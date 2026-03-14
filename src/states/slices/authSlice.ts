import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/src/types/forum";

interface AuthState {
  token: string;
  user: User | null;
}

const initialState: AuthState = {
  token: "",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    hydrateAuth(
      state,
      action: PayloadAction<{ token: string; user: User } | null>,
    ) {
      if (action.payload) {
        state.token = action.payload.token;
        state.user = action.payload.user;
      }
    },
    clearAuth(state) {
      state.token = "";
      state.user = null;
    },
  },
});

export const { setAuth, clearAuth, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
