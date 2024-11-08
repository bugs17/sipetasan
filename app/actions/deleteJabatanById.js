"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "../lib/db"


export const deleteJabatanById = async (id) => {
    try {
        await prisma.jabatan.delete({
            where:{
                id:parseInt(id)
            }
        })

        revalidatePath("/setting-jabatan")
        revalidatePath('/add-pegawai')
        revalidatePath('/edit-pegawai')
    } catch (error) {
        console.log("Error saat menghapus data jabatan dengan id", id)
        console.log(error)
        
    }
}