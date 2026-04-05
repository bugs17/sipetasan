"use server";

import { prisma } from "../lib/db";

export const deleteInstansi = async (id) => {
  if (!id) return { status: "error" };
  try {
    await prisma.opd.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { status: "sukses" };
  } catch (error) {
    console.log(
      `error saat delete instansi dengan id: ${id} errorMsg: `,
      error.message,
    );
    return { status: "error" };
  }
};
