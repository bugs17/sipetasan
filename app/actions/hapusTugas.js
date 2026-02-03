"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "../lib/db"

export const hapusTugas = async (idTugas, idJabatan) => {
    const id = parseInt(idTugas)

    try {
        await prisma.tugas.delete({
            where:{
                id:id
            }
        })

        revalidatePath(`/add-tugas?id=${idJabatan}`)
        revalidatePath('/setting-uraian-tugas')
        return true
    } catch (error) {
        console.log(`terjadi error saat menghapus tugas dengan id: ${id} `, error)
        return false
    }
}