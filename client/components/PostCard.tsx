"use client";

import { motion } from "framer-motion";
import {
  HiOutlineChatAlt2,
  HiOutlineHeart,
  HiOutlineBookmark,
  HiOutlineShare,
} from "react-icons/hi";
import type { ResearchPost } from "../lib/api";
import UserAvatar from "./UserAvatar";

const timeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

function formatTimeAgo(dateString?: string): string {
  if (!dateString) {
    return "Just now";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const diffMs = date.getTime() - Date.now();
  const minutes = Math.round(diffMs / (1000 * 60));
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (Math.abs(minutes) < 60) {
    return timeFormatter.format(minutes, "minute");
  }
  if (Math.abs(hours) < 24) {
    return timeFormatter.format(hours, "hour");
  }

  return timeFormatter.format(days, "day");
}

interface PostCardProps {
  post: ResearchPost;
}

export default function PostCard({ post }: PostCardProps) {
  const authorName =
    post.createdBy?.fullName ?? post.createdBy?.name ?? "Researcher";
  const authorRole = post.createdBy?.role ?? "Collaborator";
  const authorAvatar =
    post.createdBy?.profilePictureUrl ?? post.createdBy?.avatarUrl;
  const mediaUrl = post.media?.[0]?.url;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-slate-100 text-sm font-semibold text-slate-600 flex items-center justify-center">
            <UserAvatar
              src={authorAvatar}
              alt={authorName}
              iconClassName="text-slate-500"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{authorName}</p>
            <p className="text-xs text-slate-500">
              {authorRole} • {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        <button className="text-xs font-semibold text-blue-600">Follow</button>
      </div>

      <div className="mt-4 space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{post.description}</p>
      </div>

      {mediaUrl && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
          <img src={mediaUrl} alt={post.title} className="h-72 w-full object-cover" />
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-slate-500">
        <button className="flex items-center gap-2 text-sm font-medium transition hover:text-blue-600">
          <HiOutlineHeart className="text-lg" />
          Like
        </button>
        <button className="flex items-center gap-2 text-sm font-medium transition hover:text-blue-600">
          <HiOutlineChatAlt2 className="text-lg" />
          Comment
        </button>
        <button className="flex items-center gap-2 text-sm font-medium transition hover:text-blue-600">
          <HiOutlineBookmark className="text-lg" />
          Save
        </button>
        <button className="flex items-center gap-2 text-sm font-medium transition hover:text-blue-600">
          <HiOutlineShare className="text-lg" />
          Share
        </button>
      </div>
    </motion.article>
  );
}
