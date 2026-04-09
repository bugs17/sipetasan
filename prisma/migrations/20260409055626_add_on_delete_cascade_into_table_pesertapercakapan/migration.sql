-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PesertaPercakapan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "ruangObrolanId" INTEGER NOT NULL,
    CONSTRAINT "PesertaPercakapan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PesertaPercakapan_ruangObrolanId_fkey" FOREIGN KEY ("ruangObrolanId") REFERENCES "RuangObrolan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PesertaPercakapan" ("id", "joinedAt", "ruangObrolanId", "userId") SELECT "id", "joinedAt", "ruangObrolanId", "userId" FROM "PesertaPercakapan";
DROP TABLE "PesertaPercakapan";
ALTER TABLE "new_PesertaPercakapan" RENAME TO "PesertaPercakapan";
CREATE UNIQUE INDEX "PesertaPercakapan_userId_ruangObrolanId_key" ON "PesertaPercakapan"("userId", "ruangObrolanId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
