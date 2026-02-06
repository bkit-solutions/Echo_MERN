import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  resetPasswordRequestAsync,
  selectMailSentStatus,
} from "../AuthSlice";

import logo from "../../../assets/logo.png";

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const dispatch = useDispatch();
  const mailSentStatus = useSelector(selectMailSentStatus);

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
  };

  function forgotPasswordFormHandler({ email }) {
    dispatch(resetPasswordRequestAsync({ email }));
  }

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
            Enter your email and we’ll send you a reset link
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(forgotPasswordFormHandler)}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={mailSentStatus}
            className="btn-primary w-full"
          >
            {mailSentStatus ? "Sending email…" : "Send reset link"}
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
