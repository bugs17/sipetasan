"use server";

import { prisma } from "../lib/db";

export const getInstansiById = async (id) => {
  if (!id) return null;
  try {
    const instansi = await prisma.opd.findFirst({
      where: {
        id: Number(id),
      },
    });

    return instansi;
  } catch (error) {
    console.log(
      "error saat mengambil instansi/opd by slug. errorMsg: ",
      error.message,
    );
    return null;
  }
};
