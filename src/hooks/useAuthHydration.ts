import { useState, useEffect } from "react";
import { useAuthStore } from "@/auth/authStore";

/**
 * Custom hook that returns `true` once the Zustand auth store
 * has finished hydrating from the `persist` storage.
 * This avoids adding extra state to the store while still providing
 * a reliable signal for components that depend on persisted auth data.
 */
export default function useAuthHydration(): boolean {
  const [hydrated, setHydrated] = useState(() =>
    // In case hydration already happened before this hook runs
    // (e.g., on fast reload), read it synchronously.
    // `persist` typings are not in Zustand core, so cast to any.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useAuthStore as any).persist?.hasHydrated?.() ?? false
  );

  useEffect(() => {
    // The `persist` middleware exposes a finish hydration callback.
    // We listen to it exactly once to flip the flag.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unsub = (useAuthStore as any).persist?.onFinishHydration?.(() => {
      setHydrated(true);
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return hydrated;
}
