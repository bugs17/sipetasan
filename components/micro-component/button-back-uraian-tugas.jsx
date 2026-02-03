"use client"
import { useRouter } from 'next/navigation'
import { IoMdArrowRoundBack } from "react-icons/io";
import React from 'react'

const ButtonBackUraianTugas = () => {
    const router = useRouter()
  return (
    <button onClick={() => router.back()} className='flex flex-row items-center gap-2 group'>
        <IoMdArrowRoundBack className='group-hover:text-violet-400' />
        <span className='group-hover:text-violet-400'>Kembali</span>
    </button>
  )
}

export default ButtonBackUraianTugas