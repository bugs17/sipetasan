import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export const GET = async (req) => {
    const { searchParams } = new URL(req.url);
    const forceRefresh = searchParams.get('forceRefresh');
    let pegawai = [];

    try {
        // Step 1: Ambil semua pegawai
        const allPegawai = await prisma.pegawai.findMany({
            include: {
                jabatan: {
                    include:{
                        tugas:true,
                        _count:{
                            select:{
                                pegawai:true
                            }
                        }
                    }
                },
                pendidikan:true
            },
        });

        // Step 2: Index semua pegawai berdasarkan ID untuk akses cepat
        const pegawaiMap = new Map();
        allPegawai.forEach((pegawaiItem) => pegawaiMap.set(pegawaiItem.id, { ...pegawaiItem, bawahan: [] }));

        // Step 3: Buat hirarki dengan menambahkan pegawai ke `bawahan` atasan mereka
        const rootPegawai = [];

        pegawaiMap.forEach((pegawaiItem) => {
            if (pegawaiItem.atasanId) {
                const atasan = pegawaiMap.get(pegawaiItem.atasanId);
                if (atasan) {
                    atasan.bawahan.push(pegawaiItem);
                }
            } else {
                rootPegawai.push(pegawaiItem); // Pegawai tanpa atasan (teratas)
            }
        });

        pegawai = rootPegawai; // Menggunakan pegawai yang telah disusun hierarkinya

    } catch (error) {
        console.log("Error get data pegawai", error);
        pegawai = [];
    }

    return NextResponse.json({ "message": "sukses", "pegawai": pegawai }, { status: 200 });
}

