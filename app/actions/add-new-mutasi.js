"use server";

import { writeFile, mkdir, unlink } from "fs/promises";
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
    // --- VALIDASI DUPLIKASI ---
    // Cek jika pegawai yang sama punya mutasi ke instansi yang sama dengan status non-final
    // Kita kecualikan pengecekan ini jika ini adalah proses REVISI (oldMutasiId ada)
    if (!oldMutasiId || oldMutasiId === "undefined") {
      const existingRequest = await prisma.mutasi.findFirst({
        where: {
          pegawaiId: Number(pegawaiId),
          opdTujuanId: Number(opdTujuanId),
          status: {
            in: ["pending", "revisi"],
          },
        },
      });

      if (existingRequest) {
        return {
          success: false,
          message:
            "Pegawai ini masih memiliki permintaan mutasi yang sedang diproses di instansi tujuan tersebut.",
        };
      }
    }

    let mutasi;

    if (oldMutasiId && oldMutasiId !== "undefined") {
      // --- LOGIKA REVISI ---
      const berkasRevisi = await prisma.berkasMutasi.findMany({
        where: {
          mutasiId: Number(oldMutasiId),
          status_berkas: "revisi",
        },
      });

      for (const b of berkasRevisi) {
        try {
          const filePath = path.join(process.cwd(), "file_mutasi", b.urlBerkas);
          await unlink(filePath);
        } catch (err) {
          console.log("File fisik tidak ditemukan, lanjut hapus record DB");
        }
      }

      await prisma.berkasMutasi.deleteMany({
        where: {
          mutasiId: Number(oldMutasiId),
          status_berkas: "revisi",
        },
      });

      mutasi = await prisma.mutasi.update({
        where: { id: Number(oldMutasiId) },
        data: {
          opdTujuanId: Number(opdTujuanId),
          alasan: alasan,
          status: "pending",
          catatan: null,
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

    // 4. Simpan Berkas Baru
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
