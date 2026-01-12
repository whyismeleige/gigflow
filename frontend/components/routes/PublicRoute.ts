"use client";

import { useAppSelector } from "@/hooks/redux";
import { useMounted } from "@/hooks/useMounted";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function PublicRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const mounted = useMounted();

  useEffect(() => {
    if (mounted && isAuthenticated && user) {
      router.replace(`/auth`);
    }
  }, [mounted, isAuthenticated, router, user]);

  // Don't render anything while checking auth or redirecting
  if (!mounted || loading || (isAuthenticated && user)) {
    return null;
  }

  return children;
}
