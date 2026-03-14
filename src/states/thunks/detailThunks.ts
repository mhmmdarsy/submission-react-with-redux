import { createAsyncThunk } from "@reduxjs/toolkit";
import { createComment, votesApi } from "@/src/lib/api";
import {
  addComment,
  toggleCommentVote,
} from "@/src/states/slices/threadDetailSlice";
import { hideLoading, showLoading } from "@/src/states/slices/uiSlice";
import type { RootState } from "@/src/states/store";

export const createCommentThunk = createAsyncThunk(
  "threadDetail/createComment",
  async (
    payload: { threadId: string; content: string },
    { dispatch, getState, rejectWithValue },
  ) => {
    dispatch(showLoading());

    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const user = state.auth.user;

      if (!token || !user) {
        throw new Error("Please log in to post a comment");
      }

      const comment = await createComment(
        token,
        payload.threadId,
        payload.content,
      );
      dispatch(addComment(comment));
      return comment;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const voteCommentThunk = createAsyncThunk(
  "threadDetail/voteComment",
  async (
    payload: { threadId: string; commentId: string; voteType: 1 | -1 },
    { dispatch, getState, rejectWithValue },
  ) => {
    const state = getState() as RootState;
    const userId = state.auth.user?.id;
    const token = state.auth.token;

    if (!userId || !token) {
      return rejectWithValue("Please log in to vote");
    }

    dispatch(toggleCommentVote({ ...payload, userId }));

    try {
      dispatch(showLoading());
      await votesApi.voteComment(
        token,
        payload.threadId,
        payload.commentId,
        payload.voteType,
      );
      return true;
    } catch (error) {
      dispatch(toggleCommentVote({ ...payload, userId }));
      return rejectWithValue((error as Error).message);
    } finally {
      dispatch(hideLoading());
    }
  },
);
