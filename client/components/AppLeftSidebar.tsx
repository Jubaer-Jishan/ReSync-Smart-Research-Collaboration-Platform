"use client";

import { useMemo, useState } from "react";
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

interface AppLeftSidebarProps {
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
}

export default function AppLeftSidebar({
  userName = "",
  userRole = "",
  avatarUrl,
}: AppLeftSidebarProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
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
      router.push("/feed");
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
          onClick={() => handleNavigate("Home")}
          className="flex w-full items-center gap-3 rounded-2xl bg-blue-50 px-3 py-2.5 text-left text-sm font-medium text-blue-600 transition hover:bg-blue-100"
        >
          <HiOutlineHome className="text-lg" />
          Home
        </button>

        <div className="space-y-1">
          <button
            onClick={() => setRequestsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
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
            onClick={() => setTeamsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
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
            onClick={() => setResourcesOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
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
            onClick={() => setSavedOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
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
            onClick={() => setSettingsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
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
                    onClick={() => setDarkModeEnabled((prev) => !prev)}
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
                  <button className="relative flex items-center rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:bg-slate-100 before:absolute before:left-0 before:top-1/2 before:h-px before:w-3 before:-translate-y-1/2 before:bg-slate-200/70">
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
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              displayName
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
            )}
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
