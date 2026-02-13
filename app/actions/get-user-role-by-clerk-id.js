"use server";

import { prisma } from "../lib/db";



export const getUserRoleByClerkID = async (id) => {
    try {
        const user = await prisma.user.findFirst({
            where:{
                clerkUserId:id
            }
        })
        return user
    } catch (error) {
        console.log("Error saat mengambil user by clerkID : ", error);
        return null
    }
}