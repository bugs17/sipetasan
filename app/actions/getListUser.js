"use server";

import { clerkClient } from "../lib/clerck-server";
import { prisma } from "../lib/db";

export const getListUserOpd = async () => {
  try {
    const list = await prisma.user.findMany({
      where: {
        role: "ADMIN_OPD",
      },
      include: {
        opd: true,
      },
    });
    const listInstansi = await prisma.opd.findMany();
    return { dataUser: list, dataInstansi: listInstansi };
  } catch (error) {
    console.log("Gagal mengambil list user. errorMsg: ", error.message);
    return { dataUser: [], dataInstansi: [] };
  }
};
