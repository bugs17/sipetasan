"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "../lib/db";
import { formatTanggalMutasi } from "../utils/format-date"; // Import utilitas yang sama

export const addMutasi = async (formData) => {
  const alasan = formData.get("alasan");
  const opdTujuanId = formData.get("opdTujuanId");
  const opdAsalId = formData.get("opdAsalId");
  const pegawaiId = formData.get("pegawaiId");
  const berkas = formData.getAll("berkas");

  try {
    const newMutasi = await prisma.mutasi.create({
      data: {
        pegawaiId: Number(pegawaiId),
        opdAsalId: Number(opdAsalId),
        opdTujuanId: Number(opdTujuanId),
        catatan: alasan,
        status: "pending",
      },
      include: {
        pegawai: true,
        opdTujuan: true, // Pastikan ini di-include juga untuk mengambil nama instansi
      },
    });

    // Setup Folder & Simpan File (Logic tetap sama)
    const uploadDir = path.join(process.cwd(), "file_mutasi");
    await mkdir(uploadDir, { recursive: true });

    const uploadPromises = berkas.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const namaSimpan = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.name)}`;

      await writeFile(path.join(uploadDir, namaSimpan), buffer);

      return prisma.berkasMutasi.create({
        data: {
          namaBerkas: file.name,
          urlBerkas: namaSimpan,
          mutasiId: newMutasi.id,
          status_berkas: "pending",
        },
      });
    });

    await Promise.all(uploadPromises);

    // --- FORMAT DATA AGAR IDENTIK DENGAN getListMutasiByOpdId ---
    const formattedData = {
      id: newMutasi.id,
      nama: newMutasi.pegawai?.nama,
      nip: newMutasi.pegawai?.nip,
      status: newMutasi.status,
      tgl: formatTanggalMutasi(newMutasi.updatedAt),
      catatan: newMutasi.catatan,
      waktuUpdate: formatTanggalMutasi(newMutasi.updatedAt),
      instansiTujuan: newMutasi.opdTujuan?.namaOpd, // Ini alasannya butuh include opdTujuan
    };

    return {
      success: true,
      message: "Data mutasi berhasil disimpan",
      data: formattedData,
    };
  } catch (error) {
    console.error("SERVER_ACTION_ERROR:", error);
    return { success: false, message: "Gagal menyimpan data ke server" };
  }
};
