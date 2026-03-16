import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/src/components/auth/LoginForm";
import { useAppDispatch } from "@/src/states/hooks";
import { loginThunk } from "@/src/states/thunks/authThunks";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/src/states/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

/*
 * Skenario Pengujian:
 * - LoginForm menampilkan pesan error saat loginThunk rejected.
 * - LoginForm melakukan redirect ke home saat loginThunk fulfilled.
 */

describe("LoginForm component", () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
  });

  it("should show error text when login fails", async () => {
    const payload = { email: "wrong@example.com", password: "bad-pass" };

    dispatchMock.mockResolvedValue(
      loginThunk.rejected(
        new Error("Invalid credentials"),
        "request-1",
        payload,
        "Invalid credentials",
      ),
    );

    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText("Email"), payload.email);
    await userEvent.type(screen.getByLabelText("Password"), payload.password);
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("should navigate to home when login succeeds", async () => {
    const payload = { email: "user@example.com", password: "123456" };

    dispatchMock.mockResolvedValue(
      loginThunk.fulfilled(true, "request-2", payload),
    );

    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText("Email"), payload.email);
    await userEvent.type(screen.getByLabelText("Password"), payload.password);
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
