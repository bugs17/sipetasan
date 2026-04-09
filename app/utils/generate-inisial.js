export function generateInisial(nama) {
  if (!nama || typeof nama !== "string") return "??";

  const kata = nama.trim().split(/\s+/);

  if (kata.length >= 2) {
    return (kata[0][0] + kata[1][0]).toUpperCase();
  }

  return kata[0].substring(0, 2).toUpperCase();
}
