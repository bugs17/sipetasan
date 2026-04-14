-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProyeksiKeluar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pegawaiId" INTEGER,
    "jabatanId" INTEGER,
    "opdId" INTEGER,
    "alasan" TEXT,
    "tanggalKeluar" DATETIME,
    "tahun" INTEGER,
    CONSTRAINT "ProyeksiKeluar_pegawaiId_fkey" FOREIGN KEY ("pegawaiId") REFERENCES "Pegawai" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProyeksiKeluar_jabatanId_fkey" FOREIGN KEY ("jabatanId") REFERENCES "Jabatan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProyeksiKeluar_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "Opd" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProyeksiKeluar" ("alasan", "id", "jabatanId", "opdId", "pegawaiId", "tahun", "tanggalKeluar") SELECT "alasan", "id", "jabatanId", "opdId", "pegawaiId", "tahun", "tanggalKeluar" FROM "ProyeksiKeluar";
DROP TABLE "ProyeksiKeluar";
ALTER TABLE "new_ProyeksiKeluar" RENAME TO "ProyeksiKeluar";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
