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
  LayoutGrid,
} from "lucide-react";
import AdminIndukWrapper from "@/components/admin-induk-wrapper";
import { getColorFromId } from "@/app/utils/generate-color";
import { getListInstansi } from "@/app/actions/getListInstansi";
import SkeletonProyeksiKebutuhanListInstansi from "@/components/skeleton/list-proyeksi-kebutuhan-pegawai-admin-skeleton";
import Link from "next/link";
import { generateLaporanHirarkiJabatan } from "@/app/actions/generate-excel-peta-jabatan";
import toast from "react-hot-toast";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [instansi, setInstansi] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleDownload = async (id, nama) => {
    setIsLoading(true);
    try {
      const promise = generateLaporanHirarkiJabatan(id, nama);
      const { success, filename, data } = await toast.promise(promise, {
        loading: "Download",
        success: "Sekesai",
        error: "Gagal",
      });
      if (success) {
        const link = document.createElement("a");
        link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${data}`;
        link.download = filename;
        link.click();
      } else {
        toast.error("Gagal mendownload laporan");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoaded) return <SkeletonProyeksiKebutuhanListInstansi />;

  return (
    <AdminIndukWrapper>
      <div className="w-full max-w-7xl mx-auto p-6 space-y-12">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="flex flex-col items-start space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <LayoutGrid size={14} className="text-indigo-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                  Organizational Structure
                </span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">
                E-Reporting <span className="text-indigo-500">Peta</span>{" "}
                Jabatan
              </h2>
              <p className="text-xs text-gray-500 font-medium tracking-wide">
                Unduh dokumen peta jabatan untuk melihat hirarki dan
                ketersediaan pegawai.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group w-full md:w-96">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search
                size={18}
                className="text-gray-600 group-focus-within:text-indigo-500 transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Cari dinas atau badan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all backdrop-blur-md"
            />
          </div>
        </div>

        {/* --- GRID SECTION (Diferensiasi Card) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInstansi.length > 0 ? (
            filteredInstansi.map((item) => (
              <button
                disabled={isLoading}
                key={item.id}
                onClick={() => handleDownload(item.id, item.namaOpd)}
                className="group relative bg-[#1c1c21]/30 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 transition-all duration-500 hover:border-indigo-500/40 hover:bg-white/5 overflow-hidden"
              >
                {/* Background Pattern (Subtle) */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <Database size={120} />
                </div>

                <div className="relative z-10 space-y-8">
                  {/* Top Row: Icon & Badge */}
                  <div className="flex justify-between items-center">
                    <div
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white"
                      style={{ color: getColorFromId(item.id) }}
                    >
                      <FileSpreadsheet size={28} strokeWidth={1.5} />
                    </div>
                    <span className="text-[8px] font-black px-3 py-1 bg-white/5 rounded-full text-gray-400 tracking-[0.2em] uppercase border border-white/5">
                      Ready to Export
                    </span>
                  </div>

                  {/* Middle: Title */}
                  <div className="space-y-2">
                    <h3 className="text-md uppercase font-black text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {item.namaOpd}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-indigo-500" />
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        Struktur Organisasi (V1.0)
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Action Label */}
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-indigo-500/80 uppercase tracking-widest">
                      Download Peta .XLSX
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="text-gray-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                    />
                  </div>
                </div>

                {/* Glow Effect */}
                <div
                  className="absolute -left-20 -bottom-20 w-40 h-40 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 rounded-full"
                  style={{
                    backgroundColor: getColorFromId(item.id),
                    filter: "blur(60px)",
                  }}
                />
              </button>
            ))
          ) : (
            <div className="col-span-full py-40 text-center opacity-30">
              <p className="italic font-medium">
                Data peta jabatan tidak ditemukan...
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminIndukWrapper>
  );
};

export default Page;
