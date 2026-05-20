"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineChatAlt2,
  HiOutlineHeart,
  HiOutlineBookmark,
  HiOutlineShare,
} from "react-icons/hi";
import {
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  followUser,
  unfollowUser,
  clearAuth,
  getAccessToken,
  type ResearchPost,
} from "../lib/api";
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
  liked?: boolean;
  saved?: boolean;
  currentUserId?: string;
  isFollowing?: boolean;
}

export default function PostCard({
  post,
  liked = false,
  saved = false,
  currentUserId,
  isFollowing: isFollowingProp = false,
}: PostCardProps) {
  const router = useRouter();
  const [likeCount, setLikeCount] = useState(post.likesCount ?? 0);
  const [isLiked, setIsLiked] = useState(liked);
  const [isSaved, setIsSaved] = useState(saved);
  const [likePending, setLikePending] = useState(false);
  const [savePending, setSavePending] = useState(false);
  const [followPending, setFollowPending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(isFollowingProp);
  const authorName =
    post.createdBy?.fullName ?? post.createdBy?.name ?? "Researcher";
  const authorRole = post.createdBy?.role ?? "Collaborator";
  const authorAvatar =
    post.createdBy?.profilePictureUrl ?? post.createdBy?.avatarUrl;
  const mediaUrl = post.media?.[0]?.url;
  const hasAccessToken = Boolean(getAccessToken());
  const canFollow =
    Boolean(currentUserId) &&
    Boolean(post.createdBy?.id) &&
    post.createdBy?.id !== currentUserId;

  useEffect(() => {
    setLikeCount(post.likesCount ?? 0);
  }, [post.likesCount]);

  useEffect(() => {
    setIsLiked(liked);
  }, [liked]);

  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);

  useEffect(() => {
    setIsFollowing(isFollowingProp);
  }, [isFollowingProp]);

  const handleUnauthorized = () => {
    clearAuth();
    router.push("/");
  };

  const handleToggleLike = async () => {
    if (likePending) {
      return;
    }

    if (!hasAccessToken) {
      setActionError("Please sign in to like posts.");
      handleUnauthorized();
      return;
    }

    setLikePending(true);
    setActionError(null);
    try {
      if (isLiked) {
        await unlikePost(post.id);
        setIsLiked(false);
        setLikeCount((current) => Math.max(0, current - 1));
      } else {
        await likePost(post.id);
        setIsLiked(true);
        setLikeCount((current) => current + 1);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to like post";
      setActionError(message);
      if (message.toLowerCase().includes("unauthorized")) {
        handleUnauthorized();
      }
    } finally {
      setLikePending(false);
    }
  };

  const handleToggleSave = async () => {
    if (savePending) {
      return;
    }

    if (!hasAccessToken) {
      setActionError("Please sign in to save posts.");
      handleUnauthorized();
      return;
    }

    setSavePending(true);
    setActionError(null);
    try {
      if (isSaved) {
        await unsavePost(post.id);
        setIsSaved(false);
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("resync:saved-posts-updated", {
              detail: { action: "unsave", postId: post.id },
            }),
          );
        }
      } else {
        await savePost(post.id);
        setIsSaved(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("resync:saved-posts-updated", {
              detail: { action: "save", post },
            }),
          );
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save post";
      setActionError(message);
      if (message.toLowerCase().includes("unauthorized")) {
        handleUnauthorized();
      }
    } finally {
      setSavePending(false);
    }
  };

  const handleToggleFollow = async () => {
    if (followPending || !post.createdBy?.id) {
      return;
    }

    if (!hasAccessToken) {
      setActionError("Please sign in to follow users.");
      handleUnauthorized();
      return;
    }

    setFollowPending(true);
    setActionError(null);
    try {
      if (isFollowing) {
        await unfollowUser(post.createdBy.id);
        setIsFollowing(false);
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("resync:following-updated", {
              detail: { action: "unfollow", userId: post.createdBy.id },
            }),
          );
        }
      } else {
        await followUser(post.createdBy.id);
        setIsFollowing(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("resync:following-updated", {
              detail: { action: "follow", userId: post.createdBy.id },
            }),
          );
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to follow user";
      setActionError(message);
      if (message.toLowerCase().includes("unauthorized")) {
        handleUnauthorized();
      }
    } finally {
      setFollowPending(false);
    }
  };

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
        {canFollow ? (
          <button
            onClick={handleToggleFollow}
            disabled={followPending}
            className="text-xs font-semibold text-blue-600 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{post.description}</p>
      </div>

      {actionError && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {actionError}
        </div>
      )}

      {mediaUrl && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
          <img src={mediaUrl} alt={post.title} className="h-72 w-full object-cover" />
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-slate-500">
        <button
          onClick={handleToggleLike}
          disabled={likePending || !hasAccessToken}
          className="flex items-center gap-2 text-sm font-medium transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <HiOutlineHeart className={`text-lg ${isLiked ? "text-rose-500" : ""}`} />
          {isLiked ? "Liked" : "Like"} ({likeCount})
        </button>
        <button className="flex items-center gap-2 text-sm font-medium transition hover:text-blue-600">
          <HiOutlineChatAlt2 className="text-lg" />
          Comment
        </button>
        <button
          onClick={handleToggleSave}
          disabled={savePending || !hasAccessToken}
          className="flex items-center gap-2 text-sm font-medium transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <HiOutlineBookmark className={`text-lg ${isSaved ? "text-blue-600" : ""}`} />
          {isSaved ? "Saved" : "Save"}
        </button>
        <button className="flex items-center gap-2 text-sm font-medium transition hover:text-blue-600">
          <HiOutlineShare className="text-lg" />
          Share
        </button>
      </div>
    </motion.article>
  );
}
