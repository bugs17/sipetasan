"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Trash2,
  Edit2,
  CheckCheck,
  MessageSquare,
  X,
  UserPlus,
  Users,
} from "lucide-react";
import { HiOutlineUser, HiOutlineOfficeBuilding } from "react-icons/hi";
import { PiCaretDownBold } from "react-icons/pi";
import ChatSkeleton from "@/components/skeleton/chat-skeleton";

const AparaturChatMinimal = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeChat, setActiveChat] = useState("u1");
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef(null);

  const [availableAparatur] = useState([
    {
      id: "u1",
      name: "Dr. Ahmad Sujatmiko",
      nip: "19880211...",
      instansi: "Dinas Kesehatan",
      color: "#ef4444",
      initials: "AS",
    },
    {
      id: "u2",
      name: "Siti Rahmawati",
      nip: "19920514...",
      instansi: "RSUD Daerah",
      color: "#10b981",
      initials: "SR",
    },
    {
      id: "u3",
      name: "Kasubag Umum",
      nip: "19850320...",
      instansi: "Sekretariat Daerah",
      color: "#6d28d9",
      initials: "KU",
    },
    {
      id: "u7",
      name: "Budi Santoso",
      nip: "19900101...",
      instansi: "Diskominfo",
      color: "#3b82f6",
      initials: "BS",
    },
    {
      id: "u8",
      name: "Heri Kurniawan",
      nip: "19910512...",
      instansi: "Bappeda",
      color: "#f59e0b",
      initials: "HK",
    },
  ]);

  const [conversations, setConversations] = useState([
    {
      id: "u1",
      name: "Dr. Ahmad Sujatmiko",
      status: "Online",
      lastMsg: "Laporan tahunan siap?",
      time: "10:20",
      color: "#ef4444",
      initials: "AS",
    },
    {
      id: "u2",
      name: "Siti Rahmawati",
      status: "Away",
      lastMsg: "Siap pak, segera.",
      time: "14:05",
      color: "#10b981",
      initials: "SR",
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: "m1",
      chatId: "u1",
      sender: "them",
      text: "Halo, apakah laporan tahunan sudah siap?",
      time: "10:15",
    },
    {
      id: "m2",
      chatId: "u1",
      sender: "me",
      text: "Sedang dalam tahap finalisasi pak.",
      time: "10:18",
    },
  ]);

  // Simulasi loading saat pertama kali buka
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeChat, messages, isLoading]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    if (isEditing) {
      setMessages(
        messages.map((m) =>
          m.id === isEditing ? { ...m, text: messageInput } : m,
        ),
      );
      setIsEditing(null);
    } else {
      const newMsg = {
        id: `m${Date.now()}`,
        chatId: activeChat,
        sender: "me",
        text: messageInput,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMsg]);
    }
    setMessageInput("");
  };

  const deleteChat = (id, e) => {
    e.stopPropagation();
    if (confirm("Hapus percakapan ini secara permanen?")) {
      setConversations(conversations.filter((c) => c.id !== id));
      if (activeChat === id) setActiveChat(null);
    }
  };

  const startNewChat = (contact) => {
    const exists = conversations.find((c) => c.id === contact.id);
    if (!exists) {
      setConversations([
        {
          ...contact,
          status: "Online",
          lastMsg: "Mulai percakapan baru...",
          time: "Now",
        },
        ...conversations,
      ]);
    }
    setActiveChat(contact.id);
    setIsModalOpen(false);
  };

  if (isLoading) return <ChatSkeleton />;

  return (
    <div className="w-full h-full flex gap-4 bg-transparent text-left font-sans overflow-hidden animate-in fade-in duration-500 relative">
      {/* --- GRAINY MODAL NEW CHAT --- */}
      {isModalOpen && (
        <dialog className="modal fixed inset-0 w-full h-full z-[999] flex items-center justify-center modal-open p-4">
          <div className="modal-box bg-[#1a1a1e]/90 border border-white/10 p-8 shadow-2xl rounded-[2.5rem] max-w-md w-full h-[600px] max-h-[85vh] relative overflow-hidden flex flex-col">
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            ></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="text-center space-y-1 mb-6 shrink-0">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                  Mulai Chat Baru
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Pilih Aparatur Untuk Berkoordinasi
                </p>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-2">
                  {availableAparatur.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => startNewChat(contact)}
                      className="flex items-center gap-4 p-3 bg-white/[0.03] hover:bg-[#6d28d9]/20 border border-white/5 rounded-2xl cursor-pointer transition-all group"
                    >
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0 shadow-inner"
                        style={{
                          backgroundColor: `${contact.color}20`,
                          color: contact.color,
                        }}
                      >
                        {contact.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm text-white font-bold truncate group-hover:text-white">
                          {contact.name}
                        </span>
                        <span className="text-[10px] text-gray-500 truncate italic">
                          {contact.instansi}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 shrink-0">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full px-6 py-3 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>

          <div
            className="modal-backdrop fixed inset-0 w-full h-full bg-white/5 z-[-1]"
            onClick={() => setIsModalOpen(false)}
          >
            <button className="w-full h-full cursor-default">close</button>
          </div>
        </dialog>
      )}

      {/* --- SIDEBAR LEFT --- */}
      <div className="w-72 flex flex-col py-6 pl-6 shrink-0 h-full overflow-hidden">
        <div className="flex items-center justify-between px-2 mb-6">
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              Internal
            </h3>
            <span className="text-xs font-bold text-white uppercase tracking-tight font-italic">
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
              c.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
                <div className="relative shrink-0">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-[11px] font-black border border-white/5"
                    style={{
                      backgroundColor: `${chat.color}15`,
                      color: chat.color,
                    }}
                  >
                    {chat.initials}
                  </div>
                  {chat.status === "Online" && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#121c22] rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[11px] font-bold text-white truncate pr-4">
                      {chat.name}
                    </span>
                    <span className="text-[8px] text-gray-500 font-mono">
                      {chat.time}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 truncate font-light leading-tight">
                    {chat.lastMsg}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteChat(chat.id, e)}
                  className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 text-gray-600 hover:text-red-500 rounded-lg transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* --- CHAT CANVAS RIGHT --- */}
      <div className="flex-1 h-full flex flex-col bg-[#1a1a1e]/10 backdrop-blur-2xl border-l border-white/10 rounded-tl-[3rem] rounded-bl-[3rem] overflow-hidden relative">
        {activeChat ? (
          <div className="relative z-10 flex flex-col h-full">
            <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#6d28d9]/10 flex items-center justify-center text-[#6d28d9] font-black border border-[#6d28d9]/20 shadow-inner">
                  {conversations.find((c) => c.id === activeChat)?.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-none mb-1">
                    {conversations.find((c) => c.id === activeChat)?.name}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[9px] text-emerald-500/80 font-black uppercase tracking-widest">
                      Connected
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-white/5 rounded-xl text-gray-500 transition-all">
                <MoreVertical size={20} />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-10 py-8 space-y-6 custom-scrollbar scroll-smooth"
            >
              {messages
                .filter((m) => m.chatId === activeChat)
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} group animate-in slide-in-from-bottom-2`}
                  >
                    <div className="max-w-[70%] relative">
                      <div
                        className={`absolute -top-7 ${msg.sender === "me" ? "right-0" : "left-0"} flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all`}
                      >
                        {msg.sender === "me" && (
                          <button
                            onClick={() => {
                              setIsEditing(msg.id);
                              setMessageInput(msg.text);
                            }}
                            className="p-1.5 bg-[#1a1a1e] border border-white/10 rounded-lg text-gray-500 hover:text-white transition-all shadow-xl"
                          >
                            <Edit2 size={10} />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setMessages(messages.filter((m) => m.id !== msg.id))
                          }
                          className="p-1.5 bg-[#1a1a1e] border border-white/10 rounded-lg text-gray-500 hover:text-red-500 transition-all shadow-xl"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>

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
                ))}
            </div>

            <div className="px-8 pb-8 pt-4">
              <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-[1.8rem] p-2 pr-3 focus-within:border-[#6d28d9]/40 transition-all shadow-2xl backdrop-blur-xl">
                <div className="flex gap-0.5 px-2 border-r border-white/10">
                  <button className="p-2 text-gray-500 hover:text-[#6d28d9] transition-all">
                    <Paperclip size={18} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-[#6d28d9] transition-all">
                    <ImageIcon size={18} />
                  </button>
                </div>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={
                    isEditing ? "Edit pesan..." : "Tulis pesan internal..."
                  }
                  className="flex-1 bg-transparent py-2.5 text-sm text-white focus:outline-none"
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
              Aparatur Messenger
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(109, 40, 217, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AparaturChatMinimal;
