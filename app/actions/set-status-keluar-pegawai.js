"use server";

import { prisma } from "../lib/db";

export const setStatusKeluarPegawai = async (formData) => {
  // Validasi dasar
  if (
    !formData.id ||
    !formData.opdId ||
    !formData.jabatanId ||
    !formData.status ||
    !formData.tanggalKeluar
  ) {
    return { success: false, error: "Data tidak lengkap" };
  }

  try {
    const dateObj = new Date(formData.tanggalKeluar);
    const tahunKeluar = dateObj.getFullYear();
    const result = await prisma.$transaction(async (tx) => {
      const history = await tx.proyeksiKeluar.create({
        data: {
          pegawaiId: Number(formData.id),
          opdId: Number(formData.opdId),
          jabatanId: Number(formData.jabatanId),
          alasan: formData.status.toLowerCase(),
          tanggalKeluar: dateObj,
          tahun: tahunKeluar,
        },
      });
      await tx.pegawai.update({
        where: { id: Number(formData.id) },
        data: {
          opdId: null,
          jabatanId: null,
        },
      });

      return history;
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Error Set Status Keluar:", error);
    return { success: false, error: "Gagal memproses data keluar" };
  }
};
