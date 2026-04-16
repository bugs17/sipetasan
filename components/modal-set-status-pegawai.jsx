"use client";
import { Calendar, IdCard, User, UserMinus, AlertTriangle } from "lucide-react";

const ModalSetStatusPegawai = ({
  isModalOpen,
  closeModal,
  formData,
  setFormData,
  handleSubmit,
}) => {
  if (!isModalOpen) return null;

  const status = ["meninggal", "pensiun dini", "pecat"];

  return (
    <div className="fixed inset-0 z-[999] backdrop-blur-md flex items-center justify-center p-4">
      {/* Overlay Gelap */}
      <div className="absolute inset-0 bg-black/60" onClick={closeModal} />

      {/* Container Modal - Aksen Rose (Merah) */}
      <div className="bg-[#1a1a1e]/95 border border-rose-500/20 p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] rounded-[2.5rem] max-w-md w-full relative overflow-hidden transform animate-in fade-in zoom-in duration-300">
        {/* Glow Merah Dekoratif */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              Hentikan Status Pegawai
              <span className="text-rose-500">!</span>
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Finalisasi Pengosongan Jabatan
            </p>
          </div>

          {/* WARNING BOX - Penanda Tindakan Berbahaya */}
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 flex gap-3 items-start">
            <AlertTriangle className="text-rose-500 shrink-0" size={18} />
            <div className="space-y-1">
              <p className="text-[10px] font-black text-rose-500 uppercase">
                Peringatan Penting
              </p>
              <p className="text-[9px] text-gray-400 font-medium leading-relaxed">
                Tindakan ini akan melepaskan pegawai dari struktur organisasi
                secara permanen.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Display Nama & NIP (Locked) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-500 uppercase ml-1 flex items-center gap-2">
                  <User size={10} /> Nama
                </label>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl py-2.5 px-4 text-[10px] text-gray-400 font-bold uppercase truncate">
                  {formData.nama || "-"}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-500 uppercase ml-1 flex items-center gap-2">
                  <IdCard size={10} /> NIP
                </label>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl py-2.5 px-4 text-[10px] text-gray-400 font-mono">
                  {formData.nip || "-"}
                </div>
              </div>
            </div>

            {/* Select Status */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                <UserMinus size={10} /> Alasan Keluar
              </label>
              <div className="relative group">
                <select
                  value={formData.status || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-rose-500/50 appearance-none transition-all cursor-pointer uppercase font-bold"
                >
                  <option disabled value="" className="bg-[#1a1a1e]">
                    -- Pilih Alasan --
                  </option>
                  {status.map((j, idx) => (
                    <option key={idx} value={j} className="bg-[#1a1a1e]">
                      {j.toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <UserMinus size={14} />
                </div>
              </div>
            </div>

            {/* Input Tanggal */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                <Calendar size={10} /> Tanggal Efektif
              </label>
              <input
                type="date"
                value={
                  formData.tanggalKeluar
                    ? new Date(formData.tanggalKeluar)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, tanggalKeluar: e.target.value })
                }
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:border-rose-500/50 [color-scheme:dark] transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="flex-[2] px-6 py-4 rounded-2xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 shadow-lg shadow-rose-600/20 transition-all active:scale-95"
              >
                Konfirmasi Keluar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSetStatusPegawai;
