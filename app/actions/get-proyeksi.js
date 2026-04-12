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
      // JIKA TIDAK ADA PEGAWAI
      if (jab.pegawai.length === 0) {
        return [
          {
            id: `empty-${jab.id}`, // ID unik sementara
            nama: "-", // Kosongkan nama
            nip: "-",
            jabatan: jab.namaJabatan,
            level: jab.level,
            tglLahir: null, // Penting: null agar tidak error saat new Date()
            abk: jab.aBK || 0,
            isEmpty: true, // Flag tambahan jika ingin styling khusus di UI
          },
        ];
      }

      // JIKA ADA PEGAWAI
      return jab.pegawai.map((p) => ({
        id: p.id,
        nama: p.nama,
        nip: p.nip,
        jabatan: jab.namaJabatan,
        level: jab.level,
        tglLahir: p.tanggalLahir
          ? p.tanggalLahir.toISOString().split("T")[0]
          : null,
        abk: jab.aBK || 0,
        isEmpty: false,
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
