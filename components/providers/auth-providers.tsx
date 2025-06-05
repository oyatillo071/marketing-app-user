"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

interface AuthProvidersProps {
  onEmailClick: () => void;
}

export function AuthProviders({ onEmailClick }: AuthProvidersProps) {
  const handleGoogleLogin = () => {
    window.location.href = "https://mlm-backend.pixl.uz/authorization/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "https://mlm-backend.pixl.uz/authorization/facebook";
  };

  return (
    <div className="flex flex-col space-y-3">
      <Button
        variant="outline"
        onClick={handleGoogleLogin}
        className="flex items-center gap-2"
        aria-label="Sign in with Google"
      >
        <FcGoogle className="h-5 w-5" />
        Continue with Google
      </Button>

      <Button
        variant="outline"
        onClick={handleFacebookLogin}
        className="flex items-center gap-2"
        aria-label="Sign in with Facebook"
      >
        <Facebook className="h-5 w-5 text-blue-600" />
        Continue with Facebook
      </Button>

      <Button
        variant="outline"
        onClick={onEmailClick}
        className="flex items-center gap-2"
        aria-label="Continue with Email"
      >
        <Mail className="h-5 w-5" />
        Continue with Email
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
    </div>
  );
}
