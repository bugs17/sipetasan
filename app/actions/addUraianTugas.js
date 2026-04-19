"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../lib/db";

export const addUraianTugas = async (
  id,
  jumlahBebanKerja,
  waktuPenyelesaian,
  waktuEfektif,
) => {
  let kebutuhanPegawai =
    (Number(jumlahBebanKerja) * Number(waktuPenyelesaian)) /
    Number(waktuEfektif);
  let kebutuhanPegawaiDuaDigit = parseFloat(kebutuhanPegawai.toFixed(2));

  try {
    await prisma.tugas.update({
      where: {
        id: parseInt(id),
      },
      data: {
        jumlahBebanKerjaSetahun: Number(jumlahBebanKerja),
        waktuPenyelesaianDalamJam: Number(waktuPenyelesaian),
        waktuEfektifPenyelesaian: Number(waktuEfektif),
        KebutuhanPegawai: kebutuhanPegawaiDuaDigit,
      },
    });
    revalidatePath(`/dashboard/uraian-tugas`);
    return true;
  } catch (error) {
    console.log("error update uraian tugas", error);
    return false;
  }
};
