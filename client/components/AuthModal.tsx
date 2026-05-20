"use client";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useEffect,
  useState,
} from "react";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {

  const [isLogin, setIsLogin] =
    useState(
      initialMode === "login"
    );

  /* Prevent Background Scroll */
  useEffect(() => {

    if (isOpen) {

      document.body.style.overflow =
        "hidden";

    } else {

      document.body.style.overflow =
        "auto";
    }

    return () => {

      document.body.style.overflow =
        "auto";
    };

  }, [isOpen]);

  /* Set Initial Mode */
  useEffect(() => {

    if (isOpen) {

      setIsLogin(
        initialMode === "login"
      );
    }

  }, [initialMode, isOpen]);

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
          className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 px-4 pt-20 backdrop-blur-md"
        >

          {/* Modal Box */}
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
            transition={{
              duration: 0.3,
            }}
            className="relative w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.25)]"
          >

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white transition-all duration-300 hover:scale-110"
            >
              ✕
            </button>

            {/* Toggle Buttons */}
            <div className="mb-6 flex rounded-2xl bg-slate-100 p-2">

              <button
                onClick={() =>
                  setIsLogin(true)
                }
                className={`flex-1 rounded-xl px-6 py-3 text-lg font-bold transition-all duration-300 ${
                  isLogin
                    ? "bg-white text-cyan-600 shadow-md"
                    : "text-slate-500"
                }`}
              >
                Sign In
              </button>

              <button
                onClick={() =>
                  setIsLogin(false)
                }
                className={`flex-1 rounded-xl px-6 py-3 text-lg font-bold transition-all duration-300 ${
                  !isLogin
                    ? "bg-white text-cyan-600 shadow-md"
                    : "text-slate-500"
                }`}
              >
                Sign Up
              </button>

            </div>

            {/* Form Area */}
            <div className="max-h-[80vh] overflow-y-auto pr-2">

              {isLogin ? (
                <LoginForm />
              ) : (
                <RegisterForm />
              )}

            </div>

          </motion.div>

        </motion.div>
      )}

    </AnimatePresence>
  );
}