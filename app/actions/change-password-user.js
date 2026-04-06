"use server";

import { clerkClient } from "../lib/clerck-server";

export const changePasswordUser = async (data) => {
  if (!data.clerkUserId) return false;
  try {
    await clerkClient.users.updateUser(data.clerkUserId, {
      password: data.password,
      skipPasswordChecks: true,
      skipLegalChecks: true,
    });

    return true;
  } catch (error) {
    console.log("error saat merubah password. errorMsg: ", error.message);
    return false;
  }
};
