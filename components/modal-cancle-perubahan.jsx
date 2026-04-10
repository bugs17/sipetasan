"use client";

import { HiOutlineBan } from "react-icons/hi";

const ModalCanclePerubahan = ({
  cancelModal,
  setCancelModal,
  setDraftData,
  dataHirarki,
  setIsEditMode,
}) => {
  if (!cancelModal) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1a1e] border border-white/10 w-full max-w-sm rounded-[2rem] p-8 text-center animate-in zoom-in duration-200">
        <HiOutlineBan className="text-amber-500 w-12 h-12 mx-auto mb-4" />
        <h3 className="text-white font-black uppercase italic mb-2 tracking-tighter">
          Batalkan Perubahan?
        </h3>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Semua perubahan yang belum disimpan akan hilang secara permanen.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setCancelModal(false)}
            className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold text-xs"
          >
            LANJUT EDIT
          </button>
          <button
            onClick={() => {
              setDraftData(dataHirarki);
              setIsEditMode(false);
              setCancelModal(false);
            }}
            className="flex-1 py-4 rounded-2xl bg-amber-600 text-white font-bold text-xs uppercase"
          >
            YA, BATALKAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCanclePerubahan;
