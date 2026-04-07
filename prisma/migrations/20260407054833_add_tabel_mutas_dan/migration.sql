-- CreateTable
CREATE TABLE "Mutasi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "pegawaiId" INTEGER,
    "opdTujuanId" INTEGER,
    "status" TEXT DEFAULT 'pending',
    "catatan" TEXT,
    CONSTRAINT "Mutasi_pegawaiId_fkey" FOREIGN KEY ("pegawaiId") REFERENCES "Pegawai" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BerkasMutasi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "namaBerkas" TEXT,
    "urlBerkas" TEXT,
    "mutasiId" INTEGER,
    CONSTRAINT "BerkasMutasi_mutasiId_fkey" FOREIGN KEY ("mutasiId") REFERENCES "Mutasi" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Mutasi_pegawaiId_key" ON "Mutasi"("pegawaiId");
