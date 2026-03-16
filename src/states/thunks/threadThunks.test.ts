import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/src/states/slices/authSlice";
import threadsReducer from "@/src/states/slices/threadsSlice";
import threadDetailReducer from "@/src/states/slices/threadDetailSlice";
import uiReducer from "@/src/states/slices/uiSlice";
import { voteThreadThunk } from "@/src/states/thunks/threadThunks";
import { votesApi } from "@/src/lib/api";
import type { DetailThread, ThreadWithOwner } from "@/src/types/forum";

jest.mock("@/src/lib/api", () => ({
  createThread: jest.fn(),
  votesApi: {
    voteThread: jest.fn(),
  },
}));

/*
 * Skenario Pengujian:
 * - voteThreadThunk melakukan optimistic update saat API sukses.
 * - voteThreadThunk melakukan rollback saat API gagal.
 */

describe("threadThunks", () => {
  const mockedVoteThread = votesApi.voteThread as jest.MockedFunction<
    typeof votesApi.voteThread
  >;

  const baseThread: ThreadWithOwner = {
    id: "thread-1",
    title: "Thread One",
    body: "Body",
    category: "general",
    createdAt: "2026-01-01T00:00:00.000Z",
    ownerId: "user-1",
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0,
    owner: {
      id: "user-1",
      name: "Owner",
      avatar: "https://example.com/avatar.png",
    },
  };

  const baseDetail: DetailThread = {
    id: "thread-1",
    title: "Thread One",
    body: "Body",
    category: "general",
    createdAt: "2026-01-01T00:00:00.000Z",
    upVotesBy: [],
    downVotesBy: [],
    owner: {
      id: "user-1",
      name: "Owner",
      avatar: "https://example.com/avatar.png",
    },
    comments: [],
  };

  const createStore = () => {
    return configureStore({
      reducer: {
        auth: authReducer,
        threads: threadsReducer,
        threadDetail: threadDetailReducer,
        ui: uiReducer,
      },
      preloadedState: {
        auth: {
          token: "token-123",
          user: {
            id: "user-2",
            name: "Voter",
            avatar: "https://example.com/voter.png",
          },
        },
        threads: {
          items: [baseThread],
          activeCategory: "all",
        },
        threadDetail: {
          item: baseDetail,
        },
        ui: {
          loadingCount: 0,
        },
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should keep optimistic vote when API call succeeds", async () => {
    const store = createStore();
    mockedVoteThread.mockResolvedValue(undefined);

    const result = await store.dispatch(
      voteThreadThunk({ threadId: "thread-1", voteType: 1 }),
    );

    expect(voteThreadThunk.fulfilled.match(result)).toBe(true);
    expect(mockedVoteThread).toHaveBeenCalledWith("token-123", "thread-1", 1);
    expect(store.getState().threads.items[0].upVotesBy).toContain("user-2");
    expect(store.getState().threadDetail.item?.upVotesBy).toContain("user-2");
    expect(store.getState().ui.loadingCount).toBe(0);
  });

  it("should rollback optimistic vote when API call fails", async () => {
    const store = createStore();
    mockedVoteThread.mockRejectedValue(new Error("Vote failed"));

    const result = await store.dispatch(
      voteThreadThunk({ threadId: "thread-1", voteType: 1 }),
    );

    expect(voteThreadThunk.rejected.match(result)).toBe(true);
    expect(result.payload).toBe("Vote failed");
    expect(store.getState().threads.items[0].upVotesBy).toEqual([]);
    expect(store.getState().threadDetail.item?.upVotesBy).toEqual([]);
    expect(store.getState().ui.loadingCount).toBe(0);
  });
});
