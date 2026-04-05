"use server";

import { prisma } from "../lib/db";

export const getListUserOpd = async () => {
  try {
    const list = await prisma.user.findMany({
      where: {
        role: "ADMIN_OPD",
      },
    });
    const listInstansi = await prisma.opd.findMany();
    return { dataUser: list, dataInstansi: listInstansi };
  } catch (error) {
    console.log("Gagal mengambil list user. errorMsg: ", error.message);
    return { dataUser: [], dataInstansi: [] };
  }
};
