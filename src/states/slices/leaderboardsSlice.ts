import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LeaderboardItem } from "@/src/types/forum";

interface LeaderboardsState {
  items: LeaderboardItem[];
}

const initialState: LeaderboardsState = {
  items: [],
};

const leaderboardsSlice = createSlice({
  name: "leaderboards",
  initialState,
  reducers: {
    setLeaderboards(state, action: PayloadAction<LeaderboardItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { setLeaderboards } = leaderboardsSlice.actions;
export default leaderboardsSlice.reducer;
