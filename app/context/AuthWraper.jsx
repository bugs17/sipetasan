"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthWrapper({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Jika sudah selesai loading dan ternyata tidak login
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // Sambil menunggu pengecekan auth, tampilkan null atau loading state
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="fixed inset-0 bg-[#0f0f11] flex items-center justify-center">
        {/* Opsional: Tambahkan loader biar gak blank hitam banget */}
        <div className="w-10 h-10 border-4 border-t-indigo-500 border-white/5 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
