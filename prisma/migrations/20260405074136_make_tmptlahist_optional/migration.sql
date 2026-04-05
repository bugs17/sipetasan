-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pegawai" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nama" TEXT NOT NULL,
    "nip" TEXT,
    "tanggalLahir" DATETIME,
    "tempatLahir" TEXT,
    "tahunPensiun" INTEGER NOT NULL DEFAULT 0,
    "tahunKebutuhan" INTEGER NOT NULL DEFAULT 0,
    "pendidikanId" INTEGER,
    "jabatanId" INTEGER,
    "opdId" INTEGER,
    CONSTRAINT "Pegawai_pendidikanId_fkey" FOREIGN KEY ("pendidikanId") REFERENCES "Pendidikan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pegawai_jabatanId_fkey" FOREIGN KEY ("jabatanId") REFERENCES "Jabatan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pegawai_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "Opd" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Pegawai" ("createdAt", "id", "jabatanId", "nama", "nip", "opdId", "pendidikanId", "tahunKebutuhan", "tahunPensiun", "tanggalLahir", "tempatLahir", "updatedAt") SELECT "createdAt", "id", "jabatanId", "nama", "nip", "opdId", "pendidikanId", "tahunKebutuhan", "tahunPensiun", "tanggalLahir", "tempatLahir", "updatedAt" FROM "Pegawai";
DROP TABLE "Pegawai";
ALTER TABLE "new_Pegawai" RENAME TO "Pegawai";
CREATE UNIQUE INDEX "Pegawai_nip_key" ON "Pegawai"("nip");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
