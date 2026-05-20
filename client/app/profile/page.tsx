"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "../../lib/api";

export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const cached = getStoredUser();
    const username = cached?.username;

    if (username) {
      router.replace(`/profile/${username}`);
      return;
    }

    router.replace("/feed");
  }, [router]);

  return <div className="min-h-screen bg-slate-50" />;
}
