"use server";

import { prisma } from "../lib/db";

export const getInstansiBySlug = async (slug) => {
  if (!slug) return null;
  try {
    const instansi = await prisma.opd.findFirst({
      where: {
        slug: slug,
      },
      include: {
        jabatans: {
          include: {
            pegawai: true,
          },
        },
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
