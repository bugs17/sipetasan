"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "../lib/db"


export const addPegawai = async (nama, nip, tgl, tempatLhr, pendidikanId, jabatanId, atasanId, kj) => {
    const formatedTgl = new Date(tgl)
    try {
        const result = await prisma.pegawai.create({
            data:{
                nama:nama,
                nip:nip,
                tanggalLahir:formatedTgl,
                tempatLahir:tempatLhr,
                pendidikanId:parseInt(pendidikanId),
                jabatanId:parseInt(jabatanId),
                ...(atasanId ? { atasanId: parseInt(atasanId) } : {})
            }
        })
        await prisma.jabatan.update({
            where:{
                id:result.jabatanId
            },
            data:{
                kJ:parseInt(kj)
            }
        })
        revalidatePath('/setting-pegawai')
    } catch (error) {
        console.log("gagal add pegawai")
        console.log(error)
    }
}