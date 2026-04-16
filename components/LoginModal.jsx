"use client";
import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginModal({ isOpen, onClose }) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setPending(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        onClose();
        router.push("/dashboard");
      } else {
        // Skenario jika ada MFA atau langkah tambahan (jarang di flow simpel)
        // console.log(result);
      }
    } catch (err) {
      // Di sini kuncinya: Clerk akan kasih error jika email tidak ada
      // atau password salah. Kita handle biar user gak bisa "iseng" daftar.
      const clerkError = err.errors?.[0];
      if (clerkError?.code === "form_identifier_not_found") {
        setError("Unauthorized.");
      } else if (clerkError?.code === "form_password_incorrect") {
        setError("Kata sandi yang Anda masukkan salah.");
      } else {
        setError("Terjadi kesalahan. Silahkan coba lagi.");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <dialog className="modal fixed inset-0 w-full h-full z-[999] bg-black/95 flex items-center justify-center modal-open">
      <div className="modal-box bg-[#0d1117] border border-white/5 p-8 shadow-2xl rounded-[2.5rem] max-w-md relative overflow-hidden">
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="relative z-10">
          <div className="text-center space-y-1 mb-8">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              Akses <span className="text-indigo-500">Sistem.</span>
            </h3>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">
              Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors"
                  size={16}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                  placeholder="admin@sipetasn.com"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors"
                  size={16}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="text-rose-500" size={14} />
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-white text-black font-black uppercase text-[11px] tracking-[0.2em] py-4 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-lg shadow-white/5 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Memproses...
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>

          <button
            onClick={onClose}
            className="w-full mt-4 py-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] hover:text-rose-500 transition-colors"
          >
            Batalkan Akses
          </button>
        </div>
      </div>

      <div className="fixed inset-0 z-[-1]" onClick={onClose} />
    </dialog>
  );
}
