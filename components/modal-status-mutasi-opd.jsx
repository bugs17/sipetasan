"use client";

import { AlertCircle, CheckCircle2, Clock, X } from "lucide-react";

const ModalStatusMutasiOpd = ({
  isModalOpen,
  setIsModalOpen,
  selectedHistory,
}) => {
  if (!isModalOpen || !selectedHistory) return null;
  return (
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
              ID Pengajuan: MTX00{selectedHistory.id}
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-left space-y-3">
            <div>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                Nama Pegawai
              </p>
              <p className="text-xs text-white uppercase font-bold">
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
  );
};

export default ModalStatusMutasiOpd;
