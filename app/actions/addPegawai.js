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
                pendidikanId:parseInt(pendidikanId),
                jabatanId:parseInt(jabatanId),
                ...(atasanId ? { atasanId: parseInt(atasanId) } : {}),
                tahunPensiun:pensiun
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

        const existingRecord = await prisma.kebutuhanPegawai.findFirst({
            where: { tahunKebutuhan: parseInt(result.tahunPensiun) + 1 }
        });
    
        if (existingRecord) {
            // Jika data sudah ada, update `jumlahKebutuhan`
            await prisma.kebutuhanPegawai.update({
                where: { id: existingRecord.id },
                data: { 
                    jumlahKebutuhan: existingRecord.jumlahKebutuhan + 1,
                    idJabatan:result.jabatanId
                }
            });
        } else {
            // Jika belum ada, buat data baru untuk tahun berikutnya
            await prisma.kebutuhanPegawai.create({
                data: {
                    tahunKebutuhan: parseInt(result.tahunPensiun) + 1,
                    jumlahKebutuhan: 1,
                    idJabatan:result.jabatanId
                }
            });
        }


        revalidatePath('/setting-pegawai')
    } catch (error) {
        console.log("gagal add pegawai")
        console.log(error)
    }
}