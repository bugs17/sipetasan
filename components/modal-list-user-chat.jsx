"use client";

import { useState, useMemo } from "react";
import { getColorFromId } from "@/app/utils/generate-color";
import { generateInisial } from "@/app/utils/generate-inisial";

const ModalListUserChat = ({
  isModalOpen,
  closeModal,
  listKontak,
  startNewChat,
  disabled,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Optimasi filtering menggunakan useMemo
  const filteredKontak = useMemo(() => {
    if (!searchQuery) return listKontak;

    const query = searchQuery.toLowerCase();
    return listKontak.filter(
      (k) =>
        k.nama_user.toLowerCase().includes(query) ||
        k.opd?.namaOpd.toLowerCase().includes(query),
    );
  }, [searchQuery, listKontak]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => closeModal(false)}
      />
      <div className="bg-[#1a1a1e]/95 border border-white/10 p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] rounded-[2.5rem] max-w-md w-full relative overflow-hidden transform animate-in fade-in zoom-in duration-300">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6d28d9]/20 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-5 flex flex-col max-h-[80vh]">
          <div className="text-center space-y-1 shrink-0">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              List user instansi
              <span className="text-[#6d28d9]">.</span>
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              pilih user untuk memulai chat baru
            </p>
          </div>

          <div className="shrink-0">
            <input
              type="text"
              placeholder="CARI INSTANSI ATAU NAMA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-[10px] font-bold text-white placeholder:text-gray-600 focus:outline-none focus:border-[#6d28d9]/50 focus:bg-[#6d28d9]/5 transition-all uppercase tracking-widest"
            />
          </div>

          <div className="space-y-2 overflow-y-auto pr-2 flex-1 min-h-0 custom-scrollbar">
            {filteredKontak.length > 0 ? (
              filteredKontak.map((kontak) => (
                <div
                  key={kontak.id}
                  onClick={() => startNewChat(kontak)}
                  className="flex items-center gap-4 p-3 bg-white/[0.03] hover:bg-[#6d28d9]/20 border border-white/5 rounded-2xl cursor-pointer transition-all group"
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0 shadow-inner"
                    style={{
                      backgroundColor: `${getColorFromId(kontak.id)}20`,
                      color: getColorFromId(kontak.id),
                    }}
                  >
                    {generateInisial(kontak.nama_user)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-white font-bold truncate group-hover:text-white">
                      {kontak.opd?.namaOpd}
                    </span>
                    <span className="text-[10px] text-gray-500 truncate italic">
                      {kontak.nama_user}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  User tidak ditemukan
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 shrink-0">
            <button
              disabled={disabled}
              type="button"
              onClick={() => closeModal(false)}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalListUserChat;
