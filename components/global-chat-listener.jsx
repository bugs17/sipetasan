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
    // Inisialisasi audio (pastikan sound.wav ada di folder /public)
    const notificationSound = new Audio("/sound.mp3");

    const setupSSE = async () => {
      const dbUser = await getUser(userId);

      eventSource = new EventSource(
        `/api/chat/stream/global?userId=${dbUser.id}`,
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.pengirimId === dbUser.id) return;

        // --- PLAY SOUND ---
        // Kita gunakan .catch karena browser sering memblokir auto-play
        // jika user belum berinteraksi dengan halaman.
        notificationSound.play().catch((err) => {
          console.warn("Autoplay suara diblokir oleh browser:", err);
        });

        // 1. React Hot Toast
        toast(`Pesan baru dari ${data.namaPengirim}: \n${data.isiPesan}`, {
          id: data.id,
          icon: "💬",
          duration: 4000,
        });

        // 2. Browser Notification
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
