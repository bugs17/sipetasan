"use client";

import { cn } from "@/app/lib/cd";
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
  listEselon,
  listFungsional,
  listPelaksana
}) => {

  const listKJ = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
  

  const style = colors[item.level] || colors[1];
  const displayB = Math.floor(item.b || 0);
  const displayABK = Math.floor(item.abk || 0);
  const selisih = displayB - displayABK;

  const types = ["struktural", "fungsional", "pelaksana"];

  const renderSelectionJenjangJabatan = () => {
  // 1. Kondisi STRUKTURAL
  if (item.jenisJabatan === "struktural") {
    return (
      <select
        value={item.eselonId}
        onChange={(e) => {
          const val = e.target.value === "" ? null : parseInt(e.target.value);
          onUpdate(item.id, "eselonId", val);
          onUpdate(item.id, "fungsionalId", null);
          onUpdate(item.id, "pelaksanaId", null);

        }}
        className="w-full mt-2 bg-white border text-black border-black text-[10px] font-bold py-1 px-2 rounded uppercase outline-none cursor-pointer"
      >
        {/* Gunakan ?. agar tidak error saat listEselon masih undefined */}
        {listEselon?.map((es) => (
          <option key={es.id} value={es.id}>
            {es.namaEselon}
          </option>
        ))}
      </select>
    );
  }

  // 2. Kondisi FUNGSIONAL
  if (item.jenisJabatan === "fungsional") {
    return (
      <select
        value={item.fungsionalId}
        onChange={(e) => {
          const val = e.target.value === "" ? null : parseInt(e.target.value);
          onUpdate(item.id, "fungsionalId", val);
          onUpdate(item.id, "eselonId", null);
          onUpdate(item.id, "pelaksanaId", null);

        }}
        className="w-full mt-2 bg-white border text-black border-black text-[10px] font-bold py-1 px-2 rounded uppercase outline-none cursor-pointer"
      >
        {listFungsional?.map((fun) => (
          <option key={fun.id} value={fun.id}>
            {fun.namaJenjang}
          </option>
        ))}
      </select>
    );
  }

  // 3. Kondisi PELAKSANA
  if (item.jenisJabatan === "pelaksana") {
    return (
      <select
        value={item.pelaksanaId} 
        onChange={(e) => {
           const val = e.target.value === "" ? null : parseInt(e.target.value);
          onUpdate(item.id, "fungsionalId", null);
          onUpdate(item.id, "eselonId", null);
          onUpdate(item.id, "pelaksanaId", val);
        }}
        className="w-full mt-2 bg-white border text-black border-black text-[10px] font-bold py-1 px-2 rounded uppercase outline-none cursor-pointer"
      >
        {listPelaksana?.map((pel) => (
          <option key={pel.id} value={pel.id}>
            {pel.namaJenjang}
          </option>
        ))}
      </select>
    );
  }

  // 4. Default Fallback
  return <div className="text-[10px] opacity-50 mt-2">Pilih Jenis...</div>;
};

  return (
    <div className="inline-block p-4 relative group">

      <div className={cn(
        "min-w-[400px] border-2 border-black flex text-left shadow-2xl rounded-lg bg-white", // Base
        item.jenisJabatan === "fungsional" && "bg-orange-200", // Override jika fungsional
        item.jenisJabatan === "pelaksana" && "bg-blue-200"  // Override jika pelaksana
      )}>

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

      

        {/* LEFT */}
        <div className="flex flex-col w-1/2 border-r-2 border-black min-w-0">
          {/* TOP */}
          <div className="flex justify-center items-center p-4 border-b-2 border-black">
            {isEditMode ? (
              <div className="flex flex-col w-full gap-1">
              <input
                type="text"
                value={item.jabatan}
                onChange={(e) => onUpdate(item.id, "jabatan", e.target.value)}
                className="w-full min-w-0 bg-transparent font-bold text-center text-black uppercase leading-tight outline-none overflow-wrap break-word text-ellipsis"
                placeholder="NAMA JABATAN"
              />
              <div className="grid grid-cols-2 gap-2 justify-center w-full mt-1">
                <select
                value={item.jenisJabatan}
                onChange={(e) => {
                  const newVal = e.target.value;
                  onUpdate(item.id, "jenisJabatan", newVal);
                }}
                className="w-full mt-2 bg-white border text-black border-black text-[10px] font-bold py-1 px-2 rounded uppercase outline-none cursor-pointer"
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t.toLowerCase()}
                  </option>
                ))}
              </select>


                {renderSelectionJenjangJabatan()}

              </div>
              </div>
            ) : (
              <span className="font-bold text-black">{item.jabatan}</span>
            )}
          </div>
            {isEditMode && (
              <button
                onClick={() =>
                  onUpdate(item.id, "pegawai", [
                    ...item.pegawai,
                    "Belum Terisi",
                  ])
                }
                className="text-[9px] font-black text-emerald-400 hover:text-emerald-600 self-end mt-2 mr-2 transition-colors flex items-center gap-1"
              >
                <HiOutlineUserAdd size={12} /> ADD SDM
              </button>
            )}
          {/* BOTTOM (flex-grow biar ngikut tinggi kanan) */}
          <div className="flex flex-col p-4 gap-2 flex-grow">
            {item.pegawai.map((p, idx) => {
              const findPegawai = listPegawai.find((pg) => pg.id == p);
              const labelTampil = findPegawai
                ? findPegawai.nama
                : "Belum Terisi";
              const nipTampil = findPegawai ? findPegawai.nip : "-";

              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 border-b border-black/5 last:border-0 pb-4 last:pb-0 group/user"
                >
                  
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
                          className="flex-1 bg-transparent text-[12px] text-black font-bold outline-none cursor-pointer"
                        >
                          <option value="Belum Terisi">Belum Terisi</option>
                          {listPegawai.map((pegawai) => (
                            <option
                              key={pegawai.id}
                              value={pegawai.id}
                              className="bg-white text-black"
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
                      <span className="text-[13px] text-black font-bold leading-tight uppercase block">
                        {labelTampil}
                      </span>
                    )}
                    {findPegawai && (
                      <span className="text-[10px] text-black font-mono block mt-1 uppercase tracking-tighter opacity-60">
                        NIP. {nipTampil}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col w-1/2 ">
          {/* HEADER */}
          <div className="grid grid-cols-4">
            {["KJ", "B", "ABK", "-/+"].map((item, i) => (
              <div
                  key={i}
                  className={`flex justify-center items-center p-2 font-bold border-b-2 border-black text-black whitespace-nowrap ${ // 1. Ubah p-4 jadi p-2, 2. Tambah whitespace-nowrap
                    i !== 3 ? "border-r-2 border-black " : ""
                  }`}
                >
                {item}
              </div>

            ))}
          </div>

          {/* VALUE (flex-grow biar selalu stretch) */}
          <div className="grid grid-cols-4 flex-grow">
            {[
              {
                label: "kJ",
                val: item.kJ,
                edit: true,
              },
              {
                label: "B",
                val: displayB,
                edit: false,
              },
              {
                label: "ABK",
                val: displayABK,
                edit: false,
              },
              {
                label: "Selisih",
                val: selisih,
                edit: false,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`flex justify-center items-center p-4 text-black ${
                  i !== 3 ? "border-r-2 border-black " : ""
                }`}
              >
                {isEditMode && stat.edit ? (
                    // <input
                    //   type="number"
                    //   value={stat.val || 0}
                    //   onChange={(e) =>
                    //     onUpdate(item.id, "kJ", parseInt(e.target.value) || 0)
                    //   }
                    //   className="w-full min-w-0 bg-transparent text-black font-black text-center outline-none appearance-none"
                    // />
                    <select
                      value={stat.val || 1}
                      onChange={(e) => {
                        onUpdate(item.id, "kJ", parseInt(e.target.value) || 1);
                      }}
                      className="mt-2 bg-white border text-black border-black text-[10px] font-bold py-1 px-2 rounded uppercase outline-none cursor-pointer"
                    >
                      {listKJ.map((kj,idx) => (
                        <option key={idx} value={kj}>
                          {kj}
                        </option>
                      ))}
                    </select>
                  ) : (
                      stat.val || 1
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomNodeEditor;

// const CustomNodeEditor = ({
//   item,
//   onUpdate,
//   onAdd,
//   onDeleteConfirm,
//   isEditMode,
//   listPegawai,
// }) => {
//   const style = colors[item.level] || colors[1];
//   const displayB = Math.floor(item.b || 0);
//   const displayABK = Math.floor(item.abk || 0);
//   const selisih = displayB - displayABK;

//   return (
//     <div className="inline-block p-4 relative group">
//       <div
//         className={`min-w-[400px] w-max h-auto bg-[#151c21] border-2 ${style.border} rounded-[2rem] p-7 text-left shadow-2xl transition-all`}
//       >
//         {/* Action Buttons */}
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

//         {/* --- HEADER: JUDUL JABATAN & STATS --- */}
//         <div className="flex items-center justify-between gap-16 mb-6 pb-6 border-b border-white/5">
//           {/* Sisi Kiri: Jabatan (Memaksa Node Melebar ke Kanan) */}
//           <div className="flex flex-col shrink-0">
//             <span
//               className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-white/5 border border-white/10 ${style.text} mb-2 w-fit`}
//             >
//               LVL {item.level}
//             </span>
//             {isEditMode ? (
//               <input
//                 type="text"
//                 value={item.jabatan}
//                 onChange={(e) => onUpdate(item.id, "jabatan", e.target.value)}
//                 className="bg-transparent text-[15px] font-black text-white uppercase italic leading-tight outline-none border-b border-white/5 focus:border-indigo-500/50 transition-all whitespace-nowrap min-w-[250px]"
//                 placeholder="NAMA JABATAN"
//               />
//             ) : (
//               <h3 className="text-[15px] font-black text-white uppercase italic leading-tight tracking-tighter whitespace-nowrap">
//                 {item.jabatan}
//               </h3>
//             )}
//           </div>

//           {/* STATS BAR WITH TOOLTIPS */}
//           <div className="flex gap-2 shrink-0">
//             {[
//               {
//                 label: "kJ",
//                 val: item.kJ,
//                 color: "text-amber-400",
//                 bg: "bg-amber-500/5",
//                 edit: true,
//                 tip: "Kelas Jabatan",
//               },
//               {
//                 label: "B",
//                 val: displayB,
//                 color: "text-white",
//                 bg: "bg-white/5",
//                 edit: false,
//                 tip: "Bezetting (Jumlah Pegawai)",
//               },
//               {
//                 label: "ABK",
//                 val: displayABK,
//                 color: "text-white",
//                 bg: "bg-white/5",
//                 edit: false,
//                 tip: "Analisis Beban Kerja",
//               },
//             ].map((stat) => (
//               <div
//                 key={stat.label}
//                 className="flex flex-col items-center relative group/tip"
//               >
//                 {/* TOOLTIP */}
//                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-white/10 rounded text-[8px] font-bold text-white whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
//                   {stat.tip}
//                 </div>

//                 <span className="text-[7px] font-black text-gray-600 uppercase mb-1">
//                   {stat.label}
//                 </span>
//                 <div
//                   className={`w-10 h-8 flex items-center justify-center rounded-xl border border-white/10 ${stat.bg}`}
//                 >
//                   {isEditMode && stat.edit ? (
//                     <input
//                       type="number"
//                       value={stat.val || 0}
//                       onChange={(e) =>
//                         onUpdate(item.id, "kJ", parseInt(e.target.value) || 0)
//                       }
//                       className="w-full bg-transparent text-amber-400 text-[11px] font-black text-center outline-none"
//                     />
//                   ) : (
//                     <span className={`${stat.color} text-[11px] font-black`}>
//                       {stat.val || 0}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}

//             {/* +/- SECTION */}
//             <div className="flex flex-col items-center relative group/tip">
//               <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-white/10 rounded text-[8px] font-bold text-white whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
//                 Selisih (B - ABK)
//               </div>
//               <span className="text-[7px] font-black text-gray-600 uppercase mb-1">
//                 +/-
//               </span>
//               <div
//                 className={`w-10 h-8 flex items-center justify-center rounded-xl border font-black text-[11px] transition-all ${
//                   selisih === 0
//                     ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/20"
//                     : "text-red-500 bg-red-500/5 border-red-500/20"
//                 }`}
//               >
//                 {selisih > 0 ? `+${selisih}` : selisih}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* --- BODY: DAFTAR SDM (BERTAMBAH TINGGI OTOMATIS) --- */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-between px-1">
//             <div className="flex items-center gap-2">
//               <div
//                 className={`w-1 h-3 rounded-full ${style.bg} opacity-50`}
//               ></div>
//               <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
//                 Pegawai
//               </span>
//             </div>
//             {isEditMode && (
//               <button
//                 onClick={() =>
//                   onUpdate(item.id, "pegawai", [
//                     ...item.pegawai,
//                     "Belum Terisi",
//                   ])
//                 }
//                 className="text-[9px] font-black text-indigo-400 hover:text-white transition-colors flex items-center gap-1"
//               >
//                 <HiOutlineUserAdd size={12} /> ADD SDM
//               </button>
//             )}
//           </div>

//           {/* Menggunakan h-auto agar node memanjang ke bawah saat item ditambah */}
//           <div className="bg-black/30 rounded-[1.5rem] p-4 border border-white/5 space-y-4 h-auto">
//             {item.pegawai.map((p, idx) => {
//               const findPegawai = listPegawai.find((pg) => pg.id == p);
//               const labelTampil = findPegawai
//                 ? findPegawai.nama
//                 : "Belum Terisi";
//               const nipTampil = findPegawai ? findPegawai.nip : "-";

//               return (
//                 <div
//                   key={idx}
//                   className="flex items-start gap-4 border-b border-white/5 last:border-0 pb-4 last:pb-0 group/user"
//                 >
//                   <div
//                     className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${style.bg} shadow-[0_0_10px] shadow-${style.hex}/30`}
//                   ></div>
//                   <div className="flex-1 min-w-0">
//                     {isEditMode ? (
//                       <div className="flex items-center gap-2">
//                         <select
//                           value={p}
//                           onChange={(e) => {
//                             const val = e.target.value;
//                             const newList = [...item.pegawai];
//                             newList[idx] =
//                               val === "Belum Terisi" ? val : parseInt(val);
//                             onUpdate(item.id, "pegawai", newList);
//                           }}
//                           className="flex-1 bg-transparent text-[12px] text-gray-200 font-bold outline-none cursor-pointer"
//                         >
//                           <option value="Belum Terisi">Belum Terisi</option>
//                           {listPegawai.map((pegawai) => (
//                             <option
//                               key={pegawai.id}
//                               value={pegawai.id}
//                               className="bg-[#151c21] text-white"
//                             >
//                               {pegawai.nama}
//                             </option>
//                           ))}
//                         </select>
//                         {item.pegawai.length > 1 && (
//                           <button
//                             onClick={() =>
//                               onUpdate(
//                                 item.id,
//                                 "pegawai",
//                                 item.pegawai.filter((_, i) => i !== idx),
//                               )
//                             }
//                             className="text-gray-600 hover:text-red-500 transition-colors"
//                           >
//                             <HiOutlineX size={14} />
//                           </button>
//                         )}
//                       </div>
//                     ) : (
//                       <span className="text-[13px] text-white font-bold leading-tight uppercase block">
//                         {labelTampil}
//                       </span>
//                     )}
//                     {findPegawai && (
//                       <span className="text-[10px] text-gray-500 font-mono block mt-1 uppercase tracking-tighter opacity-60">
//                         NIP. {nipTampil}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
