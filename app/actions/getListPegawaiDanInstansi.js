"use server";

import { prisma } from "../lib/db";

export const getPegawaiDanInstansi = async () => {
  try {
    const dataInstansi = await prisma.opd.findMany();

    const dataPegawai = await prisma.pegawai.findMany({
      include: {
        opd: true,
        pendidikan: true,
      },
    });

    const dataPendidikan = await prisma.pendidikan.findMany();

    return { dataInstansi, dataPegawai, dataPendidikan };
  } catch (error) {
    console.log(
      "Error saat mengambil list instansi & pegawai. errorMsg: ",
      error.message,
    );
    return { instansi: [], pegawai: [] };
  }
};
