import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function POST(req) {
    // ambil webhook secret clerk yang ada di .env file
    const WEBHOOK_SECRET = process.env.NEXT_PUBLIC_CLERK_WEBHOOK_SECRET;

    // cek apakah webhook secret tersebut tersedia     
    if (!WEBHOOK_SECRET) {
        console.error("CLERK_WEBHOOK_SECRET tidak di temukan");
        return new NextResponse("Server error", { status: 500 }); // return 500 ke clerk bahwa internal server error
    }

    // ambil header svix
    const headerList = headers();
    const svix_id = headerList.get("svix-id");
    const svix_timestamp = headerList.get("svix-timestamp");
    const svix_signature = headerList.get("svix-signature");

    // print header sebagai testing
    console.log("########## Start here ##########")
    console.log("svix_id : ", svix_id)
    console.log("svix_timestamp : ", svix_timestamp)
    console.log("svix_signature : ", svix_signature)


    // cek headers jika kurang maka response 400
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new NextResponse("Missing svix headers", { status: 400 });
    }

    // body HARUS raw string
    const payload = await req.text(); 

    // mengambil webhook dari headers request dari clerk menggunakan Webhook dari Svix
    const wh = new Webhook(WEBHOOK_SECRET);

    let event;

    try {
        event = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error("Webhook signature tidak valid", err);
        return new NextResponse("Invalid signature", { status: 400 });
    }

    // =====================
    // HANDLE EVENT
    // =====================
    const { type, data } = event;

    if (type === "user.created") {
        const clerkUserId = data.id;
        const email = data.email_addresses?.[0]?.email_address || null;
        const role = data.public_metadata?.role;

        if (role === undefined) {
            await prisma.user.create({
                data:{
                    clerkUserId: clerkUserId,
                    role: "ADMIN_INDUK",
                }
            })
            console.log("ADMIN_INDUK di tambahkan ke app DB from webhook clerk")
        }

        // 2️⃣ key role ADA & ADMIN_OPD
        else if (role === "ADMIN_OPD") {
            console.log("admin opd");
            // do something khusus admin opd
        }

        /**
         * TODO:
         * insert / upsert ke database
         */
    }

    return NextResponse.json({ received: true });
}
