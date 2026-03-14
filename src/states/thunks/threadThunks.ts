import { createAsyncThunk } from "@reduxjs/toolkit";
import { createThread, votesApi } from "@/src/lib/api";
import { addThread, toggleThreadVote } from "@/src/states/slices/threadsSlice";
import { toggleDetailThreadVote } from "@/src/states/slices/threadDetailSlice";
import { hideLoading, showLoading } from "@/src/states/slices/uiSlice";
import type { RootState } from "@/src/states/store";
import type { ThreadWithOwner } from "@/src/types/forum";

export const createThreadThunk = createAsyncThunk(
  "threads/create",
  async (
    payload: { title: string; body: string; category?: string },
    { dispatch, getState, rejectWithValue },
  ) => {
    dispatch(showLoading());

    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const user = state.auth.user;

      if (!token || !user) {
        throw new Error("Please log in to create a thread");
      }

      const thread = await createThread(token, payload);
      const nextThread: ThreadWithOwner = {
        ...thread,
        owner: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
      };

      dispatch(addThread(nextThread));
      return nextThread;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const voteThreadThunk = createAsyncThunk(
  "threads/vote",
  async (
    payload: { threadId: string; voteType: 1 | -1 },
    { dispatch, getState, rejectWithValue },
  ) => {
    const state = getState() as RootState;
    const userId = state.auth.user?.id;
    const token = state.auth.token;

    if (!userId || !token) {
      return rejectWithValue("Please log in to vote");
    }

    dispatch(toggleThreadVote({ ...payload, userId }));
    dispatch(toggleDetailThreadVote({ userId, voteType: payload.voteType }));

    try {
      dispatch(showLoading());
      await votesApi.voteThread(token, payload.threadId, payload.voteType);
      return true;
    } catch (error) {
      dispatch(toggleThreadVote({ ...payload, userId }));
      dispatch(toggleDetailThreadVote({ userId, voteType: payload.voteType }));
      return rejectWithValue((error as Error).message);
    } finally {
      dispatch(hideLoading());
    }
  },
);
