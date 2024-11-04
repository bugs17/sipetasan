"use client"
import React, { useState } from 'react'
import { TbSquareArrowLeftFilled } from "react-icons/tb";


const RightSidebarPetajabatan = ({children}) => {
    const [right, setRight] = useState('-right-96'); // Mulai dari posisi yang lebih ke kiri

    const handleToggle = () => {
        setRight(prevState => (prevState === '-right-96' ? 'right-0' : '-right-96'));
    };
  return (
        <div className={`h-full w-96 bg-black z-50 border-l-[1px] border-t-[1px] border-slate-600 rounded-l-md absolute top-[4rem] ${right} transition-right duration-300 ease-in-out`} >
            <div className='w-10 h-10 absolute left-[-2.4rem] top-[40%] flex justify-end items-center'>
                <TbSquareArrowLeftFilled onClick={handleToggle} className='cursor-pointer text-slate-600 hover:text-slate-400' size={28} />
            </div>
            <div className="overflow-x-auto max-h-full pb-32">
                {children}
            </div>
        </div>
  )
}

export default RightSidebarPetajabatan