import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/src/components/common/Navbar";
import { useAppDispatch, useAppSelector } from "@/src/states/hooks";

const routerPushMock = jest.fn();
const pathnameMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
  usePathname: () => pathnameMock(),
}));

jest.mock("@/src/states/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

// Skenario Pengujian:
// Navbar menampilkan tombol Login/Register saat user belum login.
// Navbar memanggil logout lalu redirect ke home saat user login
// dan bukan di halaman root.

describe("Navbar component", () => {
  const dispatchMock = jest.fn();

  const createMockState = (user: {
    id: string;
    name: string;
    avatar: string;
  } | null) => {
    return {
      auth: { user },
      ui: { loadingCount: 0 },
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    pathnameMock.mockReturnValue("/");
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
  });

  it("should render login and register links for guest", () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      return selector(createMockState(null));
    });

    render(<Navbar />);

    expect(
      screen.getByRole("link", { name: "Login" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Register" }),
    ).toBeInTheDocument();
  });

  it("should dispatch logout and redirect to home", async () => {
    pathnameMock.mockReturnValue("/leaderboards");
    dispatchMock.mockResolvedValue({ type: "auth/logout/fulfilled" });

    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      return selector(
        createMockState({
          id: "user-1",
          name: "Dicoding User",
          avatar: "https://example.com/avatar.png",
        }),
      );
    });

    render(<Navbar />);

    await userEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(dispatchMock).toHaveBeenCalled();
    expect(routerPushMock).toHaveBeenCalledWith("/");
  });
});
