import Link from 'next/link';
import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { prisma } from '../../lib/db';
import FormInputPegawai from '@/components/micro-component/Form-Input-Pegawai';

const Pegawai = async () => {
    let pendidikan;
    let jabatan;
    let pegawai;

    try {
        pendidikan = await prisma.pendidikan.findMany()
    } catch (error) {
        console.log("error get pendidikan")
    }

    try {
        jabatan = await prisma.jabatan.findMany()
    } catch (error) {
        console.log("Error get jabatans");
    }

    try {
        pegawai = await prisma.pegawai.findMany()
    } catch (error) {
        console.log("Error get pegawais")
    }

  return (
    <div className='p-5 h-full overflow-y-auto'>
    <div className='w-full h-10 flex flex-row items-center'>
        <Link href={'/setting-pegawai'} className='flex flex-row items-center gap-2 group'>
            <IoMdArrowRoundBack className='group-hover:text-violet-400' />
            <span className='group-hover:text-violet-400'>Kembali</span>
        </Link>
    </div>
        <div className='w-full items-center flex flex-col justify-center gap-6 pb-40'>

        <FormInputPegawai pendidikan={pendidikan} jabatan={jabatan} pegawai={pegawai} />
            
            
        </div>
    </div>
  )
}

export default Pegawai