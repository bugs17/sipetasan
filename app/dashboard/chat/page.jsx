"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Send,
  Trash2,
  Edit2,
  CheckCheck,
  Users,
} from "lucide-react";
import ChatSkeleton from "@/components/skeleton/chat-skeleton";
import ModalListUserChat from "@/components/modal-list-user-chat";
import { getColorFromId } from "@/app/utils/generate-color";
import { generateInisial } from "@/app/utils/generate-inisial";
import { useAuth } from "@clerk/nextjs";
import useUserStore from "@/app/store/useStore";
import { getUser } from "@/app/actions/getUser";
import { getListUserOpd } from "@/app/actions/getListUser";

// Import Server Actions yang baru dibuat
import {
  getConversations,
  getMessages,
  createOrGetChat,
  sendMessage,
  deleteMessage,
  deleteConversation,
} from "@/app/actions/getPercakapan";
import AdminIndukWrapper from "@/components/admin-induk-wrapper";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [activeChat, setActiveChat] = useState(null); // Default null
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userId, isLoaded } = useAuth();
  const { userRole, setUserRole } = useUserStore();
  const [dbUser, setDbUser] = useState(null); // Untuk simpan ID User dari Prisma
  const scrollRef = useRef(null);

  const [availableAparatur, setAvailableAparatur] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  // 1. Fetch User Data & Role
  useEffect(() => {
    const fetchUser = async () => {
      if (isLoaded && userId) {
        try {
          const userData = await getUser(userId);
          setDbUser(userData); // Simpan data user Prisma (termasuk ID Int)
          setUserRole(userData.role);

          // Setelah dapat user, ambil daftar percakapan
          const convs = await getConversations(userData.id);
          setConversations(convs);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUser();
  }, [userId, isLoaded, setUserRole]);

  // 2. Fetch Available Users (untuk Modal)
  useEffect(() => {
    const fetchAparatur = async () => {
      try {
        const { dataUser } = await getListUserOpd();
        setAvailableAparatur(dataUser);
      } catch (error) {
        console.error("Failed to fetch list user:", error);
      }
    };
    fetchAparatur();
  }, []);

  // 3. Fetch Messages saat Chat Aktif berubah
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

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoadingMessages]);

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

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat || !dbUser) return;

    const textToSend = messageInput;
    setMessageInput(""); // Kosongkan input segera agar UI terasa cepat (UX)

    try {
      // Jalankan Server Action
      const result = await sendMessage(activeChat, dbUser.id, textToSend);

      if (result.success) {
        // Update UI dengan data asli dari DB
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

        // Refresh sidebar agar pesan terakhir (lastMsg) terupdate
        const updatedConvs = await getConversations(dbUser.id);
        setConversations(updatedConvs);
      }
    } catch (error) {}
  };

  const startNewChat = async (contact) => {
    try {
      // 1. Dapatkan atau buat RuangObrolanId di DB
      const chatId = await createOrGetChat(dbUser.id, contact.id);

      // 2. Refresh daftar percakapan agar yang terbaru muncul
      const updatedConvs = await getConversations(dbUser.id);
      setConversations(updatedConvs);

      // 3. Set sebagai chat aktif
      setActiveChat(chatId.toString());
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const handleDeleteSingleMessage = async (messageId) => {
    if (!confirm("Hapus pesan ini?")) return;

    try {
      // Panggil Server Action
      const result = await deleteMessage(messageId, dbUser.id);

      if (result.success) {
        // Update UI secara lokal agar pesan langsung hilang dari layar
        setMessages((prev) =>
          prev.filter((m) => m.id !== messageId.toString()),
        );

        // Opsional: Refresh conversations untuk memperbarui lastMsg di sidebar
        // jika pesan yang dihapus adalah pesan terakhir
        const updatedConvs = await getConversations(dbUser.id);
        setConversations(updatedConvs);
      } else {
        alert(result.error);
      }
    } catch (error) {
      // console.error("Gagal menghapus pesan:", error);
    }
  };

  const handleDeleteConversation = async (chatId, e) => {
    e.stopPropagation(); // Penting: Agar tidak memicu onClick milik parent (setActiveChat)

    if (!confirm("Hapus seluruh percakapan ini secara permanen?")) return;

    try {
      const result = await deleteConversation(chatId);

      if (result.success) {
        // Hapus dari state lokal
        setConversations((prev) =>
          prev.filter((c) => c.id !== chatId.toString()),
        );

        // Jika chat yang dihapus sedang aktif, reset ke null
        if (activeChat === chatId.toString()) {
          setActiveChat(null);
          setMessages([]);
        }
      } else {
        alert("Gagal menghapus percakapan.");
      }
    } catch (error) {
      // console.error("Error:", error);
    }
  };

  if (isLoading) return <ChatSkeleton />;

  const currentChatData = conversations.find((c) => c.id === activeChat);

  return (
    <AdminIndukWrapper>
      <div className="w-full h-full flex gap-4 bg-transparent text-left font-sans overflow-hidden animate-in fade-in duration-500 relative">
        {/* --- SIDEBAR LEFT --- */}
        {userRole === "ADMIN_INDUK" && (
          <div className="w-72 flex flex-col py-6 pl-6 shrink-0 h-full overflow-hidden">
            <div className="flex items-center justify-between px-2 mb-6">
              <div className="flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                  Internal
                </h3>
                <span className="text-xs font-bold text-white uppercase tracking-tight italic">
                  Messaging.
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 bg-[#6d28d9]/10 hover:bg-[#6d28d9] border border-[#6d28d9]/20 rounded-xl text-[#6d28d9] hover:text-white transition-all shadow-lg"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="relative mb-6 pr-2">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              />
              <input
                type="text"
                placeholder="Cari percakapan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#6d28d9]/30"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-3 custom-scrollbar">
              {conversations
                .filter((c) =>
                  c.nama_user.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border relative 
        ${
          activeChat === chat.id
            ? "bg-[#6d28d9]/20 border-[#6d28d9]/30 shadow-lg"
            : "bg-white/[0.03] border-white/5 hover:bg-white/[0.08] hover:border-white/10"
        }`}
                  >
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-[11px] font-black border border-white/5"
                      style={{
                        backgroundColor: `${getColorFromId(chat.id)}15`,
                        color: getColorFromId(chat.id),
                      }}
                    >
                      {generateInisial(chat.nama_user)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[11px] uppercase font-bold text-white truncate pr-8">
                          {chat.opd?.namaOpd}
                        </span>
                        <span className="text-[8px] text-gray-500 font-mono">
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate font-medium leading-tight">
                        {chat.nama_user}
                      </p>
                    </div>

                    {/* TOMBOL DELETE RIWAYAT CHAT */}
                    <button
                      onClick={(e) => handleDeleteConversation(chat.id, e)}
                      className="absolute right-3 opacity-0 group-hover:opacity-100 p-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-lg text-red-500 hover:text-white transition-all shadow-lg z-30"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- CHAT CANVAS RIGHT --- */}
        <div
          className={`flex-1 h-full flex flex-col bg-[#1a1a1e]/10 backdrop-blur-2xl border-l border-white/10 overflow-hidden relative ${userRole === "ADMIN_INDUK" ? "rounded-tl-[3rem] rounded-bl-[3rem]" : "rounded-none"}`}
        >
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
                      {currentChatData?.opd?.namaOpd}
                    </h4>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">
                      {currentChatData?.nama_user}
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
                    Memuat Pesan...
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} group animate-in slide-in-from-bottom-2`}
                    >
                      <div className="max-w-[70%] relative">
                        {/* TOOLBAR ACTION (Muncul saat hover) */}
                        <div
                          className={`absolute -top-7 ${msg.sender === "me" ? "right-0" : "left-0"} flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all z-20`}
                        >
                          {msg.sender === "me" && (
                            <>
                              {/* Tombol Delete yang saya masukkan kembali */}
                              <button
                                onClick={() =>
                                  handleDeleteSingleMessage(msg.id)
                                }
                                className="p-1.5 bg-[#1a1a1e] border border-white/10 rounded-lg text-gray-500 hover:text-red-500 transition-all shadow-xl"
                              >
                                <Trash2 size={10} />
                              </button>
                            </>
                          )}
                        </div>

                        {/* Bubble Chat */}
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
                    placeholder={
                      isEditing ? "Edit pesan..." : "Tulis pesan anda..."
                    }
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
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center opacity-10 space-y-4">
              <div className="p-8 bg-white/5 rounded-[3rem] border border-dashed border-white/20">
                <Users size={64} strokeWidth={1} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">
                Pilih percakapan untuk memulai
              </p>
            </div>
          )}
        </div>

        <ModalListUserChat
          isModalOpen={isModalOpen}
          closeModal={setIsModalOpen}
          startNewChat={startNewChat}
          listKontak={availableAparatur}
        />
      </div>
    </AdminIndukWrapper>
  );
};

export default Page;
