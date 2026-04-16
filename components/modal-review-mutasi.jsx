"use client";

import {
  Ban,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";

const ModalReviewMutasi = ({
  selectedRequest,
  setSelectedRequest,
  setActiveDocId,
  activeDocId,
  documentStatus,
  toggleDocStatus,
  adminNote,
  setAdminNote,
  anyDocRevised,
  allDocsApproved,
  activeDocData,
  isLoaded,
  pdfUrl,
  setPdfUrl,
  isLoading,
  setIsLoaded,
}) => {
  if (!selectedRequest) return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0f0f11] animate-in fade-in zoom-in-95 duration-300">
      {/* Header Modal Full Width */}
      <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6d28d9]/20 rounded-xl text-[#6d28d9]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">
                Verifikator Induk System
              </h3>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                Peninjauan Berkas Mutasi Antar Satuan Kerja
              </p>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#6d28d9] font-black uppercase tracking-widest">
              {selectedRequest.nama}
            </span>
            <span className="text-[9px] text-gray-500 font-medium tracking-tight">
              NIP: {selectedRequest.nip}
            </span>
          </div>
        </div>

        <button
          onClick={() => setSelectedRequest(null)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-red-500/20"
        >
          Tutup Panel <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-row">
        {/* Left Sidebar: Document Checklist (Wider for better readability) */}
        <div className="w-[450px] border-r border-white/5 flex flex-col bg-black/20">
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <FileText size={12} /> Persyaratan Dokumen Terlampir
            </h5>

            {selectedRequest.dokumen.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setActiveDocId(doc.id);
                  setPdfUrl(`/api/mutasi/docs/${doc.file}`);
                }}
                className={`p-5 rounded-[1.8rem] border transition-all cursor-pointer relative group ${
                  activeDocId === doc.id
                    ? "bg-[#6d28d9]/10 border-[#6d28d9] shadow-[0_0_25px_rgba(109,40,217,0.15)]"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1 group-hover:text-[#6d28d9] transition-colors">
                      Digital Archive
                    </span>
                    <span className="text-xs font-bold text-white tracking-wide">
                      {doc.nama}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {documentStatus[doc.id] === "valid" && (
                      <div className="p-1 bg-emerald-500 rounded-full text-white">
                        <Check size={10} strokeWidth={4} />
                      </div>
                    )}
                    {documentStatus[doc.id] === "revisi" && (
                      <div className="p-1 bg-amber-500 rounded-full text-white">
                        <RotateCcw size={10} strokeWidth={4} />
                      </div>
                    )}
                    {documentStatus[doc.id] === "rejected" && (
                      <div className="p-1 bg-red-500 rounded-full text-white">
                        <X size={10} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                </div>

                {selectedRequest.status === "pending" && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={(e) => toggleDocStatus(e, doc.id, "valid")}
                      className={`py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${documentStatus[doc.id] === "approved" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-white/5 text-gray-500 hover:text-emerald-400 border border-white/5"}`}
                    >
                      <Check size={12} /> Valid
                    </button>
                    <button
                      onClick={(e) => toggleDocStatus(e, doc.id, "revisi")}
                      className={`py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${documentStatus[doc.id] === "revised" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-white/5 text-gray-500 hover:text-amber-400 border border-white/5"}`}
                    >
                      <RotateCcw size={12} /> Revisi
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-6 border-t border-white/5">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">
                Catatan Verifikasi Internal
              </label>
              <textarea
                readOnly={selectedRequest.status !== "pending"}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Contoh: Berkas tidak sesuai format asli atau masa berlaku habis..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] p-5 text-xs text-white outline-none h-32 resize-none focus:border-[#6d28d9]/50 transition-all placeholder:text-gray-700 font-medium leading-relaxed"
              />
            </div>
          </div>

          {/* Action Footer Sidebar */}
          {selectedRequest.status === "pending" && (
            <div className="p-6 bg-black/40 border-t border-white/5 flex flex-col gap-3">
              <div className="flex gap-3">
                <button className="flex-1 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-600/10">
                  <Ban size={14} /> Tolak
                </button>
                <button
                  disabled={!anyDocRevised}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${anyDocRevised ? "bg-amber-600 text-white shadow-xl shadow-amber-600/20" : "bg-white/5 text-gray-700 cursor-not-allowed border border-white/5"}`}
                >
                  <RotateCcw size={14} /> Revisi
                </button>
              </div>
              <button
                disabled={!allDocsApproved}
                className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${allDocsApproved ? "bg-[#6d28d9] text-white shadow-[0_0_30px_rgba(109,40,217,0.3)]" : "bg-white/5 text-gray-700 cursor-not-allowed border border-white/5"}`}
              >
                <CheckCircle2 size={16} /> Approve Mutasi
              </button>
            </div>
          )}
        </div>

        {/* Right Side: High Performance Document Viewer */}
        <div className="flex-1 bg-[#050505] flex flex-col relative">
          {activeDocData ? (
            <>
              {/* Floating Toolbar Viewer */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-6 py-3 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl transition-all hover:border-[#6d28d9]/30">
                <div className="flex items-center gap-4 border-r border-white/10 pr-4">
                  <div className="p-1.5 bg-red-500/20 text-red-500 rounded-lg">
                    <FileText size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white tracking-wider">
                      {activeDocData.nama}
                    </span>
                  </div>
                </div>

                {/* Tombol Download Baru */}
                <a
                  href={`/api/mutasi/download/${activeDocData.file}`} // Pastikan path file sesuai dengan di folder public
                  // download={activeDocData.file}
                  className="flex items-center gap-2 pl-4 text-[9px] font-black uppercase text-gray-400 tracking-widest hover:text-[#6d28d9] transition-colors group/btn"
                >
                  Download Dokumen
                  <div className="p-1.5 bg-white/5 rounded-lg group-hover/btn:bg-[#6d28d9]/10 transition-colors">
                    <Download
                      size={14}
                      className="group-hover/btn:scale-110 transition-transform"
                    />
                  </div>
                </a>
              </div>

              <div className="flex-1 p-8 pt-24 overflow-hidden flex flex-col items-center ">
                {/* Simulated PDF Paper */}
                <div className="w-full max-w-4xl h-[80vh] bg-[#1a1a1e] rounded-t-3xl border-x border-t border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative overflow-hidden group">
                  {/* 1. Loading State (Tampil hanya saat isLoading true) */}
                  {isLoaded && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#1a1a1e]">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                      <Loader2
                        size={40}
                        className="text-[#6d28d9] animate-spin mb-6 relative z-10"
                      />
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-600 relative z-10">
                        Decrypting Document...
                      </p>
                      <div className="mt-8 px-8 py-3 bg-white/5 rounded-xl border border-white/5 text-[9px] font-bold text-gray-500 uppercase tracking-widest relative z-10">
                        Secure Content — Internal Government Use Only
                      </div>
                    </div>
                  )}

                  {/* 2. PDF Viewer (Iframe) */}
                  <iframe
                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className={`w-full h-full border-none transition-opacity duration-1000 ${
                      isLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setIsLoaded(false)}
                  />

                  {/* 3. Decorative Overlay (Optional, agar tetap terlihat premium) */}
                  {!isLoaded && (
                    <div className="absolute inset-0 pointer-events-none border-t border-white/5 z-10 shadow-[inset_0_40px_80px_-20px_rgba(0,0,0,0.5)]" />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
              <FileText size={80} strokeWidth={1} className="mb-6" />
              <h2 className="text-xl font-black uppercase tracking-[0.5em]">
                No Selection
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalReviewMutasi;
