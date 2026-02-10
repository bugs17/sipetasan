"use client";

import dynamic from "next/dynamic";
import { useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const SignIn = dynamic(
  () => import("@clerk/nextjs").then((m) => m.SignIn),
  { ssr: false }
);

export default function AuthWrapper({ children }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[#212126] flex items-center justify-center">
      
      {/* 1. Background Ornaments (Sama dengan Landing Page) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6d28d9] opacity-20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#6d28d9] opacity-15 blur-[100px] rounded-full pointer-events-none" />
      
      {/* 2. Dark Overlay & Mesh Pattern (Optional for extra texture) */}
      <div className="absolute inset-0 z-10 bg-[#212126]/40 backdrop-blur-[2px]" />

      {/* 3. Login Content Container */}
      <div className="relative z-20 flex flex-col items-center gap-8 w-full max-w-md px-4">
        
        {/* Branding Logo di atas Box Login */}
        <div className="flex flex-col items-center gap-2 animate-fade-in">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-2xl">
            <span className="text-3xl">🧨</span>
          </div>
          <div className="text-center mt-2">
            <h1 className="text-2xl font-black tracking-tighter italic text-white">
              SI<span className="text-[#6d28d9]">-</span>PETASN
            </h1>
            <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] uppercase">
              Pemerintah Provinsi Papua
            </p>
          </div>
        </div>

        {/* Clerk SignIn Component */}
        <div className="w-full glass-container relative">
          {/* Subtle Glow di belakang kartu login */}
          <div className="absolute -inset-1 bg-[#6d28d9]/20 blur-xl rounded-[2rem] pointer-events-none" />
          
          <SignIn
            routing="hash"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: "#6d28d9",
                colorBackground: "#2a2a30", // Sedikit lebih terang dari bg utama agar pop
                colorText: "white",
                borderRadius: "1rem",
              },
              elements: {
                card: "bg-transparent shadow-none border-none",
                navbar: "hidden",
                footer: "hidden", // Sesuai permintaanmu
                headerTitle: "text-xl font-bold tracking-tight",
                headerSubtitle: "text-gray-400 text-sm",
                socialButtonsBlockButton: "border-white/10 hover:bg-white/5 transition-all",
                formButtonPrimary: "bg-white text-[#212126] hover:bg-gray-100 border-none font-bold",
                formFieldInput: "bg-white/5 border-white/10 focus:border-[#6d28d9] focus:ring-0 transition-all",
              },
            }}
          />
        </div>

        {/* Footer info kecil */}
        <p className="text-[10px] text-gray-500 text-center tracking-widest leading-relaxed">
          SISTEM INFORMASI PEMETAAN ASN <br />
          DINAS KOMUNIKASI DAN INFORMATIKA PROVINSI PAPUA
        </p>
      </div>
    </div>
    );
  }

  return children;
}
