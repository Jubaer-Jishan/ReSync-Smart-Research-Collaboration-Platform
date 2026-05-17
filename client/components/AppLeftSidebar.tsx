"use client";

import {
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineFolderOpen,
  HiOutlineBell,
  HiOutlineBookmark,
  HiOutlineCog,
} from "react-icons/hi";

const items = [
  { label: "Home", icon: HiOutlineHome },
  { label: "Explore Research", icon: HiOutlineSearch },
  { label: "Research Groups", icon: HiOutlineUsers },
  { label: "Meetings", icon: HiOutlineCalendar },
  { label: "Shared Resources", icon: HiOutlineFolderOpen },
  { label: "Notifications", icon: HiOutlineBell },
  { label: "Saved", icon: HiOutlineBookmark },
  { label: "Settings", icon: HiOutlineCog },
];

interface AppLeftSidebarProps {
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
}

export default function AppLeftSidebar({
  userName = "Ayesha Rahman",
  userRole = "AI Researcher",
  avatarUrl,
}: AppLeftSidebarProps) {
  return (
    <aside className="hidden h-fit w-full max-w-[240px] flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex">
      <div className="space-y-1">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition hover:bg-slate-100 ${
                index === 0
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-700"
              }`}
            >
              <Icon className="text-lg" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="h-full w-full object-cover"
              />
            ) : (
              userName
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{userName}</p>
            <p className="text-xs text-slate-500">{userRole}</p>
          </div>
        </div>
        <button className="mt-4 w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50">
          View Profile
        </button>
      </div>
    </aside>
  );
}
