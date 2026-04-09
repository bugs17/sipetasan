-- CreateTable
CREATE TABLE "RuangObrolan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nama" TEXT
);

-- CreateTable
CREATE TABLE "PesertaPercakapan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "ruangObrolanId" INTEGER NOT NULL,
    CONSTRAINT "PesertaPercakapan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PesertaPercakapan_ruangObrolanId_fkey" FOREIGN KEY ("ruangObrolanId") REFERENCES "RuangObrolan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pesan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isiPesan" TEXT NOT NULL,
    "sudahBaca" BOOLEAN NOT NULL DEFAULT false,
    "pengirimId" INTEGER NOT NULL,
    "ruangObrolanId" INTEGER NOT NULL,
    CONSTRAINT "Pesan_pengirimId_fkey" FOREIGN KEY ("pengirimId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pesan_ruangObrolanId_fkey" FOREIGN KEY ("ruangObrolanId") REFERENCES "RuangObrolan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PesertaPercakapan_userId_ruangObrolanId_key" ON "PesertaPercakapan"("userId", "ruangObrolanId");
