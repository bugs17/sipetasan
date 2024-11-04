"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "../lib/db"

export const addTugastList = async (idJabatan, namaUraianTugas, hasilKerja) => {
    const id = parseInt(idJabatan)

    
    try {
        await prisma.tugas.create({
            data:{
                jabatanId:id,
                namaTugas:namaUraianTugas,
                hasil:hasilKerja
            }
        })
        revalidatePath(`/add-tugas?id=${id}`)
        return true
    } catch (error) {
        console.log(`terjadi error saat menambahkan list uraian tugas pada jabatan dengan id ${id} :`, error)
        return false
    }
}