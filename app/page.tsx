import ThreadListPage from "@/src/components/threads/ThreadListPage";
import { getThreads, getUsers } from "@/src/lib/api";
import type { Thread, User } from "@/src/types/forum";

export default async function Home() {
  let threads: Thread[] = [];
  let users: User[] = [];

  try {
    [threads, users] = await Promise.all([getThreads(), getUsers()]);
  } catch {
    threads = [];
    users = [];
  }

  const threadsWithOwner = threads.map((thread) => {
    const owner = users.find((user) => user.id === thread.ownerId);

    return {
      ...thread,
      owner: {
        id: owner?.id || thread.ownerId,
        name: owner?.name || "Unknown User",
        avatar: owner?.avatar,
      },
    };
  });

  return <ThreadListPage initialThreads={threadsWithOwner} />;
}
