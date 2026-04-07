import { create } from "zustand";

// Kita buat store bernama useUserStore
const useUserStore = create((set, get) => ({
  // 1. Ini adalah State (Data yang disimpan)
  userRole: "", // default role adalah guest

  // 2. Ini adalah Action (Fungsi untuk mengubah data)
  setUserRole: (newRole) => set({ userRole: newRole }),

  // 3. (Opsional) Getter manual jika dibutuhkan
  // Tapi biasanya kita langsung panggil state-nya di komponen
  getUserRole: () => get().userRole,
}));

export default useUserStore;
