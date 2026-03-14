"use client";

import { useEffect, useMemo } from "react";
import { Provider } from "react-redux";
import { getStoredToken, getStoredUser } from "@/src/lib/storage";
import { hydrateAuth } from "@/src/states/slices/authSlice";
import { createAppStore } from "@/src/states/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useMemo(() => createAppStore(), []);

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();

    if (token && user) {
      store.dispatch(hydrateAuth({ token, user }));
    }
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
