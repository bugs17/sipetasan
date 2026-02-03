"use client"

import { hapusPegawai } from '@/app/actions/hapusPegawai'
import React, { useRef, useState } from 'react'
import { MdDelete } from "react-icons/md";


const ButtonDeletePegawai = ({id}) => {

    const [isClick, setIsClick] = useState(false)

    const handleDelete = async () => {
        setIsClick(true)
        await hapusPegawai(id)
        setIsClick(false)
    }
  return (
    <MdDelete onClick={handleDelete} className={`text-red-400 hover:text-red-600 ${isClick ? 'cursor-progress' : 'cursor-pointer'}`} />
  )
}

export default ButtonDeletePegawai