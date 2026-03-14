"use client";

import { useAppSelector } from "@/src/states/hooks";

export default function LoadingIndicator() {
  const loadingCount = useAppSelector((state) => state.ui.loadingCount);

  if (loadingCount <= 0) {
    return null;
  }

  return (
    <div className="loading-wrap" role="status" aria-live="polite">
      <div className="loading-dot" />
      <span>Loading...</span>
    </div>
  );
}
