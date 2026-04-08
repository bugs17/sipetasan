export function getColorFromId(id) {
  const colors = [
    "#6d28d9", // purple
    "#2563eb", // blue
    "#16a34a", // green
    "#dc2626", // red
    "#ea580c", // orange
    "#0891b2", // cyan
    "#a855f7", // purple light

    "#0d9488", // teal
    "#2dd4bf", // aquamarine
    "#f43f5e", // salmon/coral
    "#0e7490", // teal dark
    "#059669", // emerald
    "#10b981", // green light
    "#15803d", // forest
    "#8b5cf6", // soft violet
    "#6366f1", // royal indigo
    "#fb923c", // soft orange
    "#22c55e", // bright green
    "#0284c7", // sky
    "#0369a1", // ocean

    "#ca8a04", // yellow/gold
    "#d97706", // amber
    "#b45309", // brown orange
    "#65a30d", // lime
  ];

  return colors[id % colors.length];
}
