"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "../lib/db"


export const hapusPegawai = async (id) => {
    try {
        await prisma.pegawai.delete({
            where:{
                id:parseInt(id)
            }
        })
        revalidatePath('/setting-pegawai')
        return true
    } catch (error) {
        console.log("gagal hapus pegawai")
        console.log(error)
        return false
    }
}