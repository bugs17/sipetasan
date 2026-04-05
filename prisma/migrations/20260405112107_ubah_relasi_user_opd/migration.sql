/*
  Warnings:

  - You are about to drop the column `userId` on the `Opd` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Opd" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "namaOpd" TEXT NOT NULL
);
INSERT INTO "new_Opd" ("createdAt", "id", "namaOpd", "updatedAt") SELECT "createdAt", "id", "namaOpd", "updatedAt" FROM "Opd";
DROP TABLE "Opd";
ALTER TABLE "new_Opd" RENAME TO "Opd";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clerkUserId" TEXT,
    "role" TEXT,
    "opdId" INTEGER,
    CONSTRAINT "User_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "Opd" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("clerkUserId", "createdAt", "id", "role", "updatedAt") SELECT "clerkUserId", "createdAt", "id", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");
CREATE UNIQUE INDEX "User_opdId_key" ON "User"("opdId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
