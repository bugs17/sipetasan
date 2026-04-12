const USIA_PENSIUN = parseInt(process.env.NEXT_PUBLIC_USIA_PENSIUN);

export const cekTahunKeluar = (p) => {
  // if (p.statusKeluar) return p.statusKeluar.tahun; // di gunakan jika keluar bukan hanya di sebabkan oleh pensiun
  return new Date(p.tglLahir).getFullYear() + USIA_PENSIUN;
};
