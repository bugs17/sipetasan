"use server";

import { prisma } from "../lib/db";

export const getListPegawaiByIdInstansi = async (idInstansi) => {
  if (!idInstansi) return null;

  try {
    const list = await prisma.pegawai.findMany({
      where: {
        opdId: parseInt(idInstansi),
      },
    });
    return list;
  } catch (error) {
    console.log(
      `Terjadi error saat mencoba mengambil list pegawa dengan ID instansi: ${idInstansi}, errorMsg: `,
      error.message,
    );
    return [];
  }
};
