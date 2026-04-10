"use client";
import { HiOutlineExclamation } from "react-icons/hi";

const ModalDeletePerubahan = ({
  deleteModal,
  setDeleteModal,
  executeDelete,
}) => {
  if (!deleteModal.show) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1a1e] border border-white/10 w-full max-w-sm rounded-[2rem] p-8 text-center animate-in zoom-in duration-200">
        <HiOutlineExclamation className="text-red-500 w-12 h-12 mx-auto mb-4" />
        <h3 className="text-white font-black uppercase italic mb-2">
          Hapus Cabang?
        </h3>
        <p className="text-gray-400 text-sm mb-8 italic leading-relaxed">
          "{deleteModal.title}"
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteModal({ show: false })}
            className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold text-xs"
          >
            BATAL
          </button>
          <button
            onClick={executeDelete}
            className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-bold text-xs uppercase shadow-lg shadow-red-900/30"
          >
            YA, HAPUS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeletePerubahan;
