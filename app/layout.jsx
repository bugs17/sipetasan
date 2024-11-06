import "./globals.css";
import localFont from 'next/font/local'; // Gunakan kembali localFont
import { PiCaretUpDownBold } from "react-icons/pi";

import { Recursive } from 'next/font/google'; // Tetap gunakan dari google
import Image from "next/image";

import { IoIosLogOut } from "react-icons/io";
import SideBar from "@/components/SideBar";
import SidebarLogo from "@/components/SidebarLogo";
import TitleDashboard from "@/components/micro-component/Title-Dashboard";


const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata = {
  title: "SI-PETASN",
  description: "Sistem Informasi",
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="sunset" className="bg-black" lang="id">
      <body  className={`${geistMono.variable} antialiased overflow-hidden m-0 p-0`}>
      <span className="text-xs font-mono opacity-50 absolute z-50 right-2 bottom-2">Version 1.0.0</span>
        <div className="w-screen h-screen flex flex-row">
          <div className="w-[15%] bg-black h-screen flex flex-col">
            <div className="justify-center flex items-center font-bold h-16">
              <SidebarLogo />
            </div>
            <div className="w-full flex-grow overflow-y-auto py-5">
                <SideBar />
            </div>
            <div className="dropdown dropdown-right dropdown-end w-full h-14 flex justify-center items-center p-2">
              <div tabIndex={0} className=" cursor-pointer w-full hover:bg-zinc-950 h-full flex flex-row gap-3 items-center py-6 px-3 mb-6 bg-black rounded-md">
                  
                  <div  className="avatar object-cover flex flex-row items-center">
                    <div className="w-8 h-8 rounded-md border-[1px] border-violet-400 shadow-slate-400 shadow-sm">
                      <Image src={"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} width={40} height={40} className="object-cover"  />
                    </div>
                  </div>


                  <div className="flex flex-col">
                    <span className="font-semibold text-white text-sm font-mono">John Doe</span>
                    <span className="font-thin text-xs">admin</span>
                  </div>
                  <PiCaretUpDownBold className="ml-auto" />

                  <ul tabIndex={0} className="dropdown-content menu bg-black rounded-box z-[1] w-52 p-2 shadow border-[1px] border-slate-700">
                    <li><a className="hover:text-violet-500">John Doe</a></li>
                    <li>
                      <a className="flex justify-between flex-row hover:text-violet-500">
                        <span>Logout</span>
                        <IoIosLogOut />
                      </a>
                    </li>
                  </ul>
                </div>
            </div>
          </div>

          <div className="w-[85%] border-[1px] border-slate-700 rounded-l-2xl bg-[#121c22] h-screen flex flex-col">
            <div className="border-b-[1px] border-slate-700 w-full h-16 flex flex-row justify-between items-center px-6">
                  <TitleDashboard />
            </div>
            
            <div className="w-full flex-1 overflow-auto bg-[radial-gradient(rgba(229,231,235,0.1)_1px,transparent_1px)] [background-size:16px_16px]">

              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
