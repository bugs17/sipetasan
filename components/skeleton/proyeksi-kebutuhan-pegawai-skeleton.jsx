"use client";

const SkeletonProyeksi = () => {
  return (
    <div className="w-full min-h-screen text-slate-300 p-8 font-sans animate-pulse">
      {/* HEADER AREA SKELETON */}
      <div className="sticky top-0 z-50 -mx-4 px-4 py-6 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/5 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-start gap-4">
              {/* Back Button Skeleton */}
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />

              <div className="space-y-3">
                {/* Title Skeleton */}
                <div className="h-5 w-48 bg-white/10 rounded-md" />
                {/* Subtitle Instansi Skeleton */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-indigo-500/30" />
                  <div className="h-3 w-32 bg-white/5 rounded" />
                </div>
                {/* Description Skeleton */}
                <div className="h-2 w-40 bg-white/5 rounded mt-1" />
              </div>
            </div>

            {/* Year Selector Skeleton */}
            <div className="w-32 h-10 bg-white/5 border border-white/10 rounded-2xl" />
          </div>

          {/* Badge Grid Skeleton */}
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-16 h-12 bg-white/5 border border-white/10 rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT AREA SKELETON */}
      <div className="space-y-16">
        {[1, 2].map((group) => (
          <div key={group} className="relative">
            {/* Jabatan Title Skeleton */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10" />
              <div className="space-y-2">
                <div className="h-4 w-56 bg-white/10 rounded" />
                <div className="h-2 w-32 bg-white/5 rounded" />
              </div>
            </div>

            {/* Grid Proyeksi Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((card) => (
                <div
                  key={card}
                  className="p-6 rounded-[2rem] border border-white/5 bg-[#161b22] h-64 flex flex-col justify-between"
                >
                  <div className="flex justify-between">
                    <div className="h-3 w-10 bg-white/5 rounded" />
                    <div className="h-4 w-14 bg-white/5 rounded-full" />
                  </div>

                  <div className="space-y-4">
                    <div className="h-10 w-20 bg-white/10 rounded-lg" />
                    <div className="h-12 w-full bg-white/5 rounded-2xl" />
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="h-2 w-full bg-white/5 rounded" />
                    <div className="h-2 w-2/3 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonProyeksi;
