"use client";
import {
  Briefcase,
  Building2,
  Calendar,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import { useState } from "react";

const ModalAddUser = ({
  isModalOpen,
  closeModal,
  instansi,
  formData,
  setFormData,
  handleSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  if (!isModalOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] backdrop-blur-md flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
      <div className="bg-[#1a1a1e]/95 border border-white/10 p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] rounded-[2.5rem] max-w-md w-full relative overflow-hidden transform animate-in fade-in zoom-in duration-300">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6d28d9]/20 blur-[60px] rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              {formData.id ? "Update" : "Registrasi"} User
              <span className="text-[#6d28d9]">.</span>
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Manajemen User
            </p>
          </div>
          <div className="space-y-4">
            {/* nama user */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                <User size={10} /> Nama User
              </label>
              <input
                autoFocus
                type="text"
                placeholder="Nama user"
                value={formData.nama_user || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nama_user: e.target.value })
                }
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 font-medium transition-all"
              />
            </div>

            {/* email */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                <Mail size={10} /> Email
              </label>
              <input
                type="email"
                placeholder="example@mail.com"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 font-medium transition-all"
              />
            </div>

            {/* password */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                <Lock size={10} /> Password {"Min 8 karakter"}
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password || ""}
                  placeholder="Minimal 8 karakter"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 pr-10 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 font-medium transition-all"
                />

                {/* toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* instansi */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                <Building2 size={10} /> Instansi
              </label>
              <select
                value={formData.opdId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, opdId: e.target.value })
                }
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 appearance-none"
              >
                <option value={null}>--Instansi--</option>
                {instansi.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.namaOpd}
                  </option>
                ))}
              </select>
            </div>

            {/* button */}
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
                className="flex-[2] px-6 py-4 rounded-2xl bg-white text-[#1a1a1e] text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                {formData.id ? "Update Profil" : "Simpan Pegawai"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAddUser;
