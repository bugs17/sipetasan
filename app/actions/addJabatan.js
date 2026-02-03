"use server"

import { prisma } from "../lib/db"
import { revalidatePath } from "next/cache"

function toUpperCase(sentence) {
    return sentence.toUpperCase();
}

export const addJabatan = async (formData) => {
    const jabatan = formData.get("input-jabatan")
    const fixData = toUpperCase(jabatan)
    await prisma.jabatan.create({
        data:{
            namaJabatan:fixData
        }
    })

    revalidatePath("/setting-jabatan")
    revalidatePath('/add-pegawai')
    revalidatePath('/edit-pegawai')
}