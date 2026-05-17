"use client";

import { motion } from "framer-motion";

import {
  useEffect,
  useState,
} from "react";

interface PreloaderProps {
  onFinish: () => void;
}

export default function Preloader({
  onFinish,
}: PreloaderProps) {

  const [progress, setProgress] =
    useState(0);

  useEffect(() => {

    let current = 0;

    const interval =
      setInterval(() => {

        current += Math.floor(
          Math.random() * 8
        ) + 1;

        if (current >= 100) {

          current = 100;

          clearInterval(interval);

          setTimeout(() => {
            onFinish();
          }, 800);
        }

        setProgress(current);

      }, 80);

    return () =>
      clearInterval(interval);

  }, [onFinish]);

  return (

    <motion.div
      initial={{
        opacity: 1,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed left-0 top-0 z-[99999] flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-slate-950"
    >

      {/* Glow */}
      <div className="absolute left-[-120px] top-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-3xl"></div>

      <div className="absolute bottom-[-120px] right-[-100px] h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-3xl"></div>

      {/* Logo */}
      <motion.div
        initial={{
          scale: 0.7,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        className="relative z-10 mb-8 flex h-28 w-28 items-center justify-center rounded-[32px] bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-5xl font-black text-white shadow-[0_20px_80px_rgba(14,165,233,0.45)]"
      >
        R
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
        }}
        className="relative z-10 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-5xl font-black text-transparent"
      >
        ReSync
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.4,
        }}
        className="relative z-10 mt-3 text-center text-sm tracking-[0.3em] text-slate-400"
      >
        SMART RESEARCH PLATFORM
      </motion.p>

      {/* Progress Bar */}
      <div className="relative z-10 mt-12 w-[280px] overflow-hidden rounded-full bg-slate-800 md:w-[340px]">

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${progress}%`,
          }}
          className="h-3 rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 shadow-[0_0_30px_rgba(14,165,233,0.8)]"
        />

      </div>

      {/* Percentage */}
      <motion.div
        key={progress}
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.25,
        }}
        className="relative z-10 mt-6 flex items-center gap-2"
      >

        <span className="text-3xl font-black text-white">
          {progress}
        </span>

        <span className="text-lg font-bold text-cyan-400">
          %
        </span>

      </motion.div>

    </motion.div>
  );
}