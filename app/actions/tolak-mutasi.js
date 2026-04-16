"use server";

import { prisma } from "../lib/db";

export const tolakMutasi = async (idMutasi, catatan) => {
  if (!idMutasi) return { success: false };
  try {
    await prisma.mutasi.update({
      where: {
        id: Number(idMutasi),
      },
      data: {
        catatan: catatan,
        status: "ditolak",
      },
    });
    return { success: true };
  } catch (error) {
    console.log("terjadi error saat tolak mutasi: ", error.message);
    return { success: false };
  }
};
