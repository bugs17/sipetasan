"use server";

import { prisma } from "../lib/db";

export async function getPetaJabatan(opdId) {
  try {
    const allJabatans = await prisma.jabatan.findMany({
      where: { opdId: opdId },
      include: {
        pegawai: {
          select: {
            id: true, // Ambil ID-nya!
            nama: true,
          },
        },
      },
      orderBy: { level: "asc" }, // Opsional: agar urutan lebih teratur
    });

    if (allJabatans.length === 0) {
      return {
        id: "root-1",
        jabatan: "Kepala Instansi (Default)",
        pegawai: ["Belum Terisi"],
        level: 1,
        kJ: 0,
        b: 0,
        abk: 1,
        children: [],
      };
    }

    const buildTree = (parentId = null) => {
      return allJabatans
        .filter((j) => j.parentId === parentId)
        .map((j) => ({
          id: j.id.toString(),
          jabatan: j.namaJabatan,
          // PERBAIKAN DI SINI:
          // Kita kirim array ID pegawai, bukan nama.
          // UI akan melakukan lookup nama menggunakan listPegawai
          pegawai:
            j.pegawai.length > 0
              ? j.pegawai.map((p) => p.id) // Ambil ID (integer)
              : ["Belum Terisi"],
          level: j.level,
          kJ: j.kJ,
          b: j.b,
          abk: j.aBK,
          children: buildTree(j.id),
        }));
    };

    const tree = buildTree(null);
    return tree[0] || null;
  } catch (error) {
    console.error("Gagal mengambil Peta Jabatan:", error);
    throw new Error("Gagal load data");
  }
}
