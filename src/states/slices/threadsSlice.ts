import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ThreadWithOwner } from "@/src/types/forum";

interface ThreadsState {
  items: ThreadWithOwner[];
  activeCategory: string;
}

const initialState: ThreadsState = {
  items: [],
  activeCategory: "all",
};

function applyVote(
  thread: ThreadWithOwner,
  userId: string,
  voteType: 1 | -1,
): ThreadWithOwner {
  const next = {
    ...thread,
    upVotesBy: [...thread.upVotesBy],
    downVotesBy: [...thread.downVotesBy],
  };

  const hasUp = next.upVotesBy.includes(userId);
  const hasDown = next.downVotesBy.includes(userId);

  if (voteType === 1) {
    if (hasUp) {
      next.upVotesBy = next.upVotesBy.filter((id) => id !== userId);
    } else {
      next.upVotesBy.push(userId);
      next.downVotesBy = next.downVotesBy.filter((id) => id !== userId);
    }
  }

  if (voteType === -1) {
    if (hasDown) {
      next.downVotesBy = next.downVotesBy.filter((id) => id !== userId);
    } else {
      next.downVotesBy.push(userId);
      next.upVotesBy = next.upVotesBy.filter((id) => id !== userId);
    }
  }

  return next;
}

const threadsSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    setThreads(state, action: PayloadAction<ThreadWithOwner[]>) {
      const incoming = action.payload;
      const incomingIds = new Set(incoming.map((thread) => thread.id));
      const localOnly = state.items.filter(
        (thread) => !incomingIds.has(thread.id),
      );

      state.items = [...localOnly, ...incoming];
    },
    addThread(state, action: PayloadAction<ThreadWithOwner>) {
      state.items.unshift(action.payload);
    },
    setActiveCategory(state, action: PayloadAction<string>) {
      state.activeCategory = action.payload;
    },
    toggleThreadVote(
      state,
      action: PayloadAction<{
        threadId: string;
        userId: string;
        voteType: 1 | -1;
      }>,
    ) {
      state.items = state.items.map((thread) => {
        if (thread.id !== action.payload.threadId) {
          return thread;
        }

        return applyVote(
          thread,
          action.payload.userId,
          action.payload.voteType,
        );
      });
    },
  },
});

export const { setThreads, addThread, setActiveCategory, toggleThreadVote } =
  threadsSlice.actions;
export default threadsSlice.reducer;
