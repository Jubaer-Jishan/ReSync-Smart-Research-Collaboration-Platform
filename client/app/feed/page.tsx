"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PageTransition from "../../components/PageTransition";
import AppNavbar from "../../components/AppNavbar";
import AppLeftSidebar from "../../components/AppLeftSidebar";
import AppRightSidebar from "../../components/AppRightSidebar";
import CreatePostCard from "../../components/CreatePostCard";
import PostCard from "../../components/PostCard";
import MobileBottomNav from "../../components/MobileBottomNav";
import FloatingCreateButton from "../../components/FloatingCreateButton";
import {
  clearAuth,
  fetchMe,
  fetchPosts,
  getStoredUser,
  logout,
  setStoredUser,
  type AuthUser,
  type ResearchPost,
} from "../../lib/api";

const PAGE_SIZE = 6;

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<ResearchPost[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    let lenisInstance: { raf: (time: number) => void; destroy: () => void } | null = null;
    let rafId = 0;

    import("lenis")
      .then((module) => {
        if (!mounted) {
          return;
        }

        const Lenis = module.default;
        lenisInstance = new Lenis({
          duration: 1.1,
          smoothWheel: true,
        });

        const raf = (time: number) => {
          lenisInstance?.raf(time);
          rafId = requestAnimationFrame(raf);
        };

        rafId = requestAnimationFrame(raf);
      })
      .catch(() => {
        // Lenis is optional for core rendering.
      });

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, []);

  useEffect(() => {
    const cached = getStoredUser();
    setUser(cached);

    fetchMe()
      .then((freshUser) => {
        setUser(freshUser);
        setStoredUser(freshUser);
      })
      .catch(() => {
        // Keep cached user if refresh fails.
      });
  }, []);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetchPosts(page, PAGE_SIZE)
      .then((data) => {
        if (ignore) {
          return;
        }
        setTotal(data.total);
        setPosts((prev) =>
          page === 1 ? data.items : [...prev, ...data.items],
        );
      })
      .catch((fetchError) => {
        if (ignore) {
          return;
        }
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load posts";
        setError(message);
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [page]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) {
          return;
        }

        const loadedCount = page * PAGE_SIZE;
        if (loadedCount < total && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [page, total, isLoading]);

  const handlePostCreated = (post: ResearchPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  const handleScrollToComposer = () => {
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Allow client-side logout even if API fails.
    } finally {
      clearAuth();
      router.push("/");
    }
  };

  const hasMore = page * PAGE_SIZE < total;

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,rgba(37,99,235,0)_70%)] blur-3xl"></div>
          <div className="absolute right-0 top-36 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,rgba(6,182,212,0)_70%)] blur-3xl"></div>
        </div>

        <AppNavbar
          onCreatePost={handleScrollToComposer}
          onLogout={handleLogout}
          userName={user?.fullName ?? user?.name ?? user?.email ?? "Researcher"}
          userRole={user?.role ?? "Collaborator"}
          avatarUrl={user?.avatarUrl}
          userUsername={user?.username}
        />

        <main className="relative mx-auto flex max-w-[85vw] gap-6 px-4 pb-24 pt-6 md:px-6">
          <AppLeftSidebar
            userName={user?.fullName ?? user?.name ?? user?.email ?? "Researcher"}
            userRole={user?.role ?? "Collaborator"}
            avatarUrl={user?.avatarUrl}
          />

          <section className="flex-1 space-y-6">
            <div ref={composerRef}>
              <CreatePostCard
                onPostCreated={handlePostCreated}
                userName={user?.fullName ?? user?.name ?? user?.email ?? "Researcher"}
                avatarUrl={user?.avatarUrl}
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {posts.length === 0 && !isLoading && !error && (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                No posts yet. Share your first research collaboration update.
              </div>
            )}

            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <div ref={loadMoreRef} className="py-4 text-center text-sm text-slate-400">
              {isLoading
                ? "Loading more posts..."
                : hasMore
                  ? "Scroll to load more"
                  : "You are all caught up"}
            </div>
          </section>

          <AppRightSidebar />
        </main>

        <FloatingCreateButton onClick={handleScrollToComposer} />
        <MobileBottomNav />
      </div>
    </PageTransition>
  );
}
