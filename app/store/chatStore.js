import { create } from "zustand";

const useChatStore = create((set) => ({
  isListening: false,
  setListening: (val) => set({ isListening: val }),
}));

export default useChatStore;
