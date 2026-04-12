"use server";

import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "../lib/db";

export const deleteMutasi = async (id) => {
  try {
    // 1. Ambil data berkas terkait untuk hapus file fisik
    const berkas = await prisma.berkasMutasi.findMany({
      where: { mutasiId: id },
    });

    // 2. Hapus file fisik dari storage
    const deleteFiles = berkas.map(async (file) => {
      const filePath = path.join(process.cwd(), "file_mutasi", file.urlBerkas);
      try {
        await unlink(filePath);
      } catch (err) {
        console.error(`Gagal hapus file: ${file.urlBerkas}`, err);
      }
    });
    await Promise.all(deleteFiles);

    // 3. Hapus data dari DB (Cascade delete akan menghapus berkasMutasi secara otomatis)
    await prisma.mutasi.delete({
      where: { id: id },
    });

    return { success: true, message: "Data berhasil dihapus" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal menghapus data" };
  }
};
