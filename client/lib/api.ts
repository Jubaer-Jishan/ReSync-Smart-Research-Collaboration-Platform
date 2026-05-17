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

export const ACCESS_TOKEN_KEY = "resync_access_token";
export const USER_KEY = "resync_user";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function authFetch(input: RequestInfo | URL, init?: RequestInit) {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Missing access token");
  }

  return fetch(input, {
    ...init,
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
    const message =
      (errorBody && (errorBody.message || errorBody.error)) ||
      "Failed to create post";
    throw new Error(message);
  }

  return (await response.json()) as ResearchPost;
}
