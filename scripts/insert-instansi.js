import { prisma } from "../app/lib/db.js";
import crypto from "crypto";

const daftarDinas = [
  "biro tata pemerintahan dan kesejahteraan rakyat",
  "biro hukum",
  "biro perekonomian",
  "biro pengadaan barang dan jasa",
  "biro organisasi",
  "biro umum dan administrasi pimpinan",
  "sekretariat dewan perwakilan rakyat",
  "sekretariat majelis rakyat papua",
  "dinas kesehatan",
  "dinas pendidikan",
  "dinas pekerjaan umum, penataan ruang, perumahan, kawasan permukiman dan pertanahan",
  "dinas sosial, kependudukan dan catatan sipil",
  "dinas pemberdayaan perempuan, perlindungan anak, pengendalian penduduk dan keluarga berencana",
  "dinas perindustrian dan perdagangan",
  "dinas tenaga kerja, koperasi, usaha kecil menengah dan transmigrasi",
  "dinas pangan",
  "dinas pertanian",
  "dinas penanaman modal dan pelayanan terpadu satu pintu",
  "dinas energi dan sumber daya mineral",
  "dinas kehutanan dan lingkungan hidup",
  "dinas kebudayaan dan parawisata",
  "dinas kelautan dan perikanan",
  "dinas komunikasi dan informatika",
  "dinas perhubungan",
  "dinas olahraga dan pemuda",
  "dinas pemberdayaan masyarakat kampung dan adat",
  "dinas arsip dan perpustakaan",
  "satuan polisi pamong praja",
  "inspektorat",
  "badan pengelolaan keuangan dan aset daerah",
  "badan perencanaan, pembangunan, riset dan inovasi daerah",
  "badan kepegawaian daerah",
  "badan pengembangan sumber daya manusia",
  "badan pendapatan daerah",
  "badan pengelola perbatasan",
  "badan penanggulangan bencana daerah",
  "badan kesatuan bangsa dan politik",
  "badan penghubung daerah",
  "rumah sakit umum daerah jayapura",
  "rumah sakit umum daerah abepura",
  "rumah sakit khusus jiwa abepura",
];

const run = async () => {
  console.log("###### Prosess start ###########");
  const dataToInsert = daftarDinas.map((nama) => {
    const baseSlug = nama
      .toLowerCase()
      .replace(/,/g, "") // Hapus koma
      .replace(/\s+/g, "-") // Ganti spasi jadi dash
      .replace(/[^\w-]+/g, ""); // Hapus karakter non-word (biar bersih)

    // 2. Generate random string (4 karakter saja sudah cukup buat unik)
    const randomId = crypto.randomBytes(2).toString("hex");
    return { namaOpd: nama, slug: `${baseSlug}-${randomId}` };
  });

  try {
    // Kita pakai $transaction supaya kalau ada error fatal, semua dibatalkan
    const results = await prisma.$transaction(
      dataToInsert.map((item) =>
        prisma.opd.upsert({
          where: { slug: item.slug }, // Syarat unik (slug harus @unique di schema)
          update: {}, // Jika sudah ada, jangan update apa-apa
          create: item, // Jika belum ada, buat baru
        }),
      ),
    );
    console.log(`✅ Berhasil! ${results.length} data masuk.`);
  } catch (error) {
    console.error("❌ Error pas insert:", error);
  } finally {
    await prisma.$disconnect();
  }
};

run();
