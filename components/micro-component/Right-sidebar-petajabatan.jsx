// "use client"
// import React, { useState } from 'react'
// import { TbSquareArrowLeftFilled, TbSquareArrowRight } from "react-icons/tb";


// const RightSidebarPetajabatan = ({children}) => {
//     const [right, setRight] = useState('-right-96'); // Mulai dari posisi yang lebih ke kiri

//     const handleToggle = () => {
//         setRight(prevState => (prevState === '-right-96' ? 'right-0' : '-right-96'));
//     };

//     const IconPanah = right === '-right-96' ? TbSquareArrowLeftFilled : TbSquareArrowRight;
//   return (
//         <div className={`h-full w-96 bg-black z-50 border-l-[1px] border-t-[1px] border-slate-600 rounded-l-md absolute top-[4rem] ${right} transition-right duration-300 ease-in-out`} >
//             <div className='w-10 h-10 absolute left-[-2.4rem] top-[40%] flex justify-end items-center'>
//                 <IconPanah onClick={handleToggle} className='cursor-pointer text-slate-600 hover:text-slate-400' size={28} />
//             </div>
//             <div className="overflow-x-auto max-h-full pb-32">
//                 {children}
//             </div>
//         </div>
        
//   )
// }

// export default RightSidebarPetajabatan

"use client"
import React, { useState } from 'react'
import { TbSquareArrowLeftFilled, TbSquareArrowRight } from "react-icons/tb";

const RightSidebarPetajabatan = ({ children }) => {
    // Gunakan state boolean agar lebih bersih logikanya
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    // Arah panah: jika tutup, panah ke kiri (untuk buka). Jika buka, panah ke kanan (untuk tutup).
    const IconPanah = !isOpen ? TbSquareArrowLeftFilled : TbSquareArrowRight;

    return (
        <div 
            className={`fixed top-[5rem] bottom-4 z-50 w-96 
            transition-all duration-500 ease-in-out
            ${isOpen ? 'right-4' : '-right-[25rem]'} 
            /* Glassmorphism Effect */
            bg-[#212126]/80 backdrop-blur-2xl 
            border border-white/10 rounded-3xl shadow-2xl shadow-black/50`}
        >
            {/* Tombol Toggle (Handle) */}
            <div className='absolute left-[-3rem] top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center'>
                <div className="relative group">
                    {/* Glow effect di belakang icon panah */}
                    <div className="absolute -inset-2 bg-[#6d28d9] opacity-20 blur-xl group-hover:opacity-50 transition-opacity" />
                    
                    <IconPanah 
                        onClick={handleToggle} 
                        className={`relative cursor-pointer transition-all duration-300 
                        ${isOpen ? 'text-white' : 'text-slate-500 hover:text-[#6d28d9]'}`} 
                        size={32} 
                    />
                </div>
            </div>

            {/* Header Sidebar (Opsional, agar serasi) */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#6d28d9] animate-pulse" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        Detail Informasi
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto h-[calc(100%-80px)] custom-scrollbar text-gray-300">
                {children}
            </div>

            {/* Dekorasi Cahaya di dalam Sidebar */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#6d28d9] opacity-5 blur-[50px] pointer-events-none rounded-full" />
        </div>
    )
}

export default RightSidebarPetajabatan;