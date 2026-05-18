"use client";

import { HiOutlineUser } from "react-icons/hi";

interface UserAvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
}

export default function UserAvatar({
  src,
  alt,
  className = "flex h-full w-full items-center justify-center overflow-hidden",
  iconClassName = "text-slate-600",
}: UserAvatarProps) {
  if (src) {
    return (
      <div className={className}>
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={className}>
      <HiOutlineUser className={iconClassName} />
    </div>
  );
}