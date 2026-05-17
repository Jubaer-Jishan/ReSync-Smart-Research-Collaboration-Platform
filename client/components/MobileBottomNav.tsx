"use client";

import {
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineUserGroup,
  HiOutlineChatAlt2,
  HiOutlineUser,
} from "react-icons/hi";

const items = [
  { label: "Home", icon: HiOutlineHome },
  { label: "Explore", icon: HiOutlineSearch },
  { label: "Groups", icon: HiOutlineUserGroup },
  { label: "Messages", icon: HiOutlineChatAlt2 },
  { label: "Profile", icon: HiOutlineUser },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = index === 0;
          return (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
                active ? "text-blue-600" : "text-slate-500"
              }`}
            >
              <Icon className="text-lg" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
