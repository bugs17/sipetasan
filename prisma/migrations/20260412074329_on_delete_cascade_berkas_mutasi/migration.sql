-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BerkasMutasi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status_berkas" TEXT,
    "namaBerkas" TEXT,
    "urlBerkas" TEXT,
    "mutasiId" INTEGER,
    CONSTRAINT "BerkasMutasi_mutasiId_fkey" FOREIGN KEY ("mutasiId") REFERENCES "Mutasi" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BerkasMutasi" ("createdAt", "id", "mutasiId", "namaBerkas", "status_berkas", "updatedAt", "urlBerkas") SELECT "createdAt", "id", "mutasiId", "namaBerkas", "status_berkas", "updatedAt", "urlBerkas" FROM "BerkasMutasi";
DROP TABLE "BerkasMutasi";
ALTER TABLE "new_BerkasMutasi" RENAME TO "BerkasMutasi";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
