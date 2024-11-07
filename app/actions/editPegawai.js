"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "../lib/db"


export const saveEditedPegawai = async (id, nama, nip, tgl, tempatLhr, pendidikanId, jabatanId, atasanId, kJ ) => {
    const formatedTgl = new Date(tgl)
    const pensiun = formatedTgl.getFullYear() + 60
    try {
        const pegawaiUpdate = await prisma.pegawai.update({
            where:{
                id:parseInt(id)
            },
            data:{
                nama:nama,
                jabatan:{
                    connect:{id:parseInt(jabatanId)}
                },
                pendidikan:{
                    connect:{id:parseInt(pendidikanId)}
                },
                atasan:{
                    connect:{id:parseInt(atasanId)}
                },
                nip:nip,
                tanggalLahir:formatedTgl,
                tempatLahir:tempatLhr,
                tahunPensiun:pensiun,
                tahunKebutuhan:pensiun + 1

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
        revalidatePath('/proyeksi-kebutuhan')
        revalidatePath('/')
        return true
    } catch (error) {
        console.log("gagal save edited pegawai dengan ID", id)
        console.log(error)
        return false
    }
}