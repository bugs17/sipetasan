"use server";

import { clerkClient } from "../lib/clerck-server";
import { prisma } from "../lib/db";

export const deleteUser = async (data) => {
  if (!data.id) {
    return false;
  }
  if (!data.clerkUserId) {
    return false;
  }
  try {
    await clerkClient.users.deleteUser(data.clerkUserId);
    await prisma.user.delete({
      where: {
        id: Number(data.id),
      },
    });

    return true;
  } catch (error) {
    console.log("terjadi kesalahan saat delete user", error.message);
    return false;
  }
};
