"use server";

import { prisma } from "../lib/db";

export const getAllMutasi = async () => {
  try {
    const mutasis = await prisma.mutasi.findMany({
      include: {
        berkasMutasi: true,
        pegawai: true,
        opdAsal: true,
        opdTujuan: true,
      },
    });
    const formatedData = mutasis.map((mutasi) => {
      return {
        id: mutasi.id,
        nama: mutasi?.pegawai?.nama,
        nip: mutasi?.pegawai?.nip,
        opdAsal: mutasi?.opdAsal?.namaOpd,
        opdTujuan: mutasi?.opdTujuan?.namaOpd,
        tglKirim: mutasi?.createdAt
          ? new Date(mutasi.createdAt).toLocaleDateString("id-ID")
          : "-",
        status: mutasi?.status,
        catatan: mutasi.catatan,
        dokumen: mutasi?.berkasMutasi.map((file) => {
          return {
            id: file.id,
            nama: file.namaBerkas,
            file: file.urlBerkas,
            status: file.status_berkas,
          };
        }),
      };
    });
    return formatedData;
  } catch (error) {
    console.log("error saat mengambil data mutasi: ", error.message);
    return [];
  }
};
