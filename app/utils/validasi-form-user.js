import { validasiNomorTelepon } from "./validasi-no-whatsapp";

export const validationForm = (formData) => {
  if (!formData.nama_user) {
    alert("Nama user tidak boleh kosong!");
    return false;
  }
  if (!formData.email) {
    alert("Email tidak boleh kosong!");
    return false;
  }
  if (!formData.whatsapp) {
    alert("Kontak whatsapp tidak boleh kosong!");
    return false;
  }
  if (!validasiNomorTelepon(formData.whatsapp)) {
    alert("Kontak whatsapp tidak valid!");
    return false;
  }
  if (!formData.email.includes("@")) {
    alert("Email tidak valid!");
    return false;
  }
  if (formData.id === "") {
    if (!formData.password) {
      alert("Password tidak boleh kosong!");
      return false;
    }
    if (formData.password.length < 8) {
      alert("Password minimal 8 karakter!");
      return false;
    }
    if (!formData.role) {
      alert("Role tidak boleh kosong!");
      return false;
    }
    if (formData.role === "ADMIN_OPD") {
      if (!formData.opdId) {
        alert("Instansi tidak boleh kosong!");
        return false;
      }
    }
  }
  // return true jika semua kondisi berhasil dicek
  return true;
};
