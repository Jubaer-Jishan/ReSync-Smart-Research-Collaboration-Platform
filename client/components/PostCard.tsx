"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineChatAlt2,
  HiOutlineHeart,
  HiOutlineBookmark,
  HiOutlineShare,
  HiOutlineDotsVertical,
} from "react-icons/hi";
import {
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  followUser,
  unfollowUser,
  deletePost,
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
  onDeleted?: (postId: string) => void;
}

export default function PostCard({
  post,
  liked = false,
  saved = false,
  currentUserId,
  isFollowing: isFollowingProp = false,
  onDeleted,
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authorName =
    post.createdBy?.fullName ?? post.createdBy?.name ?? "Researcher";
  const authorUsername = post.createdBy?.username;
  const authorRole = post.createdBy?.role ?? "Collaborator";
  const authorAvatar =
    post.createdBy?.profilePictureUrl ?? post.createdBy?.avatarUrl;
  const mediaItems = post.media ?? [];
  const mediaFrameClassName =
    "mt-4 w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 aspect-[16/10]";
  const hasAccessToken = Boolean(getAccessToken());
  const canFollow =
    Boolean(currentUserId) &&
    Boolean(post.createdBy?.id) &&
    post.createdBy?.id !== currentUserId;
  const canDelete = Boolean(currentUserId) && post.createdBy?.id === currentUserId;

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

  const handleOpenProfile = () => {
    if (!authorUsername) {
      return;
    }

    router.push(`/profile/${authorUsername}`);
  };

  const handleDeletePost = async () => {
    if (!canDelete || !currentUserId) {
      return;
    }

    if (!hasAccessToken) {
      setActionError("Please sign in to delete posts.");
      handleUnauthorized();
      return;
    }

    const confirmed = window.confirm("Delete this post?");
    if (!confirmed) {
      return;
    }

    setActionError(null);
    try {
      await deletePost(post.id);
      onDeleted?.(post.id);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("resync:post-deleted", {
            detail: { postId: post.id },
          }),
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete post";
      setActionError(message);
      if (message.toLowerCase().includes("unauthorized")) {
        handleUnauthorized();
      }
    }
  };

  const renderMediaGrid = () => {
    if (mediaItems.length === 0) {
      return null;
    }

    if (mediaItems.length === 1) {
      return (
        <div className={mediaFrameClassName}>
          <img
            src={mediaItems[0]?.url}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      );
    }

    if (mediaItems.length === 2) {
      return (
        <div className={mediaFrameClassName}>
          <div className="grid h-full grid-cols-2 gap-1">
            {mediaItems.slice(0, 2).map((media, index) => (
              <div key={`${media.url}-${index}`} className="overflow-hidden">
                <img src={media.url} alt={`${post.title} ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (mediaItems.length === 3) {
      return (
        <div className={mediaFrameClassName}>
          <div className="grid h-full grid-cols-2 gap-1">
            <div className="col-span-1 row-span-2 overflow-hidden">
              <img src={mediaItems[0]?.url} alt={`${post.title} 1`} className="h-full w-full object-cover" />
            </div>
            {mediaItems.slice(1, 3).map((media, index) => (
              <div key={`${media.url}-${index}`} className="overflow-hidden">
                <img src={media.url} alt={`${post.title} ${index + 2}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={mediaFrameClassName}>
        <div className="grid h-full grid-cols-2 gap-1">
          {mediaItems.slice(0, 4).map((media, index) => (
            <div key={`${media.url}-${index}`} className="overflow-hidden">
              <img src={media.url} alt={`${post.title} ${index + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {canDelete ? (
        <div className="absolute right-4 top-4 z-10">
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            aria-label="Post options"
          >
            <HiOutlineDotsVertical className="text-lg" />
          </button>
          {isMenuOpen ? (
            <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  void handleDeletePost();
                }}
                className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Delete post
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-start justify-between">
        <button
          type="button"
          onClick={handleOpenProfile}
          disabled={!authorUsername}
          className="flex items-center gap-3 text-left disabled:cursor-default"
        >
          <div className="h-11 w-11 rounded-2xl bg-slate-100 text-sm font-semibold text-slate-600 flex items-center justify-center">
            <UserAvatar
              src={authorAvatar}
              alt={authorName}
              iconClassName="text-slate-500"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 transition hover:text-blue-600">
              {authorName}
            </p>
            <p className="text-xs text-slate-500">
              {authorRole} • {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </button>
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

      {renderMediaGrid()}

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
