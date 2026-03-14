"use client";

import { useAppSelector } from "@/src/states/hooks";

export default function LoadingIndicator() {
  const loadingCount = useAppSelector((state) => state.ui.loadingCount);

  if (loadingCount <= 0) {
    return null;
  }

  return (
    <div
      className="navbar-loading"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="navbar-loading-bar" />
    </div>
  );
}
