"use server";

import { prisma } from "../lib/db";
import { formatTanggalMutasi } from "../utils/format-date";

export const getListMutasiByOpdId = async (opdId) => {
  try {
    if (!opdId) {
      throw new Error("Parameter opdId tidak ditemukan");
    }

    const listData = await prisma.mutasi.findMany({
      where: {
        opdAsalId: Number(opdId),
      },
      include: {
        pegawai: true,
        opdTujuan: true,
        berkasMutasi: true, // WAJIB: Supaya kita tahu status per file (valid/revisi)
      },
      orderBy: {
        updatedAt: "desc", // Opsional: Biar yang terbaru ada di atas
      },
    });

    const filteredData = listData.map((data) => {
      return {
        id: data?.id,
        nama: data?.pegawai?.nama,
        nip: data?.pegawai?.nip,
        status: data?.status,
        tgl: formatTanggalMutasi(data?.updatedAt),
        alasan: data?.alasan, // Tambahkan alasan agar muncul di textarea saat revisi
        waktuUpdate: formatTanggalMutasi(data?.updatedAt),
        instansiTujuan: data?.opdTujuan?.namaOpd,
        catatan: data.catatan,
        // --- DATA PENTING UNTUK HANDLE REVISI ---
        pegawaiId: data?.pegawaiId, // Untuk setFormData di handleHistoryClick
        opdTujuanId: data?.opdTujuanId, // Untuk setFormData di handleHistoryClick
        opdAsalId: data?.opdAsalId, // Untuk setFormData di handleHistoryClick
        berkasMutasi: data?.berkasMutasi, // Array file asli dari DB (isi: nama, status_berkas, url)
      };
    });

    return { success: true, data: filteredData };
  } catch (error) {
    console.log("Terjadi error: ", error.message);
    return { success: false, data: [] };
  }
};
