import uiReducer, {
  hideLoading,
  setLoading,
  showLoading,
} from "@/src/states/slices/uiSlice";

/*
 * Skenario Pengujian:
 * - showLoading menambah loadingCount.
 * - hideLoading tidak pernah membuat loadingCount negatif.
 * - setLoading mengatur loadingCount ke 1 atau 0 sesuai payload.
 */

describe("uiSlice reducer", () => {
  it("should increment loadingCount when showLoading is dispatched", () => {
    const current = { loadingCount: 0 };

    const next = uiReducer(current, showLoading());

    expect(next.loadingCount).toBe(1);
  });

  it("should not decrement loadingCount below zero", () => {
    const current = { loadingCount: 0 };

    const next = uiReducer(current, hideLoading());

    expect(next.loadingCount).toBe(0);
  });

  it("should set loadingCount based on boolean payload", () => {
    const loading = uiReducer({ loadingCount: 0 }, setLoading(true));
    const idle = uiReducer({ loadingCount: 3 }, setLoading(false));

    expect(loading.loadingCount).toBe(1);
    expect(idle.loadingCount).toBe(0);
  });
});
