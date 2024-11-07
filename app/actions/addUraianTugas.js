"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "../lib/db"


export const addUraianTugas = async (id, jumlahBebanKerja, waktuPenyelesaian, waktuEfektif) => {
    let kebutuhanPegawai = (parseInt(jumlahBebanKerja) * parseInt(waktuPenyelesaian)) / parseInt(waktuEfektif)
    let kebutuhanPegawaiDuaDigit = parseFloat(kebutuhanPegawai.toFixed(2))

    try {
        await prisma.tugas.update({
            where:{
                id:parseInt(id)
            },
            data:{
                jumlahBebanKerjaSetahun:parseInt(jumlahBebanKerja),
                waktuPenyelesaianDalamJam:parseInt(waktuPenyelesaian),
                waktuEfektifPenyelesaian:parseInt(waktuEfektif),
                KebutuhanPegawai:kebutuhanPegawaiDuaDigit
            }
        })
        revalidatePath(`/tugas?id=${id}`)
        revalidatePath(`/proyeksi-kebutuhan`)
        revalidatePath(`/`)
        return true
    } catch (error) {
        console.log("error update uraian tugas", error)
        return false
    }
}

