"use client";
import { getInstansiBySlug } from "@/app/actions/get-instansi-by-slug";
import AdminIndukWrapper from "@/components/admin-induk-wrapper";
import SkeletonProyeksi from "@/components/skeleton/proyeksi-kebutuhan-pegawai-skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";
import {
  HiOutlineUserAdd,
  HiOutlineOfficeBuilding,
  HiOutlineClock,
  HiOutlineCalendar,
} from "react-icons/hi";

// --- DATA DUMMY SESUAI PERMINTAAN ---
const rawData = [
  {
    id: "P01",
    nama: "Budi Santoso",
    jabatan: "KEPALA DINAS",
    tglLahir: "1967-05-12",
    abk: 1,
  },
  {
    id: "P02",
    nama: "Siti Aminah",
    jabatan: "KEPALA BAGIAN A",
    tglLahir: "1968-01-01",
    abk: 1,
  },
  {
    id: "P03",
    nama: "Andi Wijaya",
    jabatan: "KEPALA BAGIAN B",
    tglLahir: "1970-03-15",
    abk: 1,
  },
  {
    id: "P04",
    nama: "Hendra Kusuma",
    jabatan: "KEPALA BAGIAN C",
    tglLahir: "1969-11-20",
    abk: 1,
  },
  {
    id: "P05",
    nama: "Rina Permata",
    jabatan: "SUB BAGIAN AA",
    tglLahir: "1967-08-15",
    abk: 1,
  },
  {
    id: "P07",
    nama: "Lusi Rahmawati",
    jabatan: "SUB BAGIAN AC",
    tglLahir: "1967-12-30",
    abk: 1,
  },
  {
    id: "P10",
    nama: "Eko Prasetyo",
    jabatan: "ADMINISTRASI PERKANTORAN",
    tglLahir: "1968-06-12",
    abk: 12,
  },
  {
    id: "P11",
    nama: "Siska Putri",
    jabatan: "PENGELOLA DATA INFORMASI",
    tglLahir: "1967-04-04",
    abk: 10,
  },
  {
    id: "P13",
    nama: "Indah Cahyani",
    jabatan: "PENGELOLA DATA INFORMASI",
    tglLahir: "1967-09-15",
    abk: 10,
  },
  {
    id: "P15",
    nama: "Maya Sari",
    jabatan: "PENGELOLA DATA INFORMASI",
    tglLahir: "1969-03-25",
    abk: 10,
  },
];

const USIA_PENSIUN = process.env.NEXT_PUBLIC_USIA_PENSIUN;

const Page = () => {
  const { slug } = useParams();
  const [startYear, setStartYear] = useState(2025);
  const [instansi, setInstansi] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getInstansiBySlug(slug);
      setInstansi(res);
    };
    fetchData();
    setIsLoaded(false);
  }, []);

  const listTahun = useMemo(
    () => Array.from({ length: 5 }, (_, i) => startYear + i),
    [startYear],
  );

  const cekTahunKeluar = (p) => {
    return new Date(p.tglLahir).getFullYear() + Number(USIA_PENSIUN);
  };

  const processedData = useMemo(() => {
    const grouped = rawData.reduce((acc, curr) => {
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
          const listKeluar = item.pegawai.filter(
            (p) => cekTahunKeluar(p) === year,
          );
          return {
            tahun: year,
            jumlahKeluar: listKeluar.length,
            pegawaiKeluar: listKeluar,
          };
        });

        const tahunKritis =
          perTahun.find((t) => t.jumlahKeluar > 0)?.tahun || 9999;
        return { ...item, proyeksi: perTahun, tahunKritis };
      })
      .sort((a, b) => a.tahunKritis - b.tahunKritis);
  }, [listTahun]); // Re-calculate saat listTahun berubah

  if (isLoaded) {
    return <SkeletonProyeksi />;
  }

  return (
    <AdminIndukWrapper>
      <div className="w-full min-h-screen text-slate-300 p-8 font-sans">
        {/* HEADER AREA */}
        <div className="sticky top-0 z-50 -mx-4 px-4 py-6 bg-[#0d1117]/80 backdrop-blur-md  rounded-xl border-b border-white/5 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-start gap-4">
                {/* Tombol Back */}
                <Link
                  href="/dashboard/proyeksi-kebutuhan"
                  className="mt-0.5 group flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
                >
                  <ArrowLeft
                    className="text-slate-500 group-hover:text-indigo-500 transition-colors"
                    size={18}
                  />
                </Link>

                <div>
                  <h2 className="text-xl font-black italic text-white uppercase tracking-tighter leading-none">
                    Proyeksi Kebutuhan{" "}
                    <span className="text-indigo-500">Kekosongan.</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-indigo-500 inline-block"></span>
                    {!isLoaded ? instansi?.namaOpd : "-"}
                  </p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    Analisis otomatis pensiun
                  </p>
                </div>
              </div>

              {/* Selector Tahun Mulai */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-2 rounded-2xl group hover:border-indigo-500/50 transition-colors">
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
                    {[2023, 2024, 2025, 2026, 2027].map((y) => (
                      <option key={y} value={y} className="bg-[#0d1117]">
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Badge Informasi Ringkas Seluruh Jabatan */}
            <div className="flex flex-wrap gap-2">
              {listTahun.map((year) => {
                const totalKeluarTahunIni = rawData.filter(
                  (p) => cekTahunKeluar(p) === year,
                ).length;
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

        {/* CONTENT AREA */}
        <div className="space-y-12">
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
                              {p.pegawaiKeluar.map((orang, oIdx) => (
                                <div
                                  key={oIdx}
                                  className="bg-black/30 p-2.5 rounded-xl border border-white/5 group hover:border-rose-500/30 transition-colors"
                                >
                                  <p className="text-[10px] font-bold text-slate-100 uppercase truncate">
                                    {orang.nama}
                                  </p>
                                  <p className="text-[8px] font-medium text-rose-400 uppercase italic mt-1 flex items-center gap-1 animate-pulse">
                                    <span className="w-1 h-1 bg-rose-500 rounded-full shadow-[0_0_5px_rgba(244,63,94,0.8)]" />
                                    {orang.statusKeluar
                                      ? orang.statusKeluar.alasan
                                      : "PENSIUN 58 TH"}
                                  </p>
                                </div>
                              ))}
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
    </AdminIndukWrapper>
  );
};

export default Page;
