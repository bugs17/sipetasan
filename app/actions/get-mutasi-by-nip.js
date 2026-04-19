"use server";

import { prisma } from "../lib/db";

export const getMutasiByNip = async (nip) => {
  if (!nip) return { success: false, dataMutasi: null };
  try {
    const mtx = await prisma.pegawai.findFirst({
      where: {
        nip: nip,
      },
      include: {
        mutasi: {
          orderBy: {
            id: "desc",
          },
        },
      },
    });

    return { success: true, dataMutasi: mtx };
  } catch (error) {
    console.log(
      "Terjadi error saat mengambil data mutasi by nip: ",
      error.message,
    );
    return { success: false, dataMutasi: null };
  }
};
