'use client'

import React, { useEffect, useState } from 'react'
import { 
  HiOutlineBriefcase, 
  HiOutlineCog, 
  HiOutlineClipboardList, 
  HiOutlineSearch, 
  HiOutlineX, 
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineExclamation
} from 'react-icons/hi'
import { toast, Toaster } from 'react-hot-toast'
import { getAllJabatan } from '@/app/actions/get-all-jabatan'
import { getJabatanByID } from '@/app/actions/get-jabatan-by-id'
import { getAllTugasByJabatanID } from '@/app/actions/get-all-tugas-by-jabatan-id'
import { serverAddTugas } from '@/app/actions/add-tugas'
import { serverUpdateTugas } from '@/app/actions/edit-tugas-by-id'
import { serverDeleteTugas } from '@/app/actions/delete-tugas-by-id'

// --- COMPONENT: DRAWER CONFIG ---
const ConfigDrawer = ({ isOpen, onClose, jabatanId, onUpdate }) => {
  const [jabatan, setJabatan] = useState(null);
  const [listTugas, setListTugas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  
  const [uraianTugasInput, setUraianTugasInput] = useState("");
  const [hasilKerjaInput, setHasilKerjaInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const detailJabatan = await getJabatanByID(jabatanId);
      setJabatan(detailJabatan);
      const resTugas = await getAllTugasByJabatanID(jabatanId);
      setListTugas(resTugas || []);
    } catch (error) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && jabatanId) {
      fetchData();
      document.body.style.overflow = 'hidden';
    } else {
      setEditId(null);
      setUraianTugasInput("");
      setHasilKerjaInput("");
      setConfirmDelete(null);
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, jabatanId]);

  const handleDelete = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    const deletePromise = serverDeleteTugas(id);
    toast.promise(deletePromise, {
      loading: 'Menghapus tugas...',
      success: 'Tugas dihapus',
      error: 'Gagal menghapus',
    });
    try {
      await deletePromise;
      const resTugas = await getAllTugasByJabatanID(jabatanId);
      setListTugas(resTugas || []);
      if(onUpdate) onUpdate(); 
    } catch (err) { console.error(err); }
  };

  const startEdit = (tugas) => {
    setEditId(tugas.id);
    setUraianTugasInput(tugas.namaTugas);
    setHasilKerjaInput(tugas.hasil);
  };

  const handleSubmitTugas = async () => {
    if (!uraianTugasInput || !hasilKerjaInput) return toast.error("Isi semua field!");
    setIsSubmit(true);
    const formData = { namaTugas: uraianTugasInput, hasil: hasilKerjaInput, jabatanId: jabatanId };

    if (editId) {
      const updatePromise = serverUpdateTugas(editId, formData);
      toast.promise(updatePromise, { loading: 'Mengupdate...', success: 'Berhasil update', error: 'Gagal update' });
      try {
        await updatePromise;
        setEditId(null); setUraianTugasInput(""); setHasilKerjaInput("");
        const resTugas = await getAllTugasByJabatanID(jabatanId);
        setListTugas(resTugas || []);
      } catch (err) { console.error(err); } finally { setIsSubmit(false); }
    } else {
      const addPromise = serverAddTugas(formData);
      toast.promise(addPromise, { loading: 'Menyimpan...', success: 'Berhasil simpan', error: 'Gagal simpan' });
      try {
        await addPromise;
        setUraianTugasInput(""); setHasilKerjaInput("");
        const resTugas = await getAllTugasByJabatanID(jabatanId);
        setListTugas(resTugas || []);
        if(onUpdate) onUpdate();
      } catch (err) { console.error(err); } finally { setIsSubmit(false); }
    }
  };

  return (
    <div className={`z-[9999] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Main Overlay */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />
      
      {/* Confirmation Modal Overlay */}
      {confirmDelete && (
        <div className="absolute inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#151c21] border border-white/10 p-8 rounded-[2rem] max-w-sm w-full shadow-3xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
              <HiOutlineExclamation size={32} />
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-black uppercase tracking-widest text-sm">Hapus Tugas?</h4>
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Tindakan ini akan menyebabkan data dihapus secara permanen dari sistem.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20 transition-all"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
    )}

      {/* Drawer Content */}
      <div className={`absolute top-0 right-0 w-full max-w-4xl h-full bg-[#0f1115] border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header Drawer */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#151c21]">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <HiOutlineCog className="text-[#6d28d9] animate-spin-slow" />
                <h3 className="text-xl font-black text-white italic tracking-tighter">CONFIG <span className="text-[#6d28d9]">JABATAN.</span></h3>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">
                {loading ? 'MEMUAT DATA...' : jabatan?.namaJabatan}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
            <HiOutlineX size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* SISI KIRI: LIST TUGAS */}
          <div className="flex-[1.5] overflow-y-auto p-6 border-r border-white/5 bg-[#151c21]/30 custom-scrollbar">
            <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Daftar Uraian Tugas</h4>
            {loading ? (
               <div className="space-y-3">
                  {[1,2,3,4].map(i => <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl" />)}
               </div>
            ) : (
              <div className="space-y-3">
                {listTugas.length > 0 ? (
                  listTugas.map((t, idx) => (
                    <div key={t.id || idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-[#6d28d9]/30 transition-all">
                      <div className="flex justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-white font-medium leading-relaxed">{t.namaTugas}</p>
                          <p className="text-[10px] text-[#6d28d9] font-bold uppercase tracking-wider">Hasil: {t.hasil}</p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => startEdit(t)} className="p-1.5 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-lg"><HiOutlinePencil size={14}/></button>
                           <button onClick={() => setConfirmDelete(t.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors bg-white/5 rounded-lg"><HiOutlineTrash size={14}/></button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-32 flex flex-col items-center justify-center opacity-20 italic">
                    <HiOutlineClipboardList size={40} className="mb-4 text-white"/>
                    <p className="text-xs text-white">Belum ada uraian tugas.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SISI KANAN: FORM */}
          <div className="flex-1 p-6 bg-[#151c21]/80">
            <div className="sticky top-0">
              <h4 className="text-[11px] font-black text-[#6d28d9] uppercase tracking-[0.2em] mb-6">
                {editId ? 'Edit Tugas Terpilih' : 'Tambah Tugas Baru'}
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Uraian Tugas</label>
                  <textarea value={uraianTugasInput} onChange={e => setUraianTugasInput(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#6d28d9] min-h-[150px] transition-all placeholder:text-gray-700 resize-none" placeholder="Isi tugas..."/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Hasil Kerja</label>
                  <input type="text" value={hasilKerjaInput} onChange={e => setHasilKerjaInput(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#6d28d9] transition-all placeholder:text-gray-700" placeholder="Hasil..."/>
                </div>
                <div className="flex flex-col gap-2">
                    <button onClick={handleSubmitTugas} disabled={isSubmit || loading} className="w-full py-4 bg-[#6d28d9] hover:bg-[#5b21b6] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#6d28d9]/20">
                    {isSubmit ? <span className="loading loading-spinner loading-xs"></span> : editId ? "Update Perubahan" : "Simpan Tugas"}
                    </button>
                    {editId && (
                        <button onClick={() => { setEditId(null); setUraianTugasInput(""); setHasilKerjaInput(""); }} className="w-full py-2 text-[9px] text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-colors">Batal Edit</button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- MAIN PAGE COMPONENT ---
const JabatanPage = () => {
  const [jabatan, setJabatan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await getAllJabatan()
      setJabatan(res || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const filteredJabatan = jabatan.filter((item) =>
    item.namaJabatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenConfig = (id) => {
    setSelectedId(id);
    setIsDrawerOpen(true);
  };

  return (
    <div className='p-8 h-full min-screen text-white'>
      <Toaster position="top-left" reverseOrder={false} />
      <div className="max-w-7xl mx-auto space-y-8 pb-5">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#6d28d9]/10 border border-[#6d28d9]/20 rounded-xl flex items-center justify-center">
                <HiOutlineBriefcase className="text-[#6d28d9] text-xl" />
              </div>
              <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
                URAIAN <span className="text-[#6d28d9]">TUGAS.</span>
              </h2>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] ml-1">Uraian Tugas Jabatan ASN.</p>
          </div>

          <div className="relative group w-full md:w-80">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#6d28d9] transition-colors" size={18} />
            <input type="text" placeholder="CARI NAMA JABATAN..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#151c21]/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-bold tracking-widest text-white placeholder:text-gray-600 focus:outline-none focus:border-[#6d28d9]/50 transition-all backdrop-blur-md" />
          </div>
          
          <div className="px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Total Database</span>
              <span className="text-xl font-black text-white leading-none">
                {searchTerm ? filteredJabatan.length : jabatan.length} 
                <span className="text-[#6d28d9] text-xs font-bold uppercase ml-2">Jabatan</span>
              </span>
            </div>
          </div>
        </div>

        {/* --- CARD GRID SECTION --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-48 bg-[#151c21]/50 rounded-3xl border border-white/5" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJabatan.length > 0 ? (
              filteredJabatan.map((item, index) => (
                <div key={item.id} className="group relative bg-[#151c21]/90 hover:bg-[#151c21] border border-white/10 hover:border-[#6d28d9]/50 rounded-3xl p-6 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-xl backdrop-blur-md">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-mono text-gray-600 font-bold group-hover:text-[#6d28d9] transition-colors">#{(index + 1).toString().padStart(3, '0')}</span>
                      <div className={`px-2 py-1 rounded-lg text-[9px] font-black tracking-widest border ${item.tugas && item.tugas.length > 0 ? 'border-[#6d28d9]/30 bg-[#6d28d9]/10 text-[#6d28d9]' : 'border-red-500/30 bg-red-500/10 text-red-500'}`}>
                        {(item.tugas?.length || 0)} URAIAN TUGAS
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-200 group-hover:text-white leading-tight uppercase tracking-tight mb-2 min-h-[3.5rem] line-clamp-3 transition-colors">{item.namaJabatan}</h3>
                  </div>
                  <div className="relative z-10 pt-6 mt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><HiOutlineClipboardList className="text-gray-500 group-hover:text-[#6d28d9] transition-colors" /></div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Details</span>
                    </div>
                    <button onClick={() => handleOpenConfig(item.id)} className="flex items-center gap-2 bg-white text-[#1a1a1e] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all duration-300 group/btn active:scale-95">
                        Config <HiOutlineCog size={16} className="group-hover/btn:rotate-90 transition-transform duration-500 ease-in-out text-[#6d28d9]" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30 grayscale">
                <HiOutlineBriefcase size={64} />
                <p className="text-xs font-black uppercase mt-6 text-white">Database Kosong</p>
              </div>
            )}
          </div>
        )}

        <ConfigDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} jabatanId={selectedId} onUpdate={fetchData} />
      </div>
    </div>
  )
}

export default JabatanPage