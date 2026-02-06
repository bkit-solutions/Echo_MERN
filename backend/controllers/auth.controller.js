const { ApiResponse } = require("../utils/ApiResponse");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");
const { sendMail } = require("../service/mail.service");
const { BASE_URL } = require("../constants");
const crypto = require("crypto");
const { asyncHandler } = require("../utils/asyncHandler");

// Cookie Expiries
const ACCESS_TOKEN_AGE = 15 * 60 * 1000;              // 15 minutes
const REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000;    // 7 days

// Generate tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Failed to generate tokens");
  }
};

// Register User
const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return next(new ApiError(400, "Email is required"));
  if (!password) return next(new ApiError(400, "Password is required"));

  const exists = await User.findOne({ email });
  if (exists) return next(new ApiError(400, "User already registered"));

  await User.create({ email, password });

  return res.status(200).json(new ApiResponse(200, "User Registered Successfully"));
});

// Login User
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return next(new ApiError(400, "Email is required"));
  if (!password) return next(new ApiError(400, "Password is required"));

  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(401, "Invalid Credentials"));

  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) return next(new ApiError(401, "Invalid Credentials"));

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("role _id");

  // Localhost-safe cookie settings
  const cookieOptions = {
    secure: false,     // ❗ localhost must be false
    sameSite: "Lax",   // ❗ required for localhost HTTP
    path: "/",
  };

  return res
    .status(200)

    // accessToken cookie
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      httpOnly: true,
      maxAge: ACCESS_TOKEN_AGE,
    })

    // refreshToken cookie
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      httpOnly: true,
      maxAge: REFRESH_TOKEN_AGE,
    })

    // loggedInUserInfo cookie
    .cookie(
      "loggedInUserInfo",
      JSON.stringify({
        role: loggedInUser.role,
        userId: loggedInUser._id,
      }),
      {
        ...cookieOptions,
        httpOnly: false,
        maxAge: REFRESH_TOKEN_AGE,
      }
    )

    .json(new ApiResponse(200, "User logged in successfully"));
});

// Logout User
const logoutUser = asyncHandler(async (req, res, next) => {
  const { id } = req.body.user;

  const user = await User.findById(id);
  if (!user) return next(new ApiError(400, "User Not Found"));

  user.refreshToken = undefined;
  await user.save();

  const cookieOptions = {
    secure: false,
    sameSite: "Lax",
    path: "/",
    httpOnly: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .clearCookie("loggedInUserInfo", { ...cookieOptions, httpOnly: false })
    .json(new ApiResponse(200, "Successfully Logged Out"));
});

// Reset Password Request
const resetPasswordRequest = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new ApiError(400, "Email is required"));

  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(400, "User not found"));

  const token = crypto.randomBytes(48).toString("hex");
  user.resetPasswordToken = token;
  await user.save();

  const resetLink = `${BASE_URL}/reset-password?token=${token}&email=${email}`;

  await sendMail({
    to: email,
    subject: "Reset Password Request",
    html: `<p>Click <a href='${resetLink}'>here</a> to reset your password.</p>`,
  });

  return res.status(200).json(new ApiResponse(200, "Mail sent successfully"));
});

// Reset Password
const resetPassword = asyncHandler(async (req, res, next) => {
  const { password, email, token } = req.body;

  if (!password) return next(new ApiError(400, "Password is required"));
  if (!email) return next(new ApiError(400, "Email is required"));
  if (!token) return next(new ApiError(400, "Token is required"));

  const user = await User.findOne({ email, resetPasswordToken: token });
  if (!user) return next(new ApiError(401, "Token is invalid or expired"));

  user.password = password;
  user.resetPasswordToken = null;
  await user.save();

  await sendMail({
    to: email,
    subject: "Password Reset Successfully",
    html: `<p>Your password has been updated successfully.</p>`,
  });

  return res.status(200).json(new ApiResponse(200, "Password updated successfully"));
});

module.exports = {
  generateAccessAndRefreshTokens,
  registerUser,
  loginUser,
  logoutUser,
  resetPasswordRequest,
  resetPassword,
};
