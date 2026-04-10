"use client";

import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineUserAdd,
  HiOutlineX,
} from "react-icons/hi";

const colors = {
  1: {
    border: "border-blue-500",
    text: "text-blue-500",
    bg: "bg-blue-500",
    hex: "#3b82f6",
  },
  2: {
    border: "border-emerald-500",
    text: "text-emerald-500",
    bg: "bg-emerald-500",
    hex: "#10b981",
  },
  3: {
    border: "border-amber-500",
    text: "text-amber-500",
    bg: "bg-amber-500",
    hex: "#f59e0b",
  },
  4: {
    border: "border-rose-500",
    text: "text-rose-500",
    bg: "bg-rose-500",
    hex: "#f43f5e",
  },
  5: {
    border: "border-sky-500",
    text: "text-sky-500",
    bg: "bg-sky-500",
    hex: "#0ea5e9",
  },
  6: {
    border: "border-indigo-500",
    text: "text-indigo-500",
    bg: "bg-indigo-500",
    hex: "#6366f1",
  },
};

const CustomNodeEditor = ({
  item,
  onUpdate,
  onAdd,
  onDeleteConfirm,
  isEditMode,
  listPegawai,
}) => {
  const style = colors[item.level] || colors[1];
  const selisih = (item.b || 0) - (item.abk || 0);
  return (
    <div className="inline-block p-4 relative group">
      <div
        className={`w-[280px] bg-[#151c21] border-2 ${style.border} rounded-[1.5rem] p-5 text-left shadow-2xl transition-all`}
      >
        {isEditMode && (
          <div className="absolute -top-1 -right-1 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            {item.id !== "root-1" && (
              <button
                onClick={() => onDeleteConfirm(item.id, item.jabatan)}
                className="p-2 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all shadow-red-500/20"
              >
                <HiOutlineTrash size={12} />
              </button>
            )}
            <button
              onClick={() => onAdd(item.id)}
              className="p-2 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-all shadow-emerald-500/20"
            >
              <HiOutlinePlus size={12} />
            </button>
          </div>
        )}

        {/* Header */}
        {isEditMode ? (
          <div className="flex justify-between items-center mb-3">
            <span
              className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10 ${style.text}`}
            >
              LVL {item.level}
            </span>
            <button
              onClick={() =>
                onUpdate(item.id, "pegawai", [...item.pegawai, "Belum Terisi"])
              }
              className="text-[8px] font-bold text-gray-400 hover:text-white bg-white/5 px-2 py-1 rounded-md border border-white/5 flex items-center gap-1 transition-colors"
            >
              <HiOutlineUserAdd size={10} /> TAMBAH SDM
            </button>
          </div>
        ) : (
          <div className="mt-1"></div>
        )}

        {/* Jabatan Section */}
        {isEditMode ? (
          <input
            type="text"
            value={item.jabatan}
            onChange={(e) => onUpdate(item.id, "jabatan", e.target.value)}
            className="w-full bg-transparent text-[10px] font-black text-white uppercase italic leading-tight mb-3 outline-none border-b border-white/5 focus:border-white/20 transition-all"
            placeholder="NAMA JABATAN"
          />
        ) : (
          <h4 className="text-[10px] font-black text-white uppercase italic leading-tight mb-3 h-8 line-clamp-2">
            {item.jabatan}
          </h4>
        )}

        {/* SDM List Section */}
        <div className="bg-black/30 rounded-xl p-2 border border-white/5 space-y-2">
          {item.pegawai.map((p, idx) => (
            <div key={idx} className="flex items-center gap-2 group/user">
              <div
                className={`w-1 h-1 rounded-full shrink-0 ${style.bg}`}
              ></div>
              {isEditMode ? (
                <>
                  <select
                    value={p}
                    onChange={(e) => {
                      const newList = [...item.pegawai];
                      newList[idx] = e.target.value;
                      onUpdate(item.id, "pegawai", newList);
                    }}
                    className="w-full bg-transparent text-[10px] text-gray-300 font-medium outline-none cursor-pointer"
                  >
                    {listPegawai.map((pegawai) => (
                      <option
                        key={pegawai.id}
                        value={pegawai.id}
                        className="bg-[#151c21] text-white"
                      >
                        {pegawai.nama}
                      </option>
                    ))}
                  </select>
                  {item.pegawai.length > 1 && (
                    <button
                      onClick={() =>
                        onUpdate(
                          item.id,
                          "pegawai",
                          item.pegawai.filter((_, i) => i !== idx),
                        )
                      }
                      className="text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <HiOutlineX size={10} />
                    </button>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-gray-300 font-medium truncate">
                  {p}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Stats Footer Section */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
          <div className="flex gap-4 text-[8px] font-bold text-gray-500 uppercase">
            {/* Tooltip Wrapper Utility */}
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  .stat-tooltip { position: relative; }
                  .stat-tooltip .tooltip-text {
                    position: absolute; bottom: 130%; left: 50%; transform: translateX(-50%);
                    padding: 4px 8px; border-radius: 6px; background: #1a1a1e; border: 1px solid rgba(255,255,255,0.1);
                    color: white; font-size: 7px; white-space: nowrap; opacity: 0; pointer-events: none;
                    transition: all 0.2s ease; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                  }
                  .stat-tooltip:hover .tooltip-text { opacity: 1; bottom: 150%; }
                `,
              }}
            />

            {/* Field Kelas Jabatan (kJ) */}
            <div className="flex flex-col stat-tooltip cursor-help">
              <span className="text-[7px] opacity-60">kJ</span>
              {isEditMode ? (
                <input
                  type="number"
                  value={item.kJ || 0}
                  onChange={(e) =>
                    onUpdate(item.id, "kJ", parseInt(e.target.value) || 0)
                  }
                  className="w-7 bg-transparent text-amber-400 outline-none border-b border-transparent focus:border-white/10"
                />
              ) : (
                <span className="text-amber-400">{item.kJ || 0}</span>
              )}
              <div className="tooltip-text font-black italic">
                KELAS JABATAN
              </div>
            </div>

            {/* Field Bezetting (BEZ) */}
            <div className="flex flex-col stat-tooltip cursor-help">
              <span className="text-[7px] opacity-60">BEZ</span>
              {isEditMode ? (
                <input
                  type="number"
                  value={item.b}
                  onChange={(e) =>
                    onUpdate(item.id, "b", parseInt(e.target.value) || 0)
                  }
                  className="w-7 bg-transparent text-white outline-none border-b border-transparent focus:border-white/10"
                />
              ) : (
                <span className="text-white">{item.b}</span>
              )}
              <div className="tooltip-text font-black italic">
                JUMLAH PEGAWAI SAAT INI
              </div>
            </div>

            {/* Field ABK */}
            <div className="flex flex-col stat-tooltip cursor-help">
              <span className="text-[7px] opacity-60">ABK</span>
              {isEditMode ? (
                <input
                  type="number"
                  value={item.abk}
                  onChange={(e) =>
                    onUpdate(item.id, "abk", parseInt(e.target.value) || 0)
                  }
                  className="w-7 bg-transparent text-white outline-none border-b border-transparent focus:border-white/10"
                />
              ) : (
                <span className="text-white">{item.abk}</span>
              )}
              <div className="tooltip-text font-black italic">
                ANALISIS BEBAN KERJA
              </div>
            </div>
          </div>

          <div className="stat-tooltip cursor-help">
            <div
              className={`px-3 py-1 rounded-lg text-[10px] font-black transition-colors ${selisih < 0 ? "text-red-500 bg-red-500/10" : "text-emerald-500 bg-emerald-500/10"}`}
            >
              {selisih}
            </div>
            <div className="tooltip-text font-black italic">
              SELISIH (BEZ - ABK)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomNodeEditor;
