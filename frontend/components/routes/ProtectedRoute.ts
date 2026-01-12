"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useMounted } from "@/hooks/useMounted";
import { fetchProfile } from "@/store/slices/auth.slice";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const mounted = useMounted();

  useEffect(() => {
    if (mounted && !user && !loading) {
      dispatch(fetchProfile()).unwrap();
    }
  }, [loading, dispatch, user, mounted]);

  useEffect(() => {
    if (mounted && !loading && !user && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, router, mounted]);

  if (!mounted || !user || !isAuthenticated) {
    return null; // Next.js loading.tsx will handle the loading UI
  }

  return children;
}
