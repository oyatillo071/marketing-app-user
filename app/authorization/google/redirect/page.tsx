"use client";

import { Suspense } from "react";
import GoogleRedirectInner from "./redirect-inner";

export default function GoogleRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600 text-lg">Authenticating with Google...</p>
        </div>
      }
    >
      <GoogleRedirectInner />
    </Suspense>
  );
}

// --- redirect-inner.tsx faylini yarating ---
