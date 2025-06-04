"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function GoogleRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      // Token olish uchun backendga so‘rov yuboramiz
    axios
  .post("https://mlm-backend.pixl.uz/authorization/user", {
    code,
  })
  .then((res) => {
    const { token, user } = res.data;

    // Saqlash va redirect qilish
    localStorage.setItem("token", token);
    localStorage.setItem("mlm-data", JSON.stringify(user));
    router.push("/dashboard");
  })
  .catch((err) => {
    console.error("Auth failed:", err);
    // router.push("/login");
  });

    } else {
    //   router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-600 text-lg">Authenticating with Google...</p>
    </div>
  );
}
