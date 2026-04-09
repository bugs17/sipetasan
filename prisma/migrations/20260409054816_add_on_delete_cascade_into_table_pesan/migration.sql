-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pesan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isiPesan" TEXT NOT NULL,
    "sudahBaca" BOOLEAN NOT NULL DEFAULT false,
    "pengirimId" INTEGER NOT NULL,
    "ruangObrolanId" INTEGER NOT NULL,
    CONSTRAINT "Pesan_pengirimId_fkey" FOREIGN KEY ("pengirimId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pesan_ruangObrolanId_fkey" FOREIGN KEY ("ruangObrolanId") REFERENCES "RuangObrolan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Pesan" ("createdAt", "id", "isiPesan", "pengirimId", "ruangObrolanId", "sudahBaca") SELECT "createdAt", "id", "isiPesan", "pengirimId", "ruangObrolanId", "sudahBaca" FROM "Pesan";
DROP TABLE "Pesan";
ALTER TABLE "new_Pesan" RENAME TO "Pesan";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
