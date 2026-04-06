"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronDown,
  Building2,
  User2,
  KeyRound,
} from "lucide-react";
import ModalDelete from "@/components/modal-delete";
import ModalAddPegawai from "@/components/modal-add-pegawai";
import SettingPegawaiSkeleton, {
  ListSkeleton,
} from "@/components/skeleton/setting-pegawai-skeleton";
import { getColorFromId } from "@/app/utils/generate-color";
import AdminIndukWrapper from "@/components/admin-induk-wrapper";
import { getPegawaiDanInstansi } from "@/app/actions/getListPegawaiDanInstansi";
import toast, { Toaster } from "react-hot-toast";
import { addOrUpdatePegawaiByAdminInduk } from "@/app/actions/addOrUpdatePegawaiByAdmin";
import { deletePegawai } from "@/app/actions/deletePegawai";
import { getListUserOpd } from "@/app/actions/getListUser";
import { useUser } from "@clerk/nextjs";
import ModalAddUser from "@/components/modal-add-user";
import { addNewUser } from "@/app/actions/addUser";
import { validasiNomorTelepon } from "@/app/utils/validasi-no-whatsapp";
import Link from "next/link";

const Page = () => {
  // state
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterInstansi, setFilterInstansi] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPegawai, setSelectedPegawai] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUiReady, setIsUiReady] = useState(false);
  const [userList, setUserList] = useState([]);
  const [instansi, setInstansi] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    clerkUserId: "",
    email: "",
    whatsapp: "",
    password: "",
    nama_user: "",
    opdId: "",
    role: "",
  });

  // fetch data dan set ui ready
  useEffect(() => {
    const fetchData = async () => {
      const { dataUser, dataInstansi } = await getListUserOpd();
      setUserList(dataUser);
      setInstansi(dataInstansi);
    };
    fetchData();
    setIsUiReady(true);
  }, []);

  // Filter Logic: Fokus hanya pada search
  const filteredData = useMemo(() => {
    return userList
      .filter((p) => {
        const matchSearch = p.nama_user
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchInstansi =
          p.opdId === filterInstansi || filterInstansi === null;

        return matchSearch && matchInstansi;
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [userList, searchTerm, filterInstansi]);

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
      clerkUserId: "",
      email: "",
      whatsapp: "",
      password: "",
      nama_user: "",
      opdId: "",
      role: "",
    });
  };

  // function handle delete pegawai
  const handleDelete = async () => {
    // setIsLoading(true);
    // const promise = deletePegawai(selectedUser.id);
    // const { status } = await toast.promise(promise, {
    //   loading: "Proses..",
    //   success: "Pegawai berhasil dihapus.",
    //   error: "Pegawai gagal dihapus!",
    // });
    // if (status === "sukses") {
    //   setPegawai((prev) => prev.filter((item) => item.id !== selectedUser.id));
    // }
    // setIsDeleteModalOpen(false);
    // setIsLoading(false);
  };

  // function handle create new user
  const handleCreate = async () => {
    setIsLoading(true);
    const valid = validationForm();
    if (!valid) return;
    const promise = addNewUser(formData);
    const { isSukses, dataObj } = await toast.promise(promise, {
      loading: "Proses",
      success: "User berhasil ditambahkan!",
      error: "gagal!",
    });
    if (isSukses) {
      setUserList((prev) => [...prev, dataObj]);
    }
    setIsLoading(false);
    setIsModalOpen(false);
  };

  // function validasi form
  const validationForm = () => {
    if (!formData.nama_user) {
      alert("Nama user tidak boleh kosong!");
      return false;
    }
    if (!formData.email) {
      alert("Email tidak boleh kosong!");
      return false;
    }
    if (!formData.whatsapp) {
      alert("Kontak whatsapp tidak boleh kosong!");
      return false;
    }
    if (!validasiNomorTelepon(formData.whatsapp)) {
      alert("Kontak whatsapp tidak valid!");
      return false;
    }
    if (!formData.email.includes("@")) {
      alert("Email tidak valid!");
      return false;
    }
    if (!formData.password) {
      alert("Password tidak boleh kosong!");
      return false;
    }
    if (formData.password.length < 8) {
      alert("Password minimal 8 karakter!");
      return false;
    }
    if (!formData.role) {
      alert("Role tidak boleh kosong!");
      return false;
    }
    if (formData.role === "ADMIN_OPD") {
      if (!formData.opdId) {
        alert("Instansi tidak boleh kosong!");
        return false;
      }
    }
    // return true jika semua kondisi berhasil dicek
    return true;
  };

  // skeleton
  if (!isUiReady) return <SettingPegawaiSkeleton />;

  return (
    <AdminIndukWrapper>
      <Toaster
        position="top-right"
        toastOptions={{ style: { zIndex: 10001 } }}
      />
      <div className="w-full min-h-screen text-white p-4 md:p-8 font-sans bg-transparent text-left">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HEADER SECTION */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#0f0f12]/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md sticky top-0 z-30">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <User2 size={14} className="text-[#6d28d9]" />
                <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">
                  Manage user
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
                  placeholder="Cari user..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 transition-all w-full md:w-64"
                />
              </div>

              {/* Instansi Selector */}
              <div className="relative">
                <select
                  value={filterInstansi ?? "all"}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "all") {
                      setFilterInstansi(null);
                    } else {
                      setFilterInstansi(Number(value));
                    }
                    setCurrentPage(1);
                  }}
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-10 text-[10px] font-black uppercase tracking-widest text-gray-300 focus:outline-none focus:border-[#6d28d9]/50 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-[#1a1a1e]">
                    --Semua User--
                  </option>

                  {instansi.map((j) => (
                    <option key={j.id} value={j.id} className="bg-[#1a1a1e]">
                      {j.namaOpd}
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
                <Plus size={16} /> Tambah user
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
                      User
                    </th>

                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hidden lg:table-cell">
                      Instansi
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
                            className="h-10 w-10 rounded-xl flex items-center justify-center text-[10px] font-black border border-white/10 shrink-0 overflow-hidden"
                            style={{
                              backgroundColor: `${getColorFromId(p.id)}15`,
                              color: getColorFromId(p.id),
                            }}
                          >
                            {!isLoaded ? (
                              // ⏳ loading → fallback dulu
                              <span className="animate-pulse">
                                {p.nama_user?.substring(0, 2).toUpperCase()}
                              </span>
                            ) : user?.imageUrl ? (
                              // ✅ ada image → tampilkan
                              <img
                                src={user.imageUrl}
                                alt="profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              // ❌ tidak ada image → fallback
                              <span>
                                {p.nama_user?.substring(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white leading-none mb-1">
                              {p.nama_user || "--"}
                            </p>
                            <p className="text-[10px] font-mono text-gray-500 tracking-tighter">
                              {p.email || "--"}
                            </p>
                            <Link
                              href={`https://wa.me/${p.whatsapp}`}
                              target="_blank"
                              className="text-[10px] font-mono text-green-400 underline tracking-tighter"
                            >
                              {p.whatsapp || "--"}
                            </Link>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 px-6 hidden lg:table-cell">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Building2 size={10} />
                            <span className="text-[10px] font-bold">
                              {p.opd?.namaOpd || "PIMPINAN"}
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
                            <button
                              onClick={() => {
                                setFormData({
                                  id: p.id,
                                  clerkUserId: p.clerkId,
                                  nama_user: p.nama_user,
                                  opdId: p.opdId,
                                });
                                // setIsModalOpen(true);
                              }}
                              className="p-2 bg-white/5 hover:bg-[#28d998]/20 hover:text-[#28d998] rounded-lg text-gray-400 border border-white/5 transition-all"
                            >
                              <KeyRound size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setFormData({
                                  id: p.id,
                                  clerkUserId: p.clerkId,
                                  nama_user: p.nama_user,
                                  opdId: p.opdId,
                                  whatsapp: p.whatsapp,
                                  email: p.email,
                                });
                                setIsModalOpen(true);
                              }}
                              className="p-2 bg-white/5 hover:bg-[#6d28d9]/20 hover:text-[#6d28d9] rounded-lg text-gray-400 border border-white/5 transition-all"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(p);
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
                Menampilkan{" "}
                <span className="text-white">{currentItems.length}</span> dari{" "}
                <span className="text-white">{filteredData.length}</span>{" "}
                Pegawai di{" "}
                <span className="text-white">
                  {filterInstansi
                    ? instansi.find((i) => i.id === filterInstansi)?.namaOpd
                    : "Semua Instansi"}
                </span>
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
                User tidak ditemukan!
              </p>
            </div>
          )}
        </div>

        <ModalAddUser
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          formData={formData}
          setFormData={setFormData}
          instansi={instansi}
          handleSubmit={handleCreate}
          disabled={isLoading}
        />

        {/* <ModalAddPegawai
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          formData={formData}
          setFormData={setFormData}
          instansi={instansi}
          pendidikan={pendidikan}
          handleSubmit={handleSubmit}
        />
        <ModalDelete
          title={"Hapus User"}
          desc={"Anda yakin akan menghapus user dengan "}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          selectedItem={`username: ${selectedUser?.username}.`}
          handleDelete={handleDelete}
        /> */}
      </div>
    </AdminIndukWrapper>
  );
};

export default Page;
