import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  registerUserAsync,
  resetRegistrationStatus,
  selectRegistrationStatus,
  selectAuthState,
  selectLoggedInUser,
} from "../AuthSlice";

import logo from "../../../assets/logo.png";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validations = {
    email: {
      required: {
        value: true,
        message: "Email is required",
      },
      pattern: {
        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: "Invalid email format",
      },
      validate: (email) => {
        if (email.trim() === "") return "Email field can't be empty";
        return true;
      },
    },
    password: {
      required: "Password is required",
      validate: (value) => {
        if (!/[A-Z]/.test(value))
          return "Must include at least one uppercase letter";
        if (!/[a-z]/.test(value))
          return "Must include at least one lowercase letter";
        if (!/[!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~]/.test(value))
          return "Must include at least one special character";
        if (value.length < 8) return "Minimum length should be 8";
        return true;
      },
    },
    confirmPassword: {
      required: "Enter password again",
      validate: (value) => {
        const password = watch("password");
        if (password !== value) {
          return "Passwords do not match";
        }
        return true;
      },
    },
  };

  const dispatch = useDispatch();
  const registrationStatus = useSelector(selectRegistrationStatus);
  const signUpState = useSelector(selectAuthState);
  const user = useSelector(selectLoggedInUser);

  const navigate = useNavigate();

  async function formSubmitHandler({ email, password }) {
    dispatch(registerUserAsync({ email, password }));
  }

  useEffect(() => {
    if (registrationStatus) {
      navigate("/login");
      dispatch(resetRegistrationStatus());
    }
  }, [registrationStatus, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="card w-full max-w-md p-8">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="logo" className="h-20 mb-4" />
          <h1 className="text-2xl font-semibold text-slate-800">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Start managing your products
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(formSubmitHandler)}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email address
            </label>
            <input
              type="text"
              {...register("email", validations.email)}
              className="input"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Password
            </label>

            <button
              type="button"
              className="absolute right-3 top-9 text-slate-400 hover:text-blue-600"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

            <input
              type={showPassword ? "text" : "password"}
              {...register("password", validations.password)}
              className="input pr-10"
              placeholder="••••••••"
            />

            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Confirm password
            </label>

            <button
              type="button"
              className="absolute right-3 top-9 text-slate-400 hover:text-blue-600"
              onClick={() => setShowConfirmPassword((v) => !v)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", validations.confirmPassword)}
              className="input pr-10"
              placeholder="••••••••"
            />

            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {signUpState.status !== "idle"
              ? "Creating account…"
              : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
