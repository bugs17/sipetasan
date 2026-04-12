const USIA_PENSIUN = parseInt(process.env.NEXT_PUBLIC_USIA_PENSIUN);

export const cekTahunKeluar = (p) => {
  if (!p || !p.tglLahir) return 9999; // Kembalikan tahun jauh agar tidak dianggap pensiun sekarang
  return new Date(p.tglLahir).getFullYear() + USIA_PENSIUN;
};
