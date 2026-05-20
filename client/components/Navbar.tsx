"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  HiMenu,
  HiX,
} from "react-icons/hi";

import {
  FaMoon,
  FaSun,
} from "react-icons/fa";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

interface NavbarProps {
  onAuthOpen: (
    mode: "login" | "register"
  ) => void;
}

export default function Navbar({
  onAuthOpen,
}: NavbarProps) {

  const [open, setOpen] =
    useState(false);

  const [
    darkMode,
    setDarkMode,
  ] = useState(false);

  /* Theme Setup */
  useEffect(() => {

    const storedTheme =
  localStorage.getItem(
    "theme"
  );

if (
  storedTheme === "dark"
) {

  document.documentElement.classList.add(
    "dark"
  );

  setDarkMode(true);

} else {

  document.documentElement.classList.remove(
    "dark"
  );

  setDarkMode(false);
}

    if (
      storedTheme === "dark"
    ) {

      document.documentElement.classList.add(
        "dark"
      );

      setDarkMode(true);
    }

  }, []);

  /* Toggle Theme */
  const toggleTheme = () => {

    const html =
      document.documentElement;

    if (darkMode) {

      html.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );

      setDarkMode(false);

    } else {

      html.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );

      setDarkMode(true);
    }
  };

  return (

    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 md:py-5">

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

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xl font-black text-white shadow-lg shadow-blue-500/20">

            R

          </div>

          <div>

            <h1 className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-xl font-black text-transparent md:text-2xl">
              ReSync
            </h1>

            <p className="hidden text-xs tracking-wide text-slate-500 sm:block">
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

        {/* Desktop Right */}
        <div className="hidden items-center gap-4 lg:flex">

          {/* Theme Button */}
          <button
            onClick={
              toggleTheme
            }
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-all duration-300 hover:border-cyan-500 hover:text-cyan-500"
          >
            {darkMode ? (
              <FaSun />
            ) : (
              <FaMoon />
            )}
          </button>

          {/* Login */}
          <button
            onClick={() =>
              onAuthOpen(
                "login"
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-5 py-2 font-medium text-slate-700 transition-all duration-300 hover:border-cyan-500 hover:text-cyan-500 hover:shadow-lg"
          >
            Login
          </button>

          {/* Register */}
          <button
            onClick={() =>
              onAuthOpen(
                "register"
              )
            }
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30"
          >
            Register
          </button>

        </div>

        {/* Mobile Right */}
        <div className="flex items-center gap-3 lg:hidden">

          {/* Theme */}
          <button
            onClick={
              toggleTheme
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-all duration-300 hover:border-cyan-500 hover:text-cyan-500"
          >
            {darkMode ? (
              <FaSun />
            ) : (
              <FaMoon />
            )}
          </button>

          {/* Menu */}
          <button
            onClick={() =>
              setOpen(!open)
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-3xl text-slate-700 transition hover:border-cyan-500 hover:text-cyan-500"
          >
            {open ? (
              <HiX />
            ) : (
              <HiMenu />
            )}
          </button>

        </div>

      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>

        {open && (

          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="absolute left-0 top-full z-[9999] w-full overflow-hidden border-t border-slate-200 bg-white shadow-2xl lg:hidden"
          >

            <div className="flex flex-col gap-5 px-6 py-6 text-lg font-semibold text-slate-800">

              {[
                "Home",
                "About",
                "Features",
                "Contact",
              ].map((item) => (

                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() =>
                    setOpen(false)
                  }
                  className="rounded-xl px-3 py-3 transition-all duration-300 hover:bg-slate-100 hover:text-cyan-500"
                >
                  {item}
                </a>

              ))}

              <div className="mt-4 flex flex-col gap-4">

                <button
                  onClick={() => {

                    setOpen(false);

                    onAuthOpen(
                      "login"
                    );

                  }}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition-all duration-300 hover:border-cyan-500 hover:text-cyan-500"
                >
                  Login
                </button>

                <button
                  onClick={() => {

                    setOpen(false);

                    onAuthOpen(
                      "register"
                    );

                  }}
                  className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]"
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