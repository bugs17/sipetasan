"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  MapPin,
  Edit2,
  Trash2,
  Database,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import ModalDelete from "@/components/modal-delete";
import ModalAddPegawai from "@/components/modal-add-pegawai";
import SettingPegawaiSkeleton, {
  ListSkeleton,
} from "@/components/skeleton/setting-pegawai-skeleton";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const daftarInstansi = [
    "Biro Organisasi",
    "Dinas Kesehatan",
    "Dinas Pendidikan",
    "Dinas Perhubungan",
    "Dinas Pemberdayaan Perempuan",
  ];

  // Secara default pilih index 0 (Biro Organisasi)
  const [filterInstansi, setFilterInstansi] = useState(daftarInstansi[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const presetColors = [
    "#ef4444",
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#6d28d9",
    "#ec4899",
    "#06b6d4",
  ];

  const [pegawai, setPegawai] = useState(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: `p${i}`,
      nama: i === 0 ? "Dr. Ahmad Sujatmiko" : `Pegawai Simulasi ${i + 1}`,
      nip: `1988021120150310${String(i).padStart(2, "0")}`,
      foto: "PS",
      color: presetColors[i % presetColors.length],
      tglLahir: "1990-01-01",
      tmptLahir: "Kota Strategis",
      pendidikan: i % 2 === 0 ? "S1" : "S2",
      instansi: daftarInstansi[i % daftarInstansi.length],
    }));
  });

  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    nip: "",
    tglLahir: "",
    tmptLahir: "",
    pendidikan: "",
  });

  // Filter Logic: Fokus hanya pada instansi terpilih + search
  const filteredData = useMemo(() => {
    return pegawai.filter((p) => {
      const matchInstansi = p.instansi === filterInstansi;
      const matchSearch =
        p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nip.includes(searchTerm);
      return matchInstansi && matchSearch;
    });
  }, [pegawai, searchTerm, filterInstansi]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      id: null,
      nama: "",
      nip: "",
      tglLahir: "",
      tmptLahir: "",
      pendidikan: "",
    });
  };

  const handleDelete = () => {
    setPegawai(pegawai.filter((p) => p.id !== selectedPegawai.id));
    setIsDeleteModalOpen(false);
  };

  if (false) return <SettingPegawaiSkeleton />;

  return (
    <div className="w-full min-h-screen text-white p-4 md:p-8 font-sans bg-transparent text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#0f0f12]/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md sticky top-0 z-30">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Database size={14} className="text-[#6d28d9]" />
              <span className="text-[9px] font-black text-[#6d28d9] uppercase tracking-[0.3em]">
                Database Pegawai
              </span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">
              APARATUR <span className="text-[#6d28d9]">HUB.</span>
            </h2>
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
                placeholder="Cari di instansi ini..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 transition-all w-full md:w-64"
              />
            </div>

            {/* Instansi Selector (Tanpa opsi "Semua") */}
            <div className="relative">
              <select
                value={filterInstansi}
                onChange={(e) => {
                  setFilterInstansi(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-10 text-[10px] font-black uppercase tracking-widest text-gray-300 focus:outline-none focus:border-[#6d28d9]/50 appearance-none cursor-pointer"
              >
                {daftarInstansi.map((j) => (
                  <option key={j} value={j} className="bg-[#1a1a1e]">
                    {j}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#6d28d9] hover:bg-[#7c3aed] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-[#6d28d9]/20"
            >
              <Plus size={16} /> Tambah
            </button>
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
                {!true ? (
                  <ListSkeleton />
                ) : (
                  currentItems.map((p) => (
                    <tr
                      key={p.id}
                      className="group hover:bg-white/[0.03] transition-colors duration-300"
                    >
                      <td className="p-4 px-6">
                        <div className="flex items-center gap-4">
                          <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center text-[10px] font-black border border-white/10 shrink-0"
                            style={{
                              backgroundColor: `${p.color}15`,
                              color: p.color,
                            }}
                          >
                            {p.nama.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white leading-none mb-1">
                              {p.nama}
                            </p>
                            <p className="text-[10px] font-mono text-gray-500 tracking-tighter">
                              {p.nip}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 px-6 hidden lg:table-cell">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-gray-400">
                            <MapPin size={10} />
                            <span className="text-[10px] font-bold">
                              {p.tmptLahir}
                            </span>
                          </div>
                          <span className="text-[9px] w-fit px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5 uppercase font-black tracking-widest">
                            {p.pendidikan}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 px-6 text-right">
                        <div className="relative flex items-center justify-end min-h-[40px]">
                          <div className="absolute right-0 opacity-100 group-hover:opacity-0 transition-opacity duration-200 text-gray-600 pointer-events-none">
                            <MoreHorizontal size={18} />
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => {
                                setFormData(p);
                                setIsModalOpen(true);
                              }}
                              className="p-2 bg-white/5 hover:bg-[#6d28d9]/20 hover:text-[#6d28d9] rounded-lg text-gray-400 border border-white/5 transition-all"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPegawai(p);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-500 border border-red-500/10 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="p-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.01]">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Menampilkan{" "}
              <span className="text-white">{currentItems.length}</span> dari{" "}
              <span className="text-white">{filteredData.length}</span> Pegawai
              di {filterInstansi}
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
              Tidak ada pegawai ditemukan di {filterInstansi}
            </p>
          </div>
        )}
      </div>

      <ModalAddPegawai
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        formData={formData}
        setFormData={setFormData}
      />
      <ModalDelete
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        selectedPegawai={selectedPegawai}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Page;
