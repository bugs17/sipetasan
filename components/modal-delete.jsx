import { AlertTriangle } from "lucide-react";

const ModalDelete = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  title,
  desc,
  selectedPegawai,
  handleDelete,
}) => {
  if (!isDeleteModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => setIsDeleteModalOpen(false)}
      />
      <div className="bg-[#1a1a1e] border border-red-500/20 p-8 shadow-2xl rounded-[2.5rem] max-w-sm w-full relative animate-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">
            {title}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed px-4">
            {desc}
            <span className="text-white font-bold">
              {selectedPegawai?.nama}
            </span>{" "}
            akan dihapus permanen.
          </p>
          <div className="flex w-full gap-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
