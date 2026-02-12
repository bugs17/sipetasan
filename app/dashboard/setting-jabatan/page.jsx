"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Users, X, Home, Save, ZoomIn, ZoomOut, RotateCcw, Briefcase, Pencil, Map as MapIcon } from 'lucide-react';

// --- Konfigurasi Warna ---
const LEVEL_COLORS = [
  "border-indigo-500 shadow-indigo-500/20",
  "border-emerald-500 shadow-emerald-500/20",
  "border-amber-500 shadow-amber-500/20",
  "border-rose-500 shadow-rose-500/20",
  "border-sky-500 shadow-sky-500/20"
];

// Helper untuk mengambil border class saja tanpa shadow untuk garis hirarki
const BORDER_ONLY_COLORS = [
  "border-indigo-500",
  "border-emerald-500",
  "border-amber-500",
  "border-rose-500",
  "border-sky-500"
];

const ICON_COLORS = [
  "text-indigo-500", "text-emerald-500", "text-amber-500", "text-rose-500", "text-sky-500"
];

// --- 1. DATA DUMMY ---
const DUMMY_DATABASE_RESPONSE = [
  { "id_kursi": "KURSI-ROOT-001", "nama_jabatan": "KEPALA DINAS", "kJ": 1, "id_atasan": null },
  { "id_kursi": "KURSI-101", "nama_jabatan": "SEKRETARIS", "kJ": 1, "id_atasan": "KURSI-ROOT-001" },
  { "id_kursi": "KURSI-102", "nama_jabatan": "KABID INFORMATIKA", "kJ": 1, "id_atasan": "KURSI-ROOT-001" }
];

const buildTree = (flatData) => {
  const map = {};
  const tree = [];
  flatData.forEach(item => {
    map[item.id_kursi] = { id: item.id_kursi, namaJabatan: item.nama_jabatan, kJ: item.kJ, children: [] };
  });
  flatData.forEach(item => {
    if (item.id_atasan && map[item.id_atasan]) {
      map[item.id_atasan].children.push(map[item.id_kursi]);
    } else if (item.id_atasan === null) {
      tree.push(map[item.id_kursi]);
    }
  });
  return tree;
};

export default function HierarchyBuilder() {
  const [scale, setScale] = useState(1);
  const [hierarchy, setHierarchy] = useState(buildTree(DUMMY_DATABASE_RESPONSE));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [targetParentId, setTargetParentId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(hierarchy.length === 0);
  const [formData, setFormData] = useState({ nama: '', kj: 1 });

  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const handleMiniMapClick = (e) => {
    if (!containerRef.current || !contentRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const scrollWidth = contentRef.current.offsetWidth * scale;
    const scrollHeight = contentRef.current.offsetHeight * scale;
    containerRef.current.scrollTo({
      left: x * scrollWidth - containerRef.current.offsetWidth / 2,
      top: y * scrollHeight - containerRef.current.offsetHeight / 2,
      behavior: 'smooth'
    });
  };

  const addSubordinate = (parentId, newJabatan) => {
    const updateRecursive = (list) => {
      return list.map(item => {
        if (item.id === parentId) return { ...item, children: [...item.children, newJabatan] };
        if (item.children.length > 0) return { ...item, children: updateRecursive(item.children) };
        return item;
      });
    };
    setHierarchy(updateRecursive(hierarchy));
  };

  const updateJabatan = (id, updatedData) => {
    const editRecursive = (list) => {
      return list.map(item => {
        if (item.id === id) return { ...item, namaJabatan: updatedData.nama, kJ: updatedData.kj };
        if (item.children.length > 0) return { ...item, children: editRecursive(item.children) };
        return item;
      });
    };
    setHierarchy(editRecursive(hierarchy));
  };

  const deleteJabatan = (id) => {
    if (hierarchy.length > 0 && hierarchy[0].id === id) {
        if(confirm("Menghapus pimpinan tertinggi akan menghapus seluruh struktur. Lanjutkan?")) {
            setHierarchy([]);
            setIsSetupModalOpen(true);
        }
        return;
    }
    const deleteRecursive = (list) => {
      return list
        .filter(item => item.id !== id)
        .map(item => ({ ...item, children: deleteRecursive(item.children) }));
    };
    setHierarchy(deleteRecursive(hierarchy));
  };

  const handleSave = () => {
    if (hierarchy.length === 0) return alert("Struktur kosong!");
    const flattenedData = [];
    const processNode = (node, parentId = null) => {
      flattenedData.push({ id_kursi: node.id, nama_jabatan: node.namaJabatan, kJ: node.kJ, id_atasan: parentId });
      node.children.forEach(child => processNode(child, node.id));
    };
    processNode(hierarchy[0]);
    console.log("JSON:", JSON.stringify(flattenedData, null, 2));
    alert("Berhasil! Cek console untuk data database.");
  };

  const handleOpenAddModal = (parentId) => {
    setIsEditMode(false);
    setTargetParentId(parentId);
    setFormData({ nama: '', kj: 1 });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (node) => {
    setIsEditMode(true);
    setEditingId(node.id);
    setFormData({ nama: node.namaJabatan, kj: node.kJ });
    setIsModalOpen(true);
  };

  const handleCreateRoot = (e) => {
    e.preventDefault();
    if (formData.nama.trim()) {
        setHierarchy([{ id: `KURSI-${Date.now()}`, namaJabatan: formData.nama, kJ: formData.kj, children: [] }]);
        setIsSetupModalOpen(false);
        setFormData({ nama: '', kj: 1 });
    }
  };

  const handleSubmitModal = (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) return;
    if (isEditMode) {
      updateJabatan(editingId, formData);
    } else {
      addSubordinate(targetParentId, {
        id: `KURSI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        namaJabatan: formData.nama,
        kJ: formData.kj,
        children: []
      });
    }
    setIsModalOpen(false);
    setFormData({ nama: '', kj: 1 });
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
        {/* Style tag untuk animasi garis mengalir */}
        <style dangerouslySetInnerHTML={{ __html: `
            @keyframes dash-flow {
                to { stroke-dashoffset: -20; border-style: dashed; }
            }
            .flow-line {
                border-style: dashed !important;
                border-dasharray: 8;
                animation: dash-flow 0.5s linear infinite;
            }
        `}} />
      
      {/* PANEL CONTROL */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-2 p-2 rounded-[1.5rem] bg-[#1a1a1e]/80 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all duration-500 opacity-40 hover:opacity-100 group/dock">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none rounded-[1.5rem]" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>
        <div className="flex flex-col gap-2 relative z-10">
            <div className="relative group/item flex items-center">
                <button onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="p-2.5 bg-white/5 text-white/70 rounded-xl border border-white/5 transition-all duration-300 hover:scale-150 hover:-translate-x-3 hover:bg-indigo-600 hover:text-white shadow-lg"><ZoomIn className="w-4 h-4" /></button>
                <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/item:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover/item:translate-x-0 shadow-xl whitespace-nowrap border border-white/10">Zoom In</span>
            </div>
            <div className="relative group/item flex items-center">
                <button onClick={() => setScale(1)} className="flex items-center justify-center bg-white/5 text-white/50 w-9 h-9 rounded-xl border border-white/5 transition-all duration-300 hover:scale-150 hover:-translate-x-3 hover:bg-slate-700 hover:text-white text-[8px] font-black">{Math.round(scale * 100)}%</button>
                <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/item:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover/item:translate-x-0 shadow-xl whitespace-nowrap border border-white/10">Reset Zoom</span>
            </div>
            <div className="relative group/item flex items-center">
                <button onClick={() => setScale(s => Math.max(s - 0.1, 0.2))} className="p-2.5 bg-white/5 text-white/70 rounded-xl border border-white/5 transition-all duration-300 hover:scale-150 hover:-translate-x-3 hover:bg-indigo-600 hover:text-white shadow-lg"><ZoomOut className="w-4 h-4" /></button>
                <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/item:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover/item:translate-x-0 shadow-xl whitespace-nowrap border border-white/10">Zoom Out</span>
            </div>
        </div>
        <div className="w-6 h-[1px] bg-white/10 my-1"></div>
        <div className="flex flex-col gap-2 relative z-10">
            {hierarchy.length > 0 && (
                <div className="relative group/item flex items-center">
                    <button onClick={() => {setHierarchy([]); setIsSetupModalOpen(true);}} className="p-2.5 bg-rose-500/10 text-rose-500/70 rounded-xl border border-rose-500/10 transition-all duration-300 hover:scale-150 hover:-translate-x-3 hover:bg-rose-500 hover:text-white shadow-lg"><RotateCcw className="w-4 h-4" /></button>
                    <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/item:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover/item:translate-x-0 shadow-xl whitespace-nowrap border border-white/10">Reset Struktur</span>
                </div>
            )}
            <div className="relative group/item flex items-center">
                <button onClick={handleSave} className="p-2.5 bg-white text-[#1a1a1e] rounded-xl transition-all duration-300 hover:scale-150 hover:-translate-x-3 shadow-xl"><Save className="w-4 h-4" /></button>
                <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-white text-[#1a1a1e] text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/item:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover/item:translate-x-0 shadow-xl whitespace-nowrap border border-black/10">Simpan Struktur</span>
            </div>
        </div>
      </div>

      {/* MINI MAP INTERAKTIF */}
      <div onClick={handleMiniMapClick} className="fixed bottom-6 right-4 w-40 h-28 bg-[#1a1a1e]/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden cursor-crosshair group/map transition-all hover:w-56 hover:h-40 opacity-40 hover:opacity-100 z-50">
        <div className="absolute top-2 left-3 z-10 flex items-center gap-2">
            <MapIcon className="w-2.5 h-2.5 text-white/30" />
            <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">Trackpad</p>
        </div>
        <div className="w-full h-full flex items-center justify-center p-2 scale-[0.1] origin-center opacity-50">
            <div className="flex justify-center">
                {hierarchy.map((node) => (
                    <div key={node.id} className="flex flex-col items-center gap-4">
                        <div className="w-32 h-16 bg-indigo-500 rounded-lg"></div>
                        {node.children.length > 0 && (
                            <div className="flex gap-8 pt-8 border-t-2 border-white/20">
                                {node.children.map(child => (
                                    <div key={child.id} className="w-24 h-12 bg-white/40 rounded-lg"></div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
      </div>

      {/* Area Kanvas Utama */}
      <div ref={containerRef} className="w-full h-screen overflow-auto flex justify-center items-start pt-32 pb-40 text-center bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:40px_40px]">
        <div ref={contentRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.2s' }} className="flex justify-center min-w-max px-20">
          {hierarchy.length > 0 ? (
            hierarchy.map((node) => (
              <JabatanCard 
                key={node.id} node={node} level={0} 
                onOpenModal={handleOpenAddModal} 
                onEdit={handleOpenEditModal}
                onDelete={deleteJabatan} 
              />
            ))
          ) : (
            <div className="flex flex-col items-center gap-6 animate-pulse mt-20">
                <div className="p-6 bg-indigo-500/10 rounded-full border border-indigo-500/30"><Home className="w-12 h-12 text-indigo-500" /></div>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm text-center leading-relaxed">Belum ada struktur.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Setup Root */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 z-[999] backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1a1a1e]/90 border border-indigo-500/20 p-8 shadow-2xl rounded-[2.5rem] max-w-md w-full relative overflow-hidden transform animate-in fade-in zoom-in duration-300">
            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Setup Pimpinan</h3>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Inisialisasi Jabatan Tertinggi</p>
              </div>
              <form onSubmit={handleCreateRoot} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nama Jabatan Utama</label>
                  <input autoFocus required type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">(kJ)</label>
                  <input type="number" min="1" value={formData.kj} onChange={(e) => setFormData({...formData, kj: parseInt(e.target.value)})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none font-mono" />
                </div>
                <button type="submit" className="w-full px-6 py-4 rounded-xl bg-white text-[#1a1a1e] text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Mulai Membangun</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Tambah / Edit Bawahan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1a1a1e]/90 border border-white/10 p-8 shadow-2xl rounded-[2.5rem] max-w-md w-full relative overflow-hidden transform animate-in fade-in zoom-in duration-200">
            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{isEditMode ? 'Edit Data' : 'Tambah Bawahan'}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{isEditMode ? 'Perbarui Informasi Jabatan' : 'Input Jabatan Baru'}</p>
              </div>
              <form onSubmit={handleSubmitModal} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nama Jabatan</label>
                  <input autoFocus required type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">(kJ)</label>
                  <input type="number" min="1" value={formData.kj} onChange={(e) => setFormData({...formData, kj: parseInt(e.target.value)})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none font-mono" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-xl border border-white/5 text-[10px] font-black uppercase text-gray-400 hover:bg-white/5">Batal</button>
                  <button type="submit" className="flex-1 px-6 py-4 rounded-xl bg-white text-[#1a1a1e] text-[10px] font-black uppercase hover:bg-gray-200 shadow-xl">{isEditMode ? 'Simpan Perubahan' : 'Tambah Bawahan'}</button>
                </div>
              </form>
            </div>
          </div>
          <div className="fixed inset-0 z-[-1]" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}
    </div>
  );
}

function JabatanCard({ node, onOpenModal, onEdit, onDelete, level }) {
  const colorClass = LEVEL_COLORS[level % LEVEL_COLORS.length];
  const borderOnly = BORDER_ONLY_COLORS[level % BORDER_ONLY_COLORS.length];
  const iconColor = ICON_COLORS[level % ICON_COLORS.length];

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className={`w-64 bg-[#161b22] border-2 ${colorClass} p-6 rounded-[2rem] shadow-2xl transition-all relative z-10 group-hover:translate-y-[-4px]`}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
              <Users className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="flex gap-1">
              <button onClick={() => onEdit(node)} className="text-slate-600 hover:text-indigo-400 transition-colors p-1"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => onDelete(node.id)} className="text-slate-700 hover:text-rose-500 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <h3 className="text-white font-black uppercase text-[13px] tracking-tight mb-1 leading-tight min-h-[2.5rem] text-left">{node.namaJabatan}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${iconColor} bg-white/5 border border-white/5`}>LVL {level}</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{node.kJ} Formasi</span>
          </div>
          <button onClick={() => onOpenModal(node.id)} className="mt-5 w-full py-3 bg-white/5 hover:bg-indigo-500 hover:text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 group/btn">
            <Plus className="w-3 h-3 group-hover/btn:rotate-90 transition-transform" /> Tambah Bawahan
          </button>
        </div>
        
        {/* GARIS VERTIKAL TURUN DARI PARENT */}
        {node.children.length > 0 && (
          <div className={`w-px h-12 border-l-2 ${borderOnly} flow-line mx-auto opacity-50`}></div>
        )}
      </div>

      {node.children.length > 0 && (
        <div className={`relative flex pt-4 gap-12 border-t-2 ${borderOnly} flow-line mx-10 rounded-t-[3rem] opacity-80`}>
          {node.children.map((child) => (
            <JabatanCard 
                key={child.id} node={child} level={level + 1} 
                onOpenModal={onOpenModal} onEdit={onEdit} onDelete={onDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
}