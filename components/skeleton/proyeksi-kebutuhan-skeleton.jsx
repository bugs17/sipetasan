"use client";

const ProyeksiSkeleton = () => {
  return (
    <div className="w-full min-h-screen text-slate-300 p-8 font-sans animate-pulse">
      {/* HEADER SKELETON */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div>
              <div className="h-6 w-64 bg-slate-800 rounded-lg mb-2"></div>
              <div className="h-3 w-40 bg-slate-900 rounded-lg"></div>
            </div>
            {/* Year Selector Skeleton */}
            <div className="h-12 w-32 bg-white/5 border border-white/10 rounded-2xl"></div>
          </div>

          {/* Badge Tahun Skeleton */}
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-14 w-16 bg-white/5 border border-white/10 rounded-xl"
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT AREA SKELETON */}
      <div className="space-y-12">
        {[1, 2].map((group) => (
          <div key={group} className="relative">
            {/* Jabatan Header Skeleton */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10"></div>
              <div className="space-y-2">
                <div className="h-5 w-48 bg-slate-800 rounded-lg"></div>
                <div className="h-3 w-32 bg-slate-900 rounded-lg"></div>
              </div>
            </div>

            {/* Grid 5 Kolom Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((card) => (
                <div
                  key={card}
                  className="p-6 rounded-[2rem] border border-white/5 bg-[#161b22] h-64 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-12 bg-slate-800 rounded"></div>
                    <div className="h-4 w-16 bg-white/5 rounded-full"></div>
                  </div>

                  {/* Mimic the "Terpenuhi" or "Keluar" area */}
                  <div className="space-y-3">
                    <div className="h-10 w-20 bg-slate-800 rounded-xl"></div>
                    <div className="h-12 w-full bg-white/5 rounded-xl"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-8 w-full bg-white/5 rounded-lg"></div>
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

export default ProyeksiSkeleton;
