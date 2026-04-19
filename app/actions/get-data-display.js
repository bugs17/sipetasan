"use server";

import { prisma } from "../lib/db";

export const getDataDisplay = async () => {
  try {
    const jumlahPegawaiAktif = await prisma.pegawai.count({
      where: {
        proyeksiKeluar: {
          none: {
            alasan: {
              in: ["meninggal", "dini"],
            },
          },
        },
      },
    });

    const jumlahInstansi = await prisma.opd.count();
    const jumlahMutasi = await prisma.mutasi.count();

    const data = {
      pegawai: jumlahPegawaiAktif,
      instansi: jumlahInstansi,
      mutasi: jumlahMutasi,
    };
    return data;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
