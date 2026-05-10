"use server";

import { prisma } from "../lib/db";


export const getListRef = async () => {
    try {
        const listRefEselon = await prisma.refEselon.findMany()
        const listRefFungsional = await prisma.refFungsional.findMany()
        const listRefPelaksana = await prisma.refPelaksana.findMany()

        return {listRefEselon, listRefFungsional, listRefPelaksana}
    } catch (error) {
        console.log("Error.................")
    }
}