"use server"

import { prisma } from "../lib/db"
import { revalidatePath } from "next/cache"

function toUpperCase(sentence) {
    return sentence.toUpperCase();
}

export const addJabatan = async (formData) => {
    const jabatan = formData.get("input-jabatan")
    const fixData = toUpperCase(jabatan)
    try {
        await prisma.jabatan.create({
            data:{
                namaJabatan:fixData
            }
        })
    } catch (error) {
        console.log("Error create jabatan")
    }

    revalidatePath("/setting-jabatan")
    revalidatePath('/add-pegawai')
    revalidatePath('/edit-pegawai')
}