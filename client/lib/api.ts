const DEFAULT_API_BASE_URL = "http://localhost:3001/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export type PostMedia = {
  id?: string;
  url: string;
  type?: string;
  storageKey?: string;
};

export type PostUser = {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  profilePictureUrl?: string;
  role?: string;
};

export type AuthUser = {
  id?: string;
  fullName?: string;
  name?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  profilePictureUrl?: string;
  bannerImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  contactNumber?: string;
  institution?: string;
  department?: string;
  phoneNumber?: string;
  githubProfile?: string;
  linkedinProfile?: string;
  twitterProfile?: string;
  facebookProfile?: string;
  orcidProfile?: string;
  googleScholarProfile?: string;
  researchGateProfile?: string;
  role?: string;
  followersCount?: number;
  academicLevel?: string;
  studentProfile?: {
    institution?: string;
    department?: string;
    semester?: string;
    cgpa?: number;
    graduationYear?: number;
    skills?: string;
    interestedResearchFields?: string;
  };
  teacherProfile?: {
    institution?: string;
    department?: string;
    designation?: string;
    officeLocation?: string;
    yearsOfExperience?: number;
    specialization?: string;
    currentResearchArea?: string;
    googleScholarProfile?: string;
    researchGateProfile?: string;
    orcidId?: string;
    totalPublications?: number;
    hIndex?: number;
  };
};

export type ResearchPost = {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  likesCount?: number;
  researchDomain?: string;
  collaborationType?: string;
  department?: string;
  academicLevel?: string;
  researchStage?: string;
  experienceLevel?: string;
  requiredCollaborators?: number;
  createdBy?: PostUser;
  media?: PostMedia[];
};

export type PaginatedPosts = {
  items: ResearchPost[];
  total: number;
  page: number;
  limit: number;
};

export type PostListResponse = ResearchPost[];

export type TeamMember = {
  id?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: PostUser;
};

export type Team = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  members?: TeamMember[];
};

export type TeamApplication = {
  id: string;
  message: string;
  createdAt?: string;
  applicant?: PostUser;
  team?: Team;
};

export type TeamInvitation = {
  id: string;
  message: string;
  createdAt?: string;
  inviter?: PostUser;
  invitee?: PostUser;
  team?: Team;
};

export const ACCESS_TOKEN_KEY = "resync_access_token";
export const USER_KEY = "resync_user";
const AUTH_SESSION_KEY = "resync_auth_session";
const AUTH_EXPIRES_AT_KEY = "resync_auth_expires_at";
const AUTH_REMEMBER_ME_KEY = "resync_auth_remember_me";
const REMEMBER_ME_TTL_MS = 7 * 24 * 60 * 60 * 1000;
let authExpiryTimeoutId: ReturnType<typeof setTimeout> | null = null;

type StoredAuthSession = {
  accessToken: string;
  user: AuthUser;
  rememberMe: boolean;
  expiresAt?: number;
};

function normalizeErrorMessage(
  errorBody: unknown,
  fallback: string,
): string {
  const rawMessage =
    typeof errorBody === "object" && errorBody !== null
      ? (errorBody as { message?: unknown; error?: unknown }).message ??
        (errorBody as { message?: unknown; error?: unknown }).error
      : null;

  if (Array.isArray(rawMessage)) {
    const uniqueMessages = [...new Set(rawMessage.filter((item) => typeof item === "string"))];
    return uniqueMessages[0] ?? fallback;
  }

  if (typeof rawMessage === "string") {
    return rawMessage;
  }

  if (typeof errorBody === "string") {
    return errorBody;
  }

  return fallback;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readStoredSession(storage: Storage): StoredAuthSession | null {
  const rawSession = storage.getItem(AUTH_SESSION_KEY);
  if (rawSession) {
    try {
      const parsed = JSON.parse(rawSession) as StoredAuthSession;
      if (!parsed.accessToken || !parsed.user) {
        return null;
      }

      if (parsed.expiresAt && Date.now() >= parsed.expiresAt) {
        storage.removeItem(AUTH_SESSION_KEY);
        storage.removeItem(ACCESS_TOKEN_KEY);
        storage.removeItem(USER_KEY);
        storage.removeItem(AUTH_EXPIRES_AT_KEY);
        storage.removeItem(AUTH_REMEMBER_ME_KEY);
        return null;
      }

      return parsed;
    } catch {
      storage.removeItem(AUTH_SESSION_KEY);
    }
  }

  const accessToken = storage.getItem(ACCESS_TOKEN_KEY);
  const rawUser = storage.getItem(USER_KEY);

  if (!accessToken || !rawUser) {
    return null;
  }

  try {
    const user = JSON.parse(rawUser) as AuthUser;
    if (!user) {
      return null;
    }

    const expiresAtValue = storage.getItem(AUTH_EXPIRES_AT_KEY);
    const expiresAt = expiresAtValue ? Number(expiresAtValue) : undefined;
    if (expiresAt && Number.isFinite(expiresAt) && Date.now() >= expiresAt) {
      storage.removeItem(AUTH_SESSION_KEY);
      storage.removeItem(ACCESS_TOKEN_KEY);
      storage.removeItem(USER_KEY);
      storage.removeItem(AUTH_EXPIRES_AT_KEY);
      storage.removeItem(AUTH_REMEMBER_ME_KEY);
      return null;
    }

    const rememberMe = storage.getItem(AUTH_REMEMBER_ME_KEY) === "true";
    return {
      accessToken,
      user,
      rememberMe,
      expiresAt: Number.isFinite(expiresAt ?? NaN) ? expiresAt : undefined,
    };
  } catch {
    storage.removeItem(AUTH_SESSION_KEY);
    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(USER_KEY);
    storage.removeItem(AUTH_EXPIRES_AT_KEY);
    storage.removeItem(AUTH_REMEMBER_ME_KEY);
    return null;
  }
}

function clearStoredSession(storage: Storage): void {
  storage.removeItem(AUTH_SESSION_KEY);
  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(USER_KEY);
  storage.removeItem(AUTH_EXPIRES_AT_KEY);
  storage.removeItem(AUTH_REMEMBER_ME_KEY);
}

function persistAuthSession(session: StoredAuthSession): void {
  if (!isBrowser()) {
    return;
  }

  if (authExpiryTimeoutId) {
    clearTimeout(authExpiryTimeoutId);
    authExpiryTimeoutId = null;
  }

  const storage = session.rememberMe ? localStorage : sessionStorage;
  clearStoredSession(localStorage);
  clearStoredSession(sessionStorage);

  storage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  storage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  storage.setItem(USER_KEY, JSON.stringify(session.user));
  storage.setItem(AUTH_REMEMBER_ME_KEY, session.rememberMe ? "true" : "false");

  if (session.expiresAt) {
    storage.setItem(AUTH_EXPIRES_AT_KEY, String(session.expiresAt));

    const delay = session.expiresAt - Date.now();
    if (delay > 0) {
      authExpiryTimeoutId = setTimeout(() => {
        clearAuth();
      }, delay);
    }
  }
}

function parseApiError(errorBody: unknown, fallback: string): string {
  return normalizeErrorMessage(errorBody, fallback);
}

export type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type AuthResponse = {
  message?: string;
  accessToken?: string;
  user?: AuthUser;
};

export function getAccessToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  const localSession = readStoredSession(localStorage);
  if (localSession?.accessToken) {
    return localSession.accessToken;
  }

  const session = readStoredSession(sessionStorage);
  return session?.accessToken ?? null;
}

export function getStoredUser(): AuthUser | null {
  if (!isBrowser()) {
    return null;
  }

  return readStoredSession(localStorage)?.user ?? readStoredSession(sessionStorage)?.user ?? null;
}

export function setStoredUser(user: AuthUser | null): void {
  if (!isBrowser()) {
    return;
  }

  if (!user) {
    clearStoredSession(localStorage);
    clearStoredSession(sessionStorage);
    return;
  }

  const currentSession = readStoredSession(localStorage) ?? readStoredSession(sessionStorage);
  const rememberMe = currentSession?.rememberMe ?? false;
  const expiresAt = currentSession?.expiresAt;
  const accessToken = currentSession?.accessToken ?? getAccessToken();

  if (!accessToken) {
    return;
  }

  persistAuthSession({
    accessToken,
    user,
    rememberMe,
    expiresAt,
  });
}

export function clearAuth(): void {
  if (!isBrowser()) {
    return;
  }

  if (authExpiryTimeoutId) {
    clearTimeout(authExpiryTimeoutId);
    authExpiryTimeoutId = null;
  }

  clearStoredSession(localStorage);
  clearStoredSession(sessionStorage);
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
    }),
  });

  const data = (await response.json().catch(() => null)) as AuthResponse | null;

  if (!response.ok) {
    throw new Error(parseApiError(data, "Login failed"));
  }

  if (data?.accessToken && data.user) {
    persistAuthSession({
      accessToken: data.accessToken,
      user: data.user,
      rememberMe: Boolean(input.rememberMe),
      expiresAt: input.rememberMe ? Date.now() + REMEMBER_ME_TTL_MS : undefined,
    });
  }

  return data ?? {};
}

export async function requestPasswordReset(email: string): Promise<{ success: true }> {
  const response = await fetch(`${API_BASE_URL}/auth/password-reset/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(parseApiError(data, "Failed to send OTP"));
  }

  return { success: true };
}

export async function verifyPasswordReset(email: string, otp: string): Promise<{ success: true }> {
  const response = await fetch(`${API_BASE_URL}/auth/password-reset/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(parseApiError(data, "Invalid OTP"));
  }

  return { success: true };
}

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string,
  confirmPassword: string,
): Promise<{ success: true }> {
  const response = await fetch(`${API_BASE_URL}/auth/password-reset/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      otp,
      newPassword,
      confirmPassword,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(parseApiError(data, "Failed to reset password"));
  }

  return { success: true };
}

async function authFetch(input: RequestInfo | URL, init?: RequestInit) {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Missing access token");
  }

  return fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchMe(): Promise<AuthUser> {
  const response = await authFetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      (errorBody && (errorBody.message || errorBody.error)) ||
      "Failed to fetch profile";
    throw new Error(message);
  }

  return (await response.json()) as AuthUser;
}

export type ProfileUpdateInput = {
  bio?: string;
  profilePictureUrl?: string;
  bannerImage?: string;
  location?: string;
  website?: string;
  contactNumber?: string;
  institution?: string;
  department?: string;
  phoneNumber?: string;
  githubProfile?: string;
  linkedinProfile?: string;
  twitterProfile?: string;
  facebookProfile?: string;
  orcidProfile?: string;
  googleScholarProfile?: string;
  researchGateProfile?: string;
};

export async function updateProfile(input: ProfileUpdateInput): Promise<AuthUser> {
  const response = await authFetch(`${API_BASE_URL}/users/me/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      (errorBody && (errorBody.message || errorBody.error)) ||
      "Failed to update profile";
    throw new Error(message);
  }

  return (await response.json()) as AuthUser;
}

export type StudentProfileUpdateInput = {
  institution?: string;
  department?: string;
  semester?: string;
  cgpa?: number;
  graduationYear?: number;
  skills?: string;
  interestedResearchFields?: string;
};

export async function updateStudentProfile(
  input: StudentProfileUpdateInput,
): Promise<AuthUser> {
  const response = await authFetch(`${API_BASE_URL}/users/me/student-profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      (errorBody && (errorBody.message || errorBody.error)) ||
      "Failed to update student profile";
    throw new Error(message);
  }

  return (await response.json()) as AuthUser;
}

export type TeacherProfileUpdateInput = {
  institution?: string;
  department?: string;
  designation?: string;
  officeLocation?: string;
  yearsOfExperience?: number;
  specialization?: string;
  currentResearchArea?: string;
  googleScholarProfile?: string;
  researchGateProfile?: string;
  orcidId?: string;
  totalPublications?: number;
  hIndex?: number;
};

export async function updateTeacherProfile(
  input: TeacherProfileUpdateInput,
): Promise<AuthUser> {
  const response = await authFetch(`${API_BASE_URL}/users/me/teacher-profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      (errorBody && (errorBody.message || errorBody.error)) ||
      "Failed to update teacher profile";
    throw new Error(message);
  }

  return (await response.json()) as AuthUser;
}

export async function uploadProfileAvatar(file: File): Promise<AuthUser> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await authFetch(`${API_BASE_URL}/users/me/avatar`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      (errorBody && (errorBody.message || errorBody.error)) ||
      "Failed to upload avatar";
    throw new Error(message);
  }

  return (await response.json()) as AuthUser;
}

export async function uploadProfileBanner(file: File): Promise<AuthUser> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await authFetch(`${API_BASE_URL}/users/me/banner`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      (errorBody && (errorBody.message || errorBody.error)) ||
      "Failed to upload banner";
    throw new Error(message);
  }

  return (await response.json()) as AuthUser;
}

export async function logout(): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      (errorBody && (errorBody.message || errorBody.error)) ||
      "Failed to logout";
    throw new Error(message);
  }
}

export async function likePost(postId: string): Promise<unknown> {
  const response = await authFetch(`${API_BASE_URL}/posts/${postId}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId }),
  });

  const data = await response.json().catch(() => null);

  if (response.status === 409) {
    return data ?? { success: true, alreadyLiked: true };
  }

  if (!response.ok) {
    throw new Error(parseApiError(data, "Failed to like post"));
  }

  return data;
}

export async function unlikePost(postId: string): Promise<{ success: true }> {
  const response = await authFetch(`${API_BASE_URL}/posts/${postId}/likes`, {
    method: "DELETE",
  });

  const data = await response.json().catch(() => null);

  if (response.status === 404) {
    return { success: true };
  }

  if (!response.ok) {
    throw new Error(parseApiError(data, "Failed to unlike post"));
  }

  return data as { success: true };
}

export async function savePost(postId: string): Promise<unknown> {
  const response = await authFetch(`${API_BASE_URL}/posts/save/${postId}`, {
    method: "POST",
  });

  const data = await response.json().catch(() => null);

  if (response.status === 409) {
    return data ?? { success: true, alreadySaved: true };
  }

  if (!response.ok) {
    throw new Error(parseApiError(data, "Failed to save post"));
  }

  return data;
}

export async function unsavePost(postId: string): Promise<{ success: true }> {
  const response = await authFetch(`${API_BASE_URL}/posts/save/${postId}`, {
    method: "DELETE",
  });

  const data = await response.json().catch(() => null);

  if (response.status === 404) {
    return { success: true };
  }

  if (!response.ok) {
    throw new Error(parseApiError(data, "Failed to unsave post"));
  }

  return data as { success: true };
}

export async function fetchMyLikedPosts(): Promise<PostListResponse> {
  const response = await authFetch(`${API_BASE_URL}/posts/me/likes`, {
    method: "GET",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(parseApiError(data, "Failed to fetch liked posts"));
  }

  return (data ?? []) as PostListResponse;
}

export async function fetchMySavedPosts(): Promise<PostListResponse> {
  const response = await authFetch(`${API_BASE_URL}/posts/save/me`, {
    method: "GET",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(parseApiError(data, "Failed to fetch saved posts"));
  }

  return (data ?? []) as PostListResponse;
}

export type UserProfileResponse = {
  user: AuthUser;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isOwner: boolean;
};

export async function fetchProfileByUsername(
  username: string,
): Promise<UserProfileResponse> {
  const response = await authFetch(
    `${API_BASE_URL}/users/profile/${encodeURIComponent(username)}`,
    {
      method: "GET",
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(parseApiError(data, "Failed to load profile"));
  }

  return data as UserProfileResponse;
}

export async function followUser(userId: string): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/users/${userId}/follow`, {
    method: "POST",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(parseApiError(data, "Failed to follow user"));
  }
}

export async function unfollowUser(userId: string): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/users/${userId}/follow`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(parseApiError(data, "Failed to unfollow user"));
  }
}

export async function fetchFollowing(userId: string): Promise<AuthUser[]> {
  const response = await authFetch(`${API_BASE_URL}/users/${userId}/following`, {
    method: "GET",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(parseApiError(data, "Failed to load following"));
  }

  return (data ?? []) as AuthUser[];
}

export type CreateTeamInput = {
  name: string;
  ownerId: string;
};

export async function createTeam(input: CreateTeamInput): Promise<Team> {
  const response = await authFetch(`${API_BASE_URL}/teams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(parseApiError(data, "Failed to create team"));
  }

  return data as Team;
}

export async function addTeamMember(
  teamId: string,
  userId: string,
  role: string,
): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/teams/${teamId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, role }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(parseApiError(data, "Failed to add team member"));
  }
}

export async function removeTeamMember(
  teamId: string,
  userId: string,
): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/teams/${teamId}/members/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(parseApiError(data, "Failed to remove team member"));
  }
}

export async function changeTeamMemberRole(
  teamId: string,
  userId: string,
  role: string,
): Promise<void> {
  const response = await authFetch(
    `${API_BASE_URL}/teams/${teamId}/members/${userId}/role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(parseApiError(data, "Failed to update member role"));
  }
}

export async function deleteTeam(teamId: string): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/teams/${teamId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(parseApiError(data, "Failed to delete team"));
  }
}

export type CreateInvitationInput = {
  inviterId: string;
  inviteeId: string;
  message: string;
};

export async function inviteToTeam(
  teamId: string,
  input: CreateInvitationInput,
): Promise<TeamInvitation> {
  const response = await authFetch(`${API_BASE_URL}/invitations/${teamId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(parseApiError(data, "Failed to send invitation"));
  }

  return data as TeamInvitation;
}

export type CreateApplicationInput = {
  applicantId: string;
  message: string;
};

export async function applyToTeam(
  teamId: string,
  input: CreateApplicationInput,
): Promise<TeamApplication> {
  const response = await authFetch(`${API_BASE_URL}/applications/${teamId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(parseApiError(data, "Failed to apply to team"));
  }

  return data as TeamApplication;
}

export async function fetchPosts(
  page = 1,
  limit = 10,
): Promise<PaginatedPosts> {
  const url = new URL(`${API_BASE_URL}/posts`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      (errorBody && (errorBody.message || errorBody.error)) ||
      "Failed to fetch posts";
    throw new Error(message);
  }

  return (await response.json()) as PaginatedPosts;
}

export type CreatePostInput = {
  title: string;
  description: string;
  researchDomain: string;
  collaborationType: string;
  requiredCollaborators: number;
  department: string;
  academicLevel: string;
  researchStage: string;
  experienceLevel: string;
  deadlineIso: string;
  images: File[];
};

export async function createPost(input: CreatePostInput): Promise<ResearchPost> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Missing access token");
  }

  const formData = new FormData();
  formData.append("title", input.title);
  formData.append("description", input.description);
  formData.append("researchDomain", input.researchDomain);
  formData.append("collaborationType", input.collaborationType);
  formData.append("requiredCollaborators", String(input.requiredCollaborators));
  formData.append("department", input.department);
  formData.append("academicLevel", input.academicLevel);
  formData.append("researchStage", input.researchStage);
  formData.append("experienceLevel", input.experienceLevel);
  formData.append("deadline", input.deadlineIso);

  input.images.forEach((file) => {
    formData.append("images", file);
  });

  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = normalizeErrorMessage(errorBody, "Failed to create post");
    throw new Error(message);
  }

  return (await response.json()) as ResearchPost;
}
