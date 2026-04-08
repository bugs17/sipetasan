import React from "react";

const SkeletonPetaJabatan = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8 animate-pulse">
      {/* Header & Search Section Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col items-start space-y-4">
          {/* Badge Skeleton */}
          <div className="w-44 h-6 rounded-full bg-white/5 border border-white/10" />

          {/* Title Skeleton */}
          <div className="flex items-baseline gap-2">
            <div className="h-9 w-56 bg-white/10 rounded-lg" />
            <div className="h-2 w-2 rounded-full bg-indigo-500/50" />
          </div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="w-full md:w-80 h-12 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md" />
      </div>

      {/* Grid Instansi Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div
            key={i}
            className="flex flex-col items-start p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl h-[240px]"
          >
            {/* Icon Box Skeleton */}
            <div className="w-full flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#212126] border border-white/5" />
              <div className="w-4 h-4 bg-white/5 rounded" />
            </div>

            {/* Nama OPD Skeleton (2 baris) */}
            <div className="space-y-2 mb-8 w-full">
              <div className="h-3 w-full bg-white/10 rounded" />
              <div className="h-3 w-3/4 bg-white/10 rounded" />
            </div>

            {/* Bottom Info Skeleton */}
            <div className="w-full pt-4 border-t border-white/5 space-y-2">
              <div className="h-2 w-16 bg-white/5 rounded" />
              <div className="h-2 w-24 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonPetaJabatan;
