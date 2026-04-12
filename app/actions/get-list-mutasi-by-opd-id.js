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
      },
    });

    const filtteredData = listData.map((data) => {
      return {
        id: data?.id,
        nama: data?.pegawai?.nama,
        nip: data?.pegawai?.nip,
        status: data?.status,
        tgl: formatTanggalMutasi(data?.updatedAt),
        catatan: data?.catatan,
        waktuUpdate: formatTanggalMutasi(data?.updatedAt),
        instansiTujuan: data?.opdTujuan.namaOpd,
      };
    });
    return { success: true, data: filtteredData };
  } catch (error) {
    console.log("Terjadi error: ", error.message);
    return { success: false, data: [] };
  }
};
