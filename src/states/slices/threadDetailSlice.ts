import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Comment, DetailThread } from "@/src/types/forum";

interface ThreadDetailState {
  item: DetailThread | null;
}

const initialState: ThreadDetailState = {
  item: null,
};

function toggleVotes(users: string[], userId: string, enabled: boolean) {
  if (enabled) {
    if (users.includes(userId)) {
      return users.filter((id) => id !== userId);
    }

    return [...users, userId];
  }

  return users.filter((id) => id !== userId);
}

const threadDetailSlice = createSlice({
  name: "threadDetail",
  initialState,
  reducers: {
    setThreadDetail(state, action: PayloadAction<DetailThread | null>) {
      state.item = action.payload;
    },
    addComment(state, action: PayloadAction<Comment>) {
      if (!state.item) {
        return;
      }

      state.item.comments.push(action.payload);
    },
    toggleDetailThreadVote(
      state,
      action: PayloadAction<{ userId: string; voteType: 1 | -1 }>,
    ) {
      if (!state.item) {
        return;
      }

      const hasUp = state.item.upVotesBy.includes(action.payload.userId);
      const hasDown = state.item.downVotesBy.includes(action.payload.userId);

      if (action.payload.voteType === 1) {
        state.item.upVotesBy = toggleVotes(
          state.item.upVotesBy,
          action.payload.userId,
          true,
        );
        if (!hasUp) {
          state.item.downVotesBy = toggleVotes(
            state.item.downVotesBy,
            action.payload.userId,
            false,
          );
        }
      }

      if (action.payload.voteType === -1) {
        state.item.downVotesBy = toggleVotes(
          state.item.downVotesBy,
          action.payload.userId,
          true,
        );
        if (!hasDown) {
          state.item.upVotesBy = toggleVotes(
            state.item.upVotesBy,
            action.payload.userId,
            false,
          );
        }
      }
    },
    toggleCommentVote(
      state,
      action: PayloadAction<{
        commentId: string;
        userId: string;
        voteType: 1 | -1;
      }>,
    ) {
      if (!state.item) {
        return;
      }

      state.item.comments = state.item.comments.map((comment) => {
        if (comment.id !== action.payload.commentId) {
          return comment;
        }

        const upVotesBy = [...comment.upVotesBy];
        const downVotesBy = [...comment.downVotesBy];
        const hasUp = upVotesBy.includes(action.payload.userId);
        const hasDown = downVotesBy.includes(action.payload.userId);

        if (action.payload.voteType === 1) {
          if (hasUp) {
            return {
              ...comment,
              upVotesBy: upVotesBy.filter((id) => id !== action.payload.userId),
            };
          }

          return {
            ...comment,
            upVotesBy: [...upVotesBy, action.payload.userId],
            downVotesBy: downVotesBy.filter(
              (id) => id !== action.payload.userId,
            ),
          };
        }

        if (hasDown) {
          return {
            ...comment,
            downVotesBy: downVotesBy.filter(
              (id) => id !== action.payload.userId,
            ),
          };
        }

        return {
          ...comment,
          downVotesBy: [...downVotesBy, action.payload.userId],
          upVotesBy: upVotesBy.filter((id) => id !== action.payload.userId),
        };
      });
    },
  },
});

export const {
  setThreadDetail,
  addComment,
  toggleDetailThreadVote,
  toggleCommentVote,
} = threadDetailSlice.actions;
export default threadDetailSlice.reducer;
