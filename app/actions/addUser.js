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
  const isCreateNew = data.id === "";

  let objUser;
  let performOperation;
  try {
    if (isCreateNew) {
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
      performOperation = "create";
    } else {
      const existingUser = await prisma.user.findFirst({
        where: {
          id: Number(data.id),
        },
      });
      const isEmailStillSame = data.email === existingUser.email;
      if (!isEmailStillSame) {
        await clerkClient.emailAddresses.createEmailAddress({
          userId: data.clerkUserId,
          emailAddress: data.email,
          primary: true,
          verified: true,
        });
      }
      objUser = await prisma.user.update({
        where: {
          id: Number(data.id),
        },
        data: {
          email: data.email,
          nama_user: data.nama_user,
          whatsapp: data.whatsapp,
        },
        include: {
          opd: true,
        },
      });
      performOperation = "update";
    }

    return {
      isSukses: true,
      dataObj: objUser,
      performOperation: performOperation,
    };
  } catch (error) {
    console.log("Gagal create new user. errorMsg: ", error.message);
    return {
      isSukses: false,
      dataObj: null,
      performOperation: performOperation,
    };
  }
};
