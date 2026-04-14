import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (
  matrixData,
  listTahun,
  namaInstansi = "PEMERINTAH KABUPATEN/KOTA",
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Laporan Proyeksi");

  // --- 1. KOP INSTANSI & JUDUL ---
  const rowInstansi = worksheet.addRow([namaInstansi.toUpperCase()]);
  worksheet.mergeCells("A1:K1");
  const cellInstansi = worksheet.getCell("A1");
  cellInstansi.font = { name: "Arial", size: 14, bold: true };
  cellInstansi.alignment = { horizontal: "center" };

  const rowJudul = worksheet.addRow([
    "LAPORAN ANALISIS PROYEKSI KEBUTUHAN PEGAWAI (5 TAHUN)",
  ]);
  worksheet.mergeCells("A2:K2");
  const cellJudul = worksheet.getCell("A2");
  cellJudul.font = { name: "Arial", size: 12, bold: true };
  cellJudul.alignment = { horizontal: "center" };

  worksheet.addRow([]); // Spacer

  // --- 2. SETUP HEADER TABEL ---
  worksheet.addRow(["NAMA JABATAN", "", "", "", "", "", "", "", "", "", ""]);
  worksheet.mergeCells("A4:A5");
  worksheet.mergeCells("B4:F4");
  worksheet.mergeCells("G4:K4");

  worksheet.getCell("B4").value = "PROYEKSI KEKOSONGAN (PENSIUN/MUTASI/DLL)";
  worksheet.getCell("G4").value = "KEBUTUHAN FORMASI (H+1)";

  const rowTahun = [""];
  listTahun.forEach((y) => rowTahun.push(y));
  listTahun.forEach((y) => rowTahun.push(y));
  worksheet.addRow(rowTahun);

  // Styling Header
  ["A4", "B4", "G4"].forEach((cellRef) => {
    const cell = worksheet.getCell(cellRef);
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb:
          cellRef === "B4" ? "E11D48" : cellRef === "G4" ? "D97706" : "1F2937",
      },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // --- 3. INSERT DATA & NOTES ---
  matrixData.forEach((jab) => {
    const rowData = [jab.jabatan];
    listTahun.forEach((y) => rowData.push(jab.pensiunPerTahun[y] || 0));
    listTahun.forEach((y) => rowData.push(jab.kebutuhanPerTahun[y] || 0));

    const row = worksheet.addRow(rowData);

    row.eachCell((cell, colNumber) => {
      if (colNumber > 1) {
        const value = cell.value;
        const isPensiunZone = colNumber >= 2 && colNumber <= 6;

        if (value > 0) {
          cell.font = { bold: true, color: { argb: "FFFFFF" } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: isPensiunZone ? "E11D48" : "D97706" },
          };

          if (isPensiunZone) {
            const currentYear = listTahun[colNumber - 2];
            const detailOrang = jab.details?.[currentYear];
            if (detailOrang && detailOrang.length > 0) {
              cell.note = {
                texts: [
                  {
                    font: { bold: true, size: 9, name: "Arial" },
                    text: `DAFTAR PEGAWAI KELUAR (${currentYear}):\n`,
                  },
                  {
                    font: { size: 9, name: "Arial" },
                    text: detailOrang.join("\n"),
                  },
                ],
                margins: { inset: [0.25, 0.25, 0.25, 0.25] },
              };
            }
          }
        } else {
          cell.font = { color: { argb: "94A3B8" } };
        }
      }
    });
  });

  // --- 4. BORDER & BRANDING FOOTER ---
  const lastDataRow = worksheet.lastRow.number;

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber >= 4 && rowNumber <= lastDataRow) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    }
  });

  worksheet.addRow([]); // Spacer
  const footerRow = worksheet.addRow([
    `Dokumen ini dibuat otomatis oleh SI-PETASN pada ${new Date().toLocaleString("id-ID")}`,
  ]);
  worksheet.mergeCells(`A${footerRow.number}:K${footerRow.number}`);
  footerRow.getCell(1).font = {
    size: 9,
    italic: true,
    color: { argb: "64748B" },
  };

  const brandRow = worksheet.addRow([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "sipetasn.com",
  ]);
  brandRow.getCell(11).font = {
    size: 8,
    bold: true,
    color: { argb: "94A3B8" },
  };
  brandRow.getCell(11).alignment = { horizontal: "right" };

  // --- 5. FINAL SETUP & DOWNLOAD ---
  worksheet.getColumn(1).width = 45;
  worksheet.getColumn(1).alignment = {
    horizontal: "left",
    vertical: "middle",
    wrapText: true,
  };

  // Print Setup (A4 Landscape)
  worksheet.pageSetup = {
    paperSize: 9,
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer]),
    `Laporan_Proyeksi_${new Date().getFullYear()}.xlsx`,
  );
};
