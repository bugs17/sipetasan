"use server";

import { prisma } from "../lib/db";

export const getPegawaiDanInstansi = async () => {
  try {
    const dataInstansi = await prisma.opd.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    const dataPegawai = await prisma.pegawai.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        opd: true,
        pendidikan: true,
      },
    });

    return { dataInstansi, dataPegawai };
  } catch (error) {
    console.log(
      "Error saat mengambil list instansi & pegawai. errorMsg: ",
      error.message,
    );
    return { instansi: [], pegawai: [] };
  }
};
