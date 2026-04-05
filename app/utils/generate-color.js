export function getColorFromId(id) {
  const colors = [
    "#6d28d9", // purple
    "#2563eb", // blue
    "#16a34a", // green
    "#dc2626", // red
    "#ea580c", // orange
    "#0891b2", // cyan
  ];

  return colors[id % colors.length];
}
