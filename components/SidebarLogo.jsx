'use client'
import { useState } from "react"

const SidebarLogo = () => {
  const [isHover, setIsHover] = useState(false)
  return (
    <div className="w-full h-20 flex justify-center items-center ">
        <h1 onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className='font-bold cursor-pointer text-white '>S{isHover ? '🧨' : 'I'}-PETASN</h1>
    </div>

  )
}

export default SidebarLogo
