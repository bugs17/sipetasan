import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (
  matrixData,
  listTahun,
  namaInstansi = "PEMERINTAH KABUPATEN/KOTA",
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Laporan Proyeksi");

  // 1. KOP INSTANSI & JUDUL
  // Baris 1: Nama Instansi
  const rowInstansi = worksheet.addRow([namaInstansi.toUpperCase()]);
  worksheet.mergeCells("A1:K1");
  const cellInstansi = worksheet.getCell("A1");
  cellInstansi.font = { name: "Arial", size: 14, bold: true };
  cellInstansi.alignment = { horizontal: "center" };

  // Baris 2: Nama Laporan
  const rowJudul = worksheet.addRow([
    "LAPORAN ANALISIS PROYEKSI KEBUTUHAN PEGAWAI (5 TAHUN)",
  ]);
  worksheet.mergeCells("A2:K2");
  const cellJudul = worksheet.getCell("A2");
  cellJudul.font = { name: "Arial", size: 12, bold: true };
  cellJudul.alignment = { horizontal: "center" };

  // Baris 3: Spacer (Kosongkan satu baris agar tidak terlalu rapat)
  worksheet.addRow([]);

  // 2. SETUP HEADER TABEL (Geser ke baris 4 & 5)
  // Header Row 1: Grouping
  const rowHeaderGroup = [
    "NAMA JABATAN",
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
  ];
  worksheet.addRow(rowHeaderGroup);

  // Karena sekarang mulai di baris 4, kita sesuaikan koordinat merge-nya
  worksheet.mergeCells("A4:A5"); // Jabatan
  worksheet.mergeCells("B4:F4"); // Group Pensiun
  worksheet.mergeCells("G4:K4"); // Group Kebutuhan

  worksheet.getCell("B4").value = "PROYEKSI PENSIUN";
  worksheet.getCell("G4").value = "KEBUTUHAN FORMASI (H+1)";

  // Header Row 2: Tahun
  const rowTahun = [""];
  listTahun.forEach((y) => rowTahun.push(y));
  listTahun.forEach((y) => rowTahun.push(y));
  worksheet.addRow(rowTahun);

  // Styling Header Tabel (Baris 4 & 5)
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

  // 3. INSERT DATA
  matrixData.forEach((jab) => {
    const rowData = [jab.jabatan];
    listTahun.forEach((y) => rowData.push(jab.pensiunPerTahun[y] || 0));
    listTahun.forEach((y) => rowData.push(jab.kebutuhanPerTahun[y] || 0));

    const row = worksheet.addRow(rowData);

    row.eachCell((cell, colNumber) => {
      if (colNumber > 1) {
        const value = cell.value;
        if (value > 0) {
          const isPensiunZone = colNumber >= 2 && colNumber <= 6;
          cell.font = { bold: true, color: { argb: "FFFFFF" } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: isPensiunZone ? "E11D48" : "D97706" },
          };
        } else {
          cell.font = { color: { argb: "94A3B8" } }; // Angka 0 jadi abu-abu
        }
      }
    });
  });

  // 4. BORDER & ALIGNMENT (Mulai dari Baris 4 ke bawah)
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber >= 4) {
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

  worksheet.getColumn(1).alignment = {
    horizontal: "left",
    vertical: "middle",
    wrapText: true,
  };
  worksheet.getColumn(1).width = 40;

  // 5. DOWNLOAD
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer]),
    `Laporan_Proyeksi_${new Date().getFullYear()}.xlsx`,
  );
};
