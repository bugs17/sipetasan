
// const Landing = async () => {


    
//   return (
//       <div className="min-h-screen bg-[#212126] text-white selection:bg-[#6d28d9]/30 flex items-center justify-center p-6 overflow-hidden">
//       {/* Background Decorative Blurs */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6d28d9] opacity-20 blur-[120px] rounded-full" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#6d28d9] opacity-10 blur-[100px] rounded-full" />

//       <main className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
//         {/* Kolom Kiri: Dashboard Preview (Glassy Effect) */}
//         <div className="relative order-2 lg:order-1">
//           {/* Glow effect behind the card */}
//           <div className="absolute -inset-1 bg-gradient-to-r from-[#6d28d9] to-transparent opacity-20 blur-2xl" />
          
//           <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/20">
//             {/* Header bar dashboard sederhana */}
//             <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
//               <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
//               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
//               <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
//             </div>

//             {/* Area Konten Dashboard */}
//             <div className="aspect-[16/10] p-6 bg-[#212126]/40 flex items-center justify-center">
//               {/* Tempat Gambar/Video Dashboard Anda */}
//               <div className="w-full h-full rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 bg-[#212126]">
//                 <div className="p-4 rounded-full bg-[#6d28d9]/10">
//                   <svg className="w-8 h-8 text-[#6d28d9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <span className="text-sm text-gray-500 font-medium">Dashboard Preview Placeholder</span>
//               </div>
//             </div>

//             {/* Glassy Overlay Elements */}
//             <div className="absolute bottom-4 right-4 p-4 glassify rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-lg bg-[#6d28d9] flex items-center justify-center font-bold text-xs">92%</div>
//                 <div className="text-[10px] uppercase tracking-wider text-gray-300 font-semibold">Growth Rate</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Kolom Kanan: Tagline & Deskripsi */}
//         <div className="space-y-8 order-1 lg:order-2">
//           <div className="space-y-6">
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6d28d9]/10 border border-[#6d28d9]/20">
//               <span className="relative flex h-2 w-2">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6d28d9] opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6d28d9]"></span>
//               </span>
//               <span className="text-[12px] font-bold text-[#6d28d9] uppercase tracking-[0.2em]">Versi 2.0 Kini Tersedia</span>
//             </div>
            
//             <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
//               Elevate your <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#6d28d9]">
//                 Workflow Experience.
//               </span>
//             </h1>

//             <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed font-light">
//               Solusi cerdas untuk manajemen data yang kompleks. Rasakan pengalaman antarmuka yang intuitif, cepat, dan modern dengan dukungan analitik real-time.
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 pt-4">
//             <button className="px-8 py-4 rounded-2xl bg-[#6d28d9] text-white font-bold transition-all hover:scale-105 hover:shadow-[0_0_30px_-5px_#6d28d9] active:scale-95">
//               Coba Gratis Sekarang
//             </button>
//             <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95">
//               Pelajari Fitur
//             </button>
//           </div>

//           {/* Trust Badge / Stat singkat */}
//           <div className="pt-8 border-t border-white/5 flex gap-8">
//             <div>
//               <div className="text-2xl font-bold">10k+</div>
//               <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Users</div>
//             </div>
//             <div>
//               <div className="text-2xl font-bold">4.9/5</div>
//               <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Rating</div>
//             </div>
//           </div>
//         </div>

//       </main>
//     </div>

    
   
//   )
// }

// export default Landing

import React from 'react';
// Pastikan anda sudah menginstall @clerk/nextjs atau @clerk/clerk-react
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs"; 
import Link from 'next/link';

const LandingPage = () => {
  return (
    
    <div className="min-h-screen bg-[#212126] text-white selection:bg-[#6d28d9]/30 flex items-center justify-center p-6 overflow-hidden relative">
      
      {/* Header / Nav Section */}
      <header className="absolute top-0 w-full p-6 md:p-10 flex justify-between items-center z-20">
        
        {/* Sisi Kiri: Nama Aplikasi (Logo Sementara) */}
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

        {/* Sisi Kanan: User Profile / Login Status */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all">
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
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

      <main className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Kolom Kiri: Dashboard Preview */}
        <div className="relative order-2 lg:order-1">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#6d28d9] to-transparent opacity-20 blur-2xl" />
          
          <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/20">
            {/* Header bar dashboard */}
            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50 opacity-60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50 opacity-60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50 opacity-60" />
            </div>

            {/* Area Video Preview */}
            <div className="relative overflow-hidden bg-[#212126] min-h-[300px]"> 
              {/* 1. Menghilangkan /40 pada bg agar warna solid #212126 (sama dengan dashboard Anda).
                  2. Menambahkan flex agar video benar-benar memenuhi kontainer.
              */}
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-auto block pointer-events-none select-none align-bottom" 
                /* align-bottom atau block biasanya menghilangkan gap sisa di bawah */
                disablePictureInPicture
              >
                <source src="/preview.mov" type="video/quicktime" />
                <source src="/preview.mov" type="video/mp4" /> 
              </video>
              
              {/* Overlay halus - sedikit dipertebal di bagian bawah untuk menyatukan video dengan frame */}
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#212126] to-transparent pointer-events-none" />
            </div>

            
          </div>
        </div>

        {/* Kolom Kanan: Tagline & White Button Logic */}
        <div className="space-y-8 order-1 lg:order-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6d28d9] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6d28d9]"></span>
              </span>
              <span className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em]">Versi 2.0</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Wujudkan Data <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#6d28d9]">
                ASN Terintegrasi.
              </span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed font-light">
              Transformasi digital pemetaan ASN dan proyeksi data pegawai yang akurat untuk mewujudkan tata kelola birokrasi Pemerintah Provinsi Papua yang lebih cerdas dan terukur.
            </p>
          </div>

          <div className="pt-4">
            {/* Logic Clerk Button - Modern White Style */}
            <SignedOut>
              <Link href={'/dashboard'} className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white text-[#212126] text-sm font-bold tracking-wide transition-all duration-300 hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.97] border border-white shadow-lg">
                Sign In
              </Link>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <button className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white text-[#212126] text-sm font-bold tracking-wide transition-all duration-300 hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.97] border border-white shadow-lg inline-flex items-center justify-center gap-3 group">
                  Go to Dashboard
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
            </SignedIn>
          </div>

          {/* Authority Badges - Pengganti Trust Badge */}
          <div className="pt-8 border-t border-white/5 space-y-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">
              Dikelola Oleh
            </p>
            
            <div className="flex flex-wrap items-center gap-8 opacity-70">
              {/* Logo Provinsi Papua */}
              <div className="group flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="relative">
                  <div className="absolute -inset-2 bg-white/5 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img 
                    src="/logo-provinsi.svg" 
                    alt="Logo Pemprov Papua" 
                    className="h-10 w-auto relative z-10" 
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none tracking-tight">PEMPROV</span>
                  <span className="text-[10px] text-gray-500 font-medium">PAPUA</span>
                </div>
              </div>

              {/* Logo Kominfo */}
              <div className="group flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="relative">
                  <div className="absolute -inset-2 bg-white/5 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img 
                    src="/logo-komdigi.svg" 
                    alt="Logo Komdigi" 
                    className="h-9 w-auto relative z-10" 
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none tracking-tight">DISKOMINFO</span>
                  <span className="text-[10px] text-gray-500 font-medium">PROV. PAPUA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default LandingPage;