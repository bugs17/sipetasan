'use client'

import React, { useState } from 'react'
import { HiOutlineOfficeBuilding, HiOutlineUser, HiOutlineLockClosed, HiOutlinePlus, HiOutlineTrash, HiOutlineExclamationCircle } from 'react-icons/hi'
import { PiCaretDownBold } from 'react-icons/pi' // Tambahan ikon panah dropdown

const UserManagementOPD = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedData, setSelectedData] = useState(null) 
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isBanOpen, setIsBanOpen] = useState(false); // State untuk modal ban

    // Data Dummy untuk Pilihan Instansi (OPD)
    const opdOptions = [
        { id: 'opd-1', name: 'Dinas Komunikasi dan Informatika' },
        { id: 'opd-2', name: 'Badan Kepegawaian Daerah' },
        { id: 'opd-3', name: 'Dinas Kesehatan' },
        { id: 'opd-4', name: 'Dinas Pendidikan, Perpustakaan dan Arsip Daerah' },
        { id: 'opd-5', name: 'Sekretariat Daerah' },
    ]

    const existingData = [
        { id: 1, instansi: 'Dinas Komunikasi dan Informatika', username: 'kominfo_papua' },
        { id: 2, instansi: 'Badan Kepegawaian Daerah', username: 'bkd_papua' },
    ]

    const handleOpenModal = (data = null) => {
        setSelectedData(data)
        setIsOpen(true)
    }

    const handleCloseModal = () => {
        setSelectedData(null)
        setIsOpen(false)
    }

    const handleOpenDelete = (data) => {
        setSelectedData(data)
        setIsDeleteOpen(true)
    }

    const handleCloseAll = () => {
        setIsOpen(false)
        setIsDeleteOpen(false)
        setIsBanOpen(false)
        setSelectedData(null)
    }

    const handleOpenBan = (data) => {
        setSelectedData(data);
        setIsBanOpen(true);
    }

    return (
        <div className="p-6 space-y-6">
            {/* --- HEADER SECTION --- */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-white tracking-tight uppercase">Manajemen User OPD</h2>
                    <p className="text-xs text-gray-500 font-medium">Kelola akses akun instansi pemerintah</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()} 
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#1a1a1e] text-xs font-bold hover:bg-gray-200 transition-all shadow-xl active:scale-95"
                >
                    <HiOutlinePlus size={18} />
                    Tambah User Baru
                </button>
            </div>

            {/* --- TABLE DATA --- */}
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/[0.03]">
                            <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Instansi</th>
                            <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                        {existingData.map((data) => (
                            <tr key={data.id} className="group hover:bg-white/[0.04] transition-colors">
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-200 uppercase">{data.instansi}</span>
                                        <span className="text-[10px] font-mono text-gray-500">{data.username}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                <div className="flex justify-center gap-2">
                                    {/* Tombol Edit */}
                                    <button 
                                        onClick={() => handleOpenModal(data)}
                                        className="px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        Edit
                                    </button>

                                    {/* Tombol Ban (BARU) */}
                                    <button 
                                        onClick={() => handleOpenBan(data)}
                                        className="px-3 py-1.5 rounded-lg border border-amber-500/20 text-[10px] font-bold text-amber-500 hover:bg-amber-500 hover:text-white transition-all"
                                        title="Ban User"
                                    >
                                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                                    </button>

                                    {/* Tombol Hapus */}
                                    <button 
                                        onClick={() => handleOpenDelete(data)}
                                        className="px-3 py-1.5 rounded-lg border border-red-500/20 text-[10px] font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <HiOutlineTrash size={14} />
                                    </button>
                                </div>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL INPUT --- */}
            <dialog className={`modal fixed inset-0 w-full h-full z-[999] backdrop-blur-md flex items-center justify-center ${isOpen ? 'modal-open' : ''}`}>
                <div className="modal-box bg-[#1a1a1e]/90 border border-white/10 p-8 shadow-2xl rounded-[2.5rem] max-w-md relative overflow-hidden">
                    
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="text-center space-y-1">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                                {selectedData ? 'Update Data USER' : 'Registrasi USER'}
                            </h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                {selectedData ? 'Perbarui Kredensial User' : 'Pilih Instansi & Input Kredensial'}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* --- DROPDOWN PILIH INSTANSI --- */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Pilih Instansi / OPD</label>
                                <div className="relative group">
                                    <HiOutlineOfficeBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#6d28d9] transition-colors z-10" />
                                    <select 
                                        defaultValue={selectedData?.instansi || ""}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-10 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled className="bg-[#1a1a1e]">-- Pilih OPD --</option>
                                        {opdOptions.map((opd) => (
                                            <option key={opd.id} value={opd.name} className="bg-[#1a1a1e]">
                                                {opd.name}
                                            </option>
                                        ))}
                                    </select>
                                    <PiCaretDownBold className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-[#6d28d9]" />
                                </div>
                            </div>

                            {/* Input Username */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Username Akun</label>
                                <div className="relative group">
                                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#6d28d9] transition-colors" />
                                    <input 
                                        type="text" 
                                        defaultValue={selectedData?.username || ''}
                                        placeholder="admin_dinkes"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-mono text-white focus:outline-none focus:border-[#6d28d9]/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Input Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                                    {selectedData ? 'Password Baru (Opsional)' : 'Password'}
                                </label>
                                <div className="relative group">
                                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#6d28d9] transition-colors" />
                                    <input 
                                        type="password" 
                                        placeholder="••••••••"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button onClick={handleCloseModal} className="flex-1 px-6 py-3 rounded-xl border border-white/5 text-xs font-bold text-gray-400 hover:bg-white/5 transition-all">Batal</button>
                            <button className="flex-1 px-6 py-3 rounded-xl bg-white text-[#1a1a1e] text-xs font-bold hover:bg-gray-200 transition-all shadow-xl">
                                {selectedData ? 'Simpan Perubahan' : 'Daftarkan User'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-backdrop fixed inset-0 w-full h-full bg-black/30 backdrop-blur-sm z-[-1]" onClick={handleCloseModal}>
                    <button className="w-full h-full cursor-default">close</button>
                </div>
            </dialog>

            {/* --- MODAL KONFIRMASI HAPUS (Tidak Berubah) --- */}
            <dialog className={`modal fixed inset-0 w-full h-full z-[999] backdrop-blur-sm flex items-center justify-center ${isDeleteOpen ? 'modal-open' : ''}`}>
                <div className="modal-box bg-[#1a1a1e] border border-red-500/20 p-8 shadow-2xl rounded-[2.5rem] max-w-sm text-center relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-500 opacity-10 blur-[50px] pointer-events-none" />
                    <div className="relative z-10 space-y-6">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 animate-pulse">
                                <HiOutlineExclamationCircle size={32} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Hapus User?</h3>
                            <p className="text-xs text-gray-500 leading-relaxed px-4">
                                Anda akan menghapus akses untuk <span className="text-red-400 font-bold">{selectedData?.user}</span>. Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-lg active:scale-95" onClick={handleCloseAll}>Ya, Hapus Sekarang</button>
                            <button onClick={handleCloseAll} className="w-full py-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-bold text-gray-400 hover:bg-white/5 transition-all">Batalkan</button>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fixed inset-0 w-full h-full bg-black/30 z-[-1]" onClick={handleCloseAll} />
            </dialog>

            {/* --- MODAL KONFIRMASI BAN --- */}
            <dialog className={`modal fixed inset-0 w-full h-full z-[999] backdrop-blur-sm flex items-center justify-center ${isBanOpen ? 'modal-open' : ''}`}>
                <div className="modal-box bg-[#1a1a1e] border border-amber-500/20 p-8 shadow-2xl rounded-[2.5rem] max-w-sm text-center relative overflow-hidden">
                    
                    {/* Glow effect amber */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500 opacity-10 blur-[50px] pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="32" width="32" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Ban Akses User?</h3>
                            <p className="text-xs text-gray-500 leading-relaxed px-4">
                                Akses untuk <span className="text-amber-500 font-bold">{selectedData?.user}</span> akan ditangguhkan. User tidak akan bisa login sampai status ban dicabut.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button 
                                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-lg shadow-amber-500/10 active:scale-95"
                                onClick={() => {
                                    console.log("Banning user:", selectedData?.id);
                                    handleCloseAll();
                                }}
                            >
                                Ya, Tangguhkan Akses
                            </button>
                            <button 
                                onClick={handleCloseAll}
                                className="w-full py-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                            >
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fixed inset-0 w-full h-full bg-black/30 z-[-1]" onClick={handleCloseAll} />
            </dialog>
        </div>
    )
}

export default UserManagementOPD