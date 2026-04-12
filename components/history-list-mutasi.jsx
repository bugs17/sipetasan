"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Shuffle,
  X,
  Trash2,
} from "lucide-react";

const HistoryListMutasi = ({
  filteredHistory,
  handleHistoryClick,
  openModalDelete,
  selectedMutasi,
}) => {
  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
      <div className="space-y-3">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-[#1a1a1e]/20 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.03] transition-all"
            >
              {/* Bagian Kiri: Informasi (Klik di sini untuk detail) */}
              <div
                onClick={() => handleHistoryClick(item)}
                className="flex items-center gap-6 flex-1 cursor-pointer"
              >
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${
                    item.status === "revisi"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      : item.status === "Approved"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        : item.status === "ditolak"
                          ? "bg-red-500/10 border-red-500/20 text-red-500"
                          : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                  }`}
                >
                  {item.status === "revisi" ? (
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
                    <h4 className="text-sm uppercase font-bold text-white">
                      {item.nama}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">
                      {item.nip}
                    </p>
                  </div>
                  <div className="flex flex-row gap-3 items-center justify-start">
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">
                      {item.tgl}
                    </p>
                    <Shuffle size={10} className="text-gray-600" />
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">
                      {item.instansiTujuan}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bagian Kanan: Status & Action */}
              <div className="flex items-center gap-8">
                {item.catatan && (
                  <div className="hidden lg:block max-w-[200px]">
                    <p
                      className={`text-[9px] italic leading-relaxed line-clamp-2 ${
                        item.status === "Ditolak"
                          ? "text-red-400/80"
                          : "text-amber-500/80"
                      }`}
                    >
                      "{item.catatan}"
                    </p>
                  </div>
                )}
                <div className="text-right min-w-[80px]">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${
                      item.status === "revisi"
                        ? "text-amber-500"
                        : item.status === "Approved"
                          ? "text-emerald-500"
                          : item.status === "Ditolak"
                            ? "text-red-500"
                            : "text-blue-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Tombol Hapus: Hanya muncul jika status masih pending */}
                {item.status === "pending" && (
                  <button
                    onClick={() => {
                      openModalDelete(true);
                      selectedMutasi(item);
                    }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
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
  );
};

export default HistoryListMutasi;
