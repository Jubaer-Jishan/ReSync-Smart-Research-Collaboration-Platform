"use client";

import { useEffect, useMemo, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import AppNavbar from "../../components/AppNavbar";
import AppLeftSidebar from "../../components/AppLeftSidebar";
import PageTransition from "../../components/PageTransition";
import { clearAuth, fetchMe, fetchMySavedPosts, getStoredUser, setStoredUser, type AuthUser, type ResearchPost, createTeam, addTeamMember, removeTeamMember, changeTeamMemberRole, deleteTeam, inviteToTeam, applyToTeam } from "../../lib/api";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fieldClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none";

export default function TeamsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [memberUserId, setMemberUserId] = useState("");
  const [memberRole, setMemberRole] = useState("MEMBER");
  const [inviteeId, setInviteeId] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [applicationMessage, setApplicationMessage] = useState("");
  const [savedPosts, setSavedPosts] = useState<ResearchPost[]>([]);

  const displayName = useMemo(
    () => user?.fullName ?? user?.name ?? user?.email ?? "Researcher",
    [user],
  );

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
    fetchMySavedPosts()
      .then((posts) => setSavedPosts(posts))
      .catch(() => setSavedPosts([]));
  }, []);

  const runAction = async (action: () => Promise<unknown>, successMessage: string) => {
    setError(null);
    setStatus(null);
    try {
      await action();
      setStatus(successMessage);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Team action failed");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50">
        <AppNavbar
          userName={displayName}
          userRole={user?.role ?? "Collaborator"}
          avatarUrl={user?.profilePictureUrl ?? user?.avatarUrl}
          userUsername={user?.username}
        />

        <main className="mx-auto flex w-full max-w-[1600px] gap-6 px-4 pb-24 pt-24 md:px-6 lg:pl-[17rem] lg:pr-[19.5rem]">
          <AppLeftSidebar
            userName={displayName}
            userRole={user?.role ?? "Collaborator"}
            avatarUrl={user?.profilePictureUrl ?? user?.avatarUrl}
            savedPosts={savedPosts}
          />

          <section className="flex-1 space-y-6 font-sans">
            <div className={`${spaceGrotesk.className} rounded-3xl border border-slate-200 bg-white p-6 shadow-sm`}>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Teams</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage team APIs from the frontend</h1>
              <p className="mt-2 text-sm text-slate-600">
                Create teams, update members, invite researchers, and submit team applications.
              </p>
            </div>

            {status && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {status}
              </div>
            )}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Create team</h2>
                <div className="mt-4 space-y-3">
                  <input className={fieldClassName} placeholder="Team name" value={teamName} onChange={(event) => setTeamName(event.target.value)} />
                  <button
                    onClick={() => {
                      if (!user?.id) return setError("Login required");
                      void runAction(() => createTeam({ name: teamName, ownerId: user.id }), "Team created successfully");
                    }}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Create Team
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Add or remove member</h2>
                <div className="mt-4 space-y-3">
                  <input className={fieldClassName} placeholder="Team ID" value={teamId} onChange={(event) => setTeamId(event.target.value)} />
                  <input className={fieldClassName} placeholder="User ID" value={memberUserId} onChange={(event) => setMemberUserId(event.target.value)} />
                  <input className={fieldClassName} placeholder="Role" value={memberRole} onChange={(event) => setMemberRole(event.target.value)} />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => void runAction(() => addTeamMember(teamId, memberUserId, memberRole), "Member added successfully")}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Add Member
                    </button>
                    <button
                      onClick={() => void runAction(() => removeTeamMember(teamId, memberUserId), "Member removed successfully")}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Remove Member
                    </button>
                    <button
                      onClick={() => void runAction(() => changeTeamMemberRole(teamId, memberUserId, memberRole), "Member role updated")}
                      className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      Change Role
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Invite to team</h2>
                <div className="mt-4 space-y-3">
                  <input className={fieldClassName} placeholder="Team ID" value={teamId} onChange={(event) => setTeamId(event.target.value)} />
                  <input className={fieldClassName} placeholder="Invitee user ID" value={inviteeId} onChange={(event) => setInviteeId(event.target.value)} />
                  <textarea className={`${fieldClassName} min-h-28`} placeholder="Invitation message" value={inviteMessage} onChange={(event) => setInviteMessage(event.target.value)} />
                  <button
                    onClick={() => {
                      if (!user?.id) return setError("Login required");
                      void runAction(() => inviteToTeam(teamId, { inviterId: user.id, inviteeId, message: inviteMessage }), "Invitation sent successfully");
                    }}
                    className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
                  >
                    Send Invitation
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Apply to team / delete team</h2>
                <div className="mt-4 space-y-3">
                  <input className={fieldClassName} placeholder="Team ID" value={teamId} onChange={(event) => setTeamId(event.target.value)} />
                  <textarea className={`${fieldClassName} min-h-28`} placeholder="Application message" value={applicationMessage} onChange={(event) => setApplicationMessage(event.target.value)} />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        if (!user?.id) return setError("Login required");
                        void runAction(() => applyToTeam(teamId, { applicantId: user.id, message: applicationMessage }), "Application submitted successfully");
                      }}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Apply to Team
                    </button>
                    <button
                      onClick={() => void runAction(() => deleteTeam(teamId), "Team deleted successfully")}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Delete Team
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {!user && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Sign in first to use the authenticated team APIs.
              </div>
            )}
          </section>
        </main>
      </div>
    </PageTransition>
  );
}