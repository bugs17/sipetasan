import "./globals.css";
import localFont from 'next/font/local'; // Gunakan kembali localFont
import { PiCaretUpDownBold } from "react-icons/pi";

import { Recursive } from 'next/font/google'; // Tetap gunakan dari google
import Image from "next/image";

import { IoIosLogOut } from "react-icons/io";
import SideBar from "@/components/SideBar";
import SidebarLogo from "@/components/SidebarLogo";
import TitleDashboard from "@/components/micro-component/Title-Dashboard";
import { ClerkProvider } from "@clerk/nextjs";


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
    <ClerkProvider>
      <html data-theme="sunset" className="bg-black" lang="id">
        <body  className={`${geistMono.variable} antialiased overflow-hidden m-0 p-0`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
