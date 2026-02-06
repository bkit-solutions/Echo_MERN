import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  selectPasswordResetStatus,
  resetPasswordAsync,
  resetPasswordResetStatus,
} from "../AuthSlice";

import logo from "../../../assets/logo.png";

export function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validations = {
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

  const resetPasswordStatus = useSelector(selectPasswordResetStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const query = new URLSearchParams(window.location.search);
  const token = query.get("token");
  const email = query.get("email");

  const formSubmitHandler = ({ password }) => {
    dispatch(
      resetPasswordAsync({
        password,
        email,
        token,
      })
    );
  };

  useEffect(() => {
    if (resetPasswordStatus) {
      dispatch(resetPasswordResetStatus());
      navigate("/login");
    }
  }, [dispatch, navigate, resetPasswordStatus]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="card w-full max-w-md p-8">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="logo" className="h-20 mb-4" />
          <h1 className="text-2xl font-semibold text-slate-800 text-center">
            Reset your password
          </h1>
          <p className="text-sm text-slate-500 mt-1 text-center">
            Create a new secure password for your account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(formSubmitHandler)}
          className="space-y-5"
        >
          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              New password
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
            {resetPasswordStatus
              ? "Resetting password…"
              : "Reset password"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
