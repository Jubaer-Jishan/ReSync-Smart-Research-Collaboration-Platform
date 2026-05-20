"use client";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useEffect,
  useState,
} from "react";

import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";

import {
  requestPasswordReset,
  resetPassword,
  verifyPasswordReset,
} from "../lib/api";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  defaultEmail = "",
}: ForgotPasswordModalProps) {

  const [step, setStep] =
    useState(1);

  const [email, setEmail] =
    useState("");

  const [otpValue, setOtpValue] =
    useState("");

  const [shake, setShake] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [resetShake, setResetShake] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const passwordsMatch =
    password === confirmPassword;

  const passwordRegex =
    /^(?=.*[@#$%!&]).{8,}$/;

  const isValidPassword =
    passwordRegex.test(password);

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isValidEmail =
    emailRegex.test(email);

  const [otp, setOtp] =
    useState([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

  const [otpShake, setOtpShake] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const isOtpComplete =
    otp.every(
      (digit) => digit !== ""
    );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setStep(1);
    setEmail(defaultEmail);
    setOtp(["", "", "", "", "", ""]);
    setOtpValue("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [defaultEmail, isOpen]);

  const resetShakeEffect = () => {
    setResetShake(true);
    setTimeout(() => {
      setResetShake(false);
    }, 500);
  };

  const otpText = otpValue || otp.join("");

  const handleSendOtp = async () => {
    if (!isValidEmail) {
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 500);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await requestPasswordReset(email);
      setStep(2);
      setSuccessMessage("OTP has been sent to your registered email.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpComplete) {
      setOtpShake(true);
      setTimeout(() => {
        setOtpShake(false);
      }, 500);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await verifyPasswordReset(email, otpText);
      setStep(3);
      setSuccessMessage("OTP verified successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!passwordsMatch || !isValidPassword || otpText.length !== 6) {
      resetShakeEffect();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await resetPassword(email, otpText, password, confirmPassword);
      setSuccessMessage("Password changed successfully.");
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (
    value: string,
    index: number
  ) => {

    if (!/^\d*$/.test(value))
      return;

    const updatedOtp = [
      ...otp,
    ];

    updatedOtp[index] =
      value;

    setOtp(updatedOtp);
    setOtpValue(updatedOtp.join(""));

    if (value && index < 5) {

      const nextInput =
        document.getElementById(
          `otp-${index + 1}`
        );

      nextInput?.focus();
    }
  };

  return (

    <AnimatePresence>

      {isOpen && (

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="fixed inset-0 z-[99999] flex items-start justify-center overflow-y-auto bg-black/50 px-4 pt-10 backdrop-blur-md"
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            className="relative mt-0 w-full max-w-lg rounded-[32px] bg-white p-8 shadow-[0_20px_80px_rgba(15,23,42,0.25)]"
          >
            {/* Back Button */}
<button
  onClick={() => {
    if (step === 1) {
      onClose();
      return;
    }

    setStep((prev) => Math.max(prev - 1, 1));
    setErrorMessage(null);
    setSuccessMessage(null);
  }}
  className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-white transition-all duration-300 hover:scale-110 hover:bg-cyan-600"
>
  <FaArrowLeft />
</button>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white transition-all duration-300 hover:scale-110 hover:bg-red-600"
            >
              ✕
            </button>

            {/* STEP 1 */}
            {step === 1 && (

              <div>

                <h1 className="mb-3 text-center text-3xl font-black text-slate-800">
                  Forgot Password
                </h1>

                <p className="mb-8 text-center text-slate-500">
                  Enter your email
                </p>

                {errorMessage && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {successMessage}
                  </div>
                )}

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    
                    setEmail(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {

  if (
    e.key === "Enter" &&
    isValidEmail
  ) {

    void handleSendOtp();
  }
}}
                  placeholder="example@gmail.com"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-slate-900 outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />

                {email !== "" &&
                  !isValidEmail && (

                  <div className="mt-3 rounded-xl border border-red-500 bg-red-100 px-4 py-3 text-sm font-bold text-red-700">

                    Please enter a valid email address

                  </div>

                )}

                <motion.button
                  type="button"
                  onClick={() => {
                    void handleSendOtp();
                  }}
                  animate={
                    shake
                      ? {
                          x: [
                            -8,
                            8,
                            -8,
                            8,
                            0,
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.4,
                  }}
                  disabled={isSubmitting}
                  className={`mt-6 w-full rounded-2xl py-4 font-bold text-white transition-all duration-300 ${
                    isValidEmail
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02]"
                      : "bg-red-400"
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send OTP"}
                </motion.button>

              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (

              <div>

                <h1 className="mb-3 text-center text-3xl font-black text-slate-800">
                  Verify OTP
                </h1>

                <p className="mb-8 text-center text-slate-500">
                  Enter 6 digit OTP
                </p>

                {errorMessage && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {successMessage}
                  </div>
                )}

                <div className="flex justify-center gap-3">

                  {otp.map(
                    (
                      digit,
                      index
                    ) => (

                      <input
                      onKeyDown={(e) => {

  if (
    e.key === "Enter" &&
    isOtpComplete
  ) {

    void handleVerifyOtp();
  }
}}
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(
                            e.target.value,
                            index
                          )
                        }
                        className="h-14 w-14 rounded-2xl border border-slate-300 text-center text-xl font-bold text-slate-900 outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      />

                    )
                  )}

                </div>

                <motion.button
                  type="button"
                  onClick={() => {
                    void handleVerifyOtp();
                  }}
                  animate={
                    otpShake
                      ? {
                          x: [
                            -8,
                            8,
                            -8,
                            8,
                            0,
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.4,
                  }}
                  disabled={isSubmitting}
                  className={`mt-8 w-full rounded-2xl py-4 font-bold text-white transition-all duration-300 ${
                    isOtpComplete
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02]"
                      : "bg-red-400"
                  }`}
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </motion.button>

              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (

              <div>

                <h1 className="mb-3 text-center text-3xl font-black text-slate-800">
                  Reset Password
                </h1>

                <p className="mb-8 text-center text-slate-500">
                  Create new password
                </p>

                {errorMessage && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {successMessage}
                  </div>
                )}

                {/* New Password */}
                <div className="mb-5 flex items-center rounded-2xl border border-slate-200 bg-white px-4 transition-all duration-300 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="New password"
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

                {/* Confirm Password */}
                <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">

  <div
    className={`flex items-center gap-2 text-sm font-semibold ${
      password.length >= 8
        ? "text-green-600"
        : "text-red-500"
    }`}
  >
    {password.length >= 8
      ? "✔"
      : "✖"}

    Minimum 8 characters
  </div>

  <div
    className={`flex items-center gap-2 text-sm font-semibold ${
      /[@#$%!&]/.test(password)
        ? "text-green-600"
        : "text-red-500"
    }`}
  >
    {/[@#$%!&]/.test(password)
      ? "✔"
      : "✖"}

    At least 1 special character
  </div>

</div>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 transition-all duration-300 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100">

  <input
  type={
    showConfirmPassword
      ? "text"
      : "password"
  }
  value={confirmPassword}
  onChange={(e) =>
    setConfirmPassword(
      e.target.value
    )
  }
  onKeyDown={(e) => {

    if (
      e.key === "Enter"
    ) {

      e.preventDefault();

      if (
        passwordsMatch &&
        isValidPassword
      ) {

        alert(
          "Password changed successfully 😄🔥"
        );

        onClose();
      }
    }
  }}
  placeholder="Confirm password"
  className="w-full bg-transparent py-4 text-slate-900 outline-none"
/>

  <button
    type="button"
    onClick={() =>
      setShowConfirmPassword(
        !showConfirmPassword
      )
    }
    className="text-slate-500 transition hover:text-cyan-500"
  >
    {showConfirmPassword ? (
      <FaEyeSlash />
    ) : (
      <FaEye />
    )}
  </button>

</div>

{confirmPassword !== "" &&
  !passwordsMatch && (

  <div className="mt-3 rounded-xl border border-red-500 bg-red-100 px-4 py-3 text-sm font-bold text-red-700">

    Passwords do not match

  </div>

)}

<motion.button
  type="button"
  onClick={() => {

    void handleResetPassword();

  }}
  animate={
    resetShake
      ? {
          x: [
            -8,
            8,
            -8,
            8,
            0,
          ],
        }
      : {}
  }
  transition={{
    duration: 0.4,
  }}
  disabled={isSubmitting}
  className={`mt-8 w-full rounded-2xl py-4 font-bold text-white transition-all duration-300 ${
    passwordsMatch &&
    isValidPassword
      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02]"
      : "bg-red-400"
  }`}
>
  {isSubmitting ? "Saving..." : "Reset Password"}
</motion.button>

</div>
)}

</motion.div>

</motion.div>
)}

</AnimatePresence>
);
}