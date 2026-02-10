-- CreateTable
CREATE TABLE "Jabatan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "namaJabatan" TEXT NOT NULL,
    "kJ" INTEGER NOT NULL DEFAULT 0,
    "b" INTEGER NOT NULL DEFAULT 0,
    "aBK" REAL NOT NULL DEFAULT 0.00,
    "kurangLebih" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Tugas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "namaTugas" TEXT,
    "hasil" TEXT,
    "jumlahBebanKerjaSetahun" INTEGER NOT NULL DEFAULT 0,
    "waktuPenyelesaianDalamJam" INTEGER NOT NULL DEFAULT 0,
    "waktuEfektifPenyelesaian" INTEGER NOT NULL DEFAULT 0,
    "KebutuhanPegawai" REAL NOT NULL DEFAULT 0.00,
    "jabatanId" INTEGER NOT NULL,
    CONSTRAINT "Tugas_jabatanId_fkey" FOREIGN KEY ("jabatanId") REFERENCES "Jabatan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pendidikan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "namaPendidikan" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pegawai" (
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
    "atasanId" INTEGER,
    CONSTRAINT "Pegawai_pendidikanId_fkey" FOREIGN KEY ("pendidikanId") REFERENCES "Pendidikan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pegawai_jabatanId_fkey" FOREIGN KEY ("jabatanId") REFERENCES "Jabatan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pegawai_atasanId_fkey" FOREIGN KEY ("atasanId") REFERENCES "Pegawai" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clerkUserId" TEXT,
    "role" TEXT
);

-- CreateTable
CREATE TABLE "Opd" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "namaOpd" TEXT NOT NULL,
    "userId" INTEGER,
    "pegawaiId" INTEGER,
    CONSTRAINT "Opd_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Opd_pegawaiId_fkey" FOREIGN KEY ("pegawaiId") REFERENCES "Pegawai" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Opd_userId_key" ON "Opd"("userId");

