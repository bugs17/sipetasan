const ListMutasiOpdSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-[#1a1a1e]/10 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center"
        >
          <div className="flex gap-6 items-center">
            <div className="w-12 h-12 bg-white/5 rounded-2xl"></div>
            <div className="space-y-2">
              <div className="w-40 h-4 bg-white/5 rounded"></div>
              <div className="w-24 h-2 bg-white/5 rounded"></div>
            </div>
          </div>
          <div className="w-20 h-4 bg-white/5 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default ListMutasiOpdSkeleton;
