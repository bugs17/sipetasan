"use client";

const ListMutasiAdminIndukSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-24 bg-white/[0.02] rounded-[2rem] border border-white/5"
        />
      ))}
    </div>
  );
};

export default ListMutasiAdminIndukSkeleton;
