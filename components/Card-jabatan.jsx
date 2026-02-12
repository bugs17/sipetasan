"use client";

function JabatanCard({ node, onAddSubordinate }) {
  const handleAdd = () => {
    const nama = prompt("Masukkan Nama Jabatan Baru:");
    if (nama) {
      onAddSubordinate(node.id, {
        id: Date.now(),
        namaJabatan: nama,
        kJ: 1,
        children: []
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Box Jabatan */}
      <div className="relative group">
        <div className="w-64 bg-[#161b22] border-2 border-indigo-500/30 p-5 rounded-2xl shadow-xl transition-all hover:border-indigo-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <button className="text-slate-600 hover:text-rose-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <h3 className="text-white font-black uppercase text-sm tracking-tight mb-1">
            {node.namaJabatan}
          </h3>
          <p className="text-[10px] text-slate-500 font-bold">Kebutuhan: {node.kJ} Orang</p>

          {/* Tombol Tambah Bawahan */}
          <button 
            onClick={handleAdd}
            className="mt-4 w-full py-2 bg-white/5 hover:bg-indigo-500 hover:text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-3 h-3" /> Tambah Bawahan
          </button>
        </div>

        {/* Garis Vertikal ke Bawah jika ada anak */}
        {node.children.length > 0 && (
          <div className="w-px h-10 bg-indigo-500/30 mx-auto"></div>
        )}
      </div>

      {/* Container untuk Children (Garis Horizontal & List Anak) */}
      {node.children.length > 0 && (
        <div className="relative flex pt-4 gap-8 border-t-2 border-indigo-500/30">
          {node.children.map((child) => (
            <JabatanCard 
              key={child.id} 
              node={child} 
              onAddSubordinate={onAddSubordinate} 
            />
          ))}
        </div>
      )}
    </div>
  );
}