"use client";

import { useState } from "react";

import { HiMenu, HiX } from "react-icons/hi";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

interface NavbarProps {
  onAuthOpen: (mode: "login" | "register") => void;
}

export default function Navbar({
  onAuthOpen,
}: NavbarProps) {

  const [open, setOpen] =
    useState(false);

  return (

    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}
<motion.div
  initial={{
    opacity: 0,
    x: -20,
  }}
  animate={{
    opacity: 1,
    x: 0,
  }}
  transition={{
    duration: 0.5,
  }}
  onClick={() =>
    window.location.reload()
  }
  className="flex cursor-pointer items-center gap-3 transition-all duration-300 hover:scale-105"
>

  {/* Logo Box */}
  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xl font-black text-white shadow-lg shadow-blue-500/20">

    R

  </div>

  {/* Brand Text */}
  <div>

    <h1 className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-2xl font-black text-transparent">
      ReSync
    </h1>

    <p className="text-xs tracking-wide text-slate-500">
      Research Collaboration Platform
    </p>

  </div>

</motion.div>

        {/* Desktop Menu */}
        <ul className="hidden items-center gap-8 font-medium text-slate-700 lg:flex">

          {[
            "Home",
            "About",
            "Features",
            "Research",
            "Contact",
          ].map((item, index) => (

            <motion.li
              key={item}
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
            >

              <a
                href={`#${item.toLowerCase()}`}
                className="relative transition duration-300 hover:text-cyan-500 after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-cyan-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </a>

            </motion.li>
          ))}

        </ul>

        {/* Desktop Buttons */}
        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="hidden items-center gap-4 lg:flex"
        >

          {/* Login */}
          <button
            onClick={() => onAuthOpen("login")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2 font-medium text-slate-700 transition-all duration-300 hover:border-cyan-500 hover:text-cyan-500 hover:shadow-lg"
          >
            Login
          </button>

          {/* Register */}
          <button
            onClick={() => onAuthOpen("register")}
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30"
          >
            Register
          </button>

        </motion.div>

        {/* Mobile Menu Button */}
        <button
          onClick={() =>
            setOpen(!open)
          }
          className="text-3xl text-slate-700 transition hover:text-cyan-500 lg:hidden"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>

      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>

        {open && (

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.3,
            }}
            className="border-t border-slate-200 bg-white px-6 py-6 shadow-lg lg:hidden"
          >

            <div className="flex flex-col gap-5 text-lg font-medium text-slate-700">

              {[
                "Home",
                "About",
                "Features",
                "Research",
                "Contact",
              ].map((item) => (

                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() =>
                    setOpen(false)
                  }
                  className="transition duration-300 hover:text-cyan-500"
                >
                  {item}
                </a>

              ))}

              {/* Mobile Buttons */}
              <div className="mt-4 flex flex-col gap-4">

                {/* Login */}
                <button
                  onClick={() => {
                    setOpen(false);
                    onAuthOpen("login");
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center font-medium text-slate-700 transition-all duration-300 hover:border-cyan-500 hover:text-cyan-500"
                >
                  Login
                </button>

                {/* Register */}
                <button
                  onClick={() => {
                    setOpen(false);
                    onAuthOpen("register");
                  }}
                  className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-center font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  Register
                </button>

              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </header>
  );
}