"use client";

import {
  useState,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

import ForgotPasswordModal from "./ForgotPasswordModal";
import { login } from "../lib/api";

import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);
    const passwordRef =
  useRef<HTMLInputElement>(null);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [isForgotOpen, setIsForgotOpen] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login({
        email,
        password,
        rememberMe,
      });

      router.push("/feed");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Login failed";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <div className="w-full rounded-[32px] bg-white p-8">

      {/* Title */}
      <h1 className="mb-8 text-center text-4xl font-black text-slate-800">
        Login
      </h1>

      {/* Form */}
      <form
  className="space-y-5"
  onSubmit={handleSubmit}
>

        {/* Email */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-700">
            Email
          </label>

          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
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
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }

onKeyDown={(e) => {

  if (
    e.key === "Enter"
  ) {

    e.preventDefault();
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
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(e.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
            />

            Remember me

          </label>

          <p className="text-xs text-slate-400">
            Keeps you signed in for 7 days on this device.
          </p>

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
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-lg font-bold text-white shadow-[0_10px_40px_rgba(14,165,233,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(14,165,233,0.45)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? "Logging in..."
            : "Login"}
        </button>

        {errorMessage && (
          <p className="text-sm font-medium text-red-600">
            {errorMessage}
          </p>
        )}

      </form>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() =>
          setIsForgotOpen(false)
        }
        defaultEmail={email}
      />

    </div>
  );
}