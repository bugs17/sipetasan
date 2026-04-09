"use client";
import React, { useState, useEffect } from "react";
import {
  FileText,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowRightLeft,
  Plus,
  Search,
  X,
  ChevronDown,
  Shuffle,
} from "lucide-react";
import toast from "react-hot-toast"; // Pastikan import toast ada
import FormMutasiOpdSkeleton from "./skeleton/form-mutasi-opd-skeleton";
import ListMutasiOpdSkeleton from "./skeleton/list-mutasi-opd-skeleton";

const MutasiOPD = () => {
  const [activeTab, setActiveTab] = useState("pengajuan");
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Efek simulasi loading awal
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // State Form
  const [formData, setFormData] = useState({
    id_pegawai: "",
    tujuan: "",
    alasan: "",
  });

  const daftarInstansi = [
    "Dinas Kesehatan",
    "Dinas Pendidikan dan Kebudayaan",
    "Dinas Komunikasi dan Informatika",
    "Badan Kepegawaian Daerah",
    "Sekretariat Daerah",
    "Inspektorat Daerah",
  ];

  const daftarPegawai = ["Usher", "Abner aronggear", "Anjulens Aninam"];

  const historyMutasi = [
    {
      id: "TRX001",
      nama: "Bambang Heru",
      nip: "19880211001",
      jenis: "Antar OPD",
      status: "Revisi",
      tgl: "12 Feb 2026",
      catatan: "Dokumen SK pangkat terakhir kurang jelas (blur).",
      waktuUpdate: "14 Feb 2026 09:00",
    },
    {
      id: "TRX002",
      nama: "Siska Amelia",
      nip: "19920514002",
      jenis: "Internal OPD",
      status: "Proses",
      tgl: "10 Feb 2026",
      catatan: null,
      waktuUpdate: "11 Feb 2026 15:30",
    },
    {
      id: "TRX003",
      nama: "Andi Wijaya",
      nip: "19850320003",
      jenis: "Antar OPD",
      status: "Approved",
      tgl: "05 Feb 2026",
      catatan: "Mutasi disetujui, SK sedang dicetak.",
      waktuUpdate: "06 Feb 2026 10:00",
    },
    {
      id: "TRX004",
      nama: "Rina Puspita",
      nip: "19900101004",
      jenis: "Antar OPD",
      status: "Proses",
      tgl: "01 Feb 2026",
      catatan: null,
      waktuUpdate: "02 Feb 2026 08:45",
    },
    {
      id: "TRX005",
      nama: "Dedi Kurniawan",
      nip: "19870612005",
      jenis: "Internal OPD",
      status: "Ditolak",
      tgl: "28 Jan 2026",
      catatan: "Formasi pada unit kerja tujuan sudah penuh.",
      waktuUpdate: "30 Jan 2026 13:20",
    },
  ];

  const filteredHistory = historyMutasi.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchHistory.toLowerCase()) ||
      item.nip.includes(searchHistory),
  );

  const handleHistoryClick = (item) => {
    if (item.status === "Revisi") {
      setFormData({
        id_pegawai: item.nama,
        tujuan: "Dinas Kesehatan",
        alasan: "Perbaikan dokumen sesuai instruksi revisi.",
      });
      setActiveTab("pengajuan");
    } else {
      setSelectedHistory(item);
      setIsModalOpen(true);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length !== files.length) {
      toast.error("Hanya file PDF yang diizinkan", {
        style: { background: "#1a1a1e", color: "#fff", fontSize: "10px" },
      });
    }

    setSelectedFiles((prev) => [...prev, ...pdfFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden animate-in fade-in duration-700 relative">
      {/* --- MODAL DETAIL STATUS --- */}
      {isModalOpen && selectedHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-[#1a1a1e] border border-white/10 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="text-center space-y-4">
              <div
                className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center border ${
                  selectedHistory.status === "Approved"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : selectedHistory.status === "Ditolak"
                      ? "bg-red-500/10 border-red-500/20 text-red-500"
                      : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                }`}
              >
                {selectedHistory.status === "Approved" ? (
                  <CheckCircle2 size={32} />
                ) : selectedHistory.status === "Ditolak" ? (
                  <AlertCircle size={32} />
                ) : (
                  <Clock size={32} />
                )}
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                  {selectedHistory.status}
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">
                  ID Pengajuan: {selectedHistory.id}
                </p>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-left space-y-3">
                <div>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                    Nama Pegawai
                  </p>
                  <p className="text-xs text-white font-bold">
                    {selectedHistory.nama}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                    Update Terakhir
                  </p>
                  <p className="text-xs text-white/80">
                    {selectedHistory.waktuUpdate}
                  </p>
                </div>
                {selectedHistory.catatan && (
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1">
                      Catatan Admin Induk
                    </p>
                    <p className="text-xs text-gray-300 italic leading-relaxed">
                      "{selectedHistory.catatan}"
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-row items-center justify-between px-8 py-6 shrink-0 ">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
            Mutasi Pegawai
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Manajemen Pengajuan Perpindahan Tugas Aparatur
          </p>
        </div>

        <div className="flex items-center gap-4">
          {activeTab === "status" && (
            <div className="relative animate-in slide-in-from-right-4">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              />
              <input
                type="text"
                placeholder="Cari Nama / NIP..."
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] text-white focus:outline-none focus:border-[#6d28d9]/50 w-64 transition-all"
              />
            </div>
          )}
          <div className="flex gap-1 p-1 bg-black/20 border border-white/10 rounded-xl backdrop-blur-xl">
            <button
              onClick={() => {
                setActiveTab("pengajuan");
                setIsLoading(true);
              }}
              className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${activeTab === "pengajuan" ? "bg-[#6d28d9] text-white shadow-lg" : "text-gray-500 hover:bg-white/5"}`}
            >
              <Plus size={12} /> Pengajuan
            </button>
            <button
              onClick={() => {
                setActiveTab("status");
                setIsLoading(true);
              }}
              className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${activeTab === "status" ? "bg-[#6d28d9] text-white shadow-lg" : "text-gray-500 hover:bg-white/5"}`}
            >
              <Clock size={12} /> Riwayat
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div
        className={`flex-1 overflow-hidden relative px-8 ${activeTab === "pengajuan" && "pb-4"}`}
      >
        {isLoading ? (
          activeTab === "pengajuan" ? (
            <FormMutasiOpdSkeleton />
          ) : (
            <ListMutasiOpdSkeleton />
          )
        ) : activeTab === "pengajuan" ? (
          <div className="h-full w-full grid grid-cols-12 gap-6 overflow-hidden">
            {/* KOLOM KIRI (FORM) */}
            <div className="col-span-8 h-full min-h-0">
              <div className="bg-[#1a1a1e]/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl h-full flex flex-col overflow-hidden">
                <div className="flex items-center gap-4 mb-8 shrink-0">
                  <div className="p-3 bg-[#6d28d9]/10 rounded-2xl border border-[#6d28d9]/20 text-[#6d28d9]">
                    <Shuffle size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                      Formulir Permohonan
                    </h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      Data ini akan diverifikasi oleh Admin Induk
                    </p>
                  </div>
                </div>

                {/* Scrollable area untuk form jika layar kecil */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                  <div className="grid grid-cols-2 gap-6 content-start">
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                        Pegawai Yang Akan Mutasi
                      </label>
                      <div className="relative">
                        <select
                          value={formData.id_pegawai}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              id_pegawai: e.target.value,
                            })
                          }
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none appearance-none cursor-pointer"
                        >
                          <option
                            value=""
                            className="bg-[#1a1a1e] text-gray-600"
                          >
                            -- Pilih Pegawai --
                          </option>
                          {daftarPegawai.map((pegawai, i) => (
                            <option
                              key={i}
                              value={pegawai}
                              className="bg-[#1a1a1e]"
                            >
                              {pegawai}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                        Instansi Tujuan
                      </label>
                      <div className="relative">
                        <select
                          value={formData.tujuan}
                          onChange={(e) =>
                            setFormData({ ...formData, tujuan: e.target.value })
                          }
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#1a1a1e]">
                            -- Pilih Instansi Tujuan --
                          </option>
                          {daftarInstansi.map((instansi, i) => (
                            <option
                              key={i}
                              value={instansi}
                              className="bg-[#1a1a1e]"
                            >
                              {instansi}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                        Alasan Perpindahan
                      </label>
                      <textarea
                        rows="4"
                        value={formData.alasan}
                        onChange={(e) =>
                          setFormData({ ...formData, alasan: e.target.value })
                        }
                        placeholder="Jelaskan alasan mutasi..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN (UPLOAD) */}
            <div className="col-span-4 h-full min-h-0">
              <div className="bg-[#1a1a1e]/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl h-full flex flex-col overflow-hidden">
                <div className="shrink-0 mb-6">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-3">
                    Persyaratan Dokumen
                  </h4>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 flex gap-3 items-start">
                    <AlertCircle
                      size={16}
                      className="text-blue-400 shrink-0 mt-0.5"
                    />
                    <p className="text-[10px] text-blue-200/70 leading-relaxed font-medium">
                      <span className="text-blue-400 font-black uppercase">
                        Penting:
                      </span>{" "}
                      Gunakan format <span className="text-white">.pdf</span>.
                    </p>
                  </div>
                </div>

                {/* Bagian ini akan dipaksa scroll jika file banyak karena flex-1 & min-h-0 */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="relative group shrink-0 mb-3">
                    <div className="flex flex-col items-center justify-center p-8 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[2rem] group-hover:bg-white/[0.04] transition-all cursor-pointer">
                      <Upload
                        size={24}
                        className="text-gray-500 mb-2 group-hover:text-[#6d28d9]"
                      />
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">
                        Klik atau Taruh File PDF
                      </span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="group flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl shrink-0 animate-in fade-in slide-in-from-bottom-2"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                            <FileText size={16} className="text-red-500" />
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="text-[10px] font-bold text-white truncate">
                              {file.name}
                            </span>
                            <span className="text-[8px] text-gray-500 font-mono">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(idx)}
                          className="p-2 hover:bg-red-500/10 text-gray-600 hover:text-red-500 rounded-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {selectedFiles.length === 0 && (
                      <div className="h-32 flex items-center justify-center border border-dashed border-white/5 rounded-[2rem] opacity-20 shrink-0">
                        <p className="text-[10px] uppercase font-bold tracking-widest">
                          Belum ada file
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  disabled={selectedFiles.length === 0}
                  className={`w-full mt-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shrink-0 uppercase tracking-[0.2em] text-[10px] font-black shadow-lg ${selectedFiles.length > 0 ? "bg-[#6d28d9] text-white" : "bg-white/5 text-gray-600 cursor-not-allowed"}`}
                >
                  Kirim{" "}
                  {selectedFiles.length > 0 &&
                    `${selectedFiles.length} Dokumen`}{" "}
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-3">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleHistoryClick(item)}
                    className="bg-[#1a1a1e]/20 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.03] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      <div
                        className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${item.status === "Revisi" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : item.status === "Approved" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : item.status === "Ditolak" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-blue-500/10 border-blue-500/20 text-blue-500"}`}
                      >
                        {item.status === "Revisi" ? (
                          <AlertCircle size={20} />
                        ) : item.status === "Approved" ? (
                          <CheckCircle2 size={20} />
                        ) : item.status === "Ditolak" ? (
                          <X size={20} />
                        ) : (
                          <Clock size={20} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-bold text-white">
                            {item.nama}
                          </h4>
                          <span className="text-[8px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-gray-400 font-mono tracking-tighter">
                            {item.id}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">
                          {item.jenis} • {item.tgl}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      {item.catatan && (
                        <div className="hidden lg:block max-w-[250px]">
                          <p
                            className={`text-[9px] italic leading-relaxed line-clamp-2 ${item.status === "Ditolak" ? "text-red-400/80" : "text-amber-500/80"}`}
                          >
                            "{item.catatan}"
                          </p>
                        </div>
                      )}
                      <div className="text-right min-w-[100px]">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${item.status === "Revisi" ? "text-amber-500" : item.status === "Approved" ? "text-emerald-500" : item.status === "Ditolak" ? "text-red-500" : "text-blue-500"}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 opacity-20">
                  <Search size={48} strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-4">
                    Data tidak ditemukan
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(109, 40, 217, 0.3);
        }
      `}</style>
    </div>
  );
};

export default MutasiOPD;
