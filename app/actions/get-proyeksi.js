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
            statusKeluar: true,
            tahunKeluar: true,
          },
        },
        proyeksiKeluar: {
          include: {
            pegawai: {
              select: {
                nama: true,
                nip: true,
              },
            },
          },
        },
      },
    });

    const formattedData = dataJabatan.flatMap((jab) => {
      // 1. Ambil Pegawai Aktif
      const aktif = jab.pegawai.map((p) => ({
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
        statusKeluar: p.statusKeluar, // Dari field manual di tabel Pegawai
        tahunKeluar: p.tahunKeluar,
      }));

      // 2. Ambil Riwayat Pengosongan (Mutasi/Meninggal/Dini)
      const riwayat = jab.proyeksiKeluar.map((h) => ({
        id: `history-${h.id}`,
        nama: h.pegawai?.nama || "(PEGAWAI PINDAH)",
        nip: h.pegawai?.nip || "-",
        jabatan: jab.namaJabatan,
        level: jab.level,
        tglLahir: null, // Riwayat tidak butuh cek umur pensiun lagi
        abk: jab.aBK || 0,
        isEmpty: false,
        statusKeluar: h.alasan?.toUpperCase(), // Ambil alasan dari tabel ProyeksiKeluar
        tahunKeluar: h.tahun, // Ambil tahun dari tabel ProyeksiKeluar
      }));

      const combined = [...aktif, ...riwayat];

      // JIKA KOSONG TOTAL
      if (combined.length === 0) {
        return [
          {
            id: `empty-${jab.id}`,
            nama: "-",
            nip: "-",
            jabatan: jab.namaJabatan,
            level: jab.level,
            tglLahir: null,
            abk: jab.aBK || 0,
            isEmpty: true,
          },
        ];
      }

      return combined;
    });

    const sortedData = formattedData.sort((a, b) => a.level - b.level);

    return { success: true, data: sortedData };
  } catch (error) {
    console.error("Fetch Proyeksi Error:", error);
    return { success: false, error: "Gagal memuat data proyeksi" };
  }
}
