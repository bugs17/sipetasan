"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { getUser } from "@/app/actions/getUser";

export default function GlobalChatListener() {
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded || !userId) return;

    let eventSource;
    // Pastikan file sound.mp3 ada di folder /public
    const notificationSound = new Audio("/sound.mp3");

    const setupSSE = async () => {
      const dbUser = await getUser(userId);

      eventSource = new EventSource(
        `/api/chat/stream/global?userId=${dbUser.id}`,
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // 1. Abaikan jika pengirimnya adalah diri sendiri
        if (data.pengirimId === dbUser.id) return;

        // 2. VALIDASI WAKTU (Mencegah notifikasi palsu saat delete pesan)
        const messageTime = new Date(data.createdAt).getTime();
        const currentTime = new Date().getTime();
        const timeGap = currentTime - messageTime;

        // Jika pesan sudah lewat 5 detik, anggap itu sisa data saat delete (jangan kasih notif)
        if (timeGap > 5000) return;

        // --- LANJUTKAN NOTIFIKASI JIKA PESAN BENAR-BENAR BARU ---

        // 3. PLAY SOUND (Ini dia yang tadi ketinggalan)
        notificationSound.play().catch((err) => {
          console.warn("Autoplay suara diblokir browser:", err);
        });

        // 4. Custom React Hot Toast
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible
                  ? "animate-in fade-in slide-in-from-top-2"
                  : "animate-out fade-out zoom-out-95"
              } max-w-sm w-full bg-[#1a1a1e]/90 border border-white/10 shadow-2xl rounded-[1.5rem] pointer-events-auto flex items-center p-4 backdrop-blur-xl`}
            >
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-[#6d28d9]/20 text-[#6d28d9] border border-[#6d28d9]/30 font-bold">
                💬
              </div>
              <div className="ml-4 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6d28d9] mb-0.5">
                  Pesan Baru
                </p>
                <p className="text-xs font-bold text-white leading-tight">
                  {data.namaPengirim}
                </p>
                <p className="text-[11px] text-gray-400 truncate mt-1">
                  {data.isiPesan}
                </p>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="ml-4 p-2 text-gray-600 hover:text-white transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ),
          {
            id: data.id,
            duration: 4000,
            position: "top-right",
          },
        );

        // 5. Browser Notification
        if (Notification.permission === "granted") {
          new Notification(`Pesan dari ${data.namaPengirim}`, {
            body: data.isiPesan,
            icon: "💬",
          });
        }
      };
    };

    setupSSE();

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [isLoaded, userId]);

  return null;
}
