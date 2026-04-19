"use server";

import { prisma } from "../lib/db";
import ExcelJS from "exceljs";

export const generateLaporanHirarkiJabatan = async (opdId, namaOpd) => {
  try {
    const allJabatans = await prisma.jabatan.findMany({
      where: { opdId: Number(opdId) },
      include: {
        pegawai: true,
        tugas: true,
      },
    });

    const buildTree = (nodes, parentId = null) => {
      return nodes
        .filter((node) => node.parentId === parentId)
        .map((node) => ({
          ...node,
          children: buildTree(nodes, node.id),
        }));
    };

    const jabatanTree = buildTree(allJabatans);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Peta Jabatan");

    // --- 1. HEADER DOKUMEN (KOP) ---
    worksheet.mergeCells("A1:F1");
    const titleCell = worksheet.getCell("A1");
    const namaDinas = namaOpd?.toUpperCase();
    titleCell.value = `PETA JABATAN ${namaDinas}`;
    titleCell.font = { name: "Arial", size: 14, bold: true };
    titleCell.alignment = { horizontal: "center" };

    worksheet.mergeCells("A2:F2");
    worksheet.getCell("A2").value = `LAPORAN STRUKTUR ORGANISASI & BEZETTING`;
    worksheet.getCell("A2").font = { bold: true };
    worksheet.getCell("A2").alignment = { horizontal: "center" };

    // --- 2. HEADER TABEL ---
    const headerRow = worksheet.getRow(4);
    headerRow.values = [
      "NAMA JABATAN",
      "PEGAWAI (NAMA - NIP)",
      "KJ",
      "B",
      "ABK",
      "±",
    ];

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1F2937" }, // Warna Gelap (Slate) agar elegan
      };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    worksheet.columns = [
      { key: "nama", width: 45 },
      { key: "pegawai", width: 40 },
      { key: "kj", width: 8 },
      { key: "b", width: 8 },
      { key: "abk", width: 8 },
      { key: "selisih", width: 8 },
    ];

    // --- 3. RECURSIVE WRITE ---
    let currentRow = 5;

    const writeToSheet = (nodes, level = 0) => {
      nodes.forEach((node) => {
        const row = worksheet.getRow(currentRow);
        const daftarPegawai =
          node.pegawai && node.pegawai.length > 0
            ? node.pegawai
                .map((p) => `${p.nama} - ${p.nip || "NIP Kosong"}`)
                .join("\n")
            : "-";
        const totalABK = node.tugas.reduce((acc, current) => {
          return acc + (current.KebutuhanPegawai || 0);
        }, 0);
        row.values = {
          nama: `${"    ".repeat(level)}🏛️ ${node.namaJabatan.toUpperCase()}`,
          pegawai: daftarPegawai,
          kj: node.kJ,
          b: node.pegawai.length,
          abk: totalABK,
          selisih: Math.floor(node.pegawai.length) - Math.floor(totalABK),
        };

        row.alignment = { vertical: "middle", wrapText: true };

        if (level === 0) {
          row.font = { bold: true };
          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF2F2F2" },
          };
        }

        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        currentRow++;
        if (node.children && node.children.length > 0) {
          writeToSheet(node.children, level + 1);
        }
      });
    };

    writeToSheet(jabatanTree);

    // --- 4. BRANDING FOOTER (OTOMATIS) ---
    worksheet.addRow([]); // Spacer
    const footerRowNumber = currentRow + 1;

    // Teks keterangan otomatis
    const infoRow = worksheet.addRow([
      `Dokumen ini dibuat otomatis oleh SI-PETASN pada ${new Date().toLocaleString("id-ID")}`,
    ]);
    worksheet.mergeCells(`A${infoRow.number}:F${infoRow.number}`);
    infoRow.getCell(1).font = {
      size: 9,
      italic: true,
      color: { argb: "64748B" },
    };

    // Teks URL / Brand
    const brandRow = worksheet.addRow(["", "", "", "", "", "sipetasn.com"]);
    brandRow.getCell(6).font = {
      size: 8,
      bold: true,
      color: { argb: "94A3B8" },
    };
    brandRow.getCell(6).alignment = { horizontal: "right" };

    // --- 5. PRINT SETUP ---
    worksheet.pageSetup = {
      paperSize: 9, // A4
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const namaOpdNoSpasi = namaOpd.replaceAll(" ", "_");
    return {
      success: true,
      data: buffer.toString("base64"),
      filename: `Peta_Jabatan_${namaOpdNoSpasi}.xlsx`,
    };
  } catch (error) {
    console.error("Gagal cetak excel:", error);
    return { success: false, error: error.message };
  }
};
