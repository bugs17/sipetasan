"use client"
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  Search, 
  Plus, 
  User, 
  Calendar, 
  MapPin, 
  GraduationCap,
  Edit2,
  Trash2,
  AlertTriangle,
  Download,
  FileText,
  Table as TableIcon,
  ChevronDown,
  Database
} from 'lucide-react';

// --- COMPONENT SKELETON SHIMMER ---
const SkeletonLoader = () => {
  return (
    <div className="space-y-4 w-full max-w-6xl mx-auto animate-pulse">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <div className="h-6 w-32 bg-white/5 rounded-full"></div>
          <div className="h-10 w-64 bg-white/5 rounded-lg"></div>
          <div className="h-4 w-80 bg-white/5 rounded-md"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-64 bg-white/5 rounded-2xl"></div>
          <div className="h-12 w-40 bg-white/5 rounded-2xl"></div>
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="h-16 w-16 bg-white/5 rounded-[1.5rem] shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="h-5 w-48 bg-white/5 rounded-lg"></div>
            <div className="h-3 w-32 bg-white/5 rounded-full"></div>
          </div>
          <div className="h-10 w-10 bg-white/5 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
};

// --- COMPONENT UTAMA ---
const PetaJabatanSimple = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJabatan, setFilterJabatan] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const presetColors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#6d28d9', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316'];
  const daftarJabatan = ["Kepala Dinas Kesehatan", "Sekretaris Dinas", "Kabid Yankes", "Kasi Penyakit Menular", "Kasubag Kepegawaian", "Staff Administrasi"];
  const jenjangPendidikan = ["SMA/SMK", "D3", "D4", "S1", "S2", "S3", "Spesialis"];

  const [formData, setFormData] = useState({ id: null, nama: '', nip: '', tglLahir: '', tmptLahir: '', pendidikan: '', jabatan: '' });
  const [pegawai, setPegawai] = useState([
    { id: 'p1', nama: 'Dr. Ahmad Sujatmiko', nip: '198802112015031002', foto: 'AS', color: '#ef4444', tglLahir: '1988-02-11', tmptLahir: 'Jakarta', pendidikan: 'S2', jabatan: 'Kepala Dinas Kesehatan' },
    { id: 'p2', nama: 'Siti Rahmawati, S.Kep', nip: '199205142019012001', foto: 'SR', color: '#10b981', tglLahir: '1992-05-14', tmptLahir: 'Bandung', pendidikan: 'S1', jabatan: 'Sekretaris Dinas' },
  ]);

  const filteredData = pegawai.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || p.nip.includes(searchTerm);
    const matchFilter = filterJabatan === "Semua" || p.jabatan === filterJabatan;
    return matchSearch && matchFilter;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      setPegawai(pegawai.map(p => p.id === formData.id ? { ...p, ...formData, foto: formData.nama.substring(0, 2).toUpperCase() } : p));
    } else {
      const randomColor = presetColors[Math.floor(Math.random() * presetColors.length)];
      setPegawai([{ ...formData, id: `p${Date.now()}`, foto: formData.nama.substring(0, 2).toUpperCase(), color: randomColor }, ...pegawai]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, nama: '', nip: '', tglLahir: '', tmptLahir: '', pendidikan: '', jabatan: '' });
  };

  const handleDelete = () => {
    setPegawai(pegawai.filter(p => p.id !== selectedPegawai.id));
    setIsDeleteModalOpen(false);
  };

  const handleExport = (type) => {
    alert(`Mengekspor ${filteredData.length} data ke format ${type}...`);
    setIsExportOpen(false);
  };

  return (
    <div className="w-full min-h-screen text-white p-8 font-sans selection:bg-[#6d28d9]/30 bg-transparent text-left">
      
      {isLoading ? <SkeletonLoader /> : (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
          
          {/* HEADER SECTION (STANDARD STYLE) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex flex-col items-start space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6d28d9]/10 border border-[#6d28d9]/20">
                <Database size={14} className="text-[#6d28d9]" />
                <span className="text-[10px] font-bold text-[#6d28d9] uppercase tracking-[0.2em]">Modul Database</span>
              </div>
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-tight">
                  APARATUR <span className="text-[#6d28d9]">HUB.</span>
                </h2>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Filter Jabatan */}
              <div className="relative">
                <select 
                  value={filterJabatan} 
                  onChange={(e) => setFilterJabatan(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-10 text-[10px] font-black uppercase tracking-widest text-gray-300 focus:outline-none focus:border-[#6d28d9]/50 appearance-none cursor-pointer backdrop-blur-md"
                >
                  <option value="Semua">Semua Jabatan</option>
                  {daftarJabatan.map(j => <option key={j} value={j} className="bg-[#1a1a1e]">{j}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Cari..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 transition-all w-48 backdrop-blur-md" />
              </div>

              {/* Export Dropdown */}
              <div className="relative">
                <button onClick={() => setIsExportOpen(!isExportOpen)} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                  <Download size={16} /> Export
                </button>
                {isExportOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1e] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden p-1 animate-in slide-in-from-top-2">
                    <button onClick={() => handleExport('PDF')} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                      <FileText size={16} className="text-red-500" /> Dokumen PDF
                    </button>
                    <button onClick={() => handleExport('Excel')} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                      <TableIcon size={16} className="text-emerald-500" /> Spreadsheet Excel
                    </button>
                  </div>
                )}
              </div>

              {/* Add Button */}
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#6d28d9] hover:bg-[#7c3aed] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-[#6d28d9]/20 group">
                <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Tambah
              </button>
            </div>
          </div>

          {/* LIST CONTAINER */}
          <div className="grid grid-cols-1 gap-4">
            {filteredData.map((p) => (
              <div key={p.id} className="group relative bg-[#0f0f12]/60 backdrop-blur-xl border border-white/10 hover:border-[#6d28d9]/50 rounded-[2rem] p-6 transition-all shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="h-16 w-16 rounded-[1.5rem] flex items-center justify-center text-xl font-black border border-white/10 shadow-2xl shrink-0" 
                       style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                    {p.foto}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-bold text-white tracking-tight leading-none">{p.nama}</h4>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-white/10 text-gray-300 uppercase tracking-widest border border-white/10">{p.pendidikan}</span>
                    </div>
                    <p className="text-xs font-mono text-gray-500 tracking-widest">{p.nip}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-x-8 gap-y-1 shrink-0">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Briefcase size={14} style={{ color: p.color }} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{p.jabatan || 'Belum Terplot'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={14} className="text-gray-600" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">{p.tmptLahir}, {p.tglLahir}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setFormData(p); setIsModalOpen(true); }} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { setSelectedPegawai(p); setIsDeleteModalOpen(true); }} className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-gray-500 hover:text-red-500 transition-all border border-red-500/10">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.02] backdrop-blur-sm">
                <Users size={48} className="mx-auto text-gray-700 mb-4 opacity-20" />
                <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Data tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL FORM PEGAWAI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] backdrop-blur-md flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="bg-[#1a1a1e]/95 border border-white/10 p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] rounded-[2.5rem] max-w-md w-full relative overflow-hidden transform animate-in fade-in zoom-in duration-300">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6d28d9]/20 blur-[60px] rounded-full pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">{formData.id ? 'Update' : 'Registrasi'} Pegawai<span className="text-[#6d28d9]">.</span></h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Manajemen Profil & Jabatan</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2"><User size={10} /> Nama Lengkap</label>
                  <input autoFocus required type="text" placeholder="Nama & Gelar..." value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 font-medium transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2"><Briefcase size={10} /> Penempatan Jabatan</label>
                  <select required value={formData.jabatan} onChange={(e) => setFormData({...formData, jabatan: e.target.value})} className="w-full bg-[#1a1a1e] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 appearance-none cursor-pointer">
                    <option value="">Pilih Jabatan...</option>
                    <option value="Non-Jabatan">Tanpa Jabatan / Fungsional Umum</option>
                    {daftarJabatan.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2"><MapPin size={10} /> Kota Lahir</label>
                    <input required type="text" placeholder="Kota" value={formData.tmptLahir} onChange={(e) => setFormData({...formData, tmptLahir: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2"><Calendar size={10} /> Tanggal</label>
                    <input required type="date" value={formData.tglLahir} onChange={(e) => setFormData({...formData, tglLahir: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#6d28d9]/50 [color-scheme:dark]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-2"><GraduationCap size={10} /> Pendidikan</label>
                    <select required value={formData.pendidikan} onChange={(e) => setFormData({...formData, pendidikan: e.target.value})} className="w-full bg-[#1a1a1e] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 appearance-none">
                      <option value="">Jenjang</option>
                      {jenjangPendidikan.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest">NIP</label>
                    <input required type="text" placeholder="19XXXXXXXX" value={formData.nip} onChange={(e) => setFormData({...formData, nip: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6d28d9]/50 font-mono" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Batal</button>
                  <button type="submit" className="flex-[2] px-6 py-4 rounded-2xl bg-white text-[#1a1a1e] text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">{formData.id ? 'Update Profil' : 'Simpan Pegawai'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[1000] backdrop-blur-md flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="bg-[#1a1a1e] border border-red-500/20 p-8 shadow-2xl rounded-[2.5rem] max-w-sm w-full relative animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-2"><AlertTriangle size={32} /></div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Hapus Pegawai?</h3>
              <p className="text-xs text-gray-500 leading-relaxed px-4">Data <span className="text-white font-bold">{selectedPegawai?.nama}</span> akan dihapus permanen.</p>
              <div className="flex w-full gap-3 pt-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Batal</button>
                <button onClick={handleDelete} className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        [color-scheme:dark]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; cursor: pointer; }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.1; } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};

export default PetaJabatanSimple;