"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  ClipboardList,
  Settings,
  Download,
  Shuffle,
  SendHorizontal,
} from "lucide-react";
import { generateLaporanHirarkiJabatan } from "@/app/actions/generate-excel-peta-jabatan";
import { useAuth } from "@clerk/nextjs";
import { getUserRoleByClerkID } from "@/app/actions/get-user-role-by-clerk-id";
import toast from "react-hot-toast";

/**
 * Base path dashboard
 */
const BASE_PATH = "/dashboard";

/**
 * Sidebar Component
 */
const SideBarAdminOpd = () => {
  const pathname = usePathname();

  const [isDownloading, setIsDownloading] = useState(false);
  const [userDb, setUserDb] = useState(null);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !userId) return;
      try {
        const res = await getUserRoleByClerkID(userId);
        setUserDb(res);
      } catch (error) {}
    };
    fetchData();
  }, [isLoaded, userId]);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    document.body.style.cursor = "wait"; // Tetap ganti cursor
    try {
      const result = await generateLaporanHirarkiJabatan(
        userDb?.opdId,
        userDb?.opd?.namaOpd,
      );
      if (result.success) {
        const link = document.createElement("a");
        link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${result.data}`;
        link.download = result.filename;
        link.click();
      } else {
        toast.error("Gagal mendownload laporan: " + result.error);
      }
    } catch (error) {
    } finally {
      setIsDownloading(false);
      document.body.style.cursor = "default";
    }
  };

  const menuConfig = [
    {
      label: "Peta Jabatan",
      href: `${BASE_PATH}`,
      icon: <LayoutGrid size={20} />,
      match: (pathname) => pathname === BASE_PATH,
    },
    {
      label: "Proyeksi Kebutuhan",
      href: `${BASE_PATH}/proyeksi-kebutuhan-pegawai`,
      icon: <Users size={20} />,
      match: (pathname) =>
        pathname === `${BASE_PATH}/proyeksi-kebutuhan-pegawai`,
    },
    {
      label: "Mutasi",
      href: `${BASE_PATH}/mutasi`,
      icon: <Shuffle size={20} />,
      match: (pathname) =>
        pathname === `${BASE_PATH}/mutasi` ||
        pathname.includes(`${BASE_PATH}/mutasi`),
    },
    {
      label: "Uraian Tugas",
      href: `${BASE_PATH}/uraian-tugas`,
      icon: <ClipboardList size={20} />,
      match: (pathname) =>
        pathname === `${BASE_PATH}/uraian-tugas` ||
        pathname.includes(`${BASE_PATH}/tugas`),
    },
    {
      label: "Download",
      icon: <Download size={20} />,
      type: "group",
      children: [
        {
          label: "Peta Jabatan",
          onClick: handleDownload,
        },
        {
          label: "Proyeksi Kebutuhan",
          href: `${BASE_PATH}/reports/proyeksi-kebutuhan`,
          match: (pathname) =>
            pathname === `${BASE_PATH}/reports/proyeksi-kebutuhan`,
        },
      ],
    },
    {
      label: "Chat",
      href: `${BASE_PATH}/chat-user`,
      icon: <SendHorizontal size={20} />,
      match: (pathname) =>
        pathname === `${BASE_PATH}/chat-user` ||
        pathname.includes(`${BASE_PATH}/chat-user`),
    },
    {
      label: "Master",
      icon: <Settings size={20} />,
      type: "group",
      openWhen: (pathname) =>
        pathname.startsWith(`${BASE_PATH}/setting`) ||
        pathname.startsWith(`${BASE_PATH}/add`),
      children: [
        {
          label: "Setting Pegawai",
          href: `${BASE_PATH}/setting-pegawai`,
          match: (pathname) =>
            pathname === `${BASE_PATH}/setting-pegawai` ||
            pathname === `${BASE_PATH}/add-pegawai`,
        },
        {
          label: "Setting Uraian Tugas",
          href: `${BASE_PATH}/setting-uraian-tugas`,
          match: (pathname) =>
            pathname === `${BASE_PATH}/setting-uraian-tugas` ||
            pathname.includes(`${BASE_PATH}/add-tugas`),
        },
      ],
    },
  ];

  return (
    <ul className="menu w-full">
      {menuConfig.map((item, index) => {
        if (!item.type) {
          const isActive = item.match?.(pathname);

          return (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center gap-2 hover:text-violet-500 ${
                  isActive ? "active" : ""
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        }

        return (
          <li key={index}>
            <details open={item.openWhen?.(pathname)}>
              <summary className="flex items-center gap-2 hover:text-violet-500">
                {item.icon}
                <span>{item.label}</span>
              </summary>

              <ul className="ml-6 mt-1">
                {item.children.map((child, idx) => {
                  const isActive = child.match?.(pathname);

                  // Jika ada onClick, render sebagai <a> tanpa href atau button
                  if (child.onClick) {
                    return (
                      <li key={idx}>
                        <a
                          onClick={child.onClick}
                          className="hover:text-violet-500 cursor-pointer"
                        >
                          {child.label}
                        </a>
                      </li>
                    );
                  }

                  // Jika tidak ada onClick, render Link normal
                  return (
                    <li key={idx}>
                      <Link
                        href={child.href}
                        className={`hover:text-violet-500 ${
                          isActive ? "active" : ""
                        }`}
                      >
                        {child.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>
          </li>
        );
      })}
    </ul>
  );
};

export default SideBarAdminOpd;
