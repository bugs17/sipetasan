"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  Download,
  ChevronLeft,
  FileSpreadsheet,
  ArrowUpRight,
  Database,
} from "lucide-react";
import AdminIndukWrapper from "@/components/admin-induk-wrapper";
import { getColorFromId } from "@/app/utils/generate-color";
import { getListInstansi } from "@/app/actions/getListInstansi";
import SkeletonProyeksiKebutuhanListInstansi from "@/components/skeleton/list-proyeksi-kebutuhan-pegawai-admin-skeleton";
import Link from "next/link";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [instansi, setInstansi] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoaded(true);
        const res = await getListInstansi();
        setInstansi(res);
      } catch (error) {
      } finally {
        setIsLoaded(false);
      }
    };
    fetchData();
  }, []);

  // 2. Logika Filtering
  const filteredInstansi = useMemo(() => {
    return instansi.filter((item) =>
      item.namaOpd.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, instansi]); // Re-run hanya jika search atau data berubah

  if (isLoaded) return <SkeletonProyeksiKebutuhanListInstansi />;

  return (
    <AdminIndukWrapper>
      <div className="w-full max-w-7xl mx-auto p-6 space-y-12">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="flex flex-col items-start space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Database size={14} className="text-indigo-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                  Reporting Analysis
                </span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">
                Laporan <span className="text-indigo-500">Proyeksi</span>{" "}
                Kebutuhan
              </h2>
              <p className="text-xs text-gray-500 font-medium tracking-wide">
                Pilih instansi untuk mengunduh rekapitulasi data proyeksi 5
                tahun kedepan.
              </p>
            </div>
          </div>

          {/* Search Bar (Kembali ke Style Terang/Glass) */}
          <div className="relative group w-full md:w-96">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search
                size={18}
                className="text-gray-600 group-focus-within:text-indigo-500 transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Cari nama instansi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all backdrop-blur-md"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-4 flex items-center text-gray-600 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* --- GRID SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInstansi.length > 0 ? (
            filteredInstansi.map((item) => (
              <Link
                key={item.id}
                href={`/dashboard/reports/proyeksi-kebutuhan-induk/${item.id}?namaOpd=${item.namaOpd}`}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-7 text-left transition-all duration-500 hover:border-indigo-500/30 hover:bg-white/10 hover:-translate-y-2 overflow-hidden flex flex-col justify-between min-h-[220px]"
              >
                {/* Efek Glow Dinamis - Kembali ke Indigo */}
                <div
                  className="absolute -right-4 -top-4 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none rounded-full"
                  style={{
                    backgroundColor: getColorFromId(item.id),
                    filter: "blur(50px)",
                  }}
                />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div
                      className="p-4 rounded-[1.2rem] bg-[#212126] border border-white/5 transition-all duration-500 group-hover:scale-110 shadow-xl"
                      style={{ color: getColorFromId(item.id) }}
                    >
                      <Download size={24} strokeWidth={1.5} />
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                      <ArrowUpRight size={20} className="text-indigo-500" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm uppercase font-black text-white tracking-tight leading-snug group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {item.namaOpd}
                    </h3>
                    <div className="h-px w-8 bg-white/10 group-hover:w-16 group-hover:bg-indigo-500/50 transition-all duration-500" />
                  </div>
                </div>

                <div className="relative z-10 mt-6">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                    Format Dokumen:{" "}
                    <span className="text-emerald-500">.XLSX</span>
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-4">
              <Search size={48} className="text-gray-800" />
              <p className="text-gray-500 font-medium italic tracking-wide">
                Instansi "<span className="text-white">{searchTerm}</span>"
                tidak ditemukan...
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminIndukWrapper>
  );
};

export default Page;
