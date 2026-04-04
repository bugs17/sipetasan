"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Building2,
  Edit2,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import AdminIndukWrapper from "@/components/admin-induk-wrapper";

// Impor komponen modal buatan Anda (asumsi penamaan)
// import ModalAddInstansi from "@/components/modal-add-instansi";
// import ModalDelete from "@/components/modal-delete";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInstansi, setSelectedInstansi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Data Dummy Instansi
  const [instansi, setInstansi] = useState([
    {
      id: "i1",
      nama: "Biro Organisasi",
      kode: "ORG-01",
      totalPegawai: 24,
      warna: "#6d28d9",
    },
    {
      id: "i2",
      nama: "Dinas Kesehatan",
      kode: "KES-02",
      totalPegawai: 156,
      warna: "#ef4444",
    },
    {
      id: "i3",
      nama: "Dinas Pendidikan",
      kode: "DIK-03",
      totalPegawai: 432,
      warna: "#3b82f6",
    },
    {
      id: "i4",
      nama: "Dinas Perhubungan",
      kode: "HUB-04",
      totalPegawai: 89,
      warna: "#f59e0b",
    },
    {
      id: "i5",
      nama: "Dinas Pemberdayaan Perempuan",
      kode: "PP-05",
      totalPegawai: 45,
      warna: "#ec4899",
    },
    {
      id: "i6",
      nama: "Badan Keuangan Daerah",
      kode: "BKD-06",
      totalPegawai: 67,
      warna: "#10b981",
    },
    {
      id: "i7",
      nama: "Dinas Komunikasi & Informatika",
      kode: "KOM-07",
      totalPegawai: 34,
      warna: "#06b6d4",
    },
  ]);

  const [formData, setFormData] = useState({ id: null, nama: "", kode: "" });

  // Filter Logic
  const filteredData = useMemo(() => {
    return instansi.filter(
      (item) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kode.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [instansi, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDelete = () => {
    setInstansi(instansi.filter((i) => i.id !== selectedInstansi.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <AdminIndukWrapper>
      <div className="w-full min-h-screen text-white p-4 md:p-8 font-sans bg-transparent text-left">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HEADER SECTION */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#0f0f12]/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md sticky top-0 z-30">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <Building2 size={14} className="text-[#6d28d9]" />
                <span className="text-[9px] font-black text-[#6d28d9] uppercase tracking-[0.3em]">
                  Pengaturan Struktur
                </span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">
                MANAGE <span className="text-[#6d28d9]">INSTANSI.</span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#6d28d9] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Cari kode atau nama..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 transition-all w-full md:w-80"
                />
              </div>

              <button
                onClick={() => {
                  setFormData({ id: null, nama: "", kode: "" });
                  setIsModalOpen(true);
                }}
                className="bg-[#6d28d9] hover:bg-[#7c3aed] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-[#6d28d9]/20"
              >
                <Plus size={16} /> Tambah Instansi
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
                      Info Instansi
                    </th>

                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hidden lg:table-cell">
                      Kapasitas SDM
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-white/[0.03] transition-colors duration-300"
                    >
                      <td className="p-4 px-6">
                        <div className="flex items-center gap-4">
                          <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center border border-white/10 shrink-0"
                            style={{
                              backgroundColor: `${item.warna}15`,
                              color: item.warna,
                            }}
                          >
                            <Building2 size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white leading-none mb-1">
                              {item.nama}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                              Government Branch
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 px-6 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Users size={12} className="text-gray-500" />
                          <span className="text-[11px] font-black italic">
                            {item.totalPegawai}
                          </span>
                          <span className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter">
                            Personil terdaftar
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
                                setFormData(item);
                                setIsModalOpen(true);
                              }}
                              className="p-2 bg-white/5 hover:bg-[#6d28d9]/20 hover:text-[#6d28d9] rounded-lg text-gray-400 border border-white/5 transition-all"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInstansi(item);
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="p-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.01]">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Total <span className="text-white">{filteredData.length}</span>{" "}
                Instansi Terdaftar
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

          {/* EMPTY STATE */}
          {filteredData.length === 0 && !isLoading && (
            <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
              <Building2
                size={48}
                className="mx-auto text-gray-800 mb-4 opacity-20"
              />
              <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">
                Data instansi tidak ditemukan
              </p>
            </div>
          )}
        </div>

        {/* Modal Placeholder (Sesuaikan dengan komponen modal Anda) */}
        {/* <ModalAddInstansi isModalOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} formData={formData} /> */}
        {/* <ModalDelete isDeleteModalOpen={isDeleteModalOpen} setIsDeleteModalOpen={setIsDeleteModalOpen} selectedItem={selectedInstansi} handleDelete={handleDelete} /> */}
      </div>
    </AdminIndukWrapper>
  );
};

export default Page;
