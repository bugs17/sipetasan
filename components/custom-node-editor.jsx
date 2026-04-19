// "use client";

// import {
//   HiOutlinePlus,
//   HiOutlineTrash,
//   HiOutlineUserAdd,
//   HiOutlineX,
// } from "react-icons/hi";

// const colors = {
//   1: {
//     border: "border-blue-500",
//     text: "text-blue-500",
//     bg: "bg-blue-500",
//     hex: "#3b82f6",
//   },
//   2: {
//     border: "border-emerald-500",
//     text: "text-emerald-500",
//     bg: "bg-emerald-500",
//     hex: "#10b981",
//   },
//   3: {
//     border: "border-amber-500",
//     text: "text-amber-500",
//     bg: "bg-amber-500",
//     hex: "#f59e0b",
//   },
//   4: {
//     border: "border-rose-500",
//     text: "text-rose-500",
//     bg: "bg-rose-500",
//     hex: "#f43f5e",
//   },
//   5: {
//     border: "border-sky-500",
//     text: "text-sky-500",
//     bg: "bg-sky-500",
//     hex: "#0ea5e9",
//   },
//   6: {
//     border: "border-indigo-500",
//     text: "text-indigo-500",
//     bg: "bg-indigo-500",
//     hex: "#6366f1",
//   },
// };

// const CustomNodeEditor = ({
//   item,
//   onUpdate,
//   onAdd,
//   onDeleteConfirm,
//   isEditMode,
//   listPegawai,
// }) => {
//   const style = colors[item.level] || colors[1];
//   const selisih = (item.b || 0) - (item.abk || 0);

//   return (
//     <div className="inline-block p-4 relative group">
//       <div
//         className={`w-[280px] bg-[#151c21] border-2 ${style.border} rounded-[1.5rem] p-5 text-left shadow-2xl transition-all`}
//       >
//         {isEditMode && (
//           <div className="absolute -top-1 -right-1 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
//             {item.id !== "root-1" && (
//               <button
//                 onClick={() => onDeleteConfirm(item.id, item.jabatan)}
//                 className="p-2 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all shadow-red-500/20"
//               >
//                 <HiOutlineTrash size={12} />
//               </button>
//             )}
//             <button
//               onClick={() => onAdd(item.id)}
//               className="p-2 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-all shadow-emerald-500/20"
//             >
//               <HiOutlinePlus size={12} />
//             </button>
//           </div>
//         )}

//         {/* Header */}
//         {isEditMode ? (
//           <div className="flex justify-between items-center mb-3">
//             <span
//               className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10 ${style.text}`}
//             >
//               LVL {item.level}
//             </span>
//             <button
//               onClick={() =>
//                 onUpdate(item.id, "pegawai", [...item.pegawai, "Belum Terisi"])
//               }
//               className="text-[8px] font-bold text-gray-400 hover:text-white bg-white/5 px-2 py-1 rounded-md border border-white/5 flex items-center gap-1 transition-colors"
//             >
//               <HiOutlineUserAdd size={10} /> TAMBAH SDM
//             </button>
//           </div>
//         ) : (
//           <div className="mt-1"></div>
//         )}

//         {/* Jabatan Section */}
//         {isEditMode ? (
//           <input
//             type="text"
//             value={item.jabatan}
//             onChange={(e) => onUpdate(item.id, "jabatan", e.target.value)}
//             className="w-full bg-transparent text-[10px] font-black text-white uppercase italic leading-tight mb-3 outline-none border-b border-white/5 focus:border-white/20 transition-all"
//             placeholder="NAMA JABATAN"
//           />
//         ) : (
//           <div className="mb-4 group/title">
//             <h3 className="text-[14px] font-black text-white uppercase italic leading-tight min-h-[20px] tracking-tight decoration-indigo-500/50 group-hover/title:text-indigo-400 transition-colors">
//               {item.jabatan}
//             </h3>
//             <div
//               className={`h-1 w-12 rounded-full ${style.bg} opacity-50`}
//             ></div>
//           </div>
//         )}

//         {/* SDM List Section */}
//         <div className="bg-black/30 rounded-xl p-3 border border-white/5 space-y-3">
//           {item.pegawai.map((p, idx) => {
//             // LOGIK: Cari data lengkap pegawai berdasarkan ID
//             const findPegawai = listPegawai.find((pg) => pg.id == p);
//             const labelTampil = findPegawai ? findPegawai.nama : "Belum Terisi";
//             const nipTampil = findPegawai ? findPegawai.nip : "-";

//             return (
//               <div key={idx} className="flex items-start gap-3 group/user">
//                 {/* Dot indikator - kita buat sedikit lebih besar dan ada margin-top agar sejajar baris pertama */}
//                 <div
//                   className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${style.bg}`}
//                 ></div>

//                 {isEditMode ? (
//                   <div className="flex-1 flex flex-col gap-1">
//                     <select
//                       value={p}
//                       onChange={(e) => {
//                         const val = e.target.value;
//                         const newList = [...item.pegawai];
//                         newList[idx] =
//                           val === "Belum Terisi" ? val : parseInt(val);
//                         onUpdate(item.id, "pegawai", newList);
//                       }}
//                       className="w-full bg-transparent text-[12px] text-gray-200 font-semibold outline-none cursor-pointer"
//                     >
//                       <option value="Belum Terisi">Belum Terisi</option>
//                       {listPegawai.map((pegawai) => (
//                         <option
//                           key={pegawai.id}
//                           value={pegawai.id}
//                           className="bg-[#151c21] text-white"
//                         >
//                           {pegawai.nama}
//                         </option>
//                       ))}
//                     </select>
//                     {/* Tampilkan NIP kecil di bawah select saat edit untuk referensi */}
//                     {findPegawai && (
//                       <span className="text-[9px] text-gray-500 font-mono">
//                         NIP. {nipTampil}
//                       </span>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex flex-col min-w-0">
//                     {/* Nama Pegawai - Lebih besar dan Putih Terang */}
//                     <span className="text-[12px] text-white font-bold leading-tight uppercase tracking-tight break-words">
//                       {labelTampil}
//                     </span>
//                     {/* NIP - Font Mono agar terlihat formal/sistem */}
//                     {findPegawai && (
//                       <span className="text-[10px] text-gray-400 font-mono mt-0.5 tracking-wider">
//                         NIP. {nipTampil}
//                       </span>
//                     )}
//                   </div>
//                 )}

//                 {isEditMode && item.pegawai.length > 1 && (
//                   <button
//                     onClick={() =>
//                       onUpdate(
//                         item.id,
//                         "pegawai",
//                         item.pegawai.filter((_, i) => i !== idx),
//                       )
//                     }
//                     className="text-gray-600 hover:text-red-500 transition-colors shrink-0"
//                   >
//                     <HiOutlineX size={12} />
//                   </button>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Stats Footer Section */}
//         {/* Stats Footer Section */}
//         <div className="mt-6 pt-4 border-t border-white/10">
//           <style
//             dangerouslySetInnerHTML={{
//               __html: `
//       .stat-tooltip { position: relative; }
//       .stat-tooltip .tooltip-text {
//         position: absolute;
//         /* Turunkan nilai bottom ini */
//         bottom: 110%;
//         left: 50%;
//         transform: translateX(-50%);
//         padding: 5px 8px;
//         border-radius: 6px;
//         background: #1a1a1e;
//         border: 1px solid rgba(255,255,255,0.1);
//         color: white;
//         font-size: 7px;
//         white-space: nowrap;
//         opacity: 0;
//         pointer-events: none;
//         transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
//         z-index: 100;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.5);
//       }
//       /* Posisi saat hover dibuat tidak terlalu jauh loncatnya */
//       .stat-tooltip:hover .tooltip-text {
//         opacity: 1;
//         bottom: 125%;
//       }
//     `,
//             }}
//           />

//           {/* Gunakan Grid 4 Kolom agar lebarnya konsisten & tidak berantakan saat edit */}
//           <div className="grid grid-cols-4 gap-2 items-end">
//             {/* kJ Section */}
//             <div className="flex flex-col items-center stat-tooltip cursor-help">
//               <span className="text-[8px] font-black text-gray-500 mb-1 uppercase">
//                 kJ
//               </span>
//               <div className="w-full bg-amber-500/10 border border-amber-500/20 py-1.5 rounded-xl flex justify-center">
//                 {isEditMode ? (
//                   <input
//                     type="number"
//                     value={item.kJ || 0}
//                     onChange={(e) =>
//                       onUpdate(item.id, "kJ", parseInt(e.target.value) || 0)
//                     }
//                     className="w-full bg-transparent text-amber-400 text-[11px] font-black outline-none text-center appearance-none"
//                   />
//                 ) : (
//                   <span className="text-amber-400 text-[11px] font-black">
//                     {item.kJ || 0}
//                   </span>
//                 )}
//               </div>
//               <div className="tooltip-text font-black italic">
//                 KELAS JABATAN
//               </div>
//             </div>

//             {/* BEZ Section */}
//             <div className="flex flex-col items-center stat-tooltip cursor-help">
//               <span className="text-[8px] font-black text-gray-500 mb-1 uppercase">
//                 BEZ
//               </span>
//               <div className="w-full bg-white/5 border border-white/10 py-1.5 rounded-xl flex justify-center">
//                 <span className="text-white text-[11px] font-black">
//                   {item.b}
//                 </span>
//               </div>
//               <div className="tooltip-text font-black italic">BEZETTING</div>
//             </div>

//             {/* ABK Section */}
//             <div className="flex flex-col items-center stat-tooltip cursor-help">
//               <span className="text-[8px] font-black text-gray-500 mb-1 uppercase">
//                 ABK
//               </span>
//               <div className="w-full bg-white/5 border border-white/10 py-1.5 rounded-xl flex justify-center">
//                 <span className="text-white text-[11px] font-black">
//                   {item.abk}
//                 </span>
//               </div>
//               <div className="tooltip-text font-black italic">
//                 ANALISIS BEBAN KERJA
//               </div>
//             </div>

//             {/* Selisih Section */}
//             <div className="flex flex-col items-center stat-tooltip cursor-help">
//               <span className="text-[8px] font-black text-gray-500 mb-1 uppercase">
//                 +/-
//               </span>
//               <div
//                 className={`w-full py-1.5 rounded-xl text-[11px] font-black text-center transition-all ${
//                   selisih < 0
//                     ? "text-red-500 bg-red-500/10 border border-red-500/20"
//                     : "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20"
//                 }`}
//               >
//                 {selisih > 0 ? `+${selisih}` : selisih}
//               </div>
//               <div className="tooltip-text font-black italic">
//                 SELISIH (BEZ - ABK)
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomNodeEditor;
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
  const displayB = Math.floor(item.b || 0);
  const displayABK = Math.floor(item.abk || 0);
  const selisih = displayB - displayABK;

  return (
    <div className="inline-block p-4 relative group">
      {/* - min-w-[400px]: Lebar minimal agar tidak kekecilan
          - w-max: Melebar mengikuti konten (Nama Jabatan)
          - h-auto: Tinggi otomatis mengikuti list pegawai 
      */}
      <div
        className={`min-w-[400px] w-max h-auto bg-[#151c21] border-2 ${style.border} rounded-[2rem] p-7 text-left shadow-2xl transition-all`}
      >
        {/* Action Buttons */}
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

        {/* --- HEADER: JUDUL JABATAN & STATS --- */}
        <div className="flex items-center justify-between gap-16 mb-6 pb-6 border-b border-white/5">
          {/* Sisi Kiri: Jabatan (Memaksa Node Melebar ke Kanan) */}
          <div className="flex flex-col shrink-0">
            <span
              className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-white/5 border border-white/10 ${style.text} mb-2 w-fit`}
            >
              LVL {item.level}
            </span>
            {isEditMode ? (
              <input
                type="text"
                value={item.jabatan}
                onChange={(e) => onUpdate(item.id, "jabatan", e.target.value)}
                className="bg-transparent text-[15px] font-black text-white uppercase italic leading-tight outline-none border-b border-white/5 focus:border-indigo-500/50 transition-all whitespace-nowrap min-w-[250px]"
                placeholder="NAMA JABATAN"
              />
            ) : (
              <h3 className="text-[15px] font-black text-white uppercase italic leading-tight tracking-tighter whitespace-nowrap">
                {item.jabatan}
              </h3>
            )}
          </div>

          {/* STATS BAR WITH TOOLTIPS */}
          <div className="flex gap-2 shrink-0">
            {[
              {
                label: "kJ",
                val: item.kJ,
                color: "text-amber-400",
                bg: "bg-amber-500/5",
                edit: true,
                tip: "Kelas Jabatan",
              },
              {
                label: "B",
                val: displayB,
                color: "text-white",
                bg: "bg-white/5",
                edit: false,
                tip: "Bezetting (Jumlah Pegawai)",
              },
              {
                label: "ABK",
                val: displayABK,
                color: "text-white",
                bg: "bg-white/5",
                edit: false,
                tip: "Analisis Beban Kerja",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center relative group/tip"
              >
                {/* TOOLTIP */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-white/10 rounded text-[8px] font-bold text-white whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                  {stat.tip}
                </div>

                <span className="text-[7px] font-black text-gray-600 uppercase mb-1">
                  {stat.label}
                </span>
                <div
                  className={`w-10 h-8 flex items-center justify-center rounded-xl border border-white/10 ${stat.bg}`}
                >
                  {isEditMode && stat.edit ? (
                    <input
                      type="number"
                      value={stat.val || 0}
                      onChange={(e) =>
                        onUpdate(item.id, "kJ", parseInt(e.target.value) || 0)
                      }
                      className="w-full bg-transparent text-amber-400 text-[11px] font-black text-center outline-none"
                    />
                  ) : (
                    <span className={`${stat.color} text-[11px] font-black`}>
                      {stat.val || 0}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* +/- SECTION */}
            <div className="flex flex-col items-center relative group/tip">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-white/10 rounded text-[8px] font-bold text-white whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                Selisih (B - ABK)
              </div>
              <span className="text-[7px] font-black text-gray-600 uppercase mb-1">
                +/-
              </span>
              <div
                className={`w-10 h-8 flex items-center justify-center rounded-xl border font-black text-[11px] transition-all ${
                  selisih === 0
                    ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/20"
                    : "text-red-500 bg-red-500/5 border-red-500/20"
                }`}
              >
                {selisih > 0 ? `+${selisih}` : selisih}
              </div>
            </div>
          </div>
        </div>

        {/* --- BODY: DAFTAR SDM (BERTAMBAH TINGGI OTOMATIS) --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-1 h-3 rounded-full ${style.bg} opacity-50`}
              ></div>
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                Pegawai
              </span>
            </div>
            {isEditMode && (
              <button
                onClick={() =>
                  onUpdate(item.id, "pegawai", [
                    ...item.pegawai,
                    "Belum Terisi",
                  ])
                }
                className="text-[9px] font-black text-indigo-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <HiOutlineUserAdd size={12} /> ADD SDM
              </button>
            )}
          </div>

          {/* Menggunakan h-auto agar node memanjang ke bawah saat item ditambah */}
          <div className="bg-black/30 rounded-[1.5rem] p-4 border border-white/5 space-y-4 h-auto">
            {item.pegawai.map((p, idx) => {
              const findPegawai = listPegawai.find((pg) => pg.id == p);
              const labelTampil = findPegawai
                ? findPegawai.nama
                : "Belum Terisi";
              const nipTampil = findPegawai ? findPegawai.nip : "-";

              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 border-b border-white/5 last:border-0 pb-4 last:pb-0 group/user"
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${style.bg} shadow-[0_0_10px] shadow-${style.hex}/30`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    {isEditMode ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={p}
                          onChange={(e) => {
                            const val = e.target.value;
                            const newList = [...item.pegawai];
                            newList[idx] =
                              val === "Belum Terisi" ? val : parseInt(val);
                            onUpdate(item.id, "pegawai", newList);
                          }}
                          className="flex-1 bg-transparent text-[12px] text-gray-200 font-bold outline-none cursor-pointer"
                        >
                          <option value="Belum Terisi">Belum Terisi</option>
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
                            <HiOutlineX size={14} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-[13px] text-white font-bold leading-tight uppercase block">
                        {labelTampil}
                      </span>
                    )}
                    {findPegawai && (
                      <span className="text-[10px] text-gray-500 font-mono block mt-1 uppercase tracking-tighter opacity-60">
                        NIP. {nipTampil}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomNodeEditor;
