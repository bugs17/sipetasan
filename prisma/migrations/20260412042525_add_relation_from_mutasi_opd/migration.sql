-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mutasi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "pegawaiId" INTEGER,
    "opdAsalId" INTEGER,
    "opdTujuanId" INTEGER,
    "status" TEXT DEFAULT 'pending',
    "catatan" TEXT,
    CONSTRAINT "Mutasi_pegawaiId_fkey" FOREIGN KEY ("pegawaiId") REFERENCES "Pegawai" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Mutasi_opdAsalId_fkey" FOREIGN KEY ("opdAsalId") REFERENCES "Opd" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Mutasi_opdTujuanId_fkey" FOREIGN KEY ("opdTujuanId") REFERENCES "Opd" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Mutasi" ("catatan", "createdAt", "id", "opdTujuanId", "pegawaiId", "status", "updatedAt") SELECT "catatan", "createdAt", "id", "opdTujuanId", "pegawaiId", "status", "updatedAt" FROM "Mutasi";
DROP TABLE "Mutasi";
ALTER TABLE "new_Mutasi" RENAME TO "Mutasi";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
