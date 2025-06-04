"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function GoogleRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const params = ["code", "scope", "authuser", "prompt"];
    const collectedParams: Record<string, string> = {};

    params.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        collectedParams[key] = value;
        localStorage.setItem(`google_${key}`, value); // example: google_code, google_scope
      }
    });

    // Istasangiz barcha paramsni bitta object qilib saqlashingiz mumkin:
    localStorage.setItem("google_auth_params", JSON.stringify(collectedParams));

    // ✅ Keyingi sahifaga yo‘naltirish
    router.push("/dashboard");
  }, [searchParams, router]);

  return <p>Redirecting...</p>;
}
