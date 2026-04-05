"use client";

const SettingInstansiSkeleton = () => {
  return (
    <div className="w-full min-h-screen text-white p-4 md:p-8 font-sans bg-transparent text-left">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* HEADER SKELETON */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#0f0f12]/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-white/10 rounded-full" />
              <div className="h-2 w-24 bg-white/5 rounded" />
            </div>
            <div className="h-8 w-48 bg-white/10 rounded-lg" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="h-12 w-full md:w-64 bg-white/5 rounded-2xl border border-white/5" />
            <div className="h-12 w-40 bg-white/5 rounded-2xl border border-white/5" />
            <div className="h-12 w-32 bg-[#6d28d9]/20 rounded-2xl border border-[#6d28d9]/10" />
          </div>
        </div>

        {/* TABLE SKELETON */}
        <div className="bg-[#0f0f12]/60 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-6">
                    <div className="h-2 w-20 bg-white/10 rounded" />
                  </th>
                  <th className="p-6 hidden lg:table-cell">
                    <div className="h-2 w-20 bg-white/10 rounded" />
                  </th>
                  <th className="p-6 text-right">
                    <div className="h-2 w-12 bg-white/10 ml-auto rounded" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td className="p-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white/5 shrink-0" />
                        <div className="space-y-2">
                          <div className="h-3 w-32 bg-white/10 rounded" />
                          <div className="h-2 w-24 bg-white/5 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 px-6 hidden lg:table-cell">
                      <div className="space-y-2">
                        <div className="h-2 w-20 bg-white/5 rounded" />
                        <div className="h-4 w-12 bg-white/5 rounded-md" />
                      </div>
                    </td>
                    <td className="p-4 px-6 text-right">
                      <div className="h-8 w-8 bg-white/5 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION SKELETON */}
          <div className="p-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.01]">
            <div className="h-3 w-48 bg-white/5 rounded" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-white/5 rounded-xl" />
              <div className="flex gap-1">
                <div className="h-8 w-8 bg-white/10 rounded-xl" />
                <div className="h-8 w-8 bg-white/5 rounded-xl" />
              </div>
              <div className="h-8 w-8 bg-white/5 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingInstansiSkeleton;

export function ListSkeleton() {
  return [...Array(6)].map((_, i) => (
    <tr key={i}>
      <td className="p-4 px-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-white/5 shrink-0" />
          <div className="space-y-2">
            <div className="h-3 w-32 bg-white/10 rounded" />
            <div className="h-2 w-24 bg-white/5 rounded" />
          </div>
        </div>
      </td>
      <td className="p-4 px-6 hidden lg:table-cell">
        <div className="space-y-2">
          <div className="h-2 w-20 bg-white/5 rounded" />
          <div className="h-4 w-12 bg-white/5 rounded-md" />
        </div>
      </td>
      <td className="p-4 px-6 text-right">
        <div className="h-8 w-8 bg-white/5 rounded-lg ml-auto" />
      </td>
    </tr>
  ));
}
