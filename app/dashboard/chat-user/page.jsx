"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Trash2, Edit2, CheckCheck, Users } from "lucide-react";
import ChatSkeleton from "@/components/skeleton/chat-skeleton";
import { generateInisial } from "@/app/utils/generate-inisial";
import { useAuth } from "@clerk/nextjs";
import useUserStore from "@/app/store/useStore";
import { getUser } from "@/app/actions/getUser";

import {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage,
  createConversation,
} from "@/app/actions/getPercakapan";
import toast from "react-hot-toast";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [isEditing, setIsEditing] = useState(null);

  const { userId, isLoaded } = useAuth();
  const { setUserRole } = useUserStore();
  const [dbUser, setDbUser] = useState(null);
  const scrollRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  // Lock untuk mencegah double-creation saat development/strict mode
  const isCreatingChat = useRef(false);

  // 1. Fetch User Data & Initial Conversations
  useEffect(() => {
    const fetchUserAndChat = async () => {
      if (isLoaded && userId) {
        try {
          const userData = await getUser(userId);
          setDbUser(userData);
          setUserRole(userData.role);

          let convs = await getConversations(userData.id);

          // LOGIKA PERBAIKAN: Gunakan Ref Lock untuk mencegah duplikasi request
          if (convs.length === 0 && !isCreatingChat.current) {
            isCreatingChat.current = true; // Kunci proses
            console.log("Memulai percakapan baru untuk OPD...");

            const newChat = await createConversation(userData.id);
            if (newChat) {
              convs = [newChat];
            }
          }

          setConversations(convs);

          if (convs.length > 0) {
            setActiveChat(convs[0].id);
          }
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUserAndChat();
  }, [userId, isLoaded, setUserRole]);

  // 2. Fetch Messages saat activeChat tersedia
  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!activeChat || !dbUser) return;
      try {
        setIsLoadingMessages(true);
        const msgs = await getMessages(activeChat, dbUser.id);
        setMessages(msgs);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchChatMessages();
  }, [activeChat, dbUser]);

  useEffect(() => {
    if (!activeChat) return;

    // Buka koneksi SSE
    const eventSource = new EventSource(
      `/api/chat/stream?chatId=${activeChat}`,
    );

    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);

      // Validasi agar tidak memasukkan pesan yang kita kirim sendiri (karena sudah ada di state)
      setMessages((prev) => {
        const isExist = prev.find((m) => m.id === newMessage.id.toString());
        if (isExist) return prev;

        return [
          ...prev,
          {
            id: newMessage.id.toString(),
            chatId: newMessage.ruangObrolanId.toString(),
            sender: newMessage.pengirimId === dbUser.id ? "me" : "them",
            text: newMessage.isiPesan,
            time: new Date(newMessage.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
      });
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [activeChat, dbUser]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoadingMessages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat || !dbUser) return;

    const textToSend = messageInput;
    setMessageInput("");

    try {
      const result = await sendMessage(activeChat, dbUser.id, textToSend);
      if (result.success) {
        const newMsg = {
          id: result.data.id.toString(),
          chatId: activeChat,
          sender: "me",
          text: result.data.isiPesan,
          time: new Date(result.data.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (error) {
      console.error("Gagal mengirim pesan");
    }
  };

  const handleDeleteSingleMessage = (messageId) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible
              ? "animate-in fade-in zoom-in-95"
              : "animate-out fade-out zoom-out-95"
          } max-w-xs w-full bg-[#1a1a1e] border border-white/10 shadow-2xl rounded-2xl pointer-events-auto flex flex-col p-4 backdrop-blur-xl`}
        >
          <div className="flex flex-col gap-1 mb-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
              Konfirmasi Hapus
            </p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Pesan ini akan dihapus permanen dari riwayat percakapan.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id); // Tutup toast dulu
                try {
                  const result = await deleteMessage(messageId, dbUser.id);
                  if (result.success) {
                    setMessages((prev) =>
                      prev.filter((m) => m.id !== messageId.toString()),
                    );
                    toast.success("Pesan terhapus", {
                      style: {
                        background: "#1a1a1e",
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: "bold",
                        border: "1px solid rgba(255,255,255,0.1)",
                      },
                    });
                  }
                } catch (error) {
                  toast.error("Gagal menghapus pesan");
                }
              }}
              className="flex-1 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-500/20"
            >
              Ya, Hapus
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5"
            >
              Batal
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
      },
    );
  };

  if (isLoading) return <ChatSkeleton />;

  const currentChatData = conversations.find((c) => c.id === activeChat);

  return (
    <div className="w-full h-full flex bg-transparent text-left font-sans overflow-hidden animate-in fade-in duration-500 relative">
      {/* --- CHAT CANVAS (Full Width untuk OPD) --- */}
      <div className="flex-1 h-full flex flex-col bg-[#1a1a1e]/10 rounded-bl-2xl backdrop-blur-2xl overflow-hidden relative">
        {activeChat ? (
          <div className="relative z-10 flex flex-col h-full">
            {/* Header Chat */}
            <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#6d28d9]/10 flex items-center justify-center text-[#6d28d9] font-black border border-[#6d28d9]/20 shadow-inner">
                  {generateInisial(currentChatData?.nama_user)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-none mb-1">
                    {currentChatData?.opd?.namaOpd || "Pusat Bantuan"}
                  </h4>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">
                    Pesan Internal dengan {currentChatData?.nama_user}
                  </span>
                </div>
              </div>
            </div>

            {/* Area Pesan */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-10 py-8 space-y-6 custom-scrollbar scroll-smooth"
            >
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full text-gray-600 text-[10px] uppercase tracking-widest font-bold">
                  Memuat Riwayat Pesan...
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} group animate-in slide-in-from-bottom-2`}
                  >
                    <div className="max-w-[70%] relative">
                      {msg.sender === "me" && (
                        <div className="absolute -top-7 right-0 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all z-20">
                          <button
                            onClick={() => handleDeleteSingleMessage(msg.id)}
                            className="p-1.5 bg-[#1a1a1e] border border-white/10 rounded-lg text-gray-500 hover:text-red-500 transition-all shadow-xl"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      )}

                      <div
                        className={`px-5 py-3.5 rounded-[1.6rem] text-[13px] leading-relaxed shadow-lg ${msg.sender === "me" ? "bg-[#6d28d9] text-white rounded-tr-none" : "bg-white/10 text-gray-200 border border-white/5 backdrop-blur-md rounded-tl-none"}`}
                      >
                        {msg.text}
                        <div
                          className={`text-[8px] mt-2 flex items-center gap-1 opacity-40 ${msg.sender === "me" ? "justify-end" : ""}`}
                        >
                          {msg.time}{" "}
                          {msg.sender === "me" && <CheckCheck size={10} />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20">
                  <Users size={48} strokeWidth={1} className="mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Belum ada pesan
                  </p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="px-8 pb-8 pt-4">
              <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-[1.8rem] p-2 pr-3 focus-within:border-[#6d28d9]/40 transition-all shadow-2xl backdrop-blur-xl">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ketik pesan untuk Admin Induk..."
                  className="flex-1 bg-transparent ml-3 py-2.5 text-sm text-white focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-[#6d28d9] hover:bg-[#7c3aed] text-white rounded-2xl transition-all shadow-lg shadow-[#6d28d9]/20"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20 space-y-4">
            <Users size={64} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              Percakapan tidak ditemukan
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Page;
