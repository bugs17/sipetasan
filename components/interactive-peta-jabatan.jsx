"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { toPng } from "html-to-image";
import BadgePerubahanBelumDisimpan from "./badge-perubahan-belum-disimpan";
import ModalCanclePerubahan from "./modal-cancle-perubahan";
import ModalDeletePerubahan from "./modal-delete-perubahan";
import ControllPanel from "./controll-panel-editor-peta-jabatan";
import CustomNodeEditor from "./custom-node-editor";
import { getUser } from "@/app/actions/getUser";
import { useUser } from "@clerk/nextjs";
import { getListPegawaiByIdInstansi } from "@/app/actions/get-list-pegawai-by-id-instansi";
import { getPetaJabatan } from "@/app/actions/get-data-peta-jabatan";
import { savePetaJabatan } from "@/app/actions/add-data-peta-jabatan";
import LoadingPetaJabatan from "./loading-peta-jabatan";
import toast from "react-hot-toast";

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
  const [cancelModal, setCancelModal] = useState(false);
  const [listPegawai, setListPegawai] = useState([]);

  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Bungkus fungsi fetch agar reusable
  const loadInitialData = useCallback(async () => {
    if (!isLoaded || !user) return;

    try {
      setIsLoading(true);
      const res = await getUser(user.id);

      const [listPegawaiRes, treeDataRes] = await Promise.all([
        getListPegawaiByIdInstansi(res.opdId),
        getPetaJabatan(res.opdId),
      ]);
      setListPegawai(listPegawaiRes);
      setDataHirarki(treeDataRes);
      setDraftData(treeDataRes); // Sekarang ID sudah pasti angka dari DB
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

  const executeDelete = () => {
    const deleteRecursive = (node, id) => ({
      ...node,
      children: (node.children || [])
        .filter((c) => c.id !== id)
        .map((c) => deleteRecursive(c, id)),
    });
    setDraftData((prev) => deleteRecursive({ ...prev }, deleteModal.id));
    setDeleteModal({ show: false, id: null, title: "" });
  };

  // Update fungsi handleSaveAll
  const handleSaveAll = async () => {
    try {
      const userData = await getUser(user.id);
      const result = await savePetaJabatan(userData.opdId, draftData);

      if (result.success) {
        // TRIGER REFETCH DISINI
        await loadInitialData();

        setIsEditMode(false);
        setHasChanges(false);
        toast.success("Perubahan berhasil disimpan", {
          duration: 2000,
        });
      } else {
        // console.log("Gagal simpan: ", result.error);
      }
    } catch (err) {
      console.log("Terjadi kesalahan.");
    }
  };

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

      {/* BADGE UNSAVED */}
      <BadgePerubahanBelumDisimpan hasChanges={hasChanges} />
      {/* cancle modal */}
      <ModalCanclePerubahan
        cancelModal={cancelModal}
        dataHirarki={dataHirarki}
        setCancelModal={setCancelModal}
        setDraftData={setDraftData}
        setIsEditMode={setIsEditMode}
      />
      {/* modal delete perubahan */}
      <ModalDeletePerubahan
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        executeDelete={executeDelete}
      />

      {/* MASTER CONTROL BAR (FIXED BOTTOM RIGHT) */}
      <ControllPanel
        isDownloading={isDownloading}
        handleDownloadImage={handleDownloadImage}
        handleSaveAll={handleSaveAll}
        hasChanges={hasChanges}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        setCancelModal={setCancelModal}
        setPosition={setPosition}
        setScale={setScale}
        scale={scale}
      />
    </div>
  );
};

export default PetaJabatanEditor;
