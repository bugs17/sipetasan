"use client";
import { getInstansiById } from "@/app/actions/get-instansi-by-id";
import { getProyeksiData } from "@/app/actions/get-proyeksi";
import { cekTahunKeluar } from "@/app/utils/cek-pensiun";
import ProyeksiSkeleton from "@/components/skeleton/proyeksi-kebutuhan-skeleton";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";
import {
  HiOutlineUserAdd,
  HiOutlineOfficeBuilding,
  HiOutlineClock,
  HiOutlineCalendar,
} from "react-icons/hi";

const Page = () => {
  // State untuk kontrol tahun awal proyeksi
  const [isLoading, setIsLoading] = useState(true);
  const [dataPegawai, setDataPegawai] = useState([]);
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [startYear, setStartYear] = useState(currentYear);
  const [namaInstansi, setNamaInstansi] = useState("");
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { success, data } = await getProyeksiData(Number(id));
        if (success) {
          setDataPegawai(data);
        }
        const instansi = await getInstansiById(Number(id));
        setNamaInstansi(instansi.namaOpd || "");
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const optionsTahun = useMemo(() => {
    const range = [];
    for (let i = currentYear - 5; i <= currentYear + 4; i++) {
      range.push(i);
    }
    return range;
  }, [currentYear]);

  const listTahun = useMemo(
    () => Array.from({ length: 5 }, (_, i) => startYear + i),
    [startYear],
  );

  const processedData = useMemo(() => {
    if (!dataPegawai || dataPegawai.length === 0) return [];

    // 1. Grouping seperti biasa
    const grouped = dataPegawai.reduce((acc, curr) => {
      if (!acc[curr.jabatan]) {
        acc[curr.jabatan] = {
          jabatan: curr.jabatan,
          abk: curr.abk,
          pegawai: [],
        };
      }
      acc[curr.jabatan].pegawai.push(curr);
      return acc;
    }, {});

    return Object.values(grouped)
      .map((item) => {
        const perTahun = listTahun.map((year) => {
          const listKeluar = item.pegawai.filter((p) => {
            // LOGIKA BARU:
            // A. Cek apakah ada input manual (Mutasi, Pensiun Dini, Meninggal)
            if (p.statusKeluar && p.tahunKeluar === year) {
              return true;
            }

            // B. Jika tidak ada input manual, cek pensiun normal
            // Kita hanya hitung pensiun normal jika dia belum keluar karena sebab lain
            return !p.statusKeluar && cekTahunKeluar(p) === year;
          });

          return {
            tahun: year,
            jumlahKeluar: listKeluar.length,
            pegawaiKeluar: listKeluar.map((p) => ({
              ...p,
              // Tambahkan label alasan keluar untuk UI
              alasan: p.statusKeluar || "PENSIUN",
            })),
          };
        });

        const tahunKritis =
          perTahun.find((t) => t.jumlahKeluar > 0)?.tahun || 9999;
        return { ...item, proyeksi: perTahun, tahunKritis };
      })
      .sort((a, b) => a.tahunKritis - b.tahunKritis);
  }, [listTahun, dataPegawai]);

  if (isLoading) return <ProyeksiSkeleton />;

  if (processedData.length <= 0) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center  overflow-hidden">
        {/* Background Grid yang sama agar konsisten */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Back Button tetap ada agar user tidak terjebak */}
        <div className="absolute z-50 top-5 left-5">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md transition-all duration-300"
          >
            <ArrowLeft
              size={18}
              className="text-gray-400 group-hover:text-white"
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">
              Kembali
            </span>
          </button>
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-md px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4">
            <span className="text-rose-500 text-3xl font-black">!</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">
              Proyeksi Belum Tersedia
              <span className="text-rose-500">.</span>
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              <span className="text-white font-bold uppercase">
                {namaInstansi}
              </span>{" "}
              belum melakukan input ke dalam sistem.
            </p>
          </div>

          <div className="p-4 bg-[#1a1a1e]/40 border border-white/10 rounded-3xl">
            <p className="text-[10px] font-black text-[#6d28d9] uppercase tracking-widest mb-1">
              Tindakan Diperlukan
            </p>
            <p className="text-[11px] text-gray-400">
              Silahkan hubungi{" "}
              <span className="text-white italic">Admin Instansi</span> terkait
              untuk melakukan konfigurasi.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen text-slate-300 font-sans">
      {/* HEADER AREA - UPDATED */}
      <div className="sticky top-0 z-50 w-full bg-[#0d1117]/80 backdrop-blur-md border-b border-white/5 mb-12">
        <div className="px-10 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Tombol Back & Judul */}
              <div className="flex items-start gap-4">
                <button
                  onClick={() => router.back()}
                  className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300 active:scale-90"
                  title="Kembali"
                >
                  <ArrowLeft size={16} />
                </button>

                <div>
                  <h2 className="text-xl font-black italic text-white uppercase tracking-tighter leading-none">
                    Proyeksi Kebutuhan{" "}
                    <span className="text-indigo-500">Pegawai.</span>
                  </h2>

                  {/* Nama Instansi - Premium Label Style */}
                  <div className="mt-2 inline-flex items-center gap-2 py-1.5">
                    <div className="w-0.5 h-3 bg-indigo-500 rounded-full" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em]">
                      {namaInstansi || "Pilih Instansi"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selector Tahun Mulai */}
              <div className="flex items-center gap-3 bg-white/10 border border-white/10 px-3 py-2 rounded-2xl group hover:border-indigo-500/50 transition-colors">
                <HiOutlineCalendar className="text-indigo-500" size={18} />
                <div className="flex flex-col">
                  <label className="text-[7px] font-black text-slate-500 uppercase italic">
                    Mulai Tahun
                  </label>
                  <select
                    value={startYear}
                    onChange={(e) => setStartYear(parseInt(e.target.value))}
                    className="bg-transparent text-xs font-black text-white focus:outline-none cursor-pointer uppercase"
                  >
                    {optionsTahun.map((y) => (
                      <option key={y} value={y} className="bg-[#0d1117]">
                        {y === currentYear ? `${y} (SEKARANG)` : y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Badge Informasi Ringkas Seluruh Jabatan (Tetap Sama) */}
            <div className="flex flex-wrap gap-2">
              {listTahun.map((year) => {
                const totalKeluarTahunIni = dataPegawai.filter((p) => {
                  if (p.statusKeluar && p.tahunKeluar === year) return true;
                  return !p.statusKeluar && cekTahunKeluar(p) === year;
                }).length;

                return (
                  <div key={year} className="flex flex-col items-center">
                    <div
                      className={`px-3 py-1.5 rounded-xl border transition-all duration-300 ${
                        totalKeluarTahunIni > 0
                          ? "bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <p className="text-[8px] font-black text-slate-500 uppercase leading-none mb-1">
                        {year}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${totalKeluarTahunIni > 0 ? "bg-rose-500 animate-pulse" : "bg-slate-700"}`}
                        />
                        <span
                          className={`text-xs font-black ${totalKeluarTahunIni > 0 ? "text-white" : "text-slate-600"}`}
                        >
                          {totalKeluarTahunIni}{" "}
                          <span className="text-[9px] font-normal opacity-60">
                            Org
                          </span>
                        </span>
                      </div>
                    </div>
                    {totalKeluarTahunIni > 0 && (
                      <div className="mt-1 px-2 py-0.5 bg-amber-500 rounded-full shadow-lg shadow-amber-500/20">
                        <p className="text-[7px] font-black text-black italic">
                          KEB {year + 1}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="space-y-12 px-8 pb-8">
        {processedData.map((jab, idx) => (
          <div key={idx} className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                <HiOutlineOfficeBuilding size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">
                  {jab.jabatan}
                </h3>
                <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
                  Standar Formasi (ABK): {jab.abk} Pegawai
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {jab.proyeksi.map((p, pIdx) => {
                const isKritis = p.jumlahKeluar > 0;

                return (
                  <div
                    key={pIdx}
                    className={`relative p-6 rounded-[2rem] border transition-all duration-300 ${
                      isKritis
                        ? "bg-[#1e1617] border-rose-500/30 shadow-lg shadow-black/40"
                        : "bg-[#161b22] border-white/5 opacity-50 hover:opacity-80"
                    }`}
                  >
                    {/* Highlight tipis di atas saja (Simple Border Top) */}
                    {/* <div className={`absolute top-0 left-0 right-0 h-[1px] rounded-t-[2rem] ${isKritis ? 'bg-rose-500/20' : 'bg-white/5'}`} /> */}

                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-5">
                        <span
                          className={`text-xs font-black font-mono tracking-widest ${isKritis ? "text-rose-400" : "text-slate-500"}`}
                        >
                          {p.tahun}
                        </span>
                        {isKritis && (
                          <div className="px-3 py-1 rounded-full bg-rose-950/50 border border-rose-500/20 text-rose-400 text-[8px] font-black uppercase tracking-tighter animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                            Attention
                          </div>
                        )}
                      </div>

                      {isKritis ? (
                        <div className="space-y-5">
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">
                              {p.jumlahKeluar}
                            </span>
                            <span className="text-[10px] font-bold text-rose-400 uppercase italic">
                              Pegawai Keluar
                            </span>
                          </div>

                          {/* Badge Kebutuhan Amber - Solid & Fast Rendering */}
                          <div className="bg-amber-500 text-black p-4 rounded-2xl shadow-md transform hover:translate-y-[-2px] transition-transform duration-200 border-b-4 border-amber-700">
                            <div className="flex items-center gap-3">
                              <HiOutlineUserAdd
                                size={18}
                                className="opacity-80"
                              />
                              <div className="leading-none">
                                <p className="text-[8px] font-black uppercase opacity-70 mb-0.5">
                                  Kebutuhan Formasi
                                </p>
                                <p className="text-sm font-black italic uppercase">
                                  Tahun {p.tahun + 1}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* List Orang - Clean & Simple */}
                          <div className="pt-3 space-y-2 border-t border-white/10">
                            {p.pegawaiKeluar.map((orang, oIdx) => {
                              // Gunakan .toLowerCase() saat pengecekan agar lebih aman terhadap perbedaan input di DB
                              const alasanLabel = (
                                orang.alasan || "pensiun"
                              ).toLowerCase();

                              const isPensiun =
                                alasanLabel === "pensiun" ||
                                alasanLabel === "meninggal";

                              return (
                                <div
                                  key={oIdx}
                                  className="bg-black/30 p-2.5 rounded-xl border border-white/5 group hover:border-rose-500/30 transition-colors"
                                >
                                  <p className="text-[10px] font-bold text-slate-100 uppercase truncate">
                                    {orang.nama}
                                  </p>
                                  <p className="text-[9px] font-mono text-slate-500 tracking-tighter">
                                    NIP. {orang.nip}
                                  </p>

                                  {/* LABEL ALASAN DINAMIS */}
                                  <p
                                    className={`text-[8px] font-black uppercase italic mt-1.5 flex items-center gap-1.5 ${
                                      isPensiun
                                        ? "text-rose-400"
                                        : "text-amber-500"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full shadow-sm ${
                                        isPensiun
                                          ? "bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.8)] animate-pulse"
                                          : "bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]"
                                      }`}
                                    />
                                    {/* Render tetap uppercase agar estetik di UI */}
                                    {alasanLabel}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        /* --- BAGIAN FORMASI TERPENUHI DENGAN ANIMASI --- */
                        <div className="h-40 flex flex-col items-center justify-center group cursor-default">
                          <div className="w-14 h-14 rounded-full border border-dashed border-slate-800 flex items-center justify-center mb-4 transition-all duration-500 group-hover:border-slate-600 group-hover:scale-110">
                            <div className="relative flex items-center justify-center">
                              {/* Icon Jam Berputar */}
                              <HiOutlineClock
                                size={28}
                                className="text-slate-700 transition-transform duration-1000 ease-in-out group-hover:rotate-[360deg] group-hover:text-slate-400"
                              />
                              {/* Central Dot Glow */}
                              <div className="absolute w-1.5 h-1.5 bg-slate-600 rounded-full transition-all duration-500 group-hover:bg-indigo-500 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                            </div>
                          </div>

                          <div className="text-center transition-opacity duration-500">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-500 block">
                              Formasi
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-700 block group-hover:text-slate-500">
                              Terpenuhi
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
