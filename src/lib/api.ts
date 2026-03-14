import type {
  DetailThread,
  LeaderboardItem,
  LoginResult,
  Thread,
  User,
} from "@/src/types/forum";

const BASE_URL = "https://forum-api.dicoding.dev/v1";

interface ApiEnvelope<T> {
  status: string;
  message: string;
  data: T;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  const result = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Server error occurred");
  }

  return result;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  await request<{ user: User }>("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { email: string; password: string }) {
  const result = await request<{ token: string }>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result.data as LoginResult;
}

export async function getOwnProfile(token: string) {
  const result = await request<{ user: User }>("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return result.data.user;
}

export async function getUsers() {
  const result = await request<{ users: User[] }>("/users");
  return result.data.users;
}

export async function getThreads() {
  const result = await request<{ threads: Thread[] }>("/threads");
  return result.data.threads;
}

export async function createThread(
  token: string,
  payload: { title: string; body: string; category?: string },
) {
  const result = await request<{ thread: Thread }>("/threads", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return result.data.thread;
}

export async function getThreadDetail(threadId: string) {
  const result = await request<{ detailThread: DetailThread }>(
    `/threads/${threadId}`,
  );
  return result.data.detailThread;
}

export async function createComment(
  token: string,
  threadId: string,
  content: string,
) {
  const result = await request<{ comment: DetailThread["comments"][number] }>(
    `/threads/${threadId}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    },
  );

  return result.data.comment;
}

async function voteThread(token: string, threadId: string, type: 1 | 0 | -1) {
  const pathByType: Record<1 | 0 | -1, string> = {
    1: "up-vote",
    0: "neutral-vote",
    "-1": "down-vote",
  };

  await request(`/threads/${threadId}/${pathByType[type]}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function voteComment(
  token: string,
  threadId: string,
  commentId: string,
  type: 1 | 0 | -1,
) {
  const pathByType: Record<1 | 0 | -1, string> = {
    1: "up-vote",
    0: "neutral-vote",
    "-1": "down-vote",
  };

  await request(
    `/threads/${threadId}/comments/${commentId}/${pathByType[type]}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export const votesApi = {
  voteThread,
  voteComment,
};

export async function getLeaderboards() {
  const result = await request<{ leaderboards: LeaderboardItem[] }>(
    "/leaderboards",
  );
  return result.data.leaderboards;
}
