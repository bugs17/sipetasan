"use server";

import { prisma } from "../lib/db";

export async function getPetaJabatan(opdId) {
  try {
    const condition = {
      opdId : opdId
    };

    const allJabatans = await prisma.jabatan.findMany({
      where: condition,
      include: {
        pegawai: {
          select: {
            id: true, // Ambil ID-nya!
            nama: true,
          },
        },
        tugas: true,
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
        .map((j) => {
          // 1. Hitung total KebutuhanPegawai dari array tugas
          const totalABK = j.tugas.reduce((acc, current) => {
            return acc + (current.KebutuhanPegawai || 0);
          }, 0);

          return {
            id: j.id.toString(),
            jabatan: j.namaJabatan,
            pegawai:
              j.pegawai.length > 0
                ? j.pegawai.map((p) => p.id) // Ambil ID (integer)
                : ["Belum Terisi"],
            level: j.level,
            kJ: j.kJ,
            b: j.pegawai.length,
            abk: totalABK,
            children: buildTree(j.id),
          };
        });
    };

    const tree = buildTree(null);
    return tree[0] || null;
  } catch (error) {
    console.error("Gagal mengambil Peta Jabatan:", error);
    throw new Error("Gagal load data");
  }
}
