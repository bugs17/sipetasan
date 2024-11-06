"use server"

import { prisma } from "../lib/db";

export const addJumlahPensiun = async (tahun, jumlah) => {
    const existingRecord = await prisma.kebutuhanPegawai.findUnique({
        where: { tahunKebutuhan: parseInt(tahun) + 1 }
    });

    if (existingRecord) {
        // Jika data sudah ada, update `jumlahKebutuhan`
        await prisma.kebutuhanPegawai.update({
            where: { id: existingRecord.id },
            data: { jumlahKebutuhan: existingRecord.jumlahKebutuhan + jumlah }
        });
    } else {
        // Jika belum ada, buat data baru untuk tahun berikutnya
        await prisma.kebutuhanPegawai.create({
            data: {
                tahunKebutuhan: parseInt(tahun) + 1,
                jumlahKebutuhan: jumlah
            }
        });
    }
}