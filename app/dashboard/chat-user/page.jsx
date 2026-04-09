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
} from "@/app/actions/getPercakapan";

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

  // 1. Fetch User Data & Initial Conversations
  useEffect(() => {
    const fetchUserAndChat = async () => {
      if (isLoaded && userId) {
        try {
          const userData = await getUser(userId);
          setDbUser(userData);
          setUserRole(userData.role);

          const convs = await getConversations(userData.id);
          setConversations(convs);

          // OTOMATIS pilih chat pertama untuk ADMIN_OPD
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

  const handleDeleteSingleMessage = async (messageId) => {
    if (!confirm("Hapus pesan ini?")) return;
    try {
      const result = await deleteMessage(messageId, dbUser.id);
      if (result.success) {
        setMessages((prev) =>
          prev.filter((m) => m.id !== messageId.toString()),
        );
      }
    } catch (error) {}
  };

  if (isLoading) return <ChatSkeleton />;

  const currentChatData = conversations.find((c) => c.id === activeChat);

  return (
    <div className="w-full h-full flex bg-transparent text-left font-sans overflow-hidden animate-in fade-in duration-500 relative">
      {/* --- CHAT CANVAS (Full Width untuk OPD) --- */}
      <div className="flex-1 h-full flex flex-col bg-[#1a1a1e]/10 backdrop-blur-2xl overflow-hidden relative">
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
