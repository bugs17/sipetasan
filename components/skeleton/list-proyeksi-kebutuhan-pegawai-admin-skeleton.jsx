"use client";

const SkeletonProyeksiKebutuhanListInstansi = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-10 animate-pulse">
      {/* Header Section Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col items-start space-y-5">
          {/* Badge Skeleton */}
          <div className="w-40 h-6 rounded-full bg-white/5 border border-white/10" />

          {/* Title Skeleton */}
          <div className="h-10 w-72 bg-white/10 rounded-xl" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="w-full md:w-80 h-12 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md" />
      </div>

      {/* Grid Instansi Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="relative bg-white/5 border border-white/5 rounded-[2rem] p-8 h-[300px] flex flex-col justify-between"
          >
            {/* Top Row Skeleton */}
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 w-14 h-14 rounded-2xl bg-[#212126] border border-white/5" />
              <div className="w-16 h-6 rounded-full bg-white/5 border border-white/10" />
            </div>

            {/* Content Skeleton */}
            <div className="space-y-3 flex-grow">
              <div className="h-5 w-3/4 bg-white/10 rounded" />
              <div className="space-y-2">
                <div className="h-2.5 w-full bg-white/5 rounded" />
                <div className="h-2.5 w-2/3 bg-white/5 rounded" />
              </div>
            </div>

            {/* Bottom Row Skeleton */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="h-3 w-24 bg-white/5 rounded" />
              <div className="w-8 h-8 rounded-full bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonProyeksiKebutuhanListInstansi;
