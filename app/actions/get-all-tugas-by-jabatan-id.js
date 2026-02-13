"use server";

import { prisma } from "../lib/db";


export const getAllTugasByJabatanID = async (id) => {
    try {
        const tugas = prisma.tugas.findMany({
            where:{
                jabatanId:parseInt(id)
            }
        });
        
        return tugas;

    } catch (error) {
        console.log("Error saat mengambill all tugas by jabatan id : ", error);
        return []
    }
}