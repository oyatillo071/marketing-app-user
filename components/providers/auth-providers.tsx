"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthProvidersProps {
  onEmailClick: () => void;
}

export function AuthProviders({ onEmailClick }: AuthProvidersProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleTokenLogin = async () => {
    const result = await signIn("credentials", {
      redirect: false,
      token,
    });

    if (result?.ok) {
      localStorage.setItem("userToken", token);
      router.push("/dashboard");
    } else {
      setError("Invalid token. Please try again.");
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          window.location.href =
            "https://mlm-backend.pixl.uz/authorization/google";
        }}
        className="flex items-center gap-2"
      >
        <FcGoogle className="h-5 w-5" />
        Continue with Google
      </Button>

      <Button
        variant="outline"
        onClick={() => signIn("facebook")}
        className="flex items-center gap-2"
      >
        <Facebook className="h-5 w-5 text-blue-600" />
        Continue with Facebook
      </Button>

      <Button
        variant="outline"
        onClick={onEmailClick}
        className="flex items-center gap-2"
      >
        <Mail className="h-5 w-5" />
        Continue with Email
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* ✅ Token bilan login qilish qo‘shildi */}
      {/* <input
        type="text"
        placeholder="Enter your token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
      />
      <Button onClick={handleTokenLogin} className="w-full">
        Continue with Token
      </Button> */}
      {error && (
        <p className="text-sm text-red-500 text-center mt-1">{error}</p>
      )}
    </div>
  );
}
