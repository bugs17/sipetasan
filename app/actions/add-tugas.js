'use server'

import { revalidatePath } from "next/cache"
import { prisma } from "../lib/db"

/**
 * ACTION: TAMBAH TUGAS BARU
 * Menerima objek formData dari client
 */
export async function serverAddTugas(formData) {
  try {
    const newTugas = await prisma.tugas.create({
      data: {
        namaTugas: formData.namaTugas,
        jabatanId: parseInt(formData.jabatanId),
        hasil: formData.hasil
        // Tambahkan field default lain jika ada (misal: beban kerja = 0)
      }
    })

    // Refresh cache halaman agar angka "X URAIAN TUGAS" di card utama terupdate
    revalidatePath('/dashboard/setting-uraian-tugas') 
    return newTugas
  } catch (error) {
    console.error("Terjadi error saat menambahkan tugas baru ke DB", error)
    throw new Error("Gagal menambahkan tugas")
  }
}
