"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "../lib/db"


export const saveEditedPegawai = async (id, nama, nip, tgl, tempatLhr, pendidikanId, jabatanId, atasanId, kJ ) => {
    const formatedTgl = new Date(tgl)
    try {
        const pegawaiUpdate = await prisma.pegawai.update({
            where:{
                id:parseInt(id)
            },
            data:{
                nama:nama,
                jabatanId:parseInt(jabatanId),
                pendidikanId:parseInt(pendidikanId),
                nip:nip,
                tanggalLahir:formatedTgl,
                tempatLahir:tempatLhr,
                atasanId:parseInt(atasanId),

            }
        })

        await prisma.jabatan.update({
            where:{
                id:parseInt(pegawaiUpdate.jabatanId)
            },
            data:{
                kJ:parseInt(kJ)
            }
        })

        revalidatePath('/setting-pegawai')
        return true
    } catch (error) {
        console.log("gagal save edited pegawai dengan ID", id)
        console.log(error)
        return false
    }
}