import { Briefcase, Calendar, GraduationCap, MapPin, User } from "lucide-react";

const jenjangPendidikan = [
  "SMA/SMK",
  "D3",
  "D4",
  "S1",
  "S2",
  "S3",
  "Spesialis",
];

const ModalAddPegawai = ({
  isModalOpen,
  closeModal,
  formData,
  setFormData,
  handleSubmit,
}) => {
  if (!isModalOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] backdrop-blur-md flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
      <div className="bg-[#1a1a1e]/95 border border-white/10 p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] rounded-[2.5rem] max-w-md w-full relative overflow-hidden transform animate-in fade-in zoom-in duration-300">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6d28d9]/20 blur-[60px] rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              {formData.id ? "Update" : "Registrasi"} Pegawai
              <span className="text-[#6d28d9]">.</span>
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Manajemen Profil & Jabatan
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                <User size={10} /> Nama Lengkap
              </label>
              <input
                autoFocus
                required
                type="text"
                placeholder="Nama & Gelar..."
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 font-medium transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                  <MapPin size={10} /> Kota Lahir
                </label>
                <input
                  required
                  type="text"
                  placeholder="Kota"
                  value={formData.tmptLahir}
                  onChange={(e) =>
                    setFormData({ ...formData, tmptLahir: e.target.value })
                  }
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                  <Calendar size={10} /> Tanggal
                </label>
                <input
                  required
                  type="date"
                  value={formData.tglLahir}
                  onChange={(e) =>
                    setFormData({ ...formData, tglLahir: e.target.value })
                  }
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#6d28d9]/50 [color-scheme:dark]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                  <GraduationCap size={10} /> Pendidikan
                </label>
                <select
                  required
                  value={formData.pendidikan}
                  onChange={(e) =>
                    setFormData({ ...formData, pendidikan: e.target.value })
                  }
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 appearance-none"
                >
                  <option value="">Jenjang</option>
                  {jenjangPendidikan.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest">
                  NIP
                </label>
                <input
                  required
                  type="text"
                  placeholder="19XXXXXXXX"
                  value={formData.nip}
                  onChange={(e) =>
                    setFormData({ ...formData, nip: e.target.value })
                  }
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 font-mono"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-[2] px-6 py-4 rounded-2xl bg-white text-[#1a1a1e] text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                {formData.id ? "Update Profil" : "Simpan Pegawai"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAddPegawai;
