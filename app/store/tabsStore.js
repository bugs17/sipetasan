import { create } from "zustand";

const useTabsStore = create((set, get) => ({
  activeTab: "struktural",
  disabledAll: false,
  
  setActiveTab: (newStatus) => set({ activeTab: newStatus }),
  setDisabledAll: (status) => set({ disabledAll: status }),

}));

export default useTabsStore;
