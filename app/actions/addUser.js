"use server";

import { clerkClient } from "../lib/clerck-server";
import { prisma } from "../lib/db";

const createClerkUser = async (data) => {
  const objClerk = await clerkClient.users.createUser({
    emailAddress: [data.email],
    password: data.password,
    skipLegalChecks: true,
    skipPasswordChecks: true,
  });

  return objClerk;
};

export const addNewUser = async (data) => {
  const isAdminOpd = data.role === "ADMIN_OPD";
  const isPimpinan = data.role === "PIMPINAN";

  let objUser;
  try {
    if (isAdminOpd || isPimpinan) {
      // Jika createClerkUser gagal, ia akan langsung melempar error ke blok catch di bawah
      const objClerk = await createClerkUser(data);

      objUser = await prisma.user.create({
        data: {
          clerkUserId: objClerk.id,
          nama_user: data.nama_user,
          role: data.role, // Gunakan data.role secara dinamis
          opdId: isAdminOpd ? Number(data.opdId) : null,
          email: data.email,
          whatsapp: data.whatsapp || null,
        },
        include: {
          opd: true,
        },
      });
    }
    return { isSukses: true, dataObj: objUser };
  } catch (error) {
    console.log("Gagal create new user. errorMsg: ", error.message);
    return { isSukses: false, dataObj: null };
  }
};
