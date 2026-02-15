"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "../lib/db"

/**
 * ACTION: UPDATE TUGAS
 * Menerima ID tugas dan data yang akan diubah
 */
export async function serverUpdateTugas(id, formData) {
  try {
    const updated = await prisma.tugas.update({
      where: { id: parseInt(id) },
      data: {
        namaTugas: formData.namaTugas,
        hasil: formData.hasil
      }
    })

    revalidatePath('/dashboard/setting-uraian-tugas')
    return updated
  } catch (error) {
    console.error(`Terjadi error saat menambahkan tugas dengan ID : ${id} ke DB -> `, error)
    throw new Error("Gagal mengupdate tugas")
  }
}