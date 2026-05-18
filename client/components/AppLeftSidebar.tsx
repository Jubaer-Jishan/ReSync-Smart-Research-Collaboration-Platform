"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineFolderOpen,
  HiOutlineBookmark,
  HiOutlineCog,
  HiChevronRight,
  HiOutlineMoon,
  HiOutlineLockClosed,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import UserAvatar from "./UserAvatar";

interface AppLeftSidebarProps {
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
  onChangePassword?: () => void;
}

export default function AppLeftSidebar({
  userName = "",
  userRole = "",
  avatarUrl,
  onChangePassword,
}: AppLeftSidebarProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const hasUserData = Boolean(userName || userRole || avatarUrl);
  const displayName = useMemo(
    () => userName?.trim() || "Researcher",
    [userName],
  );
  const displayRole = useMemo(
    () => userRole?.trim() || "Collaborator",
    [userRole],
  );

  const handleNavigate = (label: string) => {
    if (label === "Home") {
      setSelectedItem("Home");
      router.push("/feed");
    }
  };

  const handleSelect = (item: string) => {
    setSelectedItem(item);
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.setItem("resync-sidebar-selected-item", item);
    } catch {
      // Ignore storage errors.
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    setDarkModeEnabled(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = localStorage.getItem("resync-sidebar-selected-item");
      setSelectedItem(stored);
    } catch {
      setSelectedItem(null);
    }
  }, []);

  const handleToggleDarkMode = () => {
    const next = !darkModeEnabled;
    setDarkModeEnabled(next);

    if (typeof document === "undefined") {
      return;
    }

    document.documentElement.classList.toggle("dark", next);
    document.documentElement.style.colorScheme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Ignore storage errors.
    }
  };

  const animationConfig = {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { duration: 0.25, ease: "easeOut" },
  };

  const menuContent = (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-1">
        <button
          onClick={() => {
            handleSelect("Home");
            handleNavigate("Home");
          }}
          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition ${
            selectedItem === "Home"
              ? "bg-blue-50 text-blue-600"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <HiOutlineHome className="text-lg" />
          Home
        </button>

        <div className="space-y-1">
          <button
            onClick={() => {
              handleSelect("Requests");
              setRequestsOpen((prev) => !prev);
            }}
            className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition ${
              selectedItem === "Requests"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <HiOutlineUsers className="text-lg" />
              Requests
            </span>
            <HiChevronRight
              className={`text-base text-slate-400 transition-transform ${
                requestsOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {hasUserData && requestsOpen ? (
              <motion.div
                key="requests"
                {...animationConfig}
                className="overflow-hidden"
              >
                <div className="ml-[2%] flex flex-col gap-2 border-l border-slate-200/70 py-2 pl-4" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => {
              handleSelect("Teams");
              setTeamsOpen((prev) => !prev);
            }}
            className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition ${
              selectedItem === "Teams"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <HiOutlineUsers className="text-lg" />
              Teams
            </span>
            <HiChevronRight
              className={`text-base text-slate-400 transition-transform ${
                teamsOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {hasUserData && teamsOpen ? (
              <motion.div
                key="teams"
                {...animationConfig}
                className="overflow-hidden"
              >
                <div className="ml-[2%] flex flex-col gap-2 border-l border-slate-200/70 py-2 pl-4" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => {
              handleSelect("Resources");
              setResourcesOpen((prev) => !prev);
            }}
            className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition ${
              selectedItem === "Resources"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <HiOutlineFolderOpen className="text-lg" />
              Resources
            </span>
            <HiChevronRight
              className={`text-base text-slate-400 transition-transform ${
                resourcesOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {hasUserData && resourcesOpen ? (
              <motion.div
                key="resources"
                {...animationConfig}
                className="overflow-hidden"
              >
                <div className="ml-[2%] flex flex-col gap-2 border-l border-slate-200/70 py-2 pl-4" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => {
              handleSelect("Saved");
              setSavedOpen((prev) => !prev);
            }}
            className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition ${
              selectedItem === "Saved"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <HiOutlineBookmark className="text-lg" />
              Saved
            </span>
            <HiChevronRight
              className={`text-base text-slate-400 transition-transform ${
                savedOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {hasUserData && savedOpen ? (
              <motion.div
                key="saved"
                {...animationConfig}
                className="overflow-hidden"
              >
                <div className="ml-[2%] flex flex-col gap-2 border-l border-slate-200/70 py-2 pl-4" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => {
              handleSelect("Settings");
              setSettingsOpen((prev) => !prev);
            }}
            className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition ${
              selectedItem === "Settings"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <HiOutlineCog className="text-lg" />
              Settings
            </span>
            <HiChevronRight
              className={`text-base text-slate-400 transition-transform ${
                settingsOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {settingsOpen ? (
              <motion.div
                key="settings"
                {...animationConfig}
                className="overflow-hidden"
              >
                <div className="ml-[2%] flex flex-col gap-2 border-l border-slate-200/70 py-2 pl-4">
                  <button
                    onClick={handleToggleDarkMode}
                    className="relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:bg-slate-100 before:absolute before:left-0 before:top-1/2 before:h-px before:w-3 before:-translate-y-1/2 before:bg-slate-200/70"
                  >
                    <span className="flex items-center">
                      <HiOutlineMoon className="text-base" />
                      Dark Mode
                    </span>
                    <span
                      className={`flex h-5 w-9 items-center rounded-full border border-slate-200 transition ${
                        darkModeEnabled ? "bg-blue-600" : "bg-slate-100"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full bg-white shadow transition ${
                          darkModeEnabled ? "translate-x-4" : "translate-x-1"
                        }`}
                      />
                    </span>
                  </button>
                  <button
                    onClick={onChangePassword}
                    className="relative flex items-center rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:bg-slate-100 before:absolute before:left-0 before:top-1/2 before:h-px before:w-3 before:-translate-y-1/2 before:bg-slate-200/70"
                  >
                    <HiOutlineLockClosed className="text-base" />
                    Change Password
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-semibold text-white">
            <UserAvatar
              src={avatarUrl}
              alt={displayName}
              iconClassName="text-lg text-white"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {displayName}
            </p>
            <p className="text-xs text-slate-500">{displayRole}</p>
          </div>
        </div>
        <button className="mt-4 w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50">
          View Profile
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed left-4 top-24 z-40 flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 lg:hidden"
        aria-label="Open sidebar"
      >
        <HiOutlineMenu className="text-xl" />
      </button>

      <aside className="hidden h-fit w-full max-w-[240px] flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex">
        {menuContent}
      </aside>

      <AnimatePresence>
        {drawerOpen ? (
          <motion.div
            key="drawer"
            className="fixed inset-0 z-50 flex lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close sidebar"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative h-full w-[280px] max-w-[85vw] rounded-r-3xl border-r border-slate-200 bg-white p-5 shadow-xl"
            >
              <button
                onClick={() => setDrawerOpen(false)}
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
                aria-label="Close sidebar"
              >
                <HiOutlineX className="text-xl" />
              </button>
              {menuContent}
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
