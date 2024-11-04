"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "../lib/db"

export const editTugas = async (idTugas, idJabatan, namaTugas, hasilKerja) => {
    const id = parseInt(idTugas)

    try {
        await prisma.tugas.update({
            where:{
                id:id
            },
            data:{
                namaTugas:namaTugas,
                hasil:hasilKerja
            }
        })

        revalidatePath(`/add-tugas?id=${idJabatan}`)
        return true
    } catch (error) {
        console.log(`terjadi error saat edit tugas dengan id: ${id} `, error)
        return false
    }
}