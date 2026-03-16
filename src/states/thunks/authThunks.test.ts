import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/src/states/slices/authSlice";
import uiReducer from "@/src/states/slices/uiSlice";
import { loginThunk } from "@/src/states/thunks/authThunks";
import { getOwnProfile, login } from "@/src/lib/api";
import { setStoredToken, setStoredUser } from "@/src/lib/storage";

jest.mock("@/src/lib/api", () => ({
  login: jest.fn(),
  getOwnProfile: jest.fn(),
  registerUser: jest.fn(),
}));

jest.mock("@/src/lib/storage", () => ({
  setStoredToken: jest.fn(),
  setStoredUser: jest.fn(),
  clearStoredToken: jest.fn(),
  clearStoredUser: jest.fn(),
  getStoredToken: jest.fn(),
  getStoredUser: jest.fn(),
}));

/*
 * Skenario Pengujian:
 * - loginThunk sukses menyimpan auth ke state dan storage.
 * - loginThunk gagal mengembalikan payload error dan loading ditutup.
 */

describe("authThunks", () => {
  const mockedLogin = login as jest.MockedFunction<typeof login>;
  const mockedGetOwnProfile = getOwnProfile as jest.MockedFunction<
    typeof getOwnProfile
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fulfill loginThunk and persist token/user", async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        ui: uiReducer,
      },
    });

    mockedLogin.mockResolvedValue({ token: "token-123" });
    mockedGetOwnProfile.mockResolvedValue({
      id: "user-1",
      name: "Dicoding",
      avatar: "https://example.com/avatar.png",
    });

    const result = await store.dispatch(
      loginThunk({ email: "dicoding@example.com", password: "123456" }),
    );

    expect(loginThunk.fulfilled.match(result)).toBe(true);
    expect(store.getState().auth.token).toBe("token-123");
    expect(store.getState().auth.user?.name).toBe("Dicoding");
    expect(store.getState().ui.loadingCount).toBe(0);
    expect(setStoredToken).toHaveBeenCalledWith("token-123");
    expect(setStoredUser).toHaveBeenCalledWith(
      expect.objectContaining({ id: "user-1" }),
    );
  });

  it("should reject loginThunk with error payload", async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        ui: uiReducer,
      },
    });

    mockedLogin.mockRejectedValue(new Error("Invalid credentials"));

    const result = await store.dispatch(
      loginThunk({ email: "wrong@example.com", password: "bad-password" }),
    );

    expect(loginThunk.rejected.match(result)).toBe(true);
    expect(result.payload).toBe("Invalid credentials");
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().ui.loadingCount).toBe(0);
    expect(setStoredToken).not.toHaveBeenCalled();
    expect(setStoredUser).not.toHaveBeenCalled();
  });
});
