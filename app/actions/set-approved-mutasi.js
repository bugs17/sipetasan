"use server";

import { prisma } from "../lib/db";

export const setApproved = async (data) => {
  if (!data || !data.id || !Array.isArray(data.dokumen)) {
    return { success: false, error: "Data tidak lengkap atau format salah" };
  }
  try {
    const now = new Date();
    await prisma.$transaction(async (tx) => {
      // 2. Update status utama mutasi
      const mtx = await tx.mutasi.update({
        where: { id: Number(data.id) },
        data: {
          status: "approved",
          catatan: data.catatan,
        },
        include: {
          pegawai: true,
        },
      });

      // 3. Cek panjang dokumen sebelum Promise.all
      // Kalau kosong, lewati saja update berkasnya biar nggak buang-buang resource
      if (data.dokumen.length > 0) {
        await Promise.all(
          data.dokumen.map((b) =>
            tx.berkasMutasi.update({
              where: { id: Number(b.id) },
              data: { status_berkas: b.status },
            }),
          ),
        );
      }

      await tx.proyeksiKeluar.create({
        data: {
          alasan: "mutasi",
          jabatanId: Number(mtx.pegawai.jabatanId),
          pegawaiId: Number(mtx.pegawaiId),
          opdId: Number(mtx.pegawai.opdId),
          tanggalKeluar: now,
          tahun: now.getFullYear(),
        },
      });

      await tx.pegawai.update({
        where: {
          id: Number(mtx.pegawai.id),
        },
        data: {
          opdId: Number(mtx.opdTujuanId),
          jabatanId: null,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Terjadi error saat revisi mutasi: ", error.message);
    return { success: false, error: error.message };
  }
};
