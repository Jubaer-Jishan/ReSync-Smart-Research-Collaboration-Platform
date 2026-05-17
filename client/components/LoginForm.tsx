"use client";

import {
  useState,
  useRef,
} from "react";

import ForgotPasswordModal from "./ForgotPasswordModal";

import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function LoginForm() {

  const [showPassword, setShowPassword] =
    useState(false);
    const passwordRef =
  useRef<HTMLInputElement>(null);

  const [isForgotOpen, setIsForgotOpen] =
    useState(false);

  return (

    <div className="w-full rounded-[32px] bg-white p-8">

      {/* Title */}
      <h1 className="mb-8 text-center text-4xl font-black text-slate-800">
        Login
      </h1>

      {/* Form */}
      <form
  className="space-y-5"
  onSubmit={(e) =>
    e.preventDefault()
  }
>

        {/* Email */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">
            Email
          </label>

          <input
            type="email"
            placeholder="example@gmail.com"
            onKeyDown={(e) => {

  if (
    e.key === "Enter"
  ) {

    e.preventDefault();

    passwordRef.current?.focus();
  }
}}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          />

        </div>

        {/* Password */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">
            Password
          </label>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 transition-all duration-300 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter password"
              ref={passwordRef}

onKeyDown={(e) => {

  if (
    e.key === "Enter"
  ) {

    e.preventDefault();

    alert(
      "Login successful 😄🔥"
    );
  }
}}
              className="w-full bg-transparent py-4 text-slate-900 outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="text-slate-500 transition hover:text-cyan-500"
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>

          </div>

        </div>

        {/* Remember */}
        <div className="flex items-center justify-between">

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">

            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
            />

            Remember me

          </label>

          {/* Forgot Password */}
          <button
            type="button"
            onClick={() =>
              setIsForgotOpen(true)
            }
            className="text-sm font-semibold text-cyan-600 transition hover:text-blue-600"
          >
            Forgot password?
          </button>

        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-lg font-bold text-white shadow-[0_10px_40px_rgba(14,165,233,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(14,165,233,0.45)]"
        >
          Login
        </button>

      </form>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() =>
          setIsForgotOpen(false)
        }
      />

    </div>
  );
}