"use server";

import { prisma } from "./lib/db";

export const getPegawaiDanInstansiByIdOpd = async (id) => {
  try {
    const dataPegawai = await prisma.pegawai.findMany({
      where: {
        opdId: Number(id),
      },
      include: {
        pendidikan: true,
        opd: true,
      },
    });
    console.log(dataPegawai);

    const dataPendidikan = await prisma.pendidikan.findMany();

    return { dataPegawai, dataPendidikan };
  } catch (error) {
    console.log(
      "Error saat mengambil list instansi & pegawai. errorMsg: ",
      error.message,
    );
    return { dataPegawai: [], dataPendidikan: [] };
  }
};
