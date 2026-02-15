"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../lib/db";


/**
 * ACTION: HAPUS TUGAS
 */
export async function serverDeleteTugas(id) {
  try {
    await prisma.tugas.delete({
      where: { id: parseInt(id) }
    })

    revalidatePath('/dashboard/setting-uraian-tugas')
    return { success: true }
  } catch (error) {
    console.error(`Terjadi error saat hapus tugas dengan ID : ${id} error_message -> `, error)
    throw new Error("Gagal menghapus tugas")
  }
}