"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
export function SaveUserToLocalStorage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status == "authenticated" && session?.user) {
      localStorage.setItem("user", JSON.stringify(session.user));
    }
  }, [status, session]);

  return null;
}
