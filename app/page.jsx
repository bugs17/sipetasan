"use client";

import React, { useState } from "react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineArrowRight,
  HiOutlineStatusOnline,
} from "react-icons/hi";
import { Search } from "lucide-react";
import LoginModal from "@/components/LoginModal";

const LandingPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [nip, setNip] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusResult, setStatusResult] = useState(null); // Dummy state untuk hasil

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckStatus = () => {
    setLoading(true);
    // Simulasi Fetching Data
    setTimeout(() => {
      setStatusResult({
        nama: "Yulianus Wandik",
        status: "DIPROSES",
        posisi: "Admin Induk (Biro Organisasi)",
        update: "11 Feb 2026",
        note: "Sedang dalam tahap verifikasi dokumen pendukung.",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#212126] text-white selection:bg-[#6d28d9]/30 flex items-center justify-center p-6 overflow-hidden relative">
      {/* --- ELEGANT FLOATING BUTTON --- */}
      <div className="fixed left-8 bottom-8 z-[100]">
        <button
          onClick={() => {
            setIsDrawerOpen(true);
            setIsModalOpen(false);
          }}
          className="group relative flex items-center gap-4 p-2 pr-6 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-2xl border border-white/10 rounded-full transition-all duration-500 hover:border-[#6d28d9]/50 hover:shadow-[0_0_30px_rgba(109,40,217,0.15)] active:scale-95"
        >
          {/* Icon Container dengan Ring Glow halus */}
          <div className="relative flex items-center justify-center w-12 h-12 bg-[#6d28d9] text-white rounded-full shadow-[0_0_20px_rgba(109,40,217,0.4)] group-hover:scale-110 transition-transform duration-500">
            <Search size={20} strokeWidth={2.5} />
            {/* Animasi Ring di sekitar icon */}
            <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-20 group-hover:hidden" />
          </div>

          {/* Text Label */}
          <div className="flex flex-col items-start">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] leading-none mb-1 group-hover:text-[#6d28d9] transition-colors">
              Layanan Publik
            </span>
            <span className="text-sm font-bold text-white tracking-tight">
              Tracking{" "}
              <span className="text-gray-400 font-medium italic mx-0.5">
                Status
              </span>
            </span>
          </div>

          {/* Subtle Glow Effect on Hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6d28d9]/0 via-[#6d28d9]/5 to-[#6d28d9]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </button>
      </div>

      {/* --- LEFT DRAWER COMPONENT --- */}
      <div
        className={`fixed inset-0 z-[110] transition-visibility ${isDrawerOpen ? "visible" : "invisible"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/80 transition-opacity duration-500 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsDrawerOpen(false)}
        />

        {/* Drawer Content */}
        <div
          className={`absolute top-0 left-0 h-full w-full max-w-md bg-[#1a1a1e] border-r border-white/10 shadow-2xl transition-transform duration-500 transform ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-8 flex flex-col h-full relative overflow-hidden">
            {/* Grainy effect for Drawer */}
            <div
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            ></div>

            {/* Close Button */}
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <HiOutlineX size={24} className="text-gray-500" />
            </button>

            <div className="relative z-10 mt-10">
              <h2 className="text-3xl font-black italic tracking-tighter">
                TRACKING <span className="text-[#6d28d9]">STATUS.</span>
              </h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
                Monitoring Usulan ASN
              </p>
            </div>

            {/* Input Section */}
            <div className="relative z-10 mt-12 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                  Nomor Induk Pegawai (NIP)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="19xxxxxxxxxxxxxx"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-mono focus:outline-none focus:border-[#6d28d9] focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleCheckStatus}
                disabled={!nip || loading}
                className="w-full bg-white text-[#1a1a1e] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Proses Data"}
                {!loading && <HiOutlineArrowRight size={16} />}
              </button>
            </div>

            {/* Result Section */}
            <div className="relative z-10 mt-12 flex-1 overflow-y-auto">
              {statusResult ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-black text-[#6d28d9] uppercase tracking-widest">
                          Nama Pegawai
                        </p>
                        <h4 className="text-sm font-bold mt-1 uppercase">
                          {statusResult.nama}
                        </h4>
                      </div>
                      <div className="px-2 py-1 rounded-md bg-[#6d28d9]/20 border border-[#6d28d9]/30">
                        <span className="text-[10px] font-black text-[#6d28d9]">
                          {statusResult.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-[#6d28d9]" />
                          <div className="w-[1px] h-10 bg-gradient-to-b from-[#6d28d9] to-transparent" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase">
                            Posisi Terakhir
                          </p>
                          <p className="text-[11px] font-medium text-gray-300">
                            {statusResult.posisi}
                          </p>
                          <p className="text-[9px] text-gray-600 mt-1">
                            {statusResult.update}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-bold text-gray-400 italic">
                        "{statusResult.note}"
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                  <HiOutlineStatusOnline size={64} />
                  <p className="text-[10px] font-black uppercase tracking-widest mt-4 text-center">
                    Belum ada data
                    <br />
                    yang diperiksa
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header / Nav Section */}
      <header className="absolute top-0 w-full p-6 md:p-10 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:border-[#6d28d9]/50 transition-colors">
            <span className="text-xl">🧨</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tighter italic">
              SI<span className="text-[#6d28d9]">-</span>PETASN
            </span>
            <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">
              Prov. Papua
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all">
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { avatarBox: "w-8 h-8" } }}
              />
              <span className="text-xs font-semibold text-gray-300 hidden sm:inline-block">
                Account Settings
              </span>
            </div>
          </SignedIn>
        </div>
      </header>

      {/* Background Decorative Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6d28d9] opacity-20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#6d28d9] opacity-10 blur-[100px] rounded-full pointer-events-none" />

      <main className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Kolom Kiri: Dashboard Preview */}
        <div className="relative order-2 lg:order-1 hidden md:block">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#6d28d9] to-transparent opacity-20 blur-2xl" />
          <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/20">
            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50 opacity-60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50 opacity-60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50 opacity-60" />
            </div>

            <div className="relative overflow-hidden bg-[#212126] min-h-[300px]">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-auto block pointer-events-none select-none align-bottom"
                disablePictureInPicture
              >
                <source src="/preview.mov" type="video/quicktime" />
                <source src="/preview.mov" type="video/mp4" />
              </video>
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#212126] to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Content */}
        <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6d28d9] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6d28d9]"></span>
              </span>
              <span className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                Versi {process.env.NEXT_PUBLIC_APP_VERSION}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Wujudkan Data <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#6d28d9]">
                ASN Terintegrasi.
              </span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg max-w-lg leading-relaxed font-light">
              Transformasi digital pemetaan ASN dan proyeksi data pegawai yang
              akurat untuk mewujudkan tata kelola birokrasi Pemerintah Provinsi
              Papua yang lebih cerdas dan terukur.
            </p>

            {/* --- STATS SECTION: OPTIMIZED --- */}
            <div className="flex flex-row items-center justify-start gap-4 md:gap-8 pt-4 py-4 border-y border-white/5 md:border-none">
              <div className="group flex flex-col">
                <div className="flex items-baseline gap-0.5 transition-transform group-hover:scale-105 duration-300">
                  <span className="text-xl md:text-3xl font-black text-white tracking-tighter">
                    12.402
                  </span>
                  <span className="text-[#6d28d9] font-bold text-lg">+</span>
                </div>
                <span className="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-widest font-black">
                  Pegawai
                </span>
              </div>

              <div className="h-8 w-[1px] bg-white/10" />

              <div className="group flex flex-col">
                <div className="flex items-baseline gap-0.5 transition-transform group-hover:scale-105 duration-300">
                  <span className="text-xl md:text-3xl font-black text-white tracking-tighter">
                    48
                  </span>
                  <span className="text-[#6d28d9] font-bold text-lg">+</span>
                </div>
                <span className="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-widest font-black">
                  Instansi
                </span>
              </div>

              <div className="h-8 w-[1px] bg-white/10" />

              <div className="group flex flex-col">
                <div className="flex items-baseline gap-0.5 transition-transform group-hover:scale-105 duration-300">
                  <span className="text-xl md:text-3xl font-black text-[#6d28d9] tracking-tighter">
                    0
                  </span>
                  <span className="text-white/50 font-bold text-lg">+</span>
                </div>
                <span className="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-widest font-black">
                  Anjab/Mutasi
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <SignedOut>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-block px-8 py-3.5 rounded-xl bg-white text-[#212126] text-sm font-bold tracking-wide transition-all duration-300 hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] border border-white shadow-lg"
              >
                Sign In
              </button>
            </SignedOut>
            <LoginModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />

            <SignedIn>
              <Link href="/dashboard">
                <button className="px-8 py-3.5 rounded-xl bg-white text-[#212126] text-sm font-bold tracking-wide transition-all duration-300 hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] border border-white shadow-lg inline-flex items-center gap-3 group">
                  Go to Dashboard
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </Link>
            </SignedIn>
          </div>

          {/* Authority Badges */}
          <div className="pt-6 border-t border-white/5 space-y-3">
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-bold">
              Dikelola Oleh
            </p>
            <div className="flex items-center gap-6 opacity-60">
              <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500">
                <img
                  src="/logo-provinsi.svg"
                  alt="Logo Pemprov Papua"
                  className="h-8 w-auto"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold leading-none">
                    PEMPROV
                  </span>
                  <span className="text-[8px] text-gray-500 font-medium">
                    PAPUA
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500">
                <img
                  src="/logo-komdigi.svg"
                  alt="Logo Komdigi"
                  className="h-7 w-auto"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold leading-none">
                    DISKOMINFO
                  </span>
                  <span className="text-[8px] text-gray-500 font-medium">
                    PROV. PAPUA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- BRAND SIGNATURE --- */}
      <div className="fixed bottom-4 right-4 z-[70] opacity-30 hover:opacity-100 transition-all duration-500 group">
        <a
          href="https://digoelsoft.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all"
        >
          <span className="text-[8px] font-black tracking-[0.2em] uppercase text-gray-500 group-hover:text-indigo-400 transition-colors">
            Developed by
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-black tracking-tighter text-gray-400 group-hover:text-white transition-colors">
              DIGOELSOFT
            </span>
            <span className="text-[8px] animate-pulse">❤️</span>
          </div>

          {/* Dekorasi Garis Kecil */}
          <div className="w-0 group-hover:w-4 h-[1px] bg-indigo-500 transition-all duration-500"></div>
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
