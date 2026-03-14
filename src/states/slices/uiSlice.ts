import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  loadingCount: number;
}

const initialState: UiState = {
  loadingCount: 0,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showLoading(state) {
      state.loadingCount += 1;
    },
    hideLoading(state) {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loadingCount = action.payload ? 1 : 0;
    },
  },
});

export const { showLoading, hideLoading, setLoading } = uiSlice.actions;
export default uiSlice.reducer;
