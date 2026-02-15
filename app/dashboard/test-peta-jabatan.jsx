'use client'

import React, { useState, useRef } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { toPng } from 'html-to-image';
import { 
  HiOutlineSave,
  HiOutlineZoomIn,
  HiOutlineZoomOut,
  HiOutlineRefresh
} from 'react-icons/hi';
// Import spinner icon untuk efek loading
import { BiLoaderAlt } from 'react-icons/bi';

const PetaJabatanChart = () => {
  const [scale, setScale] = useState(0.7);
  const [isDragging, setIsDragging] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // State Loading
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const treeRef = useRef(null);

  const dataHirarki = {
    jabatan: "Kepala Dinas",
    pegawai: ["Drs. H. Ahmad Fauzi, M.Si"],
    level: 1, kl: 1, b: 1, abk: 1, selisih: 0,
    children: [
      {
        jabatan: "Kepala Bagian Umum",
        pegawai: ["Siti Aminah, S.E"],
        level: 2, kl: 1, b: 1, abk: 1, selisih: 0,
        children: [
          {
            jabatan: "Sub Bagian Kepegawaian",
            pegawai: ["Budi Utomo"],
            level: 3, kl: 1, b: 1, abk: 1, selisih: 0,
            children: [
              { 
                jabatan: "Pengelola Data", 
                pegawai: ["Randi", "Siska"], level: 4, kl: 2, b: 2, abk: 2, selisih: 0,
                children: [{ 
                    jabatan: "Administrasi Kepegawaian", pegawai: ["Andi"], level: 5, kl: 1, b: 1, abk: 1, selisih: 0,
                    children: [{ jabatan: "Operator SIMPEG", pegawai: ["Joko"], level: 6, kl: 1, b: 1, abk: 1, selisih: 0 }]
                }]
              }
            ]
          },
          {
            jabatan: "Sub Bagian Keuangan",
            pegawai: ["Hj. Ratna Sari"],
            level: 3, kl: 1, b: 1, abk: 1, selisih: 0,
            children: [
              { 
                jabatan: "Bendahara Pengeluaran", 
                pegawai: ["Maman"], level: 4, kl: 1, b: 1, abk: 1, selisih: 0,
                children: [
                  { 
                    jabatan: "Verifikator Keuangan", pegawai: ["Ujang"], level: 5, kl: 1, b: 1, abk: 1, selisih: 0,
                    children: [{ jabatan: "Arsiparis Keuangan", pegawai: ["Lilis"], level: 6, kl: 1, b: 1, abk: 2, selisih: -1 }]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        jabatan: "Kepala Bagian Perencanaan",
        pegawai: ["Ir. Bambang S."],
        level: 2, kl: 1, b: 1, abk: 1, selisih: 0,
        children: [
          {
            jabatan: "Sub Bagian Program",
            pegawai: ["Dewi Sartika"],
            level: 3, kl: 1, b: 1, abk: 1, selisih: 0,
            children: [
              { 
                jabatan: "Analis Data & Informasi", 
                pegawai: ["Eko"], level: 4, kl: 1, b: 1, abk: 2, selisih: -1,
                children: [{ 
                  jabatan: "Penyusun Laporan", pegawai: ["Rina"], level: 5, kl: 1, b: 1, abk: 1, selisih: 0,
                  children: [{ jabatan: "Staf Teknis Perencanaan", pegawai: ["Dedi"], level: 6, kl: 1, b: 0, abk: 1, selisih: -1 }]
                }]
              }
            ]
          }
        ]
      },
      {
        jabatan: "Kepala Bagian Logistik",
        pegawai: ["H. Mansyur, M.M"],
        level: 2, kl: 1, b: 1, abk: 1, selisih: 0,
        children: [
          {
            jabatan: "Sub Bagian Aset",
            pegawai: ["Ali Mudasir"],
            level: 3, kl: 1, b: 1, abk: 1, selisih: 0,
            children: [
              { jabatan: "Pengurus Barang", pegawai: ["Tono"], level: 4, kl: 1, b: 1, abk: 1, selisih: 0 }
            ]
          }
        ]
      },
      {
        jabatan: "Kepala Bagian Operasional",
        pegawai: ["Dr. Hendra"],
        level: 2, kl: 1, b: 1, abk: 1, selisih: 0,
        children: [
          {
            jabatan: "Sub Bagian Lapangan",
            pegawai: ["Yanto"],
            level: 3, kl: 1, b: 1, abk: 1, selisih: 0,
            children: [
              { jabatan: "Koordinator Regu", pegawai: ["Budi"], level: 4, kl: 1, b: 1, abk: 1, selisih: 0 }
            ]
          }
        ]
      },
      {
        jabatan: "Kepala Bagian Hubungan Masyarakat",
        pegawai: ["Maya Sofia, S.Sos"],
        level: 2, kl: 1, b: 1, abk: 1, selisih: 0,
        children: [
          {
            jabatan: "Sub Bagian Media",
            pegawai: ["Rian"],
            level: 3, kl: 1, b: 1, abk: 1, selisih: 0,
            children: [
              { jabatan: "Admin Sosmed", pegawai: ["Sari"], level: 4, kl: 1, b: 1, abk: 1, selisih: 0 }
            ]
          }
        ]
      }
    ]
  };

  const handleWheel = (e) => {
    if (isDownloading) return;
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.2), 2));
  };

  const handleMouseDown = (e) => {
    if (isDownloading) return;
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isDownloading) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDownload = async () => {
    const node = treeRef.current;
    if (!node || isDownloading) return;

    try {
      setIsDownloading(true); // Mulai loading

      const actualWidth = node.scrollWidth;
      const actualHeight = node.scrollHeight;

      const dataUrl = await toPng(node, {
        cacheBust: true,
        // Hapus backgroundColor agar hasil download TRANSPARENT
        pixelRatio: 3, // Tingkatkan ke 3 untuk ketajaman extra di presentasi
        width: actualWidth + 150, 
        height: actualHeight + 150,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top center',
          margin: '0',
          padding: '75px',
          display: 'flex',
          justifyContent: 'center',
          width: `${actualWidth}px`,
          height: `${actualHeight}px`,
        }
      });

      const link = document.createElement('a');
      link.download = `Peta-Jabatan-Transparent-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download gagal:', err);
    } finally {
      setIsDownloading(false); // Selesai loading
    }
  };

  const colors = {
    1: { border: 'border-blue-500', text: 'text-blue-500', bg: 'bg-blue-500', hex: '#3b82f6' },
    2: { border: 'border-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500', hex: '#10b981' },
    3: { border: 'border-amber-500', text: 'text-amber-500', bg: 'bg-amber-500', hex: '#f59e0b' },
    4: { border: 'border-rose-500', text: 'text-rose-500', bg: 'bg-rose-500', hex: '#f43f5e' },
    5: { border: 'border-sky-500', text: 'text-sky-500', bg: 'bg-sky-500', hex: '#0ea5e9' },
    6: { border: 'border-indigo-500', text: 'text-indigo-500', bg: 'bg-indigo-500', hex: '#6366f1' },
  };

  const CustomNode = ({ item }) => {
    const style = colors[item.level] || colors[1];
    return (
      <div className="inline-block p-4">
        <div className={`w-[240px] bg-[#151c21] border-2 ${style.border} rounded-[1.5rem] p-5 text-left shadow-2xl`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10 ${style.text}`}>
              LVL {item.level}
            </span>
            <div className="text-[8px] font-bold text-gray-600 uppercase italic">KL: {item.kl}</div>
          </div>
          <h4 className="text-[10px] font-black text-white uppercase italic leading-tight mb-3 h-8 line-clamp-2">{item.jabatan}</h4>
          <div className="bg-black/30 rounded-xl p-3 border border-white/5">
            <div className="space-y-1 max-h-20 overflow-y-auto custom-scrollbar">
              {item.pegawai.map((p, i) => (
                <div key={i} className="text-[10px] text-gray-300 font-medium truncate flex items-center gap-2">
                  <div className={`w-1 h-1 rounded-full ${style.bg}`}></div> {p}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
            <div className="flex gap-2 text-[8px] font-bold text-gray-500 uppercase">
              <span>B: <span className="text-white">{item.b}</span></span>
              <span>ABK: <span className="text-white">{item.abk}</span></span>
            </div>
            <div className={`px-2 py-0.5 rounded text-[10px] font-black ${item.selisih < 0 ? 'text-red-500 bg-red-500/10' : 'text-emerald-500 bg-emerald-500/10'}`}>
              {item.selisih}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNodes = (node) => {
    const parentStyle = colors[node.level] || colors[1];
    return (
      <TreeNode 
        style={{ '--line-color': parentStyle.hex }} 
        label={<CustomNode item={node} />}
      >
        {node.children && node.children.map((child, index) => (
          <React.Fragment key={index}>
            {renderNodes(child)}
          </React.Fragment>
        ))}
      </TreeNode>
    );
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden select-none ${isDownloading ? 'cursor-wait' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .org-tree-node-label + .org-tree-node-children .org-tree-node:before,
        .org-tree-node-label + .org-tree-node-children .org-tree-node:after,
        .org-tree-node-label + .org-tree-node-children:before {
          border-color: var(--line-color, #334155) !important;
          border-style: dashed !important;
          border-width: 2px !important;
        }
        .org-tree-node { padding-left: 20px !important; padding-right: 20px !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      ` }} />

      {/* NAV DOCK */}
      <div className={`fixed right-6 bottom-6 z-[20] flex flex-row items-center gap-2 p-2 rounded-[1.5rem] bg-[#1a1a1e]/80 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all duration-500 
        ${isDownloading ? 'opacity-40 pointer-events-none' : 'opacity-60 hover:opacity-100 group/dock'}`}>
        
        <div className="flex flex-row gap-2 relative z-10">
            <div className="relative group/item flex flex-col items-center">
                <button disabled={isDownloading} onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="p-2.5 bg-white/5 text-white/70 rounded-xl border border-white/5 hover:bg-indigo-600 hover:text-white transition-all"><HiOutlineZoomIn className="w-4 h-4" /></button>
                <span className="absolute bottom-full mb-4 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[9px] font-black opacity-0 group-hover/item:opacity-100 transition-all translate-y-2 group-hover/item:translate-y-0">Zoom In</span>
            </div>
            <div className="relative group/item flex flex-col items-center">
                <button disabled={isDownloading} onClick={() => {setScale(0.7); setPosition({x:0, y:0});}} className="p-2.5 bg-white/5 text-white/50 rounded-xl border border-white/5 hover:bg-slate-700 hover:text-white text-[8px] font-black">{Math.round(scale * 100)}%</button>
                <span className="absolute bottom-full mb-4 px-3 py-1.5 rounded-lg bg-slate-700 text-white text-[9px] font-black opacity-0 group-hover/item:opacity-100 transition-all translate-y-2 group-hover/item:translate-y-0">Reset</span>
            </div>
            <div className="relative group/item flex flex-col items-center">
                <button disabled={isDownloading} onClick={() => setScale(s => Math.max(s - 0.1, 0.2))} className="p-2.5 bg-white/5 text-white/70 rounded-xl border border-white/5 hover:bg-indigo-600 hover:text-white transition-all"><HiOutlineZoomOut className="w-4 h-4" /></button>
                <span className="absolute bottom-full mb-4 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[9px] font-black opacity-0 group-hover/item:opacity-100 transition-all translate-y-2 group-hover/item:translate-y-0">Zoom Out</span>
            </div>
        </div>
        <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
        <div className="flex flex-row gap-2 relative z-10">
            <button disabled={isDownloading} className="p-2.5 bg-rose-500/10 text-rose-500/70 rounded-xl border border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all"><HiOutlineRefresh className="w-4 h-4" /></button>
            <div className="relative group/item flex flex-col items-center">
                <button 
                  onClick={handleDownload} 
                  disabled={isDownloading}
                  className={`p-2.5 rounded-xl transition-all shadow-xl ${isDownloading ? 'bg-indigo-600 text-white' : 'bg-white text-[#1a1a1e] hover:scale-110'}`}
                >
                  {isDownloading ? <BiLoaderAlt className="w-4 h-4 animate-spin" /> : <HiOutlineSave className="w-4 h-4" />}
                </button>
                <span className="absolute bottom-full mb-4 px-3 py-1.5 rounded-lg bg-white text-[#1a1a1e] text-[9px] font-black opacity-0 group-hover/item:opacity-100 transition-all translate-y-2 group-hover/item:translate-y-0 whitespace-nowrap">
                  {isDownloading ? 'Memproses Gambar...' : 'Simpan Peta'}
                </span>
            </div>
        </div>
      </div>

      {/* CANVAS AREA */}
      <div 
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full flex items-center justify-center bg-transparent overflow-hidden ${isDownloading ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'}`}
      >
        <div 
          ref={treeRef}
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            transformOrigin: 'center center'
          }}
          className="inline-block"
        >
          <Tree
            lineWidth={'2px'}
            lineColor={'#334155'}
            lineStyle={'dashed'}
            label={<CustomNode item={dataHirarki} />}
          >
            {dataHirarki.children.map((child, index) => (
              <React.Fragment key={index}>
                {renderNodes(child)}
              </React.Fragment>
            ))}
          </Tree>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    </div>
  );
};

export default PetaJabatanChart;