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
                tahunPensiun:pensiun

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



        const existingRecord = await prisma.kebutuhanPegawai.findFirst({
            where: { tahunKebutuhan: parseInt(pegawaiUpdate.tahunPensiun) + 1 }
        });
    
        if (existingRecord) {
            // Jika data sudah ada, update `jumlahKebutuhan`
            await prisma.kebutuhanPegawai.update({
                where: { id: existingRecord.id },
                data: { 
                    jumlahKebutuhan: existingRecord.jumlahKebutuhan + 1,
                    idJabatan:pegawaiUpdate.jabatanId
                }
            });
        } else {
            // Jika belum ada, buat data baru untuk tahun berikutnya
            await prisma.kebutuhanPegawai.create({
                data: {
                    tahunKebutuhan: parseInt(pegawaiUpdate.tahunPensiun) + 1,
                    jumlahKebutuhan: 1,
                    idJabatan:pegawaiUpdate.jabatanId
                }
            });
        }

        revalidatePath('/setting-pegawai')
        return true
    } catch (error) {
        console.log("gagal save edited pegawai dengan ID", id)
        console.log(error)
        return false
    }
}