"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import PageTransition from "../../components/PageTransition";
import AppNavbar from "../../components/AppNavbar";
import AppLeftSidebar from "../../components/AppLeftSidebar";
import AppRightSidebar from "../../components/AppRightSidebar";
import PostCard from "../../components/PostCard";
import {
  clearAuth,
  fetchMe,
  fetchPosts,
  getStoredUser,
  logout,
  setStoredUser,
  uploadProfileAvatar,
  uploadProfileBanner,
  updateProfile,
  updateStudentProfile,
  updateTeacherProfile,
  type AuthUser,
  type ResearchPost,
} from "../../lib/api";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none";

function toSafeNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeEditSection, setActiveEditSection] = useState<
    "personal" | "academic" | "social"
  >("personal");
  const [postItems, setPostItems] = useState<ResearchPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const [profileForm, setProfileForm] = useState({
    bio: "",
    profilePictureUrl: "",
    bannerImage: "",
    location: "",
    website: "",
    contactNumber: "",
    institution: "",
    department: "",
    phoneNumber: "",
    githubProfile: "",
    linkedinProfile: "",
    twitterProfile: "",
    facebookProfile: "",
    orcidProfile: "",
    googleScholarProfile: "",
    researchGateProfile: "",
  });

  const [studentForm, setStudentForm] = useState({
    institution: "",
    department: "",
    semester: "",
    cgpa: "",
    graduationYear: "",
    skills: "",
    interestedResearchFields: "",
  });

  const [teacherForm, setTeacherForm] = useState({
    institution: "",
    department: "",
    designation: "",
    officeLocation: "",
    yearsOfExperience: "",
    specialization: "",
    currentResearchArea: "",
    googleScholarProfile: "",
    researchGateProfile: "",
    orcidId: "",
    totalPublications: "",
    hIndex: "",
  });

  const displayName = useMemo(() => {
    return (
      user?.fullName ??
      user?.name ??
      user?.username ??
      user?.email ??
      "Researcher"
    );
  }, [user]);

  const displayRole = useMemo(() => {
    const rawRole = user?.role ?? "Collaborator";
    return rawRole.charAt(0) + rawRole.slice(1).toLowerCase();
  }, [user]);

  const displayAvatar =
    avatarPreview ?? user?.profilePictureUrl ?? user?.avatarUrl;
  const displayBanner = bannerPreview ?? user?.bannerImage;
  const isStudent = (user?.role ?? "").toUpperCase() === "STUDENT";
  const isTeacher = (user?.role ?? "").toUpperCase() === "TEACHER";

  const applyUserToForms = (freshUser: AuthUser) => {
    const studentProfile = freshUser.studentProfile;
    const teacherProfile = freshUser.teacherProfile;

    setProfileForm((prev) => ({
      ...prev,
      bio: (freshUser as { bio?: string }).bio ?? prev.bio,
      profilePictureUrl:
        (freshUser as { profilePictureUrl?: string }).profilePictureUrl ??
        prev.profilePictureUrl,
      bannerImage:
        (freshUser as { bannerImage?: string }).bannerImage ?? prev.bannerImage,
      location: (freshUser as { location?: string }).location ?? prev.location,
      website: (freshUser as { website?: string }).website ?? prev.website,
      contactNumber:
        (freshUser as { contactNumber?: string }).contactNumber ??
        prev.contactNumber,
      phoneNumber:
        (freshUser as { phoneNumber?: string }).phoneNumber ?? prev.phoneNumber,
      institution: freshUser.institution ?? prev.institution,
      department: freshUser.department ?? prev.department,
      githubProfile:
        (freshUser as { githubProfile?: string }).githubProfile ??
        prev.githubProfile,
      linkedinProfile:
        (freshUser as { linkedinProfile?: string }).linkedinProfile ??
        prev.linkedinProfile,
      twitterProfile:
        (freshUser as { twitterProfile?: string }).twitterProfile ??
        prev.twitterProfile,
      facebookProfile:
        (freshUser as { facebookProfile?: string }).facebookProfile ??
        prev.facebookProfile,
      orcidProfile:
        (freshUser as { orcidProfile?: string }).orcidProfile ?? prev.orcidProfile,
      googleScholarProfile:
        (freshUser as { googleScholarProfile?: string }).googleScholarProfile ??
        prev.googleScholarProfile,
      researchGateProfile:
        (freshUser as { researchGateProfile?: string }).researchGateProfile ??
        prev.researchGateProfile,
    }));
    setStudentForm((prev) => ({
      ...prev,
      institution: studentProfile?.institution ?? prev.institution,
      department: studentProfile?.department ?? prev.department,
      semester: studentProfile?.semester ?? prev.semester,
      cgpa:
        studentProfile?.cgpa !== undefined ? String(studentProfile.cgpa) : prev.cgpa,
      graduationYear:
        studentProfile?.graduationYear !== undefined
          ? String(studentProfile.graduationYear)
          : prev.graduationYear,
      skills: studentProfile?.skills ?? prev.skills,
      interestedResearchFields:
        studentProfile?.interestedResearchFields ?? prev.interestedResearchFields,
    }));
    setTeacherForm((prev) => ({
      ...prev,
      institution: teacherProfile?.institution ?? prev.institution,
      department: teacherProfile?.department ?? prev.department,
      designation: teacherProfile?.designation ?? prev.designation,
      officeLocation: teacherProfile?.officeLocation ?? prev.officeLocation,
      yearsOfExperience:
        teacherProfile?.yearsOfExperience !== undefined
          ? String(teacherProfile.yearsOfExperience)
          : prev.yearsOfExperience,
      specialization: teacherProfile?.specialization ?? prev.specialization,
      currentResearchArea:
        teacherProfile?.currentResearchArea ?? prev.currentResearchArea,
      googleScholarProfile:
        teacherProfile?.googleScholarProfile ?? prev.googleScholarProfile,
      researchGateProfile:
        teacherProfile?.researchGateProfile ?? prev.researchGateProfile,
      orcidId: teacherProfile?.orcidId ?? prev.orcidId,
      totalPublications:
        teacherProfile?.totalPublications !== undefined
          ? String(teacherProfile.totalPublications)
          : prev.totalPublications,
      hIndex:
        teacherProfile?.hIndex !== undefined
          ? String(teacherProfile.hIndex)
          : prev.hIndex,
    }));
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const cached = getStoredUser();
    setUser(cached);

    if (cached) {
      setProfileForm((prev) => ({
        ...prev,
        institution: cached.institution ?? "",
        department: cached.department ?? "",
      }));
    }

    fetchMe()
      .then((freshUser) => {
        setUser(freshUser);
        setStoredUser(freshUser);
        applyUserToForms(freshUser);
      })
      .catch(() => {
        // Keep cached user if fetch fails.
      });
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    setPostsLoading(true);
    setPostsError(null);

    fetchPosts(1, 20)
      .then((response) => {
        const filtered = response.items.filter(
          (post) => post.createdBy?.id && post.createdBy.id === user.id,
        );
        const sorted = [...filtered].sort((a, b) => {
          const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
          const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
          return bTime - aTime;
        });
        setPostItems(sorted);
      })
      .catch(() => {
        setPostsError("Unable to load posts.");
      })
      .finally(() => {
        setPostsLoading(false);
      });
  }, [user?.id]);

  useEffect(() => {
    if (!avatarPreview?.startsWith("blob:")) {
      return;
    }

    return () => {
      URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  useEffect(() => {
    if (!bannerPreview?.startsWith("blob:")) {
      return;
    }

    return () => {
      URL.revokeObjectURL(bannerPreview);
    };
  }, [bannerPreview]);

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

  const refreshProfile = async () => {
    const fresh = await fetchMe();
    setUser(fresh);
    setStoredUser(fresh);
    applyUserToForms(fresh);
  };

  const handleCancelEdit = () => {
    if (user) {
      applyUserToForms(user);
    }
    setAvatarPreview(null);
    setBannerPreview(null);
    setIsEditing(false);
  };

  const handleAvatarFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    setLoading(true);
    setError(null);
    uploadProfileAvatar(file)
      .then((freshUser) => {
        setUser(freshUser);
        setStoredUser(freshUser);
        applyUserToForms(freshUser);
        setAvatarPreview(null);
        setSuccess("Profile photo updated.");
      })
      .catch((uploadError) => {
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Unable to upload profile photo";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBannerFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setBannerPreview(previewUrl);

    setLoading(true);
    setError(null);
    uploadProfileBanner(file)
      .then((freshUser) => {
        setUser(freshUser);
        setStoredUser(freshUser);
        applyUserToForms(freshUser);
        setBannerPreview(null);
        setSuccess("Banner updated.");
      })
      .catch((uploadError) => {
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Unable to upload banner";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateProfile({
        ...profileForm,
      });
      await refreshProfile();
      setSuccess("Profile updated successfully.");
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to update profile";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateProfile({
        ...profileForm,
      });

      if (isStudent) {
        await updateStudentProfile({
          ...studentForm,
          cgpa: toSafeNumber(studentForm.cgpa),
          graduationYear: toSafeNumber(studentForm.graduationYear),
        });
      }

      if (isTeacher) {
        await updateTeacherProfile({
          ...teacherForm,
          yearsOfExperience: toSafeNumber(teacherForm.yearsOfExperience),
          totalPublications: toSafeNumber(teacherForm.totalPublications),
          hIndex: toSafeNumber(teacherForm.hIndex),
        });
      }

      await refreshProfile();
      setSuccess("Profile updated successfully.");
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to update profile";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!hasMounted) {
    return (
      <div
        className={`min-h-screen bg-slate-50 ${spaceGrotesk.className}`}
        suppressHydrationWarning
      />
    );
  }

  return (
    <PageTransition>
      <div className={`relative min-h-screen bg-slate-50 ${spaceGrotesk.className}`}>
        <AppNavbar
          onLogout={handleLogout}
          userName={displayName}
          userRole={displayRole}
          avatarUrl={displayAvatar}
        />

        <main className="relative mx-auto flex max-w-7xl gap-6 px-4 pb-24 pt-6 md:px-6">
          <AppLeftSidebar
            userName={displayName}
            userRole={displayRole}
            avatarUrl={displayAvatar}
          />

          <section className="flex-1 space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
              <div className="group relative h-48 bg-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_55%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(59,130,246,0.25))]" />
                {displayBanner && (
                  <img
                    src={displayBanner}
                    alt="Profile banner"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <label className="absolute right-6 top-6 cursor-pointer rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                  Upload banner
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerFile}
                    className="hidden"
                  />
                </label>
                <div className="absolute bottom-0 left-6 flex items-end gap-5 pb-4">
                  <div className="group/avatar relative h-20 w-20 overflow-hidden rounded-[24px] border-4 border-white bg-slate-100 shadow-xl">
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-600">
                        {displayName
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                    )}
                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-slate-900/50 text-[10px] font-semibold uppercase tracking-widest text-white opacity-0 transition group-hover/avatar:opacity-100">
                      Change photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="space-y-1 pb-4 text-white">
                    <h1 className="text-3xl font-semibold tracking-tight">
                      {displayName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
                      <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                        {displayRole}
                      </span>
                      <span>{user?.username ? `@${user.username}` : user?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Your Posts
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-600"
                >
                  Edit Profile
                </button>
              </div>

              {postsLoading && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                  Loading posts...
                </div>
              )}

              {postsError && (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                  {postsError}
                </div>
              )}

              {!postsLoading && !postsError && postItems.length === 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                  No posts yet. Start sharing your research journey.
                </div>
              )}

              <div className="space-y-5">
                {postItems.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>

          <AppRightSidebar />
        </main>

        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Edit Profile
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Make it yours
                  </h2>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelEdit}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAll}
                    disabled={loading}
                    className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveEditSection("personal")}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                      activeEditSection === "personal"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    Personal
                  </button>
                  {(isStudent || isTeacher) && (
                    <button
                      onClick={() => setActiveEditSection("academic")}
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                        activeEditSection === "academic"
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      {isTeacher ? "Work Experience" : "Academic"}
                    </button>
                  )}
                  <button
                    onClick={() => setActiveEditSection("social")}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                      activeEditSection === "social"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    Social
                  </button>
                </div>

                {activeEditSection === "personal" && (
                  <div className="rounded-3xl border border-slate-100 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Personal Info
                    </p>
                    <div className="mt-4 space-y-4">
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Bio
                        <textarea
                          value={profileForm.bio}
                          onChange={(event) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              bio: event.target.value,
                            }))
                          }
                          className={`${inputClassName} min-h-[120px]`}
                        />
                      </label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Location
                          <input
                            value={profileForm.location}
                            onChange={(event) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                location: event.target.value,
                              }))
                            }
                            className={inputClassName}
                          />
                        </label>
                        <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Website
                          <input
                            value={profileForm.website}
                            onChange={(event) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                website: event.target.value,
                              }))
                            }
                            className={inputClassName}
                          />
                        </label>
                        <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Contact Number
                          <input
                            value={profileForm.contactNumber}
                            onChange={(event) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                contactNumber: event.target.value,
                              }))
                            }
                            className={inputClassName}
                          />
                        </label>
                        <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Phone Number
                          <input
                            value={profileForm.phoneNumber}
                            onChange={(event) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                phoneNumber: event.target.value,
                              }))
                            }
                            className={inputClassName}
                          />
                        </label>
                        <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Institution
                          <input
                            value={profileForm.institution}
                            onChange={(event) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                institution: event.target.value,
                              }))
                            }
                            className={inputClassName}
                          />
                        </label>
                        <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Department
                          <input
                            value={profileForm.department}
                            onChange={(event) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                department: event.target.value,
                              }))
                            }
                            className={inputClassName}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeEditSection === "academic" && isStudent && (
                  <div className="rounded-3xl border border-slate-100 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Academic Info
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {[
                        { label: "Institution", key: "institution" },
                        { label: "Department", key: "department" },
                        { label: "Semester", key: "semester" },
                        { label: "CGPA", key: "cgpa" },
                        { label: "Graduation Year", key: "graduationYear" },
                        { label: "Skills", key: "skills" },
                        { label: "Interested Research Fields", key: "interestedResearchFields" },
                      ].map((field) => (
                        <label
                          key={field.key}
                          className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                          {field.label}
                          <input
                            value={studentForm[field.key as keyof typeof studentForm]}
                            onChange={(event) =>
                              setStudentForm((prev) => ({
                                ...prev,
                                [field.key]: event.target.value,
                              }))
                            }
                            className={inputClassName}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeEditSection === "academic" && isTeacher && (
                  <div className="rounded-3xl border border-slate-100 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Work Experience
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {[
                        { label: "Institution", key: "institution" },
                        { label: "Department", key: "department" },
                        { label: "Designation", key: "designation" },
                        { label: "Office Location", key: "officeLocation" },
                        { label: "Years of Experience", key: "yearsOfExperience" },
                        { label: "Specialization", key: "specialization" },
                        { label: "Current Research Area", key: "currentResearchArea" },
                        { label: "Google Scholar", key: "googleScholarProfile" },
                        { label: "ResearchGate", key: "researchGateProfile" },
                        { label: "ORCID", key: "orcidId" },
                        { label: "Total Publications", key: "totalPublications" },
                        { label: "H-Index", key: "hIndex" },
                      ].map((field) => (
                        <label
                          key={field.key}
                          className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                          {field.label}
                          <input
                            value={teacherForm[field.key as keyof typeof teacherForm]}
                            onChange={(event) =>
                              setTeacherForm((prev) => ({
                                ...prev,
                                [field.key]: event.target.value,
                              }))
                            }
                            className={inputClassName}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeEditSection === "social" && (
                  <div className="rounded-3xl border border-slate-100 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Social Info
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        GitHub
                        <input
                          value={profileForm.githubProfile}
                          onChange={(event) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              githubProfile: event.target.value,
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        LinkedIn
                        <input
                          value={profileForm.linkedinProfile}
                          onChange={(event) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              linkedinProfile: event.target.value,
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Twitter
                        <input
                          value={profileForm.twitterProfile}
                          onChange={(event) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              twitterProfile: event.target.value,
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Facebook
                        <input
                          value={profileForm.facebookProfile}
                          onChange={(event) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              facebookProfile: event.target.value,
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        ORCID
                        <input
                          value={profileForm.orcidProfile}
                          onChange={(event) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              orcidProfile: event.target.value,
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Google Scholar
                        <input
                          value={profileForm.googleScholarProfile}
                          onChange={(event) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              googleScholarProfile: event.target.value,
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        ResearchGate
                        <input
                          value={profileForm.researchGateProfile}
                          onChange={(event) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              researchGateProfile: event.target.value,
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
