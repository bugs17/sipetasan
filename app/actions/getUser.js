"use server";

import { prisma } from "../lib/db";


export const getUser = async (userId) => {
    try {
        const user = await prisma.user.findFirst({
            where:{
                clerkUserId:userId
            }
        })

        if (!user) {
            return null
        }
        return user
    } catch (error) {
        console.log("Error saat mengambil user by clerkUserId : ", error)
        return null
    }

    
}