"use client"
import React, { useState, useMemo } from 'react';
import { HiOutlineTrendingUp, HiOutlineDatabase, HiOutlineUserGroup, HiOutlineCalendar, HiOutlineInformationCircle } from 'react-icons/hi';

// --- KONSTANTA ---
const USIA_PENSIUN = 58;

// --- DATA DUMMY ---
const rawData = [
  { id: "P01", nama: "Budi Santoso", jabatan: "KEPALA DINAS", tglLahir: "1967-05-12", abk: 1, statusKeluar: null },
  { id: "P02", nama: "Siti Aminah", jabatan: "KEPALA BAGIAN A", tglLahir: "1968-01-01", abk: 1, statusKeluar: null },
  { id: "P03", nama: "Andi Wijaya", jabatan: "KEPALA BAGIAN B", tglLahir: "1970-03-15", abk: 1, statusKeluar: { tahun: 2026, alasan: "PENSIUN DINI" } },
  { id: "P04", nama: "Hendra Kusuma", jabatan: "KEPALA BAGIAN C", tglLahir: "1969-11-20", abk: 1, statusKeluar: null },
  { id: "P05", nama: "Rina Permata", jabatan: "SUB BAGIAN AA", tglLahir: "1967-08-15", abk: 1, statusKeluar: null },
  { id: "P06", nama: "Bambang Sujatmiko", jabatan: "SUB BAGIAN AB", tglLahir: "1972-01-10", abk: 1, statusKeluar: { tahun: 2025, alasan: "MUTASI" } },
  { id: "P07", nama: "Lusi Rahmawati", jabatan: "SUB BAGIAN AC", tglLahir: "1967-12-30", abk: 1, statusKeluar: null },
  { id: "P08", nama: "Rian Hidayat", jabatan: "ADMINISTRASI PERKANTORAN", tglLahir: "1980-01-01", abk: 12, statusKeluar: { tahun: 2026, alasan: "WAFAT" } },
  { id: "P09", nama: "Dewi Lestari", jabatan: "ADMINISTRASI PERKANTORAN", tglLahir: "1985-05-05", abk: 12, statusKeluar: { tahun: 2026, alasan: "MUTASI" } },
  { id: "P10", nama: "Eko Prasetyo", jabatan: "ADMINISTRASI PERKANTORAN", tglLahir: "1968-06-12", abk: 12, statusKeluar: null },
  { id: "P11", nama: "Siska Putri", jabatan: "PENGELOLA DATA INFORMASI", tglLahir: "1967-04-04", abk: 10, statusKeluar: null },
  { id: "P12", nama: "Anton Nugroho", jabatan: "PENGELOLA DATA INFORMASI", tglLahir: "1990-02-20", abk: 10, statusKeluar: { tahun: 2025, alasan: "RESIGN" } },
  { id: "P13", nama: "Indah Cahyani", jabatan: "PENGELOLA DATA INFORMASI", tglLahir: "1967-09-15", abk: 10, statusKeluar: null },
  { id: "P14", nama: "Fajar Shidiq", jabatan: "ADMINISTRASI PERKANTORAN", tglLahir: "1975-10-10", abk: 12, statusKeluar: { tahun: 2027, alasan: "MUTASI" } },
  { id: "P15", nama: "Maya Sari", jabatan: "PENGELOLA DATA INFORMASI", tglLahir: "1969-03-25", abk: 10, statusKeluar: null },
];

const ProyeksiPegawaiTabel = () => {
  const [startYear, setStartYear] = useState(2025);
  const [hoverData, setHoverData] = useState(null);

  const listTahunPns = useMemo(() => Array.from({ length: 5 }, (_, i) => startYear + i), [startYear]);
  const listTahunKeb = useMemo(() => Array.from({ length: 5 }, (_, i) => (startYear + 1) + i), [startYear]);

  const cekTahunKeluar = (p) => {
    if (p.statusKeluar) return p.statusKeluar.tahun;
    return new Date(p.tglLahir).getFullYear() + USIA_PENSIUN;
  };

  const groupedData = useMemo(() => {
    const grouped = rawData.reduce((acc, curr) => {
      if (!acc[curr.jabatan]) {
        acc[curr.jabatan] = { jabatan: curr.jabatan, totalBez: 0, totalAbk: curr.abk, pegawai: [] };
      }
      acc[curr.jabatan].totalBez += 1;
      acc[curr.jabatan].pegawai.push(curr);
      return acc;
    }, {});
    
    const order = ["KEPALA DINAS", "KEPALA BAGIAN", "SUB BAGIAN", "PENGELOLA", "ADMINISTRASI"];
    return Object.values(grouped).sort((a, b) => {
      const idxA = order.findIndex(o => a.jabatan.includes(o));
      const idxB = order.findIndex(o => b.jabatan.includes(o));
      return idxA - idxB;
    });
  }, []);

  return (
    <div className='w-full min-h-screen text-slate-300 p-8 font-sans relative overflow-x-hidden'>
      
      {/* Header Area */}
      <div className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">
            Proyeksi <span className="text-indigo-500">Kebutuhan Pegawai.</span>
          </h2>
          {/* <div className="flex items-center gap-2 mt-2">
            <span className="bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded italic">T + 5</span>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Data Agregasi & Skenario Attrisi</p>
          </div> */}
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-[#161b22] border border-white/10 p-2 rounded-2xl shadow-xl">
        {/* Dropdown Tahun */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded-xl border border-white/5">
          <HiOutlineCalendar className="text-indigo-500" size={14} />
          <select 
            value={startYear} 
            onChange={(e) => setStartYear(parseInt(e.target.value))}
            className="bg-transparent text-[10px] font-black text-white outline-none cursor-pointer uppercase"
          >
            {[2023, 2024, 2025, 2026].map(y => (
              <option key={y} value={y} className="bg-[#1c2128] text-xs">Start: {y}</option>
            ))}
          </select>
        </div>

        {/* Badge PNS Keluar (T) */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20">
          <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[8px] font-black text-rose-500 uppercase italic">PNS Keluar</span>
        </div>

        {/* Badge Kebutuhan (T+1) */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <div className="w-1 h-1 rounded-full bg-amber-500" />
          <span className="text-[8px] font-black text-amber-500 uppercase italic">Kebutuhan</span>
        </div>
      </div>
      </div>

      {/* Tabel dengan Scroll & Kolom ABK */}
      <div className="rounded-[2rem] border border-white/10 bg-[#161b22]/90 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="table w-full border-collapse min-w-[1300px]">
            <thead>
              <tr className="bg-[#1c2128] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/10">
                <th className="p-6 text-center w-16 italic">No</th>
                <th className="p-6 text-left min-w-[300px] sticky left-0 bg-[#1c2128] z-20">Nama Jabatan</th>
                <th className="p-6 text-center w-20">Bez</th>
                <th className="p-6 text-center w-20 text-indigo-400">ABK</th>
                {listTahunPns.map(t => <th key={t} className="p-6 text-center bg-rose-500/5 text-rose-400">PNS {t}</th>)}
                {listTahunKeb.map(t => <th key={t} className="p-6 text-center bg-amber-500/5 text-amber-500">KEB {t}</th>)}
              </tr>
            </thead>
            <tbody>
              {groupedData.map((row, index) => (
                <tr key={index} className="hover:bg-white/[0.02] border-b border-white/5 transition-colors group">
                  <td className="p-6 text-center text-slate-600 font-mono text-xs">{index + 1}</td>
                  <td className="p-6 font-black text-[12px] uppercase text-slate-200 tracking-tighter sticky left-0 bg-[#161b22] group-hover:bg-[#1c2128] z-20 transition-colors border-r border-white/5 shadow-xl">
                    {row.jabatan}
                  </td>
                  <td className="p-6 text-center font-mono text-sm text-white">{row.totalBez}</td>
                  <td className="p-6 text-center font-mono text-sm text-indigo-400 font-bold bg-indigo-500/5">
                    {row.totalAbk}
                  </td>
                  
                  {listTahunPns.map(t => {
                    const pegKeluar = row.pegawai.filter(p => cekTahunKeluar(p) === t);
                    const count = pegKeluar.length;
                    return (
                      <td 
                        key={t} 
                        onMouseEnter={(e) => count > 0 && setHoverData({ list: pegKeluar, x: e.clientX, y: e.clientY })}
                        onMouseLeave={() => setHoverData(null)}
                        className={`p-6 text-center border-r border-white/5 font-black text-xs cursor-help transition-all duration-300 ${
                          count > 0 
                            ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.4)] hover:animate-none hover:scale-110' 
                            : 'text-slate-800'
                        }`}
                      >
                        {count > 0 ? <span className="text-sm">{count}</span> : '-'}
                      </td>
                    );
                  })}

                  {listTahunKeb.map(t => {
                    const count = row.pegawai.filter(p => cekTahunKeluar(p) === (t - 1)).length;
                    return (
                      <td key={t} className={`p-6 text-center border-r border-white/5 font-black text-xs ${
                        count > 0 ? 'bg-amber-500 text-black shadow-inner' : 'text-slate-800'
                      }`}>
                        {count > 0 ? count : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Tooltip Detail */}
      {hoverData && (
        <div 
          className="fixed z-[100] bg-[#1c2128] border border-white/10 rounded-2xl shadow-2xl p-4 min-w-[220px] pointer-events-none transform -translate-x-1/2 -translate-y-[calc(100%+15px)] transition-all duration-200"
          style={{ left: hoverData.x, top: hoverData.y }}
        >
          <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
            <HiOutlineInformationCircle className="text-rose-500" size={18} />
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Detail Pegawai Keluar</h5>
          </div>
          <div className="space-y-3">
            {hoverData.list.map((p, i) => (
              <div key={i} className="flex flex-col border-l-2 border-rose-500 pl-3 py-0.5">
                <span className="text-[11px] font-black text-slate-100 uppercase leading-none mb-1">{p.nama}</span>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded italic uppercase">
                        {p.statusKeluar ? p.statusKeluar.alasan : "PENSIUN 58 TH"}
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono">#{p.id}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1c2128] border-r border-b border-white/10 rotate-45"></div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 flex items-center gap-3 p-5 bg-white/5 rounded-2xl border border-white/10">
        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-500">
            <HiOutlineUserGroup size={20} />
        </div>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
            Data ABK menunjukkan standar formasi ideal. <br />
            Hover pada angka berkedip untuk melihat personil yang akan meninggalkan jabatan.
        </p>
      </div>
    </div>
  );
};

export default ProyeksiPegawaiTabel;