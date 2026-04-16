"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  Search,
  X,
  FileText,
  Calendar,
  User,
  ArrowRight,
  Eye,
  XCircle,
  RefreshCcw,
  Clock,
} from "lucide-react";
import ListMutasiAdminIndukSkeleton from "./skeleton/list-mutasi-admin-induk-skeleton";
import ModalReviewMutasi from "./modal-review-mutasi";
import { getAllMutasi } from "@/app/actions/get-all-mutasi-admin-induk";
import toast from "react-hot-toast";
import { tolakMutasi } from "@/app/actions/tolak-mutasi";

const MutasiIduk = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeDocId, setActiveDocId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [documentStatus, setDocumentStatus] = useState({});
  const [adminNote, setAdminNote] = useState("");
  const [isLoaded, setIsLoaded] = useState(true);
  const [allData, setAllData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");

  const fetchAllMutasi = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllMutasi();
      setAllData(response);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllMutasi();
  }, [fetchAllMutasi]);

  const filteredData = allData.filter((item) => {
    const matchTab =
      activeTab === "pending"
        ? item.status === "pending"
        : item.status !== "pending";
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nip.includes(searchQuery);
    return matchTab && matchSearch;
  });

  const handleOpenReview = (request) => {
    setSelectedRequest(request);
    setAdminNote(request.catatanAdmin || "");
    setActiveDocId(request.dokumen[0]?.id);
    const initialStatus = {};
    request.dokumen.forEach((doc) => (initialStatus[doc.id] = doc.status));
    setDocumentStatus(initialStatus);
  };

  const toggleDocStatus = (e, docId, status) => {
    e.stopPropagation();
    if (selectedRequest.status !== "pending") return;
    setDocumentStatus((prev) => ({ ...prev, [docId]: status }));
  };

  const activeDocData = selectedRequest?.dokumen.find(
    (d) => d.id === activeDocId,
  );
  const allDocsApproved =
    selectedRequest &&
    selectedRequest.dokumen.every((doc) => documentStatus[doc.id] === "valid");

  const anyDocRevised =
    selectedRequest &&
    selectedRequest.dokumen.some((doc) => documentStatus[doc.id] === "revisi");

  const handleTolak = async () => {
    if (!adminNote) {
      toast.error(
        "Tambahkan alasan penolakan terlebih dahulu pada kolom catatan!",
      );
      return;
    }

    const response = await tolakMutasi(selectedRequest.id, adminNote);
    if (response.success) {
      toast.success("Mutasi berhasil ditolak!");
      fetchAllMutasi();
      setSelectedRequest(null);
      return;
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden text-white font-sans">
      {/* --- HEADER DASHBOARD --- */}
      <div className="px-8 pt-8 shrink-0 flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">
            Verifikasi Induk
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
            Panel Kendali Mutasi Antar Satuan Kerja
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-3xl shadow-inner">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2.5 
    ${
      activeTab === "pending"
        ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10 backdrop-blur-md"
        : "text-gray-500 hover:bg-white/[0.05] hover:text-gray-300 border border-transparent"
    }`}
            >
              <Clock
                size={12}
                strokeWidth={2.5}
                className={
                  activeTab === "pending" ? "text-white" : "text-gray-600"
                }
              />
              <span>Perlu Review</span>
            </button>

            <button
              onClick={() => setActiveTab("completed")}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2.5 
    ${
      activeTab === "completed"
        ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10 backdrop-blur-md"
        : "text-gray-500 hover:bg-white/[0.05] hover:text-gray-300 border border-transparent"
    }`}
            >
              <CheckCircle2
                size={12}
                strokeWidth={2.5}
                className={
                  activeTab === "completed" ? "text-white" : "text-gray-600"
                }
              />
              <span>Selesai Verifikasi</span>
            </button>
          </div>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
            />
            <input
              type="text"
              placeholder="Cari NIP / Nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] w-64 focus:outline-none focus:border-[#6d28d9]/50 transition-all text-white"
            />
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-hidden p-8 flex flex-col gap-6">
        {/* tab */}

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
            <ListMutasiAdminIndukSkeleton />
          ) : filteredData.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredData.map((item, idx) => (
                <ItemMutasi
                  key={idx}
                  handleOpenReview={handleOpenReview}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <EmptyStateList
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeTab={activeTab}
            />
          )}
        </div>
      </div>

      <ModalReviewMutasi
        selectedRequest={selectedRequest}
        activeDocData={activeDocData}
        activeDocId={activeDocId}
        adminNote={adminNote}
        allDocsApproved={allDocsApproved}
        anyDocRevised={anyDocRevised}
        documentStatus={documentStatus}
        isLoaded={isLoaded}
        isLoading={isLoading}
        pdfUrl={pdfUrl}
        setPdfUrl={setPdfUrl}
        setActiveDocId={setActiveDocId}
        setAdminNote={setAdminNote}
        setIsLoaded={setIsLoaded}
        setSelectedRequest={setSelectedRequest}
        toggleDocStatus={toggleDocStatus}
        handleTolak={handleTolak}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
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

export default MutasiIduk;

// komponen empty state
const EmptyStateList = ({ searchQuery, setSearchQuery, activeTab }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in duration-500">
      <div className="relative mb-6">
        {/* Glow Effect di belakang icon */}
        <div className="absolute inset-0 bg-[#6d28d9]/20 blur-[50px] rounded-full" />

        <div className="relative w-24 h-24 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center backdrop-blur-3xl shadow-2xl">
          {searchQuery ? (
            <Search size={40} className="text-gray-600" />
          ) : (
            <FileText size={40} className="text-[#6d28d9]/50" />
          )}
        </div>

        <div className="absolute -right-2 -bottom-2 w-10 h-10 rounded-2xl bg-[#1a1a1e] border border-white/10 flex items-center justify-center shadow-xl">
          <X size={18} className="text-rose-500" />
        </div>
      </div>

      <div className="text-center space-y-2 max-w-xs">
        <h3 className="text-lg font-black uppercase tracking-tighter italic text-white">
          {searchQuery ? "Pencarian Nihil" : "Antrian Bersih"}
          <span className="text-[#6d28d9]">.</span>
        </h3>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
          {searchQuery
            ? `Tidak ada hasil untuk "${searchQuery}". Coba periksa kembali NIP atau Nama.`
            : `Saat ini tidak ada permohonan mutasi dalam status ${activeTab}.`}
        </p>
      </div>

      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="mt-8 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
        >
          Reset Pencarian
        </button>
      )}
    </div>
  );
};

// komponen item
const ItemMutasi = ({ item, handleOpenReview }) => {
  return (
    <div className="group bg-[#1a1a1e]/40 backdrop-blur-2xl hover:bg-[#1a1a1e]/60 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between transition-all shadow-xl">
      <div className="flex items-center gap-8">
        {/* status */}
        <div
          className={`flex flex-col items-center justify-center p-4 rounded-3xl border min-w-[100px] transition-all duration-500 ${
            item.status === "approved"
              ? "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
              : item.status === "ditolak"
                ? "bg-red-500/5 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                : item.status === "revisi"
                  ? "bg-amber-500/5 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                  : "bg-[#6d28d9]/5 border-[#6d28d9]/20 shadow-[0_0_15px_rgba(109,40,217,0.05)]"
          }`}
        >
          <div className="mb-1">
            {item.status === "approved" && (
              <CheckCircle2 size={20} className="text-emerald-500" />
            )}
            {item.status === "ditolak" && (
              <XCircle size={20} className="text-red-500" />
            )}
            {item.status === "revisi" && (
              <RefreshCcw size={20} className="text-amber-500" />
            )}
            {item.status === "pending" && (
              <Clock size={20} className="text-[#6d28d9] animate-pulse" />
            )}
          </div>

          <span
            className={`text-[8px] font-black uppercase tracking-[0.2em] text-center ${
              item.status === "approved"
                ? "text-emerald-500/70"
                : item.status === "ditolak"
                  ? "text-red-500/70"
                  : item.status === "revisi"
                    ? "text-amber-500/70"
                    : "text-[#6d28d9]/70"
            }`}
          >
            {item.status}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h4 className="text-sm font-black text-white uppercase tracking-tight">
              {item.nama}
            </h4>
            {item.status !== "pending" && (
              <span
                className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${
                  item.status === "approved"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : item.status === "ditolak"
                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}
              >
                {item.status}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-wider">
            <User size={10} /> {item.nip} • <Calendar size={10} />{" "}
            {item.tglKirim}
          </div>
        </div>

        <div className="flex items-center gap-4 px-6 border-l border-white/5">
          <div className="text-right">
            <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">
              Asal
            </p>
            <p className="text-[10px] text-gray-300 font-bold">
              {item.opdAsal}
            </p>
          </div>
          <ArrowRight size={14} className="text-[#6d28d9]" />
          <div>
            <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">
              Tujuan
            </p>
            <p className="text-[10px] text-gray-300 font-bold">
              {item.opdTujuan}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => handleOpenReview(item)}
        className={`flex items-center gap-3 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${item.status === "pending" ? "bg-[#6d28d9]/10 hover:bg-[#6d28d9] text-[#6d28d9] hover:text-white border-[#6d28d9]/20" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"}`}
      >
        {item.status === "pending" ? "Periksa Berkas" : "Lihat Detail"}{" "}
        <Eye size={14} />
      </button>
    </div>
  );
};
