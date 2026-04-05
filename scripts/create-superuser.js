import { prisma } from "../app/lib/db.js";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const [, , email, password, name] = process.argv;

if (!email || !password || !name) {
  console.log("Usage: node create-superuser.js email password name");
  process.exit(1);
}

const run = async () => {
  try {
    // 1. Create user di Clerk
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      skipPasswordChecks: true,
      skipLegalChecks: true,
    });

    // 2. Simpan ke database kamu
    const user = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        role: "ADMIN_INDUK",
        nama_user: name,
      },
    });

    console.log("✅ Superuser berhasil dibuat");
    console.log({
      clerkId: clerkUser.id,
      dbUserId: user.id,
      email: email,
      name: name,
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

run();
