"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Database,
  Download,
  Calendar,
  FileSpreadsheet,
  Printer,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { getUserRoleByClerkID } from "@/app/actions/get-user-role-by-clerk-id";
import { getProyeksiData } from "@/app/actions/get-proyeksi";
import { cekTahunKeluar } from "@/app/utils/cek-pensiun";
import SettingSkeleton from "@/components/skeleton/setting-skeleton";
import { exportToExcel } from "@/app/utils/create-proyeksi";

const ReportProyeksiMatrix = () => {
  const { isLoaded, userId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dataPegawai, setDataPegawai] = useState([]);
  const [instansiName, setInstansiName] = useState("");

  // State untuk kontrol tahun mulai
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(currentYear);

  // Opsi pilihan tahun (5 tahun ke belakang s/d 5 tahun ke depan)
  const optionsTahun = useMemo(() => {
    const range = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      range.push(i);
    }
    return range;
  }, [currentYear]);

  // List 5 tahun yang dinamis berdasarkan startYear
  const listTahun = useMemo(
    () => Array.from({ length: 5 }, (_, i) => startYear + i),
    [startYear],
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !userId) return;
      try {
        const userDb = await getUserRoleByClerkID(userId);
        setInstansiName(userDb.opd?.namaOpd || "INSTANSI PEMERINTAH");
        const { success, data } = await getProyeksiData(userDb.opdId);
        if (success) setDataPegawai(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isLoaded, userId]);

  const matrixData = useMemo(() => {
    if (!dataPegawai.length) return [];

    const grouped = dataPegawai.reduce((acc, curr) => {
      if (!acc[curr.jabatan]) {
        acc[curr.jabatan] = {
          jabatan: curr.jabatan,
          pensiunPerTahun: {},
          kebutuhanPerTahun: {},
        };
      }

      if (!curr.isEmpty) {
        const thnKeluar = cekTahunKeluar(curr);
        // Cek apakah tahun pensiun masuk dalam range listTahun yang dipilih
        if (listTahun.includes(thnKeluar)) {
          acc[curr.jabatan].pensiunPerTahun[thnKeluar] =
            (acc[curr.jabatan].pensiunPerTahun[thnKeluar] || 0) + 1;

          const thnButuh = thnKeluar + 1;
          acc[curr.jabatan].kebutuhanPerTahun[thnButuh] =
            (acc[curr.jabatan].kebutuhanPerTahun[thnButuh] || 0) + 1;
        }
      }
      return acc;
    }, {});

    return Object.values(grouped);
  }, [dataPegawai, listTahun]);

  if (isLoading) return <SettingSkeleton />;

  return (
    <div className="w-full min-h-screen text-white p-4 md:p-8 font-sans bg-transparent">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* HEADER AREA */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#0f0f12]/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md sticky top-0 z-30">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Database size={14} className="text-indigo-500" />
              <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">
                Reporting Analysis
              </span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">
              Matrix Proyeksi{" "}
              <span className="text-indigo-500 uppercase">
                {startYear}-{startYear + 4}
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* SELECTOR TAHUN MULAI */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl group hover:border-indigo-500/50 transition-all">
              <Calendar size={16} className="text-indigo-500" />
              <div className="flex flex-col">
                <label className="text-[7px] font-black text-gray-500 uppercase italic">
                  Mulai Tahun
                </label>
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(parseInt(e.target.value))}
                  className="bg-transparent text-xs font-black text-white focus:outline-none cursor-pointer uppercase"
                >
                  {optionsTahun.map((y) => (
                    <option key={y} value={y} className="bg-[#0f0f12]">
                      {y === currentYear ? `${y} (SEKARANG)` : y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tombol Export Excel */}
            <button
              onClick={() => exportToExcel(matrixData, listTahun, instansiName)}
              className="flex items-center gap-3 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all shadow-lg shadow-emerald-600/20 border border-emerald-400/20"
            >
              <FileSpreadsheet size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Download .XLSX
              </span>
            </button>
          </div>
        </div>

        {/* TABLE PREVIEW (Otomatis ter-update sesuai listTahun) */}
        <div className="bg-[#0f0f12]/60 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl shadow-2xl overflow-x-auto">
          {/* ... kode table yang sama seperti sebelumnya ... */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th
                  rowSpan={2}
                  className="p-6 text-[10px] font-black uppercase text-gray-500 border-r border-white/5 text-left"
                >
                  Nama Jabatan
                </th>
                <th
                  colSpan={5}
                  className="p-4 text-[10px] font-black uppercase text-rose-500 text-center border-r border-white/5 bg-rose-500/5"
                >
                  Proyeksi Pensiun
                </th>
                <th
                  colSpan={5}
                  className="p-4 text-[10px] font-black uppercase text-amber-500 text-center bg-amber-500/5"
                >
                  Kebutuhan Formasi
                </th>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                {listTahun.map((year) => (
                  <th
                    key={`p-${year}`}
                    className="p-4 text-[9px] font-mono text-gray-400 text-center border-r border-white/5"
                  >
                    {year}
                  </th>
                ))}
                {listTahun.map((year) => (
                  <th
                    key={`k-${year}`}
                    className="p-4 text-[9px] font-mono text-gray-400 text-center border-r last:border-0 border-white/5"
                  >
                    {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {matrixData.map((jab, idx) => (
                <tr
                  key={idx}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-5 text-[11px] font-black uppercase text-white border-r border-white/5 min-w-[250px]">
                    {jab.jabatan}
                  </td>
                  {listTahun.map((year) => (
                    <td
                      key={`p-v-${year}`}
                      className={`p-4 text-center text-xs font-mono border-r border-white/5 ${jab.pensiunPerTahun[year] > 0 ? "text-rose-500 font-bold" : "text-gray-700"}`}
                    >
                      {jab.pensiunPerTahun[year] || 0}
                    </td>
                  ))}
                  {listTahun.map((year) => (
                    <td
                      key={`k-v-${year}`}
                      className={`p-4 text-center text-xs font-mono border-r last:border-0 border-white/5 ${jab.kebutuhanPerTahun[year] > 0 ? "text-amber-500 font-bold" : "text-gray-700"}`}
                    >
                      {jab.kebutuhanPerTahun[year] || 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportProyeksiMatrix;
