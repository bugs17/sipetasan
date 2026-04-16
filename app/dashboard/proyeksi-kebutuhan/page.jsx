"use client";
import { cloneElement, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowUpRight, Search, X, Building2 } from "lucide-react";
import AdminIndukWrapper from "@/components/admin-induk-wrapper";
import { getColorFromId } from "@/app/utils/generate-color";
import { getListInstansi } from "@/app/actions/getListInstansi";
import SkeletonProyeksiKebutuhanListInstansi from "@/components/skeleton/list-proyeksi-kebutuhan-pegawai-admin-skeleton";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
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
      <div className="w-full max-w-7xl mx-auto p-6 space-y-10">
        {/* Header Section dengan Search Bar di Kanan Atas */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col items-start space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <TrendingUp size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">
                Modul Perencanaan
              </span>
            </div>
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter italic">
                PROYEKSI <span className="text-[#6d28d9]">KEBUTUHAN</span>
              </h2>
            </div>
          </div>

          {/* 3. Search Bar Component */}
          <div className="relative group w-full md:w-80">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search
                size={18}
                className="text-gray-500 group-focus-within:text-blue-400 transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Cari instansi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all backdrop-blur-md"
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

        {/* Grid - Menggunakan data yang sudah difilter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredInstansi.length > 0 ? (
            filteredInstansi.map((item) => (
              <Link
                key={item.id}
                href={`/dashboard/proyeksi-kebutuhan/${item.id}`}
                // Padding dikurangi dari p-8 ke p-6 agar pas di grid yang lebih kecil
                className="group relative bg-white/5 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 text-left transition-all duration-500 hover:border-blue-500/30 hover:bg-white/10 overflow-hidden"
              >
                <div
                  className="absolute -right-10 -bottom-10 w-32 h-32 opacity-5 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none rounded-full"
                  style={{
                    backgroundColor: getColorFromId(item.id),
                    filter: "blur(40px)",
                  }}
                />

                <div className="flex justify-between items-start mb-6">
                  <div
                    className="p-3.5 rounded-2xl bg-[#212126] border border-white/5 transition-all duration-500 group-hover:scale-110"
                    style={{ color: getColorFromId(item.id) }}
                  >
                    {/* Icon dikecilkan sedikit dari 28 ke 24 */}
                    <Building2 size={24} strokeWidth={1.5} />
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-bold text-gray-500 group-hover:text-white">
                    AKTIF
                  </div>
                </div>

                <div className="space-y-1.5">
                  {/* Text size disesuaikan agar tidak wrap terlalu banyak baris */}
                  <h3 className="text-sm uppercase font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[40px]">
                    {item.namaOpd}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2">
                    Klik untuk melihat detail proyeksi kebutuhan pegawai.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Analisis
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500 transition-all duration-500">
                    <ArrowUpRight size={14} className="text-white" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 italic">
                Instansi "{searchTerm}" tidak ditemukan...
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminIndukWrapper>
  );
};

export default Page;
