import threadsReducer, {
  setThreads,
  toggleThreadVote,
} from "@/src/states/slices/threadsSlice";
import type { ThreadWithOwner } from "@/src/types/forum";

/*
 * Skenario Pengujian:
 * - setThreads mempertahankan item lokal yang tidak ada di payload server.
 * - toggleThreadVote menambahkan upvote user dan menghapus downvote sebelumnya.
 */

describe("threadsSlice reducer", () => {
  const owner = {
    id: "user-1",
    name: "User One",
    avatar: "https://example.com/avatar.png",
  };

  const createThread = (id: string): ThreadWithOwner => ({
    id,
    title: `Thread ${id}`,
    body: "Body",
    category: "general",
    createdAt: "2026-01-01T00:00:00.000Z",
    ownerId: owner.id,
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0,
    owner,
  });

  it("should keep local-only items while replacing incoming ids", () => {
    const current = {
      items: [
        { ...createThread("thread-1"), title: "local thread-1" },
        createThread("thread-local-only"),
      ],
      activeCategory: "all",
    };

    const incoming = [
      { ...createThread("thread-1"), title: "server thread-1" },
      createThread("thread-2"),
    ];

    const next = threadsReducer(current, setThreads(incoming));

    expect(next.items).toHaveLength(3);
    expect(next.items[0].id).toBe("thread-local-only");
    expect(next.items[1].title).toBe("server thread-1");
    expect(next.items[2].id).toBe("thread-2");
  });

  it("should toggle upvote and remove downvote for the same user", () => {
    const current = {
      items: [
        {
          ...createThread("thread-1"),
          downVotesBy: ["user-2"],
        },
      ],
      activeCategory: "all",
    };

    const next = threadsReducer(
      current,
      toggleThreadVote({
        threadId: "thread-1",
        userId: "user-2",
        voteType: 1,
      }),
    );

    expect(next.items[0].upVotesBy).toContain("user-2");
    expect(next.items[0].downVotesBy).not.toContain("user-2");
  });
});
