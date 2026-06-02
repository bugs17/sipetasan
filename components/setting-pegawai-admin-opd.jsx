"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Database,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronDown,
  Building2,
  UserMinus,
} from "lucide-react";
import ModalAddPegawai from "@/components/modal-add-pegawai";
import { getColorFromId } from "@/app/utils/generate-color";
import toast, { Toaster } from "react-hot-toast";
import { addOrUpdatePegawaiByAdminInduk } from "@/app/actions/addOrUpdatePegawaiByAdmin";
import { deletePegawai } from "@/app/actions/deletePegawai";
import SettingSkeleton from "@/components/skeleton/setting-skeleton";
import { useAuth } from "@clerk/nextjs";
import { getUserRoleByClerkID } from "@/app/actions/get-user-role-by-clerk-id";
import { getPegawaiDanInstansiByIdOpd } from "@/app/getListPegawaiDansInstansiByIdOpd";
import ModalSetStatusPegawai from "./modal-set-status-pegawai";
import { setStatusKeluarPegawai } from "@/app/actions/set-status-keluar-pegawai";

const SettingPegawaiAdminOpd = () => {
  // state
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalStatusOpen, setIsModalStatusOpen] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUiReady, setIsUiReady] = useState(false);
  const [pegawai, setPegawai] = useState([]);
  const [pendidikan, setPendidikan] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    nip: "",
    tempatLahir: "",
    tanggalLahir: "",
    pendidikanId: "",
    opdId: "",
    statusPegawai:"PNS"
  });
  const [formDataKeluar, setFormDataKeluar] = useState({
    id: "",
    status: "",
    tanggalKeluar: "",
    nama: "",
    nip: "",
    opdId: "",
    jabatanId: "",
    statusPegawai:"PNS"
  });
  const { userId, isLoaded } = useAuth();

  // fetch data dan set ui ready
  useEffect(() => {
    const fetchData = async () => {
      setIsUiReady(false);
      try {
        const userDb = await getUserRoleByClerkID(userId);
        const { dataPegawai, dataPendidikan } =
          await getPegawaiDanInstansiByIdOpd(userDb.opdId);
        setPegawai(dataPegawai);
        setPendidikan(dataPendidikan);
      } catch (error) {
      } finally {
        setIsUiReady(true);
      }
    };
    fetchData();
  }, []);

  // Filter Logic: Fokus hanya pada search
  const filteredData = useMemo(() => {
    return pegawai
      .filter((p) => {
        const matchSearch =
          p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.nip.includes(searchTerm);

        return matchSearch;
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [pegawai, searchTerm]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // bersihkan formData saat close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      id: "",
      nama: "",
      nip: "",
      tempatLahir: "",
      tanggalLahir: "",
      pendidikanId: "",
      opdId: "",
      statusPegawai:"PNS"
    });
  };

  // function handle create/update pegawa
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!formData.nama) {
      toast.error("Kolom nama tidak boleh kosong!");
      setIsLoading(false);
      return;
    }
    if (!formData.nip) {
      toast.error("Kolom nip tidak boleh kosong!");
      setIsLoading(false);
      return;
    }
    const promise = addOrUpdatePegawaiByAdminInduk(formData);
    const { operasi, obj } = await toast.promise(promise, {
      loading: "Proses...",
      success: "Berhasil ditambahkan!",
      error: "Gagal menambahkan data!",
    });

    if (operasi === null) return;
    if (operasi === "create") {
      setPegawai((prev) => [...prev, obj]);
    }
    if (operasi === "update") {
      setPegawai((prev) =>
        prev.map((item) => (item.id === obj.id ? obj : item)),
      );
    }
    setIsLoading(false);
    setIsModalOpen(false);
  };

  // function handle perubahan status pegawai
  const handleSubmitStatusPegawai = async () => {
    if (!formDataKeluar.status) {
      toast.error("Mohon memilih status!");
      return;
    }
    if (!formDataKeluar.tanggalKeluar) {
      toast.error("Mohon set tanggal keluar!");
      return;
    }

    const res = await setStatusKeluarPegawai(formDataKeluar);
    if (res.success) {
      toast.success("Pegawai telah dikeluarkan!");
      setPegawai((prev) => prev.filter((p) => p.id !== formDataKeluar.id));
      setIsModalStatusOpen(false);
    } else {
      toast.error("Error: Terjadi masalah system!");
      return;
    }
  };

  // skeleton
  if (!isUiReady) return <SettingSkeleton />;

  return (
    <div className="w-full min-h-screen text-white p-4 md:p-8 font-sans bg-transparent text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#0f0f12]/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md sticky top-0 z-30">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Database size={14} className="text-[#6d28d9]" />
              <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">
                Database Pegawai
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative group">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#6d28d9] transition-colors"
              />
              <input
                type="text"
                placeholder="Cari pegawai..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 transition-all w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-[#0f0f12]/60 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    Pegawai
                  </th>

                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hidden lg:table-cell">
                    Informasi
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentItems.map((p) => (
                  <tr
                    key={p.id}
                    className="group hover:bg-white/[0.03] transition-colors duration-300"
                  >
                    <td className="p-4 px-6">
                      <div className="flex items-center gap-4">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center text-[10px] font-black border border-white/10 shrink-0"
                          style={{
                            backgroundColor: `${getColorFromId(p.id)}15`,
                            color: getColorFromId(p.id),
                          }}
                        >
                          {p.nama.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm uppercase font-bold text-white leading-none mb-1">
                            {p.nama}
                          </p>
                          <p className="text-[10px] font-mono text-gray-500 tracking-tighter">
                            {p.nip || "--"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 px-6 hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Building2 size={10} />
                          <span className="text-[10px] font-bold uppercase">
                            {p.opd?.namaOpd || "Belum memiliki dinas"}
                          </span>
                        </div>

                        <div className="flex flex-row gap-2 items-center">
                          <span className="text-[9px] w-fit px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5 uppercase font-black tracking-widest">
                            {p.pendidikan?.namaPendidikan ||
                              "Belum ada data pendidikan terakhir"}
                          </span>
                          <span 
                            className={`text-[9px] w-fit px-2 py-0.5 rounded-md border border-white/5 uppercase font-black tracking-widest ${
                              p.statusPegawai?.toUpperCase() === "PPPK" 
                                ? "bg-red-500/10 text-red-400" 
                                : p.statusPegawai?.toUpperCase() === "PNS" 
                                ? "bg-emerald-500/10 text-emerald-400" 
                                : "bg-white/5 text-gray-400"
                            }`}
                          >
                            {p.statusPegawai || "-"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 px-6 text-right">
                      <div className="relative flex items-center justify-end min-h-[40px]">
                        <div className="absolute right-0 opacity-100 group-hover:opacity-0 transition-opacity duration-200 text-gray-600 pointer-events-none">
                          <MoreHorizontal size={18} />
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {/* Tombol Status Keluar */}
                          <button
                            onClick={() => {
                              setFormDataKeluar({
                                id: p.id,
                                nama: p.nama,
                                nip: p.nip,
                                opdId: p.opdId,
                                status: "",
                                tanggalKeluar: "",
                                jabatanId: p.jabatanId,
                                statusPegawai:p.statusPegawai
                              });
                              setIsModalStatusOpen(true);
                            }}
                            className="p-2 bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 rounded-lg text-gray-400 border border-white/5 transition-all"
                            title="Set Status Keluar"
                          >
                            <UserMinus size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setFormData({
                                id: p.id,
                                nama: p.nama,
                                nip: p.nip,
                                pendidikanId: p.pendidikanId,
                                tempatLahir: p.tempatLahir,
                                tanggalLahir: p.tanggalLahir,
                                opdId: p.opdId,
                                statusPegawai:p.statusPegawai
                              });
                              setIsModalOpen(true);
                            }}
                            className="p-2 bg-white/5 hover:bg-[#6d28d9]/20 hover:text-[#6d28d9] rounded-lg text-gray-400 border border-white/5 transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="p-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.01]">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Menampilkan{" "}
              <span className="text-white">{currentItems.length}</span> dari{" "}
              <span className="text-white">{filteredData.length}</span> Pegawai
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-20 hover:bg-white/10 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${
                      currentPage === i + 1
                        ? "bg-[#6d28d9] text-white shadow-lg shadow-[#6d28d9]/20"
                        : "bg-white/5 text-gray-500 hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-20 hover:bg-white/10 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {filteredData.length === 0 && !isLoading && (
          <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
            <Users
              size={48}
              className="mx-auto text-gray-800 mb-4 opacity-20"
            />
            <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">
              Tidak ada pegawai ditemukan dengan nama {searchTerm}
            </p>
          </div>
        )}
      </div>

      <ModalSetStatusPegawai
        closeModal={() => {
          setFormDataKeluar({
            id: "",
            opdId: "",
            status: "",
            tanggalKeluar: "",
            nama: "",
            nip: "",
            jabatanId: "",
            statusPegawai:"PNS"
          });
          setIsModalStatusOpen(false);
        }}
        formData={formDataKeluar}
        setFormData={setFormDataKeluar}
        handleSubmit={handleSubmitStatusPegawai}
        isModalOpen={isModalStatusOpen}
      />

      <ModalAddPegawai
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        formData={formData}
        setFormData={setFormData}
        pendidikan={pendidikan}
        handleSubmit={handleSubmit}
        isAdminOpd={true}
      />

      <Toaster
        position="top-right"
        toastOptions={{ style: { zIndex: 10001 } }}
      />
    </div>
  );
};

export default SettingPegawaiAdminOpd;
