// app/actions/getConversations.ts
"use server";

import { prisma } from "../lib/db";

export async function getConversations(currentUserId) {
  const chats = await prisma.ruangObrolan.findMany({
    where: {
      peserta: {
        some: { userId: Number(currentUserId) }, // Hanya ambil chat yang diikuti user ini
      },
    },
    include: {
      // Ambil peserta lain (lawan bicara)
      peserta: {
        where: {
          userId: { not: Number(currentUserId) },
        },
        include: {
          user: {
            include: { opd: true },
          },
        },
      },
      // Ambil pesan terakhir untuk ditampilkan di sidebar
      pesan: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Mapping agar sesuai dengan format state 'conversations' di UI kamu
  return chats.map((chat) => {
    const lawanBicara = chat.peserta[0]?.user;
    const lastMsg = chat.pesan[0];

    return {
      id: chat.id.toString(),
      nama_user: lawanBicara?.nama_user || "Unknown",
      opd: {
        namaOpd: lawanBicara?.opd?.namaOpd || "ADMIN INDUK",
      },
      lastMsg: lastMsg?.isiPesan || "Mulai percakapan...",
      time: lastMsg
        ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      // Data tambahan untuk keperluan activeChat
      lawanBicaraId: lawanBicara?.id,
    };
  });
}

export async function getMessages(chatId, currentUserId) {
  const messages = await prisma.pesan.findMany({
    where: { ruangObrolanId: Number(chatId) },
    orderBy: { createdAt: "asc" },
    include: { pengirim: true },
  });

  return messages.map((msg) => ({
    id: msg.id.toString(),
    chatId: msg.ruangObrolanId.toString(),
    sender: msg.pengirimId === currentUserId ? "me" : "them",
    text: msg.isiPesan,
    time: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
}

export async function createOrGetChat(myId, targetId) {
  // 1. Cari apakah sudah ada ruang obrolan antara berdua
  const existingChat = await prisma.ruangObrolan.findFirst({
    where: {
      AND: [
        { peserta: { some: { userId: Number(myId) } } },
        { peserta: { some: { userId: Number(targetId) } } },
      ],
    },
  });

  if (existingChat) return existingChat.id;

  // 2. Jika belum ada, buat baru
  const newChat = await prisma.ruangObrolan.create({
    data: {
      peserta: {
        create: [{ userId: Number(myId) }, { userId: Number(targetId) }],
      },
    },
  });

  return newChat.id;
}

export async function sendMessage(chatId, senderId, text) {
  try {
    const newMessage = await prisma.pesan.create({
      data: {
        ruangObrolanId: Number(chatId),
        pengirimId: Number(senderId),
        isiPesan: text,
      },
    });

    // Update 'updatedAt' di RuangObrolan agar chat naik ke atas di sidebar
    await prisma.ruangObrolan.update({
      where: { id: Number(chatId) },
      data: { updatedAt: new Date() },
    });

    return { success: true, data: newMessage };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMessage(messageId, currentUserId) {
  try {
    // Cari pesan untuk memastikan pengirimnya adalah user yang sedang login
    const pesan = await prisma.pesan.findUnique({
      where: { id: Number(messageId) },
    });

    if (!pesan || pesan.pengirimId !== Number(currentUserId)) {
      return {
        success: false,
        error: "Tidak memiliki akses untuk menghapus pesan ini.",
      };
    }

    await prisma.pesan.delete({
      where: { id: Number(messageId) },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteConversation(chatId) {
  try {
    const id = Number(chatId);

    // 1. Hapus semua Pesan di dalam ruang obrolan ini
    await prisma.pesan.deleteMany({
      where: { ruangObrolanId: id },
    });

    // 2. Hapus semua Peserta di dalam ruang obrolan ini
    await prisma.pesertaPercakapan.deleteMany({
      where: { ruangObrolanId: id },
    });

    // 3. Baru hapus RuangObrolan-nya
    await prisma.ruangObrolan.delete({
      where: { id: id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return { success: false, error: error.message };
  }
}

export async function createConversation(opdUserId) {
  try {
    // 1. Cari Admin Induk (Pusat)
    const adminInduk = await prisma.user.findFirst({
      where: { role: "ADMIN_INDUK" },
    });

    if (!adminInduk) throw new Error("Admin Induk tidak ditemukan");

    // 2. Buat Ruang Obrolan baru
    const newChat = await prisma.ruangObrolan.create({
      data: {
        peserta: {
          create: [{ userId: opdUserId }, { userId: adminInduk.id }],
        },
      },
      include: {
        peserta: {
          include: {
            user: {
              include: { opd: true },
            },
          },
        },
      },
    });

    // Format agar sesuai dengan struktur state 'conversations' kamu
    return {
      id: newChat.id,
      nama_user: adminInduk.nama_user,
      opd: { namaOpd: "Pusat Bantuan / Admin Induk" },
    };
  } catch (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
}
