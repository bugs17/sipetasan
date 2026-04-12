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
import ModalStatusMutasiOpd from "./modal-status-mutasi-opd";
import HistoryListMutasi from "./history-list-mutasi";
import { getListMutasiByOpdId } from "@/app/actions/get-list-mutasi-by-opd-id";
import { useAuth } from "@clerk/nextjs";
import { getUserRoleByClerkID } from "@/app/actions/get-user-role-by-clerk-id";
import { getListInstansi } from "@/app/actions/getListInstansi";
import { getListPegawaiByIdInstansi } from "@/app/actions/get-list-pegawai-by-id-instansi";
import FormPengajuanMutasi from "./form-pengajuan-mutasi";
import { addMutasi } from "@/app/actions/add-new-mutasi";

const MutasiOPD = () => {
  const [activeTab, setActiveTab] = useState("pengajuan");
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  // State Form
  const [formData, setFormData] = useState({
    id_pegawai: "",
    idInstansiTujuan: "",
    idInstansiAsal: "",
    alasan: "",
    files: [],
  });
  const [historyMutasi, setHistoryMutasi] = useState([]);
  const { isLoaded, userId } = useAuth();
  const [daftarInstansi, setDaftarInstansi] = useState([]);
  const [daftarPegawai, setDaftarPegawai] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!isLoaded || !userId) return;

      // Kita hanya tampilkan skeleton besar di awal saja
      setIsLoading(true);

      try {
        const userData = await getUserRoleByClerkID(userId);

        // Ambil data statis (Hanya sekali seumur hidup komponen)
        const [listInstansi, listPegawai] = await Promise.all([
          getListInstansi(),
          getListPegawaiByIdInstansi(userData.opdId),
        ]);

        setDaftarInstansi(listInstansi);
        setDaftarPegawai(listPegawai);
        setFormData({
          ...formData,
          idInstansiAsal: userData.opdId,
        });

        // Ambil data awal untuk history
        const { success, data } = await getListMutasiByOpdId(userData.opdId);
        if (success) setHistoryMutasi(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [isLoaded, userId]);

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

    // Update ke dalam formData.files
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...pdfFiles],
    }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    // 1. Inisialisasi FormData asli (Web API)
    const submission = new FormData();

    // 2. Masukkan field teks
    submission.append("pegawaiId", formData.id_pegawai);
    submission.append("opdTujuanId", formData.idInstansiTujuan);
    submission.append("opdAsalId", formData.idInstansiAsal);
    submission.append("alasan", formData.alasan);

    // 3. Masukkan semua file (looping dari array state kamu)
    formData.files.forEach((file) => {
      submission.append("berkas", file);
    });

    // 4. Kirim ke Server Action
    try {
      const { success, data, message } = await addMutasi(submission);
      if (success) {
        toast.success(message);
        setHistoryMutasi((prev) => [data, ...prev]);
        setFormData({
          id_pegawai: "",
          idInstansiTujuan: "",
          idInstansiAsal: formData.idInstansiAsal, // Tetap simpan ID asal jika masih dibutuhkan
          alasan: "",
          files: [],
        });
      }
      setActiveTab("status");
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden animate-in fade-in duration-700 relative">
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
          {/* tab */}
          <div className="flex gap-1 p-1 bg-black/20 border border-white/10 rounded-xl backdrop-blur-xl">
            <button
              onClick={() => {
                setActiveTab("pengajuan");
              }}
              className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${activeTab === "pengajuan" ? "bg-[#6d28d9] text-white shadow-lg" : "text-gray-500 hover:bg-white/5"}`}
            >
              <Plus size={12} /> Pengajuan
            </button>
            <button
              onClick={() => {
                setActiveTab("status");
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
          // Skeleton ini HANYA akan muncul saat isLoading pertama kali (fetch data awal)
          activeTab === "pengajuan" ? (
            <FormMutasiOpdSkeleton />
          ) : (
            <ListMutasiOpdSkeleton />
          )
        ) : activeTab === "pengajuan" ? (
          <FormPengajuanMutasi
            formData={formData} // Jangan lupa kirim ini
            setFormData={setFormData} // Dan ini
            daftarInstansi={daftarInstansi}
            daftarPegawai={daftarPegawai}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            selectedFiles={selectedFiles}
            handleSubmit={handleSubmit}
          />
        ) : (
          <HistoryListMutasi
            filteredHistory={filteredHistory}
            handleHistoryClick={handleHistoryClick}
          />
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

      {/* modal status mutasi */}
      <ModalStatusMutasiOpd
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedHistory={selectedHistory}
      />
    </div>
  );
};

export default MutasiOPD;
