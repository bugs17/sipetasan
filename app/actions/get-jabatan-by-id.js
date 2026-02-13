"use server";

import { prisma } from "../lib/db";


export const getJabatanByID = async (id) => {
    try {
        const jabatan = await prisma.jabatan.findFirst({
            where:{
                id:parseInt(id)
            }
        });

        return jabatan;
    } catch (error) {
        console.log("Terjadi error saat mengambil jabatan by ID : ", error);
        return {};
    }
}