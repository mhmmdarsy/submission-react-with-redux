"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/src/components/common/LoadingIndicator";
import { useAppDispatch, useAppSelector } from "@/src/states/hooks";
import { logoutThunk } from "@/src/states/thunks/authThunks";

export default function Navbar() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onLogout = async () => {
    await dispatch(logoutThunk());
    router.push("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="brand">
          Dicoding Forum Hub
        </Link>
        <nav className="nav-links">
          <Link href="/">Threads</Link>
          <p>|</p>
          <Link href="/leaderboards">Leaderboards</Link>
          <p>|</p>
          {user ? (
            <>
              <span className="user-pill">
                <Image
                  src={user.avatar || "https://ui-avatars.com/api/?name=User"}
                  alt={user.name}
                  width={28}
                  height={28}
                  unoptimized
                />
                {user.name}
              </span>
              <button type="button" onClick={onLogout} className="ghost-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="ghost-btn">
                Login
              </Link>
              <Link href="/register" className="solid-btn">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
      <LoadingIndicator />
    </header>
  );
}
