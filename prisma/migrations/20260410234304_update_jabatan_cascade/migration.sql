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
    "opdId" INTEGER DEFAULT 1,
    CONSTRAINT "Jabatan_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Jabatan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Jabatan_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "Opd" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Jabatan" ("aBK", "b", "createdAt", "id", "kJ", "kurangLebih", "level", "namaJabatan", "opdId", "parentId", "updatedAt") SELECT "aBK", "b", "createdAt", "id", "kJ", "kurangLebih", "level", "namaJabatan", "opdId", "parentId", "updatedAt" FROM "Jabatan";
DROP TABLE "Jabatan";
ALTER TABLE "new_Jabatan" RENAME TO "Jabatan";
CREATE INDEX "Jabatan_opdId_idx" ON "Jabatan"("opdId");
CREATE INDEX "Jabatan_parentId_idx" ON "Jabatan"("parentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
