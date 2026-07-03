"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { getMe } from "@/store/slices/auth.slice";

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, []);

  return null;
}
