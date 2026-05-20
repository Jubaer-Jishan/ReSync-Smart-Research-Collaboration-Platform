"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineBell,
  HiOutlineChatAlt2,
  HiOutlinePlus,
  HiOutlineSearch,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import UserAvatar from "./UserAvatar";

interface AppNavbarProps {
  onCreatePost?: () => void;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
  userUsername?: string;
}

export default function AppNavbar({
  onCreatePost,
  onLogout,
  userName = "Ayesha Rahman",
  userRole = "Researcher",
  avatarUrl,
  userUsername,
}: AppNavbarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleNavigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const profilePath = userUsername ? `/profile/${userUsername}` : "/profile";

  const handleLogout = () => {
    setOpen(false);
    onLogout?.();
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-[85vw] items-center justify-between px-4 py-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-black text-white shadow-sm">
            R
          </div>
          <div className="leading-tight">
            <p className="text-lg font-black text-slate-900">ReSync</p>
            <p className="text-xs text-slate-500">Collaboration Hub</p>
          </div>
        </motion.div>

        <div className="hidden flex-1 px-6 lg:flex">
          <div className="flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700">
            <HiOutlineSearch className="text-lg text-slate-400" />
            <input
              type="text"
              placeholder="Search researchers, posts, or topics"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onCreatePost}
            className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 md:flex"
          >
            <HiOutlinePlus className="text-lg" />
            Create Post
          </button>

          <button
            onClick={onCreatePost}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 md:hidden"
            aria-label="Create post"
          >
            <HiOutlinePlus className="text-xl" />
          </button>

          <button className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 sm:inline-flex">
            <HiOutlineBell className="text-xl" />
          </button>
          <button className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 sm:inline-flex">
            <HiOutlineChatAlt2 className="text-xl" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:border-blue-300"
            >
              <div className="h-9 w-9 overflow-hidden rounded-xl bg-slate-200">
                <UserAvatar
                  src={avatarUrl}
                  alt={userName}
                  iconClassName="text-xl text-slate-600"
                />
              </div>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-48 rounded-2xl border border-slate-200 bg-white p-2 text-sm shadow-xl"
                >
                  <button
                    onClick={() => handleNavigate(profilePath)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-slate-700 transition hover:bg-slate-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleNavigate("/groups")}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-slate-700 transition hover:bg-slate-100"
                  >
                    My Groups
                  </button>
                  <button
                    onClick={() => handleNavigate(`${profilePath}?tab=settings`)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-slate-700 transition hover:bg-slate-100"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
}
