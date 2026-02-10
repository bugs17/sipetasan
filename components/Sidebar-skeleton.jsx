import React from 'react';

const SidebarSkeleton = () => {
  return (
    <div className="w-full space-y-6 px-4 py-6 animate-pulse">

      {/* Menu Groups */}
      <div className="space-y-8">
        {[1, 2].map((group) => (
          <div key={group} className="space-y-4">
            {/* Label Grup Menu */}
            <div className="h-2 w-16 bg-white/5 rounded-full ml-4 mb-2"></div>
            
            {/* List Item Menu */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
                {/* Icon Skeleton */}
                <div className="w-5 h-5 bg-white/10 rounded-md"></div>
                {/* Text Skeleton */}
                <div className="h-3 w-24 bg-white/10 rounded-full"></div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Profile Skeleton di bagian bawah */}
      {/* <div className="absolute bottom-10 left-0 w-full px-6">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="w-10 h-10 bg-white/10 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-white/10 rounded-full"></div>
            <div className="h-2 w-12 bg-white/5 rounded-full"></div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SidebarSkeleton;