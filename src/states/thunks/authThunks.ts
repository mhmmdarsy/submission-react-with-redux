import { createAsyncThunk } from "@reduxjs/toolkit";
import { getOwnProfile, login, registerUser } from "@/src/lib/api";
import {
  clearStoredToken,
  clearStoredUser,
  setStoredToken,
  setStoredUser,
} from "@/src/lib/storage";
import { clearAuth, setAuth } from "@/src/states/slices/authSlice";
import { hideLoading, showLoading } from "@/src/states/slices/uiSlice";

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (
    payload: { name: string; email: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    dispatch(showLoading());

    try {
      await registerUser(payload);
      return true;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    payload: { email: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    dispatch(showLoading());

    try {
      const { token } = await login(payload);
      const user = await getOwnProfile(token);

      dispatch(setAuth({ token, user }));
      setStoredToken(token);
      setStoredUser(user);

      return true;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    dispatch(clearAuth());
    clearStoredToken();
    clearStoredUser();
  },
);
