"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // Custom credentials orqali login qilish
      signIn("credentials", {
        token,
        callbackUrl: "/", // login bo'lgach qayerga redirect qilish
      });
    }
  }, [token]);

  return <p>Redirecting...</p>;
}
