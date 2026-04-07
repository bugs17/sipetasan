import { nanoid } from "nanoid";

export const generateSlug = (text) => {
  const cleanedText = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Ganti spasi dengan -
    .replace(/[^\w\-]+/g, "") // Hapus simbol
    .replace(/\-\-+/g, "-"); // Hapus double dash

  // Langsung gabungkan di sini (nanoid ditaruh di depan atau belakang sesukamu)
  return `${nanoid(6)}-${cleanedText}`;
};
