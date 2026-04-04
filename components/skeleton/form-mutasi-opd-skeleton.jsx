const FormMutasiOpdSkeleton = () => {
  return (
    <div className="h-full w-full grid grid-cols-12 gap-6 overflow-hidden animate-pulse">
      <div className="col-span-8 h-full bg-[#1a1a1e]/20 border border-white/5 p-8 rounded-[2.5rem]">
        <div className="flex gap-4 mb-8">
          <div className="w-12 h-12 bg-white/5 rounded-2xl"></div>
          <div className="space-y-2">
            <div className="w-32 h-4 bg-white/5 rounded"></div>
            <div className="w-48 h-2 bg-white/5 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`space-y-2 ${i > 2 ? "col-span-2" : ""}`}>
              <div className="w-20 h-2 bg-white/5 rounded"></div>
              <div className="w-full h-12 bg-white/5 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-4 h-full bg-[#1a1a1e]/20 border border-white/5 p-8 rounded-[2.5rem] space-y-4">
        <div className="w-32 h-4 bg-white/5 rounded mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full h-16 bg-white/5 rounded-2xl"></div>
        ))}
        <div className="w-full h-14 bg-white/5 rounded-2xl mt-auto"></div>
      </div>
    </div>
  );
};

export default FormMutasiOpdSkeleton;

// const FormSkeleton = () => (

// );
