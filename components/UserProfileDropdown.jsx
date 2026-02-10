'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useUser, useClerk } from '@clerk/nextjs'
import { UserProfile } from '@clerk/nextjs'
import { PiCaretUpDownBold } from 'react-icons/pi'
import { IoIosLogOut } from 'react-icons/io'
import { TbArrowsDiagonalMinimize2 } from 'react-icons/tb'
import { dark } from '@clerk/themes'
import { FiUser } from 'react-icons/fi'
import { useMounted } from '@/app/hooks/useMounted'


const truncate = (text, max = 8) =>
  text.length > max ? text.slice(0, max) + '…' : text

export default function UserProfileDropdown() {
    const mounted = useMounted()
    const { user, isLoaded } = useUser()
    const { signOut } = useClerk()
    const [open, setOpen] = useState(false)
    const [imgError, setImgError] = useState(false)

    // 🔥 FIX HYDRATION
    if (!mounted || !isLoaded || !user) return null

    const rawUsername = user.username || user.fullName || 'User'
    const username = truncate(rawUsername)
    const role = user.publicMetadata?.role || 'ADMIN'
    const imageUrl = user.imageUrl

    const initial =
        user.username?.[0] ||
        user.firstName?.[0] ||
        'A'

    return (
        <>
        {/* ===== Dropdown ===== */}
        <div className="dropdown dropdown-right dropdown-end w-full h-14 flex items-center p-2">
            <div
            tabIndex={0}
            className="cursor-pointer w-full hover:bg-zinc-950 h-full flex gap-3 items-center px-3 bg-black rounded-md"
            >
            <div className="w-8 h-8 rounded-md border border-violet-400 flex items-center justify-center bg-zinc-900">
                {imageUrl && !imgError ? (
                <Image
                    src={imageUrl}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-md"
                    onError={() => setImgError(true)}
                />
                ) : (
                <span className="text-sm font-bold text-white uppercase">
                    {initial}
                </span>
                )}
            </div>

            <div className="flex flex-col">
                <span className="text-sm font-mono text-white">
                {username}
                </span>
                <span className="text-xs uppercase opacity-70">
                {role}
                </span>
            </div>

            <PiCaretUpDownBold className="ml-auto" />

            <ul className="dropdown-content menu bg-black rounded-box w-52 p-2 border border-slate-700 z-50">
                <li>
                <button
                    onClick={() => setOpen(true)}
                    className="flex justify-between"
                >
                    <span>Profile</span>
                    <FiUser />
                </button>
                </li>
                <li>
                <button
                    onClick={() => signOut()}
                    className="flex justify-between text-red-400"
                >
                    <span>Logout</span>
                    <IoIosLogOut />
                </button>
                </li>
            </ul>
            </div>
        </div>

        {/* ===== MODAL (NO SCROLLBAR) ===== */}
        <dialog className={`modal ${open ? 'modal-open' : ''}`}>
            <div className="modal-box max-w-full flex justify-center items-center bg-transparent overflow-hidden">
            <div className="max-h-[85vh] overflow-hidden no-scrollbar">
                <UserProfile
                routing="virtual"
                appearance={{
                        baseTheme: dark,
                    }}
                />
            </div>
            </div>

            <div
                className="modal-backdrop bg-black/20 backdrop-blur-sm"
                
            >
                <div className='absolute right-0 left-0 top-2 mb-10 flex justify-center'>
                    <button onClick={() => setOpen(false)} className="btn btn-sm border-none bg-[#212126] hover:bg-[#29292f]">
                        Tutup
                        <TbArrowsDiagonalMinimize2 className='text-violet-500' />
                    </button>
                </div>
            </div>
        </dialog>
        </>
    )
}
