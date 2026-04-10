"use client";

import { useEffect, useState, useMemo } from "react";
import {
  HiOutlineBriefcase,
  HiOutlineSearch,
  HiOutlineArrowRight,
  HiOutlineClipboardList,
  HiOutlineX,
} from "react-icons/hi";
import {
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { getAllJabatan } from "@/app/actions/get-all-jabatan";
import { getAllTugasByJabatanID } from "@/app/actions/get-all-tugas-by-jabatan-id";
import { addUraianTugas } from "@/app/actions/addUraianTugas";
import Link from "next/link";

// --- MAIN COMPONENT ---
const JabatanSubmitPage = () => {
  const [jabatans, setJabatans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedJabatan, setSelectedJabatan] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllJabatan();
        setJabatans(res);
      } catch (err) {
        toast.error("Gagal memuat database jabatan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return jabatans.filter((item) =>
      item.namaJabatan.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, jabatans]);

  const openSubmitDrawer = (jabatan) => {
    setSelectedJabatan(jabatan);
    setIsDrawerOpen(true);
  };

  return (
    // PERBAIKAN: Hapus 'h-full' dan 'overflow-hidden' agar halaman bisa scroll secara natural
    // Tambahkan min-h-screen untuk memastikan background menutupi seluruh layar
    <div className="p-8 min-h-screen relative">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6d28d9]/10 border border-[#6d28d9]/20 rounded-xl flex items-center justify-center">
                <Send className="text-[#6d28d9]" size={20} />
              </div>
              <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
                Submit <span className="text-[#6d28d9]">Tugas.</span>
              </h2>
            </div>
            <p className="inline-block text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
              Monitoring & Pengisian Data Uraian Tugas
            </p>
          </div>

          <div className="relative w-full md:w-[350px] group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <HiOutlineSearch
                className="text-gray-500 group-focus-within:text-[#6d28d9] transition-colors"
                size={18}
              />
            </div>
            <input
              type="text"
              placeholder="Cari jabatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141b20] border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        {/* --- GRID JABATAN --- */}
        {/* PERBAIKAN: Tambahkan padding bottom yang cukup agar card terakhir tidak terpotong */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
          {loading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-44 bg-[#141b20] rounded-3xl border border-white/5 animate-pulse"
                />
              ))
            : filteredData.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative bg-[#141b20] border border-white/10 hover:border-[#6d28d9]/50 rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-[#6d28d9]/5"
                >
                  <div className="relative z-10 space-y-4">
                    <div className="w-8 h-8 rounded-lg bg-[#6d28d9]/10 flex items-center justify-center border border-[#6d28d9]/20">
                      <HiOutlineBriefcase
                        className="text-[#6d28d9]"
                        size={16}
                      />
                    </div>
                    <h3 className="text-md font-bold text-gray-200 group-hover:text-white leading-snug uppercase tracking-tight min-h-[3rem] line-clamp-2">
                      {item.namaJabatan}
                    </h3>
                    <div className="pt-4 border-t border-white/5">
                      <button
                        onClick={() => openSubmitDrawer(item)}
                        className="flex items-center justify-between w-full bg-white text-black px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 group/btn"
                      >
                        Submit Sekarang
                        <HiOutlineArrowRight
                          size={14}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

          {!loading && filteredData.length === 0 && (
            <div className="col-span-full py-20 text-center opacity-20">
              <HiOutlineSearch size={48} className="mx-auto mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Jabatan tidak ditemukan
              </p>
            </div>
          )}
        </div>
      </div>

      <SubmitDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        jabatan={selectedJabatan}
      />
    </div>
  );
};

// --- SUB-COMPONENT: DRAWER ---
const SubmitDrawer = ({ isOpen, onClose, jabatan }) => {
  const [tugasList, setTugasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTugasId, setActiveTugasId] = useState(null);

  const fetchTugas = async () => {
    if (!jabatan) return;
    setLoading(true);
    try {
      const res = await getAllTugasByJabatanID(jabatan.id);
      setTugasList(res);
    } catch {
      toast.error("Gagal sinkronisasi data tugas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && jabatan) {
      fetchTugas();
      document.body.style.overflow = "hidden"; // Lock main scroll when drawer open
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, jabatan]);

  return (
    <>
      {/* Overlay Smooth */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer Panel Smooth */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xl bg-[#0f1418] border-l border-white/10 z-[110] shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#141b20]">
            <div>
              <h3 className="text-xl font-black italic text-white tracking-tighter">
                LIST URAIAN <span className="text-[#6d28d9]">TUGAS.</span>
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate max-w-[300px] mt-1">
                {jabatan?.namaJabatan}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors group"
            >
              <HiOutlineX
                size={24}
                className="text-gray-500 group-hover:text-white transition-colors"
              />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3 opacity-20">
                <Loader2 className="animate-spin text-[#6d28d9]" size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Sinkronisasi...
                </span>
              </div>
            ) : tugasList.length > 0 ? (
              tugasList.map((tugas) => (
                <div key={tugas.id} className="space-y-3">
                  <button
                    onClick={() =>
                      setActiveTugasId(
                        activeTugasId === tugas.id ? null : tugas.id,
                      )
                    }
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                      activeTugasId === tugas.id
                        ? "bg-[#6d28d9]/10 border-[#6d28d9]/50"
                        : "bg-white/[0.02] border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg transition-colors ${tugas.jumlahBebanKerjaSetahun > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                      >
                        {tugas.jumlahBebanKerjaSetahun > 0 ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <AlertCircle size={16} />
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-300 leading-tight uppercase tracking-tight group-hover:text-white transition-colors">
                        {tugas.namaTugas}
                      </span>
                    </div>
                    <HiOutlineArrowRight
                      className={`text-gray-600 transition-transform duration-300 ${activeTugasId === tugas.id ? "rotate-90 text-[#6d28d9]" : ""}`}
                    />
                  </button>

                  {activeTugasId === tugas.id && (
                    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                      <FormInputTugas data={tugas} onSuccess={fetchTugas} />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-20 ">
                <HiOutlineClipboardList
                  size={48}
                  className="mx-auto opacity-20"
                />
                <p className="text-[10px] font-black uppercase mt-4 opacity-20">
                  Belum ada rincian tugas
                </p>
                <Link
                  href={"/dashboard/setting-uraian-tugas"}
                  className="flex w-full justify-center pt-4"
                >
                  <button className="flex  items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-gray-100 active:scale-95 shadow-sm">
                    Tambahkan Sekarang
                    <ArrowRight size={14} />
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// --- SUB-COMPONENT: FORM INPUT ---
const FormInputTugas = ({ data, onSuccess }) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [values, setValues] = useState({
    jumlahBebanKerja: data.jumlahBebanKerjaSetahun || "",
    waktuPenyelesaian: data.waktuPenyelesaianDalamJam || "",
    waktuEfektif: data.waktuEfektifPenyelesaian || "",
  });

  const handleSubmit = async () => {
    if (
      !values.jumlahBebanKerja ||
      !values.waktuPenyelesaian ||
      !values.waktuEfektif
    ) {
      toast.error("Semua field harus diisi!");
      return;
    }

    setIsSubmit(true);
    const toastId = toast.loading("Sedang menyimpan data...");

    try {
      const result = await addUraianTugas(
        data.id,
        values.jumlahBebanKerja,
        values.waktuPenyelesaian,
        values.waktuEfektif,
      );

      if (result) {
        toast.success("Data berhasil disimpan", { id: toastId });
        onSuccess();
      } else {
        toast.error("Gagal menyimpan data", { id: toastId });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server", { id: toastId });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-4">
        <label className="block">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
            Beban Kerja (1 Tahun)
          </span>
          <input
            type="number"
            value={values.jumlahBebanKerja}
            onChange={(e) =>
              setValues({ ...values, jumlahBebanKerja: e.target.value })
            }
            placeholder="0"
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9] transition-all"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
              Penyelesaian (JAM)
            </span>
            <input
              type="number"
              value={values.waktuPenyelesaian}
              onChange={(e) =>
                setValues({ ...values, waktuPenyelesaian: e.target.value })
              }
              placeholder="0"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9] transition-all"
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
              Waktu Efektif
            </span>
            <input
              type="number"
              value={values.waktuEfektif}
              onChange={(e) =>
                setValues({ ...values, waktuEfektif: e.target.value })
              }
              placeholder="0"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9] transition-all"
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmit}
        className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] disabled:bg-[#6d28d9]/50 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#6d28d9]/20"
      >
        {isSubmit ? (
          <Loader2 className="animate-spin" size={14} />
        ) : (
          <Save size={14} />
        )}
        {isSubmit ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );
};

export default JabatanSubmitPage;
