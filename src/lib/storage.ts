import type { User } from "@/src/types/forum";

const TOKEN_KEY = "forum_token";
const USER_KEY = "forum_user";

function isClient() {
  return typeof window !== "undefined";
}

export function getStoredToken() {
  if (!isClient()) {
    return "";
  }

  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function setStoredToken(token: string) {
  if (!isClient()) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  if (!isClient()) {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
  if (!isClient()) {
    return null;
  }

  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User) {
  if (!isClient()) {
    return;
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (!isClient()) {
    return;
  }

  localStorage.removeItem(USER_KEY);
}
