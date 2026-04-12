"use server";

import { prisma } from "../lib/db";

export async function getProyeksiData(opdId) {
  try {
    const dataJabatan = await prisma.jabatan.findMany({
      where: {
        opdId: Number(opdId),
      },
      include: {
        pegawai: {
          select: {
            id: true,
            nama: true,
            nip: true,
            tanggalLahir: true,
          },
        },
      },
    });

    // Transformasi agar sesuai dengan kebutuhan Page Proyeksi
    const formattedData = dataJabatan.flatMap((jab) => {
      // Jika satu jabatan punya multiple pegawai (misal: fungsional/staf)
      return jab.pegawai.map((p) => ({
        id: p.id,
        nama: p.nama,
        nip: p.nip,
        jabatan: jab.namaJabatan, // Nama jabatan dari parent
        level: jab.level,
        tglLahir: p.tanggalLahir.toISOString().split("T")[0],
        abk: jab.aBK || 0,
      }));
    });

    const sortedData = formattedData.sort((a, b) => a.level - b.level);

    return { success: true, data: sortedData };
  } catch (error) {
    console.error("Fetch Proyeksi Error:", error);
    return {
      success: false,
      error: "Gagal memuat data proyeksi dari database",
    };
  }
}
