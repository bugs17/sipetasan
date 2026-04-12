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
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
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
import { deleteMutasi } from "@/app/actions/delete-mutasi";
import ModalDelete from "./modal-delete";

const MutasiOPD = () => {
  const [activeTab, setActiveTab] = useState("pengajuan");
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [formData, setFormData] = useState({
    id_pegawai: "",
    idInstansiTujuan: "",
    idInstansiAsal: "",
    alasan: "",
    catatan: "",
    files: [],
    existingFiles: [],
    isRevision: false,
    oldMutasiId: null,
  });

  const [historyMutasi, setHistoryMutasi] = useState([]);
  const { isLoaded, userId } = useAuth();
  const [daftarInstansi, setDaftarInstansi] = useState([]);
  const [daftarPegawai, setDaftarPegawai] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMutasi, setSelectedMutasi] = useState(null);

  // LOGIKA VALIDASI JUMLAH BERKAS REVISI
  const totalPerluRevisi =
    formData.existingFiles?.filter((f) => f.status_berkas === "revisi")
      .length || 0;

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!isLoaded || !userId) return;
      setIsLoading(true);
      try {
        const userData = await getUserRoleByClerkID(userId);
        const [listInstansi, listPegawai] = await Promise.all([
          getListInstansi(),
          getListPegawaiByIdInstansi(userData.opdId),
        ]);

        setDaftarInstansi(listInstansi);
        setDaftarPegawai(listPegawai);
        setFormData((prev) => ({
          ...prev,
          idInstansiAsal: userData.opdId,
        }));

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
    if (item.status === "revisi") {
      setFormData({
        id_pegawai: item.pegawaiId,
        idInstansiTujuan: item.opdTujuanId,
        idInstansiAsal: item.opdAsalId,
        catatan: item.catatan || "",
        alasan: item.alasan || "",
        files: [],
        existingFiles: item.berkasMutasi || [],
        isRevision: true,
        oldMutasiId: item.id,
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
      toast.error("Hanya file PDF yang diizinkan");
    }

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
    // 1. HITUNG DINAMIS: Agar variabel totalPerluRevisi tidak undefined saat validasi
    const totalPerluRevisi =
      formData.existingFiles?.filter((f) => f.status_berkas === "revisi")
        .length || 0;

    // VALIDASI LEVEL UI: CEK JUMLAH BERKAS JIKA MODE REVISI
    if (
      formData.isRevision &&
      totalPerluRevisi > 0 &&
      formData.files.length < totalPerluRevisi
    ) {
      toast.error(
        `Wajib mengunggah minimal ${totalPerluRevisi} berkas untuk menggantikan yang direvisi.`,
      );
      return;
    }

    if (
      !formData.id_pegawai ||
      !formData.idInstansiTujuan ||
      formData.files.length === 0
    ) {
      toast.error("Lengkapi data terlebih dahulu");
      return;
    }

    const submission = new FormData();
    submission.append("pegawaiId", formData.id_pegawai);
    submission.append("opdTujuanId", formData.idInstansiTujuan);
    submission.append("opdAsalId", formData.idInstansiAsal);
    submission.append("alasan", formData.alasan);

    if (formData.isRevision && formData.oldMutasiId) {
      submission.append("oldMutasiId", formData.oldMutasiId);
    }

    formData.files.forEach((file) => {
      submission.append("berkas", file);
    });

    try {
      const { success, data, message } = await addMutasi(submission);

      if (success) {
        toast.success(message);
        if (formData.isRevision) {
          setHistoryMutasi((prev) =>
            prev.map((item) => (item.id === data.id ? data : item)),
          );
        } else {
          setHistoryMutasi((prev) => [data, ...prev]);
        }

        // 2. PAKAI FUNGSI RESET: Agar sinkron dengan tombol "Batal" di UI
        resetForm();

        setActiveTab("status");
      } else {
        toast.error(message);
      }
    } catch (err) {
      console.error("SUBMIT_ERROR:", err);
      toast.error("Terjadi kesalahan sistem");
    }
  };

  const resetForm = () => {
    setFormData({
      id_pegawai: "",
      idInstansiTujuan: "",
      idInstansiAsal: formData.idInstansiAsal, // Tetap simpan ID Asal OPD user
      alasan: "",
      catatan: "",
      files: [],
      existingFiles: [],
      isRevision: false,
      oldMutasiId: null,
    });
  };

  const handleDelete = async (id) => {
    const res = await deleteMutasi(selectedMutasi.id);
    if (res.success) {
      toast.success(res.message);
      setHistoryMutasi((prev) => prev.filter((item) => item.id !== id));
    } else {
      toast.error(res.message);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden animate-in fade-in duration-700 relative">
      <div className="flex flex-row items-center justify-between px-8 py-6 shrink-0 ">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 group relative">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
              Mutasi Pegawai
            </h2>

            {/* ICON INFO */}
            <div className="cursor-help text-gray-600 hover:text-[#6d28d9] transition-colors mt-1">
              <Info size={16} />
            </div>

            {/* TOOLTIP LUAS */}
            <div className="absolute top-full left-0 mt-3 w-80 p-6 bg-[#1a1a1e] border border-white/10 rounded-[2.5rem] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] backdrop-blur-3xl">
              <h5 className="text-[11px] font-black text-[#6d28d9] uppercase mb-3 tracking-widest flex items-center gap-2">
                <FileText size={14} /> Persyaratan Dokumen
              </h5>
              <ul className="space-y-3">
                <li className="text-[10px] text-gray-300 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6d28d9] mt-1 shrink-0" />
                  <span>Surat Pengantar dari Kepala OPD Asal</span>
                </li>
                <li className="text-[10px] text-gray-300 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6d28d9] mt-1 shrink-0" />
                  <span>Scan SK Pangkat & Jabatan Terakhir</span>
                </li>
                <li className="text-[10px] text-gray-300 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6d28d9] mt-1 shrink-0" />
                  <span>Surat Rekomendasi Instansi Tujuan</span>
                </li>
                <li className="text-[10px] text-gray-300 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6d28d9] mt-1 shrink-0" />
                  <span>Dokumen pendukung alasan perpindahan</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[9px] text-gray-500 leading-relaxed italic uppercase font-bold">
                  * Semua berkas wajib dalam format PDF
                </p>
              </div>
            </div>
          </div>
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
              onClick={() => setActiveTab("pengajuan")}
              className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${activeTab === "pengajuan" ? "bg-[#6d28d9] text-white shadow-lg" : "text-gray-500 hover:bg-white/5"}`}
            >
              <Plus size={12} /> Pengajuan
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${activeTab === "status" ? "bg-[#6d28d9] text-white shadow-lg" : "text-gray-500 hover:bg-white/5"}`}
            >
              <Clock size={12} /> Riwayat
            </button>
          </div>
        </div>
      </div>

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
          <FormPengajuanMutasi
            formData={formData}
            setFormData={setFormData}
            daftarInstansi={daftarInstansi}
            daftarPegawai={daftarPegawai}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            handleSubmit={handleSubmit}
            totalPerluRevisi={totalPerluRevisi} // Kirim prop ini ke UI jika perlu label info
            onCancelRevision={resetForm}
          />
        ) : (
          <HistoryListMutasi
            filteredHistory={filteredHistory}
            handleHistoryClick={handleHistoryClick}
            openModalDelete={setIsDeleteModalOpen}
            selectedMutasi={setSelectedMutasi}
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

      <ModalStatusMutasiOpd
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedHistory={selectedHistory}
      />
      <ModalDelete
        isDeleteModalOpen={isDeleteModalOpen}
        desc={"Data mutasi ini akan di hapus permanen"}
        title={"Hapus mutasi ini"}
        handleDelete={handleDelete}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />
    </div>
  );
};

export default MutasiOPD;
