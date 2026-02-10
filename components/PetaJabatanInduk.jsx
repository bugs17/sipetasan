// "use client"
// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   HeartPulse, GraduationCap, HardHat, Landmark, 
//   ShieldCheck, Map, Users, TreePine, Briefcase, Building2,
//   ChevronRight, Network
// } from 'lucide-react';

// const InstansiCard = ({ type = "peta-jabatan" }) => {
//   const router = useRouter();

//   // Konfigurasi tipe halaman agar komponen bisa dipakai berulang (reusable)
//   const config = {
//     "peta-jabatan": {
//       label: "Peta Jabatan",
//       path: "/dashboard/peta-jabatan",
//       accent: "#6d28d9", // Ungu khas app kamu
//       subtext: "Struktur Organisasi"
//     },
//     "proyeksi": {
//       label: "Proyeksi Kebutuhan",
//       path: "/dashboard/proyeksi",
//       accent: "#0ea5e9", // Biru untuk proyeksi
//       subtext: "Analisis SDM"
//     }
//   };

//   const currentConfig = config[type];

//   const instansiList = [
//     { id: 1, nama: 'Dinas Kesehatan', slug: 'dinas-kesehatan', icon: <HeartPulse />, color: '#ef4444' },
//     { id: 2, nama: 'Dinas Pendidikan', slug: 'dinas-pendidikan', icon: <GraduationCap />, color: '#3b82f6' },
//     { id: 3, nama: 'Dinas Pekerjaan Umum', slug: 'dinas-pu', icon: <HardHat />, color: '#f59e0b' },
//     { id: 4, nama: 'Sekretariat Daerah', slug: 'setda', icon: <Landmark />, color: '#6366f1' },
//     { id: 5, nama: 'Inspektorat', slug: 'inspektorat', icon: <ShieldCheck />, color: '#10b981' },
//     // ... tambahkan yang lain
//   ];

//   return (
//     <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
//       <div className="flex flex-col items-center space-y-2">
//         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
//           <Network size={12} className="text-gray-400" />
//           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Direktori Utama</span>
//         </div>
//         <h2 className="text-3xl font-extrabold text-white tracking-tight italic">
//           {currentConfig.label} <span className="text-[#6d28d9]">.</span>
//         </h2>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
//         {instansiList.map((instansi) => (
//           <button
//             key={instansi.id}
//             onClick={() => router.push(`${currentConfig.path}/${instansi.slug}`)}
//             className="group relative flex flex-col items-start p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/10 active:scale-95 overflow-hidden text-left"
//           >
//             {/* Glow effect */}
//             <div 
//               className="absolute -right-4 -top-4 w-24 h-24 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none rounded-full"
//               style={{ backgroundColor: instansi.color, filter: 'blur(30px)' }}
//             />

//             {/* Top Row: Icon & Mini Arrow */}
//             <div className="w-full flex justify-between items-start mb-6">
//               <div className="p-3 rounded-2xl bg-[#212126] border border-white/5 shadow-inner transition-transform duration-500 group-hover:scale-110">
//                 {React.cloneElement(instansi.icon, { 
//                   size: 24, 
//                   strokeWidth: 1.5,
//                   style: { color: instansi.color } 
//                 })}
//               </div>
//               <ChevronRight size={18} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
//             </div>

//             {/* Nama Instansi */}
//             <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-wider leading-tight mb-4 min-h-[32px]">
//               {instansi.nama}
//             </h3>

//             {/* Footer Label: Memberitahu aksi tombol ini */}
//             <div className="w-full pt-4 border-t border-white/5 flex flex-col gap-1">
//               <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-[#6d28d9] transition-colors">
//                 Buka Halaman
//               </span>
//               <span className="text-[10px] font-medium text-gray-400 group-hover:text-white">
//                 {currentConfig.subtext} &rarr;
//               </span>
//             </div>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default InstansiCard;


"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HeartPulse, GraduationCap, HardHat, Landmark, 
  ShieldCheck, Map, Users, TreePine, Briefcase, Building2,
  ChevronRight, Network, Search, X
} from 'lucide-react';

const InstansiCard = ({ type = "peta-jabatan" }) => {
  const router = useRouter();
  
  // 1. State untuk pencarian
  const [searchTerm, setSearchTerm] = useState("");

  const config = {
    "peta-jabatan": {
      label: "Peta Jabatan",
      path: "/dashboard/peta-jabatan",
      accent: "#6d28d9", 
      subtext: "Peta Jabatan"
    },
    // "proyeksi": {
    //   label: "Proyeksi Kebutuhan",
    //   path: "/dashboard/proyeksi",
    //   accent: "#0ea5e9", 
    //   subtext: "Analisis SDM"
    // }
  };

  const currentConfig = config[type];

  const instansiList = [
    { id: 1, nama: 'Dinas Kesehatan', slug: 'dinas-kesehatan', icon: <HeartPulse />, color: '#ef4444' },
    { id: 2, nama: 'Dinas Pendidikan', slug: 'dinas-pendidikan', icon: <GraduationCap />, color: '#3b82f6' },
    { id: 3, nama: 'Dinas Pekerjaan Umum', slug: 'dinas-pu', icon: <HardHat />, color: '#f59e0b' },
    { id: 4, nama: 'Sekretariat Daerah', slug: 'setda', icon: <Landmark />, color: '#6366f1' },
    { id: 5, nama: 'Inspektorat', slug: 'inspektorat', icon: <ShieldCheck />, color: '#10b981' },
    { id: 6, nama: 'Bappeda', slug: 'bappeda', icon: <Map />, color: '#a855f7' },
    { id: 7, nama: 'Dinas Sosial', slug: 'dinsos', icon: <Users />, color: '#f97316' },
    { id: 8, nama: 'Dinas Lingkungan Hidup', slug: 'dlh', icon: <TreePine />, color: '#22c55e' },
    { id: 9, nama: 'BKPSDM', slug: 'bkpsdm', icon: <Briefcase />, color: '#06b6d4' },
    { id: 10, nama: 'Dinas Perhubungan', slug: 'dishub', icon: <Building2 />, color: '#64748b' },
  ];

  // 2. Logika Filter
  const filteredInstansi = instansiList.filter((instansi) =>
    instansi.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col items-start space-y-2">
          {/* Badge yang sudah diganti teksnya */}
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Network size={12} className="text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Modul Struktur & Formasi
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight italic">
            {currentConfig.label} <span style={{ color: currentConfig.accent }}>.</span>
          </h2>
        </div>

        {/* Search Bar - Gaya Glassmorphism */}
        <div className="relative group w-full md:w-80">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500 group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            placeholder={`Cari instansi...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all backdrop-blur-md"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Grid Instansi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 ">
        {filteredInstansi.length > 0 ? (
          filteredInstansi.map((instansi) => (
            <button
              key={instansi.id}
              onClick={() => router.push(`${currentConfig.path}/${instansi.slug}`)}
              className="group relative flex flex-col items-start p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/10 active:scale-95 overflow-hidden text-left"
            >
              {/* Glow effect */}
              <div 
                className="absolute -right-4 -top-4 w-24 h-24 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none rounded-full"
                style={{ backgroundColor: instansi.color, filter: 'blur(30px)' }}
              />

              <div className="w-full flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-[#212126] border border-white/5 shadow-inner transition-transform duration-500 group-hover:scale-110">
                  {React.cloneElement(instansi.icon, { 
                    size: 24, 
                    strokeWidth: 1.5,
                    style: { color: instansi.color } 
                  })}
                </div>
                <ChevronRight size={18} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-wider leading-tight mb-4 min-h-[32px]">
                {instansi.nama}
              </h3>

              <div className="w-full pt-4 border-t border-white/5 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors" 
                      style={{ '--hover-color': currentConfig.accent }}>
                  Buka Halaman
                </span>
                <span className="text-[10px] font-medium text-gray-400 group-hover:text-white">
                  {currentConfig.subtext} &rarr;
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
            <p className="text-gray-500 italic">Pencarian "{searchTerm}" tidak ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstansiCard;