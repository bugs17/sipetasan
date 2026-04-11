"use client";

const LoadingPetaJabatan = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-transparent text-white overflow-hidden relative">
      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-[#4f46e4]/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#4f46e4] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(79,70,228,0.3)]"></div>
          <div className="absolute inset-2 border-2 border-violet-400/20 border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
          <div className="absolute inset-[45%] bg-[#4f46e4]/40 rounded-full blur-[4px] animate-pulse"></div>
        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-white/90 animate-pulse">
            SINKRONISASI DATA
          </h2>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest italic">
            Memuat Struktur Peta Jabatan...
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-48 h-[2px] bg-white/5 mt-8 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 w-full animate-[loading-bar_2s_ease-in-out_infinite] origin-left"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            transform: scaleX(0);
            opacity: 0;
          }
          50% {
            transform: scaleX(0.5);
            opacity: 1;
          }
          100% {
            transform: scaleX(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingPetaJabatan;
