"use server";

import { prisma } from "../lib/db";

export const setRevisiMutasi = async (data) => {
  if (!data || !data.id) return { success: false };

  console.log(data);

  try {
    // Gunakan Transaction agar jika satu gagal, semua batal (Atomic)
    await prisma.$transaction(async (tx) => {
      // 1. Update status utama mutasi dan catatannya
      await tx.mutasi.update({
        where: {
          id: Number(data.id),
        },
        data: {
          status: "revisi",
          catatan: data.catatan,
        },
      });

      // 2. Update tiap berkas secara spesifik berdasarkan ID berkasnya
      // Kita gunakan Promise.all untuk menjalankan update berkas secara paralel
      await Promise.all(
        data.dokumen.map((b) =>
          tx.berkasMutasi.update({
            where: { id: Number(b.id) },
            data: { status_berkas: b.status },
          }),
        ),
      );
    });

    return { success: true };
  } catch (error) {
    console.error("Terjadi error saat revisi mutasi: ", error.message);
    return { success: false, error: error.message };
  }
};
