"use server";

import { writeFile, mkdir, unlink } from "fs/promises"; // Tambahkan unlink
import path from "path";
import { prisma } from "../lib/db";
import { formatTanggalMutasi } from "../utils/format-date";

export const addMutasi = async (formData) => {
  const alasan = formData.get("alasan");
  const opdTujuanId = formData.get("opdTujuanId");
  const opdAsalId = formData.get("opdAsalId");
  const pegawaiId = formData.get("pegawaiId");
  const berkas = formData.getAll("berkas");
  const oldMutasiId = formData.get("oldMutasiId");

  try {
    let mutasi;

    if (oldMutasiId && oldMutasiId !== "undefined") {
      // --- LOGIKA REVISI ---

      // 1. Hapus berkas fisik dan data DB yang statusnya 'revisi' sebelum upload yang baru
      // Ini mencegah penumpukan file sampah di folder server
      const berkasRevisi = await prisma.berkasMutasi.findMany({
        where: {
          mutasiId: Number(oldMutasiId),
          status_berkas: "revisi",
        },
      });

      for (const b of berkasRevisi) {
        try {
          const filePath = path.join(process.cwd(), "file_mutasi", b.urlBerkas);
          await unlink(filePath); // Hapus file fisik
        } catch (err) {
          console.log("File fisik tidak ditemukan, lanjut hapus record DB");
        }
      }

      // 2. Hapus record database berkas yang berstatus revisi
      await prisma.berkasMutasi.deleteMany({
        where: {
          mutasiId: Number(oldMutasiId),
          status_berkas: "revisi",
        },
      });

      // 3. Update data mutasi utamanya
      mutasi = await prisma.mutasi.update({
        where: { id: Number(oldMutasiId) },
        data: {
          opdTujuanId: Number(opdTujuanId),
          alasan: alasan,
          status: "pending", // Reset status ke pending
          catatan: null, // Bersihkan catatan admin induk karena sudah diperbaiki
        },
        include: { pegawai: true, opdTujuan: true },
      });
    } else {
      // --- LOGIKA BARU ---
      mutasi = await prisma.mutasi.create({
        data: {
          pegawaiId: Number(pegawaiId),
          opdAsalId: Number(opdAsalId),
          opdTujuanId: Number(opdTujuanId),
          alasan: alasan,
          status: "pending",
        },
        include: { pegawai: true, opdTujuan: true },
      });
    }

    // 4. Simpan Berkas Baru (Logika tetap sama)
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
          mutasiId: mutasi.id,
          status_berkas: "pending",
        },
      });
    });

    await Promise.all(uploadPromises);

    // 5. Ambil semua berkas (Berkas lama yang 'valid' + Berkas baru yang 'pending')
    const allBerkas = await prisma.berkasMutasi.findMany({
      where: { mutasiId: mutasi.id },
    });

    const formattedData = {
      id: mutasi.id,
      nama: mutasi.pegawai?.nama,
      nip: mutasi.pegawai?.nip,
      status: mutasi.status,
      tgl: formatTanggalMutasi(mutasi.updatedAt),
      catatan: mutasi.catatan,
      alasan: mutasi.alasan,
      waktuUpdate: formatTanggalMutasi(mutasi.updatedAt),
      instansiTujuan: mutasi.opdTujuan?.namaOpd,
      pegawaiId: mutasi.pegawaiId,
      opdTujuanId: mutasi.opdTujuanId,
      opdAsalId: mutasi.opdAsalId,
      berkasMutasi: allBerkas,
    };

    return {
      success: true,
      message: oldMutasiId
        ? "Perbaikan berhasil dikirim"
        : "Data mutasi berhasil diajukan",
      data: formattedData,
    };
  } catch (error) {
    console.error("SERVER_ACTION_ERROR:", error);
    return { success: false, message: "Gagal memproses data" };
  }
};
