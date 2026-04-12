"use client";
import React from "react";
import {
  AlertCircle,
  ChevronDown,
  FileText,
  History,
  Send,
  Shuffle,
  Upload,
  X,
  MessageSquare,
} from "lucide-react";

const FormPengajuanMutasi = ({
  daftarPegawai,
  daftarInstansi,
  handleFileChange,
  removeFile,
  formData,
  setFormData,
  handleSubmit,
  onCancelRevision,
}) => {
  return (
    <div className="h-full w-full grid grid-cols-12 gap-6 overflow-hidden">
      {/* KOLOM KIRI */}
      <div className="col-span-8 h-full min-h-0">
        <div className="bg-[#1a1a1e]/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#6d28d9]/10 rounded-2xl border border-[#6d28d9]/20 text-[#6d28d9]">
                <Shuffle size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">
                  {formData.isRevision
                    ? "Perbaikan Permohonan"
                    : "Formulir Permohonan"}
                </h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Pilih pegawai dan instansi tujuan
                </p>
              </div>
            </div>

            {/* BADGE & TOMBOL BATAL */}
            {formData.isRevision && (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2">
                  <AlertCircle size={14} className="text-amber-500" />
                  <span className="text-[9px] font-black text-amber-500 uppercase">
                    Revisi Aktif
                  </span>
                </div>
                <button
                  onClick={onCancelRevision}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-500 transition-all group"
                >
                  <X
                    size={14}
                    className="group-hover:rotate-90 transition-transform"
                  />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
            {formData.isRevision && formData.catatan && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2rem] p-6 shrink-0">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-500">
                    <MessageSquare size={18} />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[10px] font-black text-amber-500 uppercase mb-1">
                      Instruksi Admin:
                    </h5>
                    <p className="text-xs text-amber-100/80 italic">
                      "{formData.catatan}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 pb-4">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                  Nama Pegawai
                </label>
                <div className="relative">
                  <select
                    disabled={formData.isRevision}
                    value={formData.id_pegawai}
                    onChange={(e) =>
                      setFormData({ ...formData, id_pegawai: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-4 text-xs text-white appearance-none disabled:opacity-40 cursor-pointer focus:outline-none"
                  >
                    <option disabled value="">
                      -- Pilih Pegawai --
                    </option>
                    {daftarPegawai.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#1a1a1e]">
                        {p.nama} - {p.nip}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                  Instansi Tujuan
                </label>
                <div className="relative">
                  <select
                    value={formData.idInstansiTujuan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idInstansiTujuan: e.target.value,
                      })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-4 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-[#6d28d9]/50"
                  >
                    <option disabled value="">
                      -- Pilih Instansi Tujuan --
                    </option>
                    {daftarInstansi.map((i) => (
                      <option key={i.id} value={i.id} className="bg-[#1a1a1e]">
                        {i.namaOpd}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                  Alasan Perpindahan
                </label>
                <textarea
                  rows="5"
                  value={formData.alasan}
                  onChange={(e) =>
                    setFormData({ ...formData, alasan: e.target.value })
                  }
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-4 text-xs text-white resize-none focus:outline-none focus:border-[#6d28d9]/50"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KOLOM KANAN */}
      <div className="col-span-4 h-full min-h-0 flex flex-col">
        <div className="bg-[#1a1a1e]/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl h-full flex flex-col overflow-hidden">
          {formData.isRevision && (
            <div className="mb-6 shrink-0 bg-black/20 p-5 rounded-3xl border border-white/5">
              <h4 className="text-[10px] font-black text-amber-500 uppercase mb-4 flex items-center gap-2">
                <History size={14} /> Berkas Lama
              </h4>
              <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                {formData.existingFiles?.map((file, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 border rounded-2xl ${file.status_berkas === "revisi" ? "bg-red-500/10 border-red-500/30" : "bg-emerald-500/5 border-emerald-500/20 opacity-60"}`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <FileText
                        size={14}
                        className={
                          file.status_berkas === "revisi"
                            ? "text-red-500"
                            : "text-emerald-500"
                        }
                      />
                      <span
                        className={`text-[10px] truncate ${file.status_berkas === "revisi" ? "text-red-200" : "text-gray-400"}`}
                      >
                        {file.namaBerkas}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col min-h-0">
            {/* BAGIAN YANG DIUBAH: HEADER UPLOAD DENGAN INDIKATOR JUMLAH */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest">
                {formData.isRevision ? "Upload Pengganti" : "Dokumen (.PDF)"}
              </h4>
              {formData.isRevision && (
                <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
                  WAJIB:{" "}
                  {formData.existingFiles?.filter(
                    (f) => f.status_berkas === "revisi",
                  ).length || 0}{" "}
                  FILE
                </span>
              )}
            </div>

            <div className="relative group shrink-0 mb-4">
              <div className="flex flex-col items-center justify-center p-8 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[2rem] group-hover:border-[#6d28d9]/30 transition-all">
                <Upload
                  size={24}
                  className="text-gray-500 mb-2 group-hover:text-[#6d28d9]"
                />
                <span className="text-[9px] font-black text-gray-500 uppercase">
                  Pilih File
                </span>
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {formData.files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-[#6d28d9]/5 border border-[#6d28d9]/20 rounded-2xl animate-in zoom-in-95"
                >
                  <div className="flex items-center gap-3 truncate">
                    <FileText size={16} className="text-[#6d28d9]" />
                    <span className="text-[10px] font-bold text-white truncate">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-2 text-gray-600 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={formData.files.length === 0}
            className={`w-full mt-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] text-[10px] font-black ${formData.files.length > 0 ? "bg-[#6d28d9] text-white shadow-[#6d28d9]/20" : "bg-white/5 text-gray-600 opacity-50"}`}
          >
            {formData.isRevision ? "Kirim Perbaikan" : "Kirim Pengajuan"}{" "}
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default FormPengajuanMutasi;
