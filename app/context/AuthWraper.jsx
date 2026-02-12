"use client";

import dynamic from "next/dynamic";
import { useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";

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
      {/* <div className="absolute inset-0 z-10 bg-[#212126]/40 backdrop-blur-[2px]" /> */}

      <div className=" bg-[#1a1a1e]/90 border border-white/10 p-8 shadow-2xl rounded-[2.5rem] max-w-md relative overflow-hidden">
                      
                      {/* Noise Texture Effect */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
                      </div>
      
                      <div className="relative z-10">
                          {/* Header Custom */}
                          <div className="text-center space-y-1 mb-8">
                              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                                  Akses Sistem
                              </h3>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                  Silahkan Masuk Menggunakan Akun Terverifikasi
                              </p>
                          </div>
      
                          {/* Clerk SignIn */}
                          <div className="w-full">
                              <SignIn
                                  routing="hash"
                                  fallbackRedirectUrl="/dashboard"
                                  appearance={{
                                      baseTheme: dark,
                                      variables: {
                                      colorPrimary: "#ffffff",
                                      colorBackground: "transparent",
                                      colorText: "white",
                                      borderRadius: "0.75rem",
                                      // Tambahkan font family jika perlu agar tidak default
                                      },
                                      elements: {
                                      // rootBox: "w-full", // Memastikan box terluar memenuhi lebar
                                      // cardBox: "w-full", // Memastikan card memenuhi lebar
                                      // card: "bg-transparent shadow-none border-none p-0 w-full", // Buang p-0 bawaan Clerk
                                      header: "hidden", 
                                      footer: "hidden",
                                      // main: "gap-6", // Memberi jarak antar elemen form
                                      // formFieldLabelRow: "mb-2 ml-1", // Memperbaiki baris label agar tidak terpotong
                                      // formFieldLabel: "text-[10px] font-black text-gray-400 uppercase tracking-widest",
                                      // formFieldInput: "bg-white/[0.03] border border-white/10 focus:border-white/30 focus:ring-0 transition-all h-12 text-sm w-full px-4",
                                      // formButtonPrimary: "bg-white text-[#1a1a1e] hover:bg-gray-200 border-none font-black uppercase text-xs tracking-[0.2em] h-12 shadow-xl w-full mt-2",
                                      // socialButtonsBlockButton: "bg-white/[0.03] border border-white/10 hover:bg-white/5 transition-all text-sm h-12 w-full",
                                      // dividerLine: "bg-white/10",
                                      // dividerText: "text-[10px] font-black text-gray-600 uppercase",
                                      // identityPreview: "bg-white/5 border-white/10", // Jika user sudah input email dan lanjut ke password
                                      },
                                  }}
                                  />
                          </div>
      
                          {/* Footer / Cancel Button */}
                          <div className="mt-6 w-full flex justify-center">
                              <Link 
                                  href={'/'}
                                  className="w-full text-center px-6 py-3 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-white/5 transition-all"
                              >
                                  Batalkan Akses
                              </Link>
                          </div>
                      </div>
                  </div>
    
    </div>
    );
  }

  return children;
}
