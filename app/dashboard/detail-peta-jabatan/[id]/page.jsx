"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { toPng } from "html-to-image";
import { useUser } from "@clerk/nextjs";
import { getListPegawaiByIdInstansi } from "@/app/actions/get-list-pegawai-by-id-instansi";
import { getPetaJabatan } from "@/app/actions/get-data-peta-jabatan";
import { useParams, useRouter } from "next/navigation";
import LoadingPetaJabatan from "@/components/loading-peta-jabatan";
import CustomNodeEditor from "@/components/custom-node-editor";
import ControllPanelPetaJabatanAdminInduk from "@/components/controll-pannel-peta-jabatan-admin-induk";
import { ArrowLeft } from "lucide-react";

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

// --- KOMPONEN UTAMA ---
const PetaJabatanEditor = () => {
  const treeRef = useRef(null);
  const [dataHirarki, setDataHirarki] = useState(null);
  const [draftData, setDraftData] = useState(null);
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
  const [listPegawai, setListPegawai] = useState([]);
  const [namaInstansi, setNamaInstansi] = useState("");

  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // Bungkus fungsi fetch agar reusable
  const loadInitialData = useCallback(async () => {
    if (!isLoaded || !user) return;

    try {
      setIsLoading(true);

      const [listPegawaiRes, treeDataRes] = await Promise.all([
        getListPegawaiByIdInstansi(Number(id)),
        getPetaJabatan(Number(id)),
      ]);
      setListPegawai(listPegawaiRes?.list || []);
      setDataHirarki(treeDataRes);
      setDraftData(treeDataRes); // Sekarang ID sudah pasti angka dari DB
      setNamaInstansi(listPegawaiRes?.opd?.namaOpd || "");
    } catch (error) {
      // console.error("Gagal load data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    setHasChanges(JSON.stringify(dataHirarki) !== JSON.stringify(draftData));
  }, [draftData, dataHirarki]);

  const updateNodeRecursive = (node, id, action, newData = {}) => {
    // 1. Jika ini node yang dicari
    if (node.id === id) {
      if (action === "ADD_CHILD") {
        const newNode = {
          id: `node-${Math.random().toString(36).substr(2, 9)}`,
          jabatan: "Jabatan Baru",
          pegawai: ["Belum Terisi"],
          level: node.level + 1,
          kJ: 0,
          b: 0,
          abk: 1,
          children: [],
        };
        return { ...node, children: [...(node.children || []), newNode] };
      }

      if (action === "UPDATE_FIELD") {
        // Ini akan mengupdate field apapun (jabatan, pegawai, kJ, dll)
        return { ...node, ...newData };
      }
    }

    // 2. Jika bukan, cari di anak-anaknya (Rekursi)
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: node.children.map((child) =>
          updateNodeRecursive(child, id, action, newData),
        ),
      };
    }

    return node;
  };

  // Di dalam komponen PetaJabatanEditor:
  const handleUpdate = (id, field, value) => {
    setDraftData((prev) => {
      // Kita jalankan rekursi mulai dari root (prev)
      return updateNodeRecursive({ ...prev }, id, "UPDATE_FIELD", {
        [field]: value,
      });
    });
  };

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
      // console.error("Download gagal:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderNodes = useCallback(
    (node) => (
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
            listPegawai={listPegawai} // <--- SEKARANG INI AKAN UPDATE
          />
        }
      >
        {node.children && node.children.map((child) => renderNodes(child))}
      </TreeNode>
    ),
    [listPegawai, isEditMode, handleUpdate, handleAddChild],
  );

  if (isLoading) {
    return <LoadingPetaJabatan />;
  }

  // --- LOGIC EMPTY STATE ---
  const isDataEmpty =
    !draftData ||
    draftData.id === "root-1" ||
    draftData.jabatan.includes("(Default)");
  if (isDataEmpty) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center  overflow-hidden">
        {/* Background Grid yang sama agar konsisten */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Back Button tetap ada agar user tidak terjebak */}
        <div className="absolute z-50 top-5 left-5">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md transition-all duration-300"
          >
            <ArrowLeft
              size={18}
              className="text-gray-400 group-hover:text-white"
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">
              Kembali
            </span>
          </button>
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-md px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4">
            <span className="text-rose-500 text-3xl font-black">!</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">
              Peta Jabatan Belum Tersedia
              <span className="text-rose-500">.</span>
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              <span className="text-white font-bold uppercase">
                {namaInstansi}
              </span>{" "}
              belum melakukan input struktur organisasi ke dalam sistem.
            </p>
          </div>

          <div className="p-4 bg-[#1a1a1e]/40 border border-white/10 rounded-3xl">
            <p className="text-[10px] font-black text-[#6d28d9] uppercase tracking-widest mb-1">
              Tindakan Diperlukan
            </p>
            <p className="text-[11px] text-gray-400">
              Silahkan hubungi{" "}
              <span className="text-white italic">Admin Instansi</span> terkait
              untuk melakukan konfigurasi Peta Jabatan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-screen overflow-hidden select-none bg-transparent ${isDownloading ? "cursor-wait" : ""}`}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `.org-tree-node-label + .org-tree-node-children .org-tree-node:before, .org-tree-node-label + .org-tree-node-children .org-tree-node:after, .org-tree-node-label + .org-tree-node-children:before { border-color: var(--line-color, #334155) !important; border-style: dashed !important; border-width: 2px !important; } .org-tree-node { padding: 0 20px !important; }`,
        }}
      />

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
        <div className="absolute z-50 flex flex-row items-center justify-between top-5 left-5 right-5">
          {/* Tombol Kembali */}
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md transition-all duration-300 active:scale-95"
          >
            <ArrowLeft
              size={18}
              className="text-gray-400 group-hover:text-white group-hover:-translate-x-1 transition-all duration-300"
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
              Kembali
            </span>
          </button>

          {/* Nama Instansi - Premium Look */}
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-black text-white uppercase tracking-[0.2em] italic drop-shadow-md">
              {namaInstansi || "Memuat Data..."}
              <span className="text-[#6d28d9] ml-1">.</span>
            </h1>
            <div className="h-[2px] w-8 bg-gradient-to-r from-transparent via-[#6d28d9] to-transparent mt-1 opacity-50" />
          </div>

          {/* Spacer agar h1 tetap di tengah */}
          <div className="w-[100px]" />
        </div>
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
                item={draftData} // Ini untuk Root (Kepala Dinas)
                onUpdate={handleUpdate}
                onAdd={handleAddChild}
                onDeleteConfirm={(id, t) =>
                  setDeleteModal({ show: true, id, title: t })
                }
                isEditMode={isEditMode}
                listPegawai={listPegawai} // <--- Pastikan ini ada!
              />
            }
          >
            {draftData.children.map(renderNodes)}
          </Tree>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* MASTER CONTROL BAR (FIXED BOTTOM RIGHT) */}
      <ControllPanelPetaJabatanAdminInduk
        isDownloading={isDownloading}
        handleDownloadImage={handleDownloadImage}
        setPosition={setPosition}
        setScale={setScale}
        scale={scale}
      />
    </div>
  );
};

export default PetaJabatanEditor;
