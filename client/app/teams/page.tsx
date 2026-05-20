"use client";

import { useEffect, useMemo, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import AppNavbar from "../../components/AppNavbar";
import AppLeftSidebar from "../../components/AppLeftSidebar";
import PageTransition from "../../components/PageTransition";
import UserSearchPicker from "../../components/UserSearchPicker";
import { clearAuth, fetchMe, fetchMySavedPosts, getStoredUser, setStoredUser, type AuthUser, type ResearchPost, type Team, createTeam, addTeamMember, removeTeamMember, changeTeamMemberRole, deleteTeam, inviteToTeam, applyToTeam } from "../../lib/api";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fieldClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none";

const WORKSPACE_TEAMS_KEY = "resync_workspace_teams";

function readWorkspaceTeams(): Team[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(WORKSPACE_TEAMS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as Team[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function storeWorkspaceTeams(teams: Team[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(WORKSPACE_TEAMS_KEY, JSON.stringify(teams));
  } catch {
    // Ignore storage errors.
  }
}

export default function TeamsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [memberRole, setMemberRole] = useState("MEMBER");
  const [memberUser, setMemberUser] = useState<AuthUser | null>(null);
  const [inviteeUser, setInviteeUser] = useState<AuthUser | null>(null);
  const [inviteMessage, setInviteMessage] = useState("");
  const [applicationMessage, setApplicationMessage] = useState("");
  const [savedPosts, setSavedPosts] = useState<ResearchPost[]>([]);
  const [managedTeams, setManagedTeams] = useState<Team[]>([]);

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

  useEffect(() => {
    const cachedTeams = readWorkspaceTeams();
    setManagedTeams(cachedTeams);
    setTeamId((current) => current || cachedTeams[0]?.id || "");
  }, []);

  const runAction = async <T,>(
    action: () => Promise<T>,
    successMessage: string,
    onSuccess?: (result: T) => void,
  ): Promise<T | undefined> => {
    setError(null);
    setStatus(null);
    try {
      const result = await action();
      onSuccess?.(result);
      setStatus(successMessage);
      return result;
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Team action failed");
      return undefined;
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
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className={`${spaceGrotesk.className} text-sm uppercase tracking-[0.2em] text-blue-600`}>Teams</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Team workspace</h1>
                  <p className="mt-2 text-sm text-slate-600">
                    Create a team once and it appears below for quick reuse across member, invite, and application actions.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Selected team: <span className="font-semibold text-slate-900">{teamId || "None"}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Created Teams</h2>
                <p className="text-xs text-slate-400">Teams are stored in this browser until backend team listing is enabled.</p>
              </div>

              {managedTeams.length > 0 ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {managedTeams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => setTeamId(team.id)}
                      className={`rounded-2xl border p-4 text-left transition ${team.id === teamId ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"}`}
                    >
                      <p className="text-sm font-semibold text-slate-900">{team.name || "Untitled team"}</p>
                      <p className="mt-1 break-all text-xs text-slate-500">{team.id}</p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Use this team</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                  No teams saved in this browser yet. Create one to make it appear here.
                </div>
              )}
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
                      const trimmedTeamName = teamName.trim();
                      if (!user?.id) return setError("Login required");
                      if (!trimmedTeamName) return setError("Team name is required");
                      void runAction(
                        () => createTeam({ name: trimmedTeamName }),
                        "Team created successfully",
                        (createdTeam) => {
                          const nextTeams = [
                            createdTeam,
                            ...managedTeams.filter((team) => team.id !== createdTeam.id),
                          ];
                          setManagedTeams(nextTeams);
                          storeWorkspaceTeams(nextTeams);
                          setTeamId(createdTeam.id);
                          setTeamName("");
                        },
                      );
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
                  <UserSearchPicker
                    label="Member"
                    placeholder="Search by name, username, institution, or department"
                    selectedUser={memberUser}
                    onSelect={(user) => setMemberUser(user)}
                    helperText="Search for the user you want to add, remove, or re-role."
                  />
                  <select
                    className={fieldClassName}
                    value={memberRole}
                    onChange={(event) => setMemberRole(event.target.value)}
                  >
                    <option value="MEMBER">Member</option>
                    <option value="OWNER">Owner</option>
                    <option value="LEAD">Lead</option>
                    <option value="COORDINATOR">Coordinator</option>
                  </select>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        const trimmedTeamId = teamId.trim();
                        const trimmedRole = memberRole.trim();
                        const selectedMemberId = memberUser?.id;
                        if (!trimmedTeamId) return setError("Team ID is required");
                        if (!selectedMemberId) return setError("Select a member first");
                        if (!trimmedRole) return setError("Role is required");
                        void runAction(() => addTeamMember(trimmedTeamId, selectedMemberId, trimmedRole), "Member added successfully");
                      }}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Add Member
                    </button>
                    <button
                      onClick={() => {
                        const trimmedTeamId = teamId.trim();
                        const selectedMemberId = memberUser?.id;
                        if (!trimmedTeamId) return setError("Team ID is required");
                        if (!selectedMemberId) return setError("Select a member first");
                        void runAction(() => removeTeamMember(trimmedTeamId, selectedMemberId), "Member removed successfully");
                      }}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Remove Member
                    </button>
                    <button
                      onClick={() => {
                        const trimmedTeamId = teamId.trim();
                        const trimmedRole = memberRole.trim();
                        const selectedMemberId = memberUser?.id;
                        if (!trimmedTeamId) return setError("Team ID is required");
                        if (!selectedMemberId) return setError("Select a member first");
                        if (!trimmedRole) return setError("Role is required");
                        void runAction(() => changeTeamMemberRole(trimmedTeamId, selectedMemberId, trimmedRole), "Member role updated");
                      }}
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
                  <UserSearchPicker
                    label="Invitee"
                    placeholder="Search the user to invite"
                    selectedUser={inviteeUser}
                    onSelect={(user) => setInviteeUser(user)}
                    helperText="Choose the teammate you want to invite."
                  />
                  <textarea className={`${fieldClassName} min-h-28`} placeholder="Invitation message" value={inviteMessage} onChange={(event) => setInviteMessage(event.target.value)} />
                  <button
                    onClick={() => {
                      const trimmedTeamId = teamId.trim();
                      const trimmedInviteMessage = inviteMessage.trim();
                      const selectedInviteeId = inviteeUser?.id;
                      if (!trimmedTeamId) return setError("Team ID is required");
                      if (!selectedInviteeId) return setError("Select an invitee first");
                      if (!trimmedInviteMessage) return setError("Invitation message is required");
                      void runAction(() => inviteToTeam(trimmedTeamId, { inviteeId: selectedInviteeId, message: trimmedInviteMessage }), "Invitation sent successfully");
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
                        const trimmedTeamId = teamId.trim();
                        const trimmedApplicationMessage = applicationMessage.trim();
                        if (!trimmedTeamId) return setError("Team ID is required");
                        if (!trimmedApplicationMessage) return setError("Application message is required");
                        void runAction(() => applyToTeam(trimmedTeamId, { message: trimmedApplicationMessage }), "Application submitted successfully");
                      }}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Apply to Team
                    </button>
                    <button
                      onClick={() => {
                        const trimmedTeamId = teamId.trim();
                        if (!trimmedTeamId) return setError("Team ID is required");
                        void runAction(() => deleteTeam(trimmedTeamId), "Team deleted successfully");
                      }}
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