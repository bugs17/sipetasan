import { prisma } from "@/app/lib/db";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { userId: clerkId } = getAuth(request);

  if (!clerkId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response("User ID is required", { status: 400 });
  }

  // CATAT WAKTU KONEKSI DIBUAT
  // Kita hanya ingin pesan yang dibuat SETELAH detik ini.
  const connectionTime = new Date();

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = async (data) => {
    try {
      await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    } catch (e) {}
  };

  let lastMessageId = null;

  const interval = setInterval(async () => {
    try {
      const latestMessage = await prisma.pesan.findFirst({
        where: {
          ruangObrolan: {
            peserta: {
              some: { userId: Number(userId) },
            },
          },
          pengirimId: { not: Number(userId) },
          // HANYA AMBIL PESAN YANG LEBIH BARU DARI WAKTU KONEKSI
          createdAt: { gt: connectionTime },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          pengirim: {
            select: {
              nama_user: true,
            },
          },
        },
      });

      if (latestMessage) {
        if (latestMessage.id !== lastMessageId) {
          lastMessageId = latestMessage.id;

          await sendEvent({
            id: latestMessage.id,
            isiPesan: latestMessage.isiPesan,
            namaPengirim: latestMessage.pengirim.nama_user,
            chatId: latestMessage.ruangObrolanId,
            createdAt: latestMessage.createdAt,
          });
        }
      }
    } catch (e) {
      console.error("Global SSE Error:", e);
    }
  }, 3000);

  request.signal.onabort = () => {
    clearInterval(interval);
    writer.close();
  };

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
