import { prisma } from "@/app/lib/db";
import { getAuth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { userId: clerkId } = getAuth(request);

  if (!clerkId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Fungsi untuk mengirim data ke client
  const sendEvent = async (data) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  // Lakukan polling sederhana di sisi server atau gunakan trigger
  // Untuk SQLite, kita lakukan interval checking singkat
  const interval = setInterval(async () => {
    try {
      const messages = await prisma.pesan.findMany({
        where: { ruangObrolanId: Number(chatId) },
        orderBy: { createdAt: "desc" },
        take: 1,
      });

      if (messages.length > 0) {
        await sendEvent(messages[0]);
      }
    } catch (e) {
      console.error("SSE Error:", e);
    }
  }, 2000); // Cek setiap 2 detik

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
