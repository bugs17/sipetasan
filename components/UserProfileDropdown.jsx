"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";
import { UserProfile } from "@clerk/nextjs";
import { PiCaretUpDownBold } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import { TbArrowsDiagonalMinimize2 } from "react-icons/tb";
import { dark } from "@clerk/themes";
import { FiUser } from "react-icons/fi";
import { useMounted } from "@/app/hooks/useMounted";
import { getUser } from "@/app/actions/getUser";

const truncate = (text, max = 8) =>
  text.length > max ? text.slice(0, max) + "…" : text;

export default function UserProfileDropdown() {
  const mounted = useMounted();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [userDb, setUserDb] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      if (isLoaded && user) {
        try {
          const userData = await getUser(user.id);
          setUserDb(userData);
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUser();
  }, [user, isLoaded]);

  if (isLoading) {
    return null;
  }

  const rawUsername = userDb.nama_user || "User";
  const username = truncate(rawUsername);
  const role =
    userDb.role === "ADMIN_OPD" || userDb.role === "ADMIN_INDUK"
      ? "ADMIN"
      : "PIMPINAN";
  const imageUrl = user.imageUrl;

  return (
    <>
      {/* ===== Dropdown ===== */}
      <div className="dropdown dropdown-top dropdown-start w-full px-2 py-4">
        <div
          tabIndex={0}
          className="group cursor-pointer w-full h-14 flex gap-3 items-center px-4 
                bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 
                rounded-2xl transition-all duration-300 backdrop-blur-md"
        >
          {/* Avatar Section */}
          <div className="relative w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center bg-[#1a1a1e] overflow-hidden shadow-inner group-hover:border-[#6d28d9]/50 transition-colors">
            {imageUrl && !imgError ? (
              <Image
                src={imageUrl}
                alt="avatar"
                width={36}
                height={36}
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-xs font-black text-[#6d28d9] uppercase">
                ""
              </span>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col overflow-hidden">
            <span className="text-[11px] font-black text-white tracking-wider uppercase truncate">
              {username}
            </span>
            <span className="text-[9px] font-bold text-[#6d28d9] uppercase tracking-[0.15em] opacity-80 group-hover:opacity-100 transition-opacity">
              {role}
            </span>
          </div>

          <PiCaretUpDownBold
            className="ml-auto text-gray-500 group-hover:text-white transition-colors"
            size={14}
          />

          {/* Dropdown Menu - Glassy Style */}
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 mt-[-10px] ml-2 
                    bg-[#1a1a1e]/90 backdrop-blur-2xl rounded-2xl w-52 
                    border border-white/10 shadow-2xl z-[400] animate-in fade-in slide-in-from-left-2 "
          >
            <div className="px-3 py-2 mb-1 border-b border-white/5">
              <p className="text-[10px] font-bold text-gray-500 uppercase">
                Menu Akun
              </p>
            </div>
            <li>
              <button
                onClick={() => setOpen(true)}
                className="flex justify-between items-center py-3 text-xs text-gray-300 hover:bg-white/5 hover:text-white active:bg-[#6d28d9]/20"
              >
                <span className="font-medium tracking-wide">Profil Saya</span>
                <FiUser className="text-[#6d28d9]" size={16} />
              </button>
            </li>
            <li>
              <button
                onClick={() => signOut()}
                className="flex justify-between items-center py-3 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 active:bg-red-500/20"
              >
                <span className="font-medium tracking-wide">Logout</span>
                <IoIosLogOut size={16} />
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* ===== MODAL (NO SCROLLBAR) ===== */}
      <dialog className={`modal ${open ? "modal-open" : ""}`}>
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

        <div className="modal-backdrop bg-black/20 backdrop-blur-sm">
          <div className="absolute right-0 left-0 top-2 mb-10 flex justify-center">
            <button
              onClick={() => setOpen(false)}
              className="btn btn-sm border-none bg-[#212126] hover:bg-[#29292f]"
            >
              Tutup
              <TbArrowsDiagonalMinimize2 className="text-violet-500" />
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
