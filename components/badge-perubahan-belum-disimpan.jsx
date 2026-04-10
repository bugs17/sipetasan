"use client";

const BadgePerubahanBelumDisimpan = ({ hasChanges }) => {
  if (!hasChanges) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[50] px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-bounce">
      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
      Perubahan Belum Disimpan
    </div>
  );
};

export default BadgePerubahanBelumDisimpan;
