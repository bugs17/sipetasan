"use server";

import { prisma } from "../lib/db";

export const deletePegawai = async (id) => {
  if (!id) return { status: "error" };
  try {
    await prisma.pegawai.delete({
      where: {
        id: Number(id),
      },
    });

    return { status: "sukses" };
  } catch (error) {
    console.log(
      `error saat delete pegawai dengan id: ${id} errorMsg: `,
      error.message,
    );
    return { status: "error" };
  }
};
