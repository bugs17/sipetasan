"use server";

import { prisma } from "../lib/db";

export const getAllJabatan = async () => {

    try {
        const pegawais = await prisma.jabatan.findMany({
            include:{
                tugas: true
            },

        })
        
        return pegawais
    } catch (error) {
        console.log("Error saat get all pegawai :", error);
        return []
    }
}
