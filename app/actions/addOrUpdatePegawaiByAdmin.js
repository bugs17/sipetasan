"use server";

import { prisma } from "../lib/db";

const toIntOrNull = (val) => {
  if (val === "" || val === null || val === undefined) return null;

  const num = Number(val);
  return isNaN(num) ? null : num;
};

export const addOrUpdatePegawaiByAdminInduk = async (data) => {
  if (!data.nama) return;

  let performType = "";
  let result;
  try {
    // update
    if (data.id) {
      result = await prisma.pegawai.update({
        where: {
          id: Number(data.id),
        },
        data: {
          nama: data.nama,
          nip: data.nip,
          pendidikanId: toIntOrNull(data.pendidikanId),
          opdId: toIntOrNull(data.opdId),
          tanggalLahir: new Date(data.tanggalLahir),
          tempatLahir: data.tempatLahir,
        },
        include: {
          pendidikan: true,
          opd: true,
        },
      });
      performType = "update";
    } else {
      // create
      result = await prisma.pegawai.create({
        data: {
          nama: data.nama,
          nip: data.nip === "" ? null : data.nip,
          pendidikanId: toIntOrNull(data.pendidikanId),
          opdId: toIntOrNull(data.opdId),
          tanggalLahir:
            data.tanggalLahir === "" ? null : new Date(data.tanggalLahir),
          tempatLahir: data.tempatLahir === "" ? null : data.tempatLahir,
        },
        include: {
          pendidikan: true,
          opd: true,
        },
      });
      performType = "create";
    }

    return { operasi: performType, obj: result };
  } catch (error) {
    console.log(
      "Gagal melakukan update/create pegawai by admin induk. errorMsg: ",
      error.message,
    );
    return { operasi: null, obj: null };
  }
};
