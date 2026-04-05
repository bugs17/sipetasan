"use server";

import { prisma } from "../lib/db";

export const addOrUpdateInstansi = async (data) => {
  let performType = "";
  let result;
  try {
    if (data.id) {
      // UPDATE
      result = await prisma.opd.update({
        where: {
          id: parseInt(data.id),
        },
        data: {
          namaOpd: data.namaOpd,
        },
        include: {
          _count: {
            select: {
              pegawai: true,
            },
          },
        },
      });
      performType = "update";
    } else {
      // CREATE
      result = await prisma.opd.create({
        data: {
          namaOpd: data.namaOpd,
        },
        include: {
          _count: {
            select: {
              pegawai: true,
            },
          },
        },
      });
      performType = "create";
    }
    return { operasi: performType, obj: result };
  } catch (error) {
    console.log(
      "Gagal melakukan upsert data instansi. Error Msg: ",
      error.message,
    );
    return { operasi: performType, obj: null };
  }
};
