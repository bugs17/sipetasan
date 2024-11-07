"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "../lib/db"


export const addPegawai = async (nama, nip, tgl, tempatLhr, pendidikanId, jabatanId, atasanId, kj) => {
    const formatedTgl = new Date(tgl)
    const pensiun = formatedTgl.getFullYear() + 60

    try {
        const result = await prisma.pegawai.create({
            data:{
                nama:nama,
                nip:nip,
                tanggalLahir:formatedTgl,
                tempatLahir:tempatLhr,
                pendidikan:{
                    connect:{id:parseInt(pendidikanId)}
                },
                jabatan:{
                    connect:{id:parseInt(jabatanId)}
                },
                ...(atasanId ? { atasan: {
                    connect:{id:parseInt(atasanId)}
                } } : {}),
                tahunPensiun:pensiun,
                tahunKebutuhan:pensiun + 1
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
        revalidatePath('/proyeksi-kebutuhan')
        revalidatePath('/')
    } catch (error) {
        console.log("gagal add pegawai")
        console.log(error)
    }
}