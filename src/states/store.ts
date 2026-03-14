import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/src/states/slices/authSlice";
import leaderboardsReducer from "@/src/states/slices/leaderboardsSlice";
import threadDetailReducer from "@/src/states/slices/threadDetailSlice";
import threadsReducer from "@/src/states/slices/threadsSlice";
import uiReducer from "@/src/states/slices/uiSlice";

export function createAppStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      threads: threadsReducer,
      threadDetail: threadDetailReducer,
      leaderboards: leaderboardsReducer,
    },
  });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
