import { create } from "zustand";

const useAkumulasiTabelStore = create((set, get) => ({
  shown: false,
  toggleShown: () => set((state) => ({ shown: !state.shown })),

}));

export default useAkumulasiTabelStore;
