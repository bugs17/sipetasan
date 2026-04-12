export const formatTanggalMutasi = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};
