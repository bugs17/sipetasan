"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  GraduationCap,
  HardHat,
  Landmark,
  ShieldCheck,
  Map,
  Users,
  TreePine,
  Briefcase,
  Building2,
  ChevronRight,
  Network,
  Search,
  X,
  SearchX,
} from "lucide-react";
import { color } from "framer-motion";
import { getColorFromId } from "@/app/utils/generate-color";
import { getListInstansi } from "@/app/actions/getListInstansi";
import SkeletonPetaJabatan from "./skeleton/list-peta-jabatan-instansi-skeleton";

const InstansiCard = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [instansiList, setInstansiList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoaded(true);
        const res = await getListInstansi();
        setInstansiList(res);
      } catch (error) {
      } finally {
        setIsLoaded(false);
      }
    };
    fetchData();
  }, []);

  const filteredInstansi = useMemo(() => {
    return instansiList
      .filter((item) =>
        item.namaOpd?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .map((item) => {
        const itemColor = getColorFromId(item.id);
        return {
          ...item,
          color: itemColor, // Tambahkan key baru
          icon: <Building2 size={24} strokeWidth={1.5} color={itemColor} />,
        };
      });
  }, [instansiList, searchTerm]);

  if (isLoaded) {
    return <SkeletonPetaJabatan />;
  }

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
            Peta Jabatan <span style={{ color: "#6d28d9" }}>.</span>
          </h2>
        </div>

        {/* Search Bar - Gaya Glassmorphism */}
        <div className="relative group w-full md:w-80">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-gray-500 group-focus-within:text-white transition-colors"
            />
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
              onClick={() =>
                router.push(`/dashboard/detail-peta-jabatan/${instansi.slug}`)
              }
              className="group relative flex flex-col items-start p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/10 active:scale-95 overflow-hidden text-left"
            >
              {/* Glow effect */}
              <div
                className="absolute -right-4 -top-4 w-24 h-24 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none rounded-full"
                style={{
                  backgroundColor: instansi.color,
                  filter: "blur(30px)",
                }}
              />

              <div className="w-full flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-[#212126] border border-white/5 shadow-inner transition-transform duration-500 group-hover:scale-110">
                  {instansi.icon}
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
              </div>

              <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-wider leading-tight mb-4 min-h-[32px]">
                {instansi.namaOpd}
              </h3>

              <div className="w-full pt-4 border-t border-white/5 flex flex-col gap-1">
                <span
                  className="text-[9px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors"
                  style={{ "--hover-color": "#6d28d9" }}
                >
                  Buka Halaman
                </span>
                <span className="text-[10px] font-medium text-gray-400 group-hover:text-white">
                  Peta Jabatan &rarr;
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full py-24 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02] backdrop-blur-sm transition-all duration-500">
            {/* Icon Container dengan Glow Effect */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-500/20 blur-[30px] rounded-full" />
              <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-[#161b22] border border-white/10 shadow-2xl">
                <SearchX
                  size={32}
                  className="text-slate-500 group-hover:text-indigo-400 transition-colors"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-2 max-w-xs">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                Data Tidak Ditemukan
              </h3>
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase tracking-widest">
                Instansi{" "}
                <span className="text-indigo-400 italic">"{searchTerm}"</span>{" "}
                tidak tersedia dalam direktori peta jabatan saat ini.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setSearchTerm("")}
              className="mt-8 px-6 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-[10px] font-black text-white uppercase tracking-widest transition-all active:scale-95"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstansiCard;
