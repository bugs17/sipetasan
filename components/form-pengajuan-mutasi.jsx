"use client";

import {
  AlertCircle,
  ChevronDown,
  FileText,
  Send,
  Shuffle,
  Upload,
  X,
} from "lucide-react";

const FormPengajuanMutasi = ({
  daftarPegawai,
  daftarInstansi,
  handleFileChange,
  removeFile,
  formData,
  setFormData,
  handleSubmit,
}) => {
  return (
    <div className="h-full w-full grid grid-cols-12 gap-6 overflow-hidden">
      {/* KOLOM KIRI (FORM) */}
      <div className="col-span-8 h-full min-h-0">
        <div className="bg-[#1a1a1e]/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl h-full flex flex-col overflow-hidden">
          <div className="flex items-center gap-4 mb-8 shrink-0">
            <div className="p-3 bg-[#6d28d9]/10 rounded-2xl border border-[#6d28d9]/20 text-[#6d28d9]">
              <Shuffle size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                Formulir Permohonan
              </h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Data ini akan diverifikasi oleh Admin Induk
              </p>
            </div>
          </div>

          {/* Scrollable area untuk form jika layar kecil */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-2 gap-6 content-start">
              {/* select pegawai */}
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                  Pegawai Yang Akan Mutasi
                </label>
                <div className="relative">
                  <select
                    value={formData.id_pegawai}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        id_pegawai: e.target.value,
                      });
                    }}
                    className="w-full uppercase bg-white/[0.03] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none appearance-none cursor-pointer"
                  >
                    <option
                      disabled
                      value=""
                      className="bg-[#1a1a1e] text-gray-600"
                    >
                      -- Pilih Pegawai --
                    </option>
                    {daftarPegawai.length > 0 &&
                      daftarPegawai.map((pegawai, idx) => (
                        <option
                          key={pegawai.id}
                          value={pegawai.id}
                          className="bg-[#1a1a1e]"
                        >
                          {pegawai.nama}
                        </option>
                      ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>

              {/* select instansi */}
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
                    className="w-full bg-white/[0.03] uppercase border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none appearance-none cursor-pointer"
                  >
                    <option disabled value="" className="bg-[#1a1a1e]">
                      -- Pilih Instansi Tujuan --
                    </option>
                    {daftarInstansi.length > 0 &&
                      daftarInstansi.map((instansi, idx) => (
                        <option
                          key={instansi.id}
                          value={instansi.id}
                          className="bg-[#1a1a1e] "
                        >
                          {instansi.namaOpd}
                        </option>
                      ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>

              {/* text area : alasan */}
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                  Alasan Perpindahan
                </label>
                <textarea
                  rows="4"
                  value={formData.alasan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      alasan: e.target.value,
                    })
                  }
                  placeholder="Jelaskan alasan mutasi..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KOLOM KANAN (UPLOAD) */}
      <div className="col-span-4 h-full min-h-0">
        <div className="bg-[#1a1a1e]/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl h-full flex flex-col overflow-hidden">
          <div className="shrink-0 mb-6">
            <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-3">
              Persyaratan Dokumen
            </h4>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 flex gap-3 items-start">
              <AlertCircle
                size={16}
                className="text-blue-400 shrink-0 mt-0.5"
              />
              <p className="text-[10px] text-blue-200/70 leading-relaxed font-medium">
                <span className="text-blue-400 font-black uppercase">
                  Penting:
                </span>{" "}
                Gunakan format <span className="text-white">.pdf</span>.
              </p>
            </div>
          </div>

          {/* Bagian ini akan dipaksa scroll jika file banyak karena flex-1 & min-h-0 */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="relative group shrink-0 mb-3">
              <div className="flex flex-col items-center justify-center p-8 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[2rem] group-hover:bg-white/[0.04] transition-all cursor-pointer">
                <Upload
                  size={24}
                  className="text-gray-500 mb-2 group-hover:text-[#6d28d9]"
                />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">
                  Klik atau Taruh File PDF
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
              {formData?.files?.map((file, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl shrink-0 animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-red-500" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-[10px] font-bold text-white truncate">
                        {file.name}
                      </span>
                      <span className="text-[8px] text-gray-500 font-mono">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-2 hover:bg-red-500/10 text-gray-600 hover:text-red-500 rounded-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {formData?.files?.length === 0 && (
                <div className="h-32 flex items-center justify-center border border-dashed border-white/5 rounded-[2rem] opacity-20 shrink-0">
                  <p className="text-[10px] uppercase font-bold tracking-widest">
                    Belum ada file
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={formData?.files?.length === 0}
            className={`w-full mt-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shrink-0 uppercase tracking-[0.2em] text-[10px] font-black shadow-lg ${formData?.files.length > 0 ? "bg-[#6d28d9] text-white" : "bg-white/5 text-gray-600 cursor-not-allowed"}`}
          >
            Kirim{" "}
            {formData?.files?.length > 0 &&
              `${formData?.files?.length} Dokumen`}{" "}
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPengajuanMutasi;
