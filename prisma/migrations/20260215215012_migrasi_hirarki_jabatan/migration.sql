/*
  Warnings:

  - You are about to drop the column `pegawaiId` on the `Opd` table. All the data in the column will be lost.
  - You are about to drop the column `atasanId` on the `Pegawai` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Jabatan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "namaJabatan" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "kJ" INTEGER NOT NULL DEFAULT 0,
    "b" INTEGER NOT NULL DEFAULT 0,
    "aBK" REAL NOT NULL DEFAULT 0.00,
    "kurangLebih" INTEGER NOT NULL DEFAULT 0,
    "parentId" INTEGER,
    "opdId" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Jabatan_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Jabatan" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Jabatan_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "Opd" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Jabatan" ("aBK", "b", "createdAt", "id", "kJ", "kurangLebih", "namaJabatan", "updatedAt") SELECT "aBK", "b", "createdAt", "id", "kJ", "kurangLebih", "namaJabatan", "updatedAt" FROM "Jabatan";
DROP TABLE "Jabatan";
ALTER TABLE "new_Jabatan" RENAME TO "Jabatan";
CREATE TABLE "new_Opd" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "namaOpd" TEXT NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Opd_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Opd" ("createdAt", "id", "namaOpd", "updatedAt", "userId") SELECT "createdAt", "id", "namaOpd", "updatedAt", "userId" FROM "Opd";
DROP TABLE "Opd";
ALTER TABLE "new_Opd" RENAME TO "Opd";
CREATE UNIQUE INDEX "Opd_userId_key" ON "Opd"("userId");
CREATE TABLE "new_Pegawai" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nama" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "tanggalLahir" DATETIME NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "tahunPensiun" INTEGER NOT NULL DEFAULT 0,
    "tahunKebutuhan" INTEGER NOT NULL DEFAULT 0,
    "pendidikanId" INTEGER,
    "jabatanId" INTEGER,
    "opdId" INTEGER,
    CONSTRAINT "Pegawai_pendidikanId_fkey" FOREIGN KEY ("pendidikanId") REFERENCES "Pendidikan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pegawai_jabatanId_fkey" FOREIGN KEY ("jabatanId") REFERENCES "Jabatan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pegawai_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "Opd" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Pegawai" ("createdAt", "id", "jabatanId", "nama", "nip", "pendidikanId", "tahunKebutuhan", "tahunPensiun", "tanggalLahir", "tempatLahir", "updatedAt") SELECT "createdAt", "id", "jabatanId", "nama", "nip", "pendidikanId", "tahunKebutuhan", "tahunPensiun", "tanggalLahir", "tempatLahir", "updatedAt" FROM "Pegawai";
DROP TABLE "Pegawai";
ALTER TABLE "new_Pegawai" RENAME TO "Pegawai";
CREATE UNIQUE INDEX "Pegawai_nip_key" ON "Pegawai"("nip");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
