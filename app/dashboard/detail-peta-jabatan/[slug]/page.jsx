"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { toPng } from "html-to-image";
import {
  HiOutlineSave,
  HiOutlineZoomIn,
  HiOutlineZoomOut,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlineUserAdd,
  HiOutlineX,
  HiOutlineExclamation,
  HiOutlinePencilAlt,
  HiOutlineCheck,
  HiOutlineBan,
} from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const listPegawai = [
  "Drs. H. Ahmad Fauzi, M.Si",
  "Siti Aminah, S.E",
  "Budi Utomo",
  "Hj. Ratna Sari",
  "Ir. Bambang S.",
  "Dewi Sartika",
  "Belum Terisi",
];

const colors = {
  1: {
    border: "border-blue-500",
    text: "text-blue-500",
    bg: "bg-blue-500",
    hex: "#3b82f6",
  },
  2: {
    border: "border-emerald-500",
    text: "text-emerald-500",
    bg: "bg-emerald-500",
    hex: "#10b981",
  },
  3: {
    border: "border-amber-500",
    text: "text-amber-500",
    bg: "bg-amber-500",
    hex: "#f59e0b",
  },
  4: {
    border: "border-rose-500",
    text: "text-rose-500",
    bg: "bg-rose-500",
    hex: "#f43f5e",
  },
  5: {
    border: "border-sky-500",
    text: "text-sky-500",
    bg: "bg-sky-500",
    hex: "#0ea5e9",
  },
  6: {
    border: "border-indigo-500",
    text: "text-indigo-500",
    bg: "bg-indigo-500",
    hex: "#6366f1",
  },
};

// --- KOMPONEN CARD ---
const CustomNodeEditor = ({
  item,
  onUpdate,
  onAdd,
  onDeleteConfirm,
  isEditMode,
}) => {
  const style = colors[item.level] || colors[1];
  const selisih = (item.b || 0) - (item.abk || 0);

  return (
    <div className="inline-block p-4 relative group">
      <div
        className={`w-[280px] bg-[#151c21] border-2 ${style.border} rounded-[1.5rem] p-5 text-left shadow-2xl transition-all`}
      >
        {isEditMode && (
          <div className="absolute -top-1 -right-1 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            {item.id !== "root-1" && (
              <button
                onClick={() => onDeleteConfirm(item.id, item.jabatan)}
                className="p-2 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all shadow-red-500/20"
              >
                <HiOutlineTrash size={12} />
              </button>
            )}
            <button
              onClick={() => onAdd(item.id)}
              className="p-2 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-all shadow-emerald-500/20"
            >
              <HiOutlinePlus size={12} />
            </button>
          </div>
        )}

        {/* Header */}
        {isEditMode ? (
          <div className="flex justify-between items-center mb-3">
            <span
              className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10 ${style.text}`}
            >
              LVL {item.level}
            </span>
            <button
              onClick={() =>
                onUpdate(item.id, "pegawai", [...item.pegawai, "Belum Terisi"])
              }
              className="text-[8px] font-bold text-gray-400 hover:text-white bg-white/5 px-2 py-1 rounded-md border border-white/5 flex items-center gap-1 transition-colors"
            >
              <HiOutlineUserAdd size={10} /> TAMBAH SDM
            </button>
          </div>
        ) : (
          <div className="mt-1"></div>
        )}

        {/* Jabatan Section */}
        {isEditMode ? (
          <input
            type="text"
            value={item.jabatan}
            onChange={(e) => onUpdate(item.id, "jabatan", e.target.value)}
            className="w-full bg-transparent text-[10px] font-black text-white uppercase italic leading-tight mb-3 outline-none border-b border-white/5 focus:border-white/20 transition-all"
            placeholder="NAMA JABATAN"
          />
        ) : (
          <h4 className="text-[10px] font-black text-white uppercase italic leading-tight mb-3 h-8 line-clamp-2">
            {item.jabatan}
          </h4>
        )}

        {/* SDM List Section */}
        <div className="bg-black/30 rounded-xl p-2 border border-white/5 space-y-2">
          {item.pegawai.map((p, idx) => (
            <div key={idx} className="flex items-center gap-2 group/user">
              <div
                className={`w-1 h-1 rounded-full shrink-0 ${style.bg}`}
              ></div>
              {isEditMode ? (
                <>
                  <select
                    value={p}
                    onChange={(e) => {
                      const newList = [...item.pegawai];
                      newList[idx] = e.target.value;
                      onUpdate(item.id, "pegawai", newList);
                    }}
                    className="w-full bg-transparent text-[10px] text-gray-300 font-medium outline-none cursor-pointer"
                  >
                    {listPegawai.map((opt, i) => (
                      <option
                        key={i}
                        value={opt}
                        className="bg-[#151c21] text-white"
                      >
                        {opt}
                      </option>
                    ))}
                  </select>
                  {item.pegawai.length > 1 && (
                    <button
                      onClick={() =>
                        onUpdate(
                          item.id,
                          "pegawai",
                          item.pegawai.filter((_, i) => i !== idx),
                        )
                      }
                      className="text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <HiOutlineX size={10} />
                    </button>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-gray-300 font-medium truncate">
                  {p}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Stats Footer Section */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
          <div className="flex gap-4 text-[8px] font-bold text-gray-500 uppercase">
            {/* Tooltip Wrapper Utility */}
            <style
              dangerouslySetInnerHTML={{
                __html: `
              .stat-tooltip { position: relative; }
              .stat-tooltip .tooltip-text {
                position: absolute; bottom: 130%; left: 50%; transform: translateX(-50%);
                padding: 4px 8px; border-radius: 6px; background: #1a1a1e; border: 1px solid rgba(255,255,255,0.1);
                color: white; font-size: 7px; white-space: nowrap; opacity: 0; pointer-events: none;
                transition: all 0.2s ease; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
              }
              .stat-tooltip:hover .tooltip-text { opacity: 1; bottom: 150%; }
            `,
              }}
            />

            {/* Field Kelas Jabatan (kJ) */}
            <div className="flex flex-col stat-tooltip cursor-help">
              <span className="text-[7px] opacity-60">kJ</span>
              {isEditMode ? (
                <input
                  type="number"
                  value={item.kJ || 0}
                  onChange={(e) =>
                    onUpdate(item.id, "kJ", parseInt(e.target.value) || 0)
                  }
                  className="w-7 bg-transparent text-amber-400 outline-none border-b border-transparent focus:border-white/10"
                />
              ) : (
                <span className="text-amber-400">{item.kJ || 0}</span>
              )}
              <div className="tooltip-text font-black italic">
                KELAS JABATAN
              </div>
            </div>

            {/* Field Bezetting (BEZ) */}
            <div className="flex flex-col stat-tooltip cursor-help">
              <span className="text-[7px] opacity-60">BEZ</span>
              {isEditMode ? (
                <input
                  type="number"
                  value={item.b}
                  onChange={(e) =>
                    onUpdate(item.id, "b", parseInt(e.target.value) || 0)
                  }
                  className="w-7 bg-transparent text-white outline-none border-b border-transparent focus:border-white/10"
                />
              ) : (
                <span className="text-white">{item.b}</span>
              )}
              <div className="tooltip-text font-black italic">
                JUMLAH PEGAWAI SAAT INI
              </div>
            </div>

            {/* Field ABK */}
            <div className="flex flex-col stat-tooltip cursor-help">
              <span className="text-[7px] opacity-60">ABK</span>
              {isEditMode ? (
                <input
                  type="number"
                  value={item.abk}
                  onChange={(e) =>
                    onUpdate(item.id, "abk", parseInt(e.target.value) || 0)
                  }
                  className="w-7 bg-transparent text-white outline-none border-b border-transparent focus:border-white/10"
                />
              ) : (
                <span className="text-white">{item.abk}</span>
              )}
              <div className="tooltip-text font-black italic">
                ANALISIS BEBAN KERJA
              </div>
            </div>
          </div>

          <div className="stat-tooltip cursor-help">
            <div
              className={`px-3 py-1 rounded-lg text-[10px] font-black transition-colors ${selisih < 0 ? "text-red-500 bg-red-500/10" : "text-emerald-500 bg-emerald-500/10"}`}
            >
              {selisih}
            </div>
            <div className="tooltip-text font-black italic">
              SELISIH (BEZ - ABK)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA ---
const Page = () => {
  const [dataHirarki, setDataHirarki] = useState({
    id: "root-1",
    jabatan: "Kepala Dinas",
    pegawai: ["Drs. H. Ahmad Fauzi, M.Si"],
    level: 1,
    b: 1,
    abk: 1,
    children: [],
  });
  const [draftData, setDraftData] = useState(dataHirarki);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [scale, setScale] = useState(0.7);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    id: null,
    title: "",
  });

  const router = useRouter();

  const treeRef = useRef(null);

  useEffect(() => {
    setHasChanges(JSON.stringify(dataHirarki) !== JSON.stringify(draftData));
  }, [draftData, dataHirarki]);

  const updateNodeRecursive = useCallback((node, id, action, newData = {}) => {
    if (node.id === id) {
      if (action === "ADD_CHILD") {
        const newNode = {
          id: `node-${Math.random().toString(36).substr(2, 9)}`,
          jabatan: "Jabatan Baru",
          pegawai: ["Belum Terisi"],
          level: node.level + 1,
          b: 0,
          abk: 1,
          children: [],
        };
        return { ...node, children: [...(node.children || []), newNode] };
      }
      if (action === "UPDATE_FIELD") return { ...node, ...newData };
    }
    if (node.children)
      return {
        ...node,
        children: node.children.map((c) =>
          updateNodeRecursive(c, id, action, newData),
        ),
      };
    return node;
  }, []);

  const handleUpdate = (id, field, value) =>
    setDraftData((prev) =>
      updateNodeRecursive({ ...prev }, id, "UPDATE_FIELD", { [field]: value }),
    );
  const handleAddChild = (id) =>
    setDraftData((prev) => updateNodeRecursive({ ...prev }, id, "ADD_CHILD"));

  // --- DOWNLOADER SAKTI (Mencegah Terpotong) ---
  const handleDownloadImage = async () => {
    const node = treeRef.current;
    if (!node || isDownloading) return;

    try {
      setIsDownloading(true);
      const actualWidth = node.scrollWidth;
      const actualHeight = node.scrollHeight;

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 3,
        width: actualWidth + 150,
        height: actualHeight + 150,
        style: {
          transform: "scale(1)",
          transformOrigin: "top center",
          margin: "0",
          padding: "75px",
          display: "flex",
          justifyContent: "center",
          width: `${actualWidth}px`,
          height: `${actualHeight}px`,
        },
      });

      const link = document.createElement("a");
      link.download = `Peta-Jabatan-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download gagal:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderNodes = (node) => (
    <TreeNode
      key={node.id}
      style={{ "--line-color": colors[node.level]?.hex || "#334155" }}
      label={
        <CustomNodeEditor
          item={node}
          onUpdate={handleUpdate}
          onAdd={handleAddChild}
          onDeleteConfirm={(id, t) =>
            setDeleteModal({ show: true, id, title: t })
          }
          isEditMode={isEditMode}
        />
      }
    >
      {node.children && node.children.map(renderNodes)}
    </TreeNode>
  );

  return (
    <div
      className={`relative w-full h-screen overflow-hidden select-none bg-transparent ${isDownloading ? "cursor-wait" : ""}`}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `.org-tree-node-label + .org-tree-node-children .org-tree-node:before, .org-tree-node-label + .org-tree-node-children .org-tree-node:after, .org-tree-node-label + .org-tree-node-children:before { border-color: var(--line-color, #334155) !important; border-style: dashed !important; border-width: 2px !important; } .org-tree-node { padding: 0 20px !important; }`,
        }}
      />
      <div className="absolute left-6 top-6 z-[40] transition-all duration-300">
        <button
          onClick={() => router.back()}
          className="mt-0.5 group flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
        >
          <ArrowLeft
            className="text-slate-500 group-hover:text-indigo-500 transition-colors"
            size={18}
          />
        </button>
      </div>

      {/* MASTER CONTROL BAR (FIXED BOTTOM RIGHT) */}
      <div className="fixed right-6 bottom-6 z-[40] flex flex-row items-center gap-4 transition-all duration-300">
        {/* CSS Tooltip Utility */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .tooltip-trigger { position: relative; display: flex; align-items: center; }
          .tooltip-content {
            position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%);
            padding: 6px 10px; border-radius: 10px; background: rgba(26, 26, 30, 0.95); 
            border: 1px solid rgba(255,255,255,0.1); backdrop-blur-md;
            color: white; font-size: 9px; font-weight: 800; text-transform: uppercase; white-space: nowrap;
            pointer-events: none; opacity: 0; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4);
          }
          .tooltip-trigger:hover .tooltip-content { opacity: 1; bottom: 140%; }
        `,
          }}
        />

        {/* VIEWPORT DOCK */}
        <div className="flex items-center gap-2 p-2 rounded-[1.5rem] bg-[#1a1a1e]/80 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all opacity-60 hover:opacity-100 group/dock">
          <div className="tooltip-trigger">
            <button
              onClick={() => setScale((s) => Math.min(s + 0.1, 2))}
              className="p-2.5 bg-white/5 text-white/70 rounded-xl border border-white/5 hover:bg-indigo-600 hover:text-white transition-all"
            >
              <HiOutlineZoomIn size={16} />
            </button>
            <div className="tooltip-content">Zoom In</div>
          </div>

          <div className="tooltip-trigger">
            <button
              onClick={() => {
                setScale(0.7);
                setPosition({ x: 0, y: 0 });
              }}
              className="p-2.5 bg-white/5 text-white/50 rounded-xl border border-white/5 hover:bg-slate-700 hover:text-white text-[8px] font-black min-w-[45px]"
            >
              {Math.round(scale * 100)}%
            </button>
            <div className="tooltip-content">Reset View</div>
          </div>

          <div className="tooltip-trigger">
            <button
              onClick={() => setScale((s) => Math.max(s - 0.1, 0.2))}
              className="p-2.5 bg-white/5 text-white/70 rounded-xl border border-white/5 hover:bg-indigo-600 hover:text-white transition-all"
            >
              <HiOutlineZoomOut size={16} />
            </button>
            <div className="tooltip-content">Zoom Out</div>
          </div>

          <div className="h-6 w-[1px] bg-white/10 mx-1"></div>

          <div className="tooltip-trigger">
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className={`p-2.5 rounded-xl transition-all shadow-xl ${isDownloading ? "bg-indigo-600 text-white" : "bg-white text-[#1a1a1e] hover:scale-110"}`}
            >
              {isDownloading ? (
                <BiLoaderAlt className="animate-spin" size={16} />
              ) : (
                <HiOutlineSave size={16} />
              )}
            </button>
            <div className="tooltip-content">Ekspor PNG</div>
          </div>
        </div>
      </div>

      {/* CANVAS AREA */}
      <div
        onWheel={(e) =>
          setScale((s) =>
            Math.min(Math.max(s + (e.deltaY > 0 ? -0.05 : 0.05), 0.2), 2),
          )
        }
        onMouseDown={(e) => {
          if (!["INPUT", "SELECT", "BUTTON"].includes(e.target.tagName)) {
            setIsDragging(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseMove={(e) => {
          if (isDragging) {
            setPosition((p) => ({
              x: p.x + (e.clientX - lastMousePos.x),
              y: p.y + (e.clientY - lastMousePos.y),
            }));
            setLastMousePos({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing bg-transparent"
      >
        <div
          ref={treeRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
            transformOrigin: "center center",
          }}
          className="inline-block p-20"
        >
          <Tree
            lineWidth={"2px"}
            lineColor={"#334155"}
            lineStyle={"dashed"}
            label={
              <CustomNodeEditor
                item={draftData}
                onUpdate={handleUpdate}
                onAdd={handleAddChild}
                onDeleteConfirm={(id, t) =>
                  setDeleteModal({ show: true, id, title: t })
                }
                isEditMode={isEditMode}
              />
            }
          >
            {draftData.children.map(renderNodes)}
          </Tree>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    </div>
  );
};

export default Page;
