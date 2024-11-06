"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "../lib/db"


export const hapusPegawai = async (id) => {
    try {
        const result = await prisma.pegawai.delete({
            where:{
                id:parseInt(id)
            }
        })

        const existingRecord = await prisma.kebutuhanPegawai.findFirst({
            where: { tahunKebutuhan: parseInt(result.tahunPensiun) + 1 }
        });
    
        if (existingRecord) {
            // Jika data sudah ada, update `jumlahKebutuhan`
            await prisma.kebutuhanPegawai.update({
                where: { id: existingRecord.id },
                data: { 
                    jumlahKebutuhan: existingRecord.jumlahKebutuhan - 1,
                    idJabatan:result.jabatanId
                }
            });
        }

        revalidatePath('/setting-pegawai')
        return true
    } catch (error) {
        console.log("gagal hapus pegawai")
        console.log(error)
        return false
    }
}