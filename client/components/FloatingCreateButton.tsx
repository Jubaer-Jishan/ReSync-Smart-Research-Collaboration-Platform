"use client";

import { HiOutlinePlus } from "react-icons/hi";

interface FloatingCreateButtonProps {
  onClick?: () => void;
}

export default function FloatingCreateButton({
  onClick,
}: FloatingCreateButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 transition hover:scale-105 lg:hidden"
      aria-label="Create post"
    >
      <HiOutlinePlus className="text-2xl" />
    </button>
  );
}
