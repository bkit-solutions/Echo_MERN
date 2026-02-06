import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  loginUserAsync,
  selectLoggedInUser,
  selectAuthState,
} from "../AuthSlice";

import logo from "../../../assets/logo.png";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

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
      required: {
        value: true,
        message: "Password is required",
      },
      validate: (password) => {
        if (password.trim() === "") return "Password field can't be empty";
        return true;
      },
    },
  };

  const dispatch = useDispatch();
  const loginState = useSelector(selectAuthState);
  const navigate = useNavigate();
  const user = useSelector(selectLoggedInUser);

  function formSubmitHandler({ email, password }) {
    dispatch(loginUserAsync({ email, password, navigate }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="card w-full max-w-md p-8">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="logo" className="h-20 mb-4" />
          <h1 className="text-2xl font-semibold text-slate-800">
            Log in to your account
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, please enter your details
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

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

          {/* Submit */}
          <button
            type="submit"
            disabled={loginState.status !== "idle"}
            className="btn-primary w-full"
          >
            {loginState.status !== "idle"
              ? "Logging in…"
              : "Log in"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Not a member?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
