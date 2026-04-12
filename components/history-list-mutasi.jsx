"use cleint";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Search,
  Shuffle,
  X,
} from "lucide-react";

const HistoryListMutasi = ({ filteredHistory, handleHistoryClick }) => {
  return (
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
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">
                      {item.nip}
                    </p>
                  </div>
                  <div className="flex flex-row gap-3 items-center justify-start ">
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
  );
};

export default HistoryListMutasi;
