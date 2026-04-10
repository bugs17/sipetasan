"use server";

import { prisma } from "../lib/db";

export async function savePetaJabatan(opdId, treeData) {
  try {
    // 1. Fungsi Helper untuk meratakan Tree menjadi Array Datar
    const flattenNodes = (node, parentId = null) => {
      let nodes = [];
      const { children, ...currentData } = node;

      // Simpan data node saat ini
      nodes.push({
        ...currentData,
        parentId: parentId,
      });

      // Rekursi ke anak-anaknya
      if (children && children.length > 0) {
        children.forEach((child) => {
          nodes = nodes.concat(flattenNodes(child, node.id));
        });
      }
      return nodes;
    };

    const flatNodes = flattenNodes(treeData);

    // 2. Gunakan Transaction agar jika satu gagal, semua batal (Data Integrity)
    return await prisma.$transaction(
      async (tx) => {
        // Map untuk menyimpan relasi antara ID temporary (node-xxx / root-xxx) ke ID asli DB (Int)
        const idMap = {};

        for (const node of flatNodes) {
          // Tentukan apakah ini node baru atau lama berdasarkan format ID
          // Kita anggap baru jika ID mengandung string "node-" atau "root-" atau bukan angka murni
          const rawId = node.id.toString();
          const isNewNode =
            rawId.startsWith("node-") ||
            rawId.startsWith("root-") ||
            isNaN(parseInt(rawId));

          // Pastikan ID untuk 'where' valid (gunakan -1 jika baru/invalid agar lari ke create)
          const safeIdForWhere = isNewNode ? -1 : parseInt(rawId);

          // Helper untuk mendapatkan parentId yang valid dari idMap atau parse langsung
          const getSafeParentId = (pId) => {
            if (!pId) return null;
            // Cek di map dulu (siapa tahu parent-nya baru saja di-create di loop sebelumnya)
            if (idMap[pId]) return idMap[pId];
            // Jika tidak ada di map, coba parse (untuk node lama)
            const parsed = parseInt(pId);
            return isNaN(parsed) ? null : parsed;
          };

          const parentIdValue = getSafeParentId(node.parentId);

          // --- PROSES JABATAN (UPSERT) ---
          const savedJabatan = await tx.jabatan.upsert({
            where: {
              id: safeIdForWhere,
            },
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

          // Simpan mapping ID asli dari DB agar children-nya bisa mereferensi ID ini
          idMap[node.id] = savedJabatan.id;

          // --- PROSES PEGAWAI (SYNC RELASI) ---
          // 1. Reset: Semua pegawai yang sebelumnya terdaftar di jabatan ini dilepas dulu
          await tx.pegawai.updateMany({
            where: { jabatanId: savedJabatan.id },
            data: { jabatanId: null },
          });

          // 2. Assign: Pasang pegawai yang baru dipilih (filter hanya yang berupa ID angka)
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
        timeout: 10000, // Berikan timeout 10 detik karena operasi loop mungkin berat
      },
    );
  } catch (error) {
    console.error("Gagal simpan peta jabatan:", error);
    return { success: false, error: error.message };
  }
}
