"use server";

import { prisma } from "../lib/db";

export async function savePetaJabatan(opdId, treeData) {
  try {
    // 1. Helper meratakan Tree (Sama seperti sebelumnya)
    const flattenNodes = (node, parentId = null) => {
      let nodes = [];
      const { children, ...currentData } = node;
      nodes.push({ ...currentData, parentId: parentId });
      if (children && children.length > 0) {
        children.forEach((child) => {
          nodes = nodes.concat(flattenNodes(child, node.id));
        });
      }
      return nodes;
    };

    const flatNodes = flattenNodes(treeData);

    // Ambil semua ID yang dikirim dari UI (yang berupa angka/ID asli DB)
    const activeIdsFromUI = flatNodes
      .map((n) => parseInt(n.id))
      .filter((id) => !isNaN(id));

    return await prisma.$transaction(
      async (tx) => {
        // --- TAHAP 1: DELETE JABATAN YANG SUDAH TIDAK ADA DI UI ---
        // Kita hapus semua jabatan di OPD ini yang ID-nya TIDAK ada dalam kiriman UI
        // Karena kita pakai onDelete: Cascade di schema (seharusnya),
        // maka menghapus parent akan menghapus child secara otomatis.
        // Jika tidak Cascade, kita harus hapus dari level terdalam dulu.
        await tx.jabatan.deleteMany({
          where: {
            opdId: opdId,
            id: {
              notIn: activeIdsFromUI,
            },
          },
        });

        // Map untuk relasi ID temporary
        const idMap = {};

        // --- TAHAP 2: UPSERT DATA (Seperti sebelumnya) ---
        for (const node of flatNodes) {
          const rawId = node.id.toString();
          const isNewNode =
            rawId.startsWith("node-") ||
            rawId.startsWith("root-") ||
            isNaN(parseInt(rawId));
          const safeIdForWhere = isNewNode ? -1 : parseInt(rawId);

          const getSafeParentId = (pId) => {
            if (!pId) return null;
            if (idMap[pId]) return idMap[pId];
            const parsed = parseInt(pId);
            return isNaN(parsed) ? null : parsed;
          };

          const parentIdValue = getSafeParentId(node.parentId);

          const savedJabatan = await tx.jabatan.upsert({
            where: { id: safeIdForWhere },
            update: {
              namaJabatan: node.jabatan,
              level: node.level,
              kJ: node.kJ || 0,
              b: node.b || 0,
              aBK: node.abk || 0,
              parentId: parentIdValue,
            },
            create: {
              namaJabatan: node.jabatan,
              level: node.level,
              kJ: node.kJ || 0,
              b: node.b || 0,
              aBK: node.abk || 0,
              opdId: opdId,
              parentId: parentIdValue,
            },
          });

          idMap[node.id] = savedJabatan.id;

          // --- PROSES PEGAWAI ---
          await tx.pegawai.updateMany({
            where: { jabatanId: savedJabatan.id },
            data: { jabatanId: null },
          });

          const selectedPegawaiIds = node.pegawai
            .filter((p) => p !== "Belum Terisi" && !isNaN(parseInt(p)))
            .map((p) => parseInt(p));

          if (selectedPegawaiIds.length > 0) {
            await tx.pegawai.updateMany({
              where: { id: { in: selectedPegawaiIds } },
              data: { jabatanId: savedJabatan.id },
            });
          }
        }

        return { success: true };
      },
      {
        timeout: 15000, // Naikkan sedikit timeout karena ada proses delete
      },
    );
  } catch (error) {
    console.error("Gagal simpan peta jabatan:", error);
    return { success: false, error: error.message };
  }
}
