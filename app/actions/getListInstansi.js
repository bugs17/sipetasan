"use server";

import { prisma } from "../lib/db";

export const getListInstansi = async () => {
  try {
    const data = prisma.opd.findMany({
      include: {
        _count: {
          select: {
            pegawai: true,
          },
        },
      },
    });
    console.log(data);
    return data;
  } catch (error) {
    console.log(
      "Error saat mencoba mengambil list instansi. Error message: ",
      error.message,
    );
    return [];
  }
};
