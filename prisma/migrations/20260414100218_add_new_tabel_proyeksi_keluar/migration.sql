-- CreateTable
CREATE TABLE "ProyeksiKeluar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pegawaiId" INTEGER,
    "jabatanId" INTEGER,
    "opdId" INTEGER,
    "alasan" TEXT,
    "tanggalKeluar" DATETIME,
    "tahun" INTEGER
);
