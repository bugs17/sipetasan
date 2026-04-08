"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Import semua icon dari lucide-react
import {
  Users,
  LayoutDashboard,
  ClipboardList,
  Settings,
  Download,
  Shuffle,
  SendHorizontal,
} from "lucide-react";

/**
 * Base path dashboard
 */
const BASE_PATH = "/dashboard";

/**
 * Menu configuration
 */
const menuConfig = [
  {
    label: "Peta Jabatan",
    href: `${BASE_PATH}`,
    icon: <LayoutDashboard size={20} />,
    match: (pathname) => pathname === BASE_PATH,
  },
  {
    label: "Proyeksi Kebutuhan",
    href: `${BASE_PATH}/proyeksi-kebutuhan`,
    icon: <Users size={20} />,
    match: (pathname) => pathname.startsWith(`${BASE_PATH}/proyeksi-kebutuhan`),
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
        label: "Seting Instansi",
        href: `${BASE_PATH}/setting-instansi`,
        match: (pathname) => pathname === `${BASE_PATH}/setting-instansi`,
      },
      {
        label: "Seting Pegawai",
        href: `${BASE_PATH}/setting-pegawai`,
        match: (pathname) =>
          pathname === `${BASE_PATH}/setting-pegawai` ||
          pathname === `${BASE_PATH}/add-pegawai`,
      },
      {
        label: "Seting User",
        href: `${BASE_PATH}/setting-user`,
        match: (pathname) =>
          pathname === `${BASE_PATH}/setting-user` ||
          pathname.includes(`${BASE_PATH}/setting-user`),
      },
    ],
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
    label: "Chat",
    href: `${BASE_PATH}/chat`,
    icon: <SendHorizontal size={20} />,
    match: (pathname) =>
      pathname === `${BASE_PATH}/chat` ||
      pathname.includes(`${BASE_PATH}/chat`),
  },
  // Jika nanti mau download group, bisa diaktifkan
  // {
  //   label: 'Download',
  //   icon: <Download size={20} />,
  //   type: 'group',
  //   children: [
  //     { label: 'Peta Jabatan', href: '' },
  //     { label: 'Proyeksi Kebutuhan', href: '' },
  //   ],
  // },
];

/**
 * Sidebar Component
 */
const SideBarAdminInduk = () => {
  const pathname = usePathname();

  return (
    <ul className="menu w-full">
      {menuConfig.map((item, index) => {
        if (!item.type) {
          const isActive = item.match?.(pathname);

          return (
            <li key={index}>
              <Link
                href={item.href}
                className={`hover:text-violet-500 ${isActive ? "active" : ""}`}
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
              <summary className="hover:text-violet-500">
                {item.icon}
                <span>{item.label}</span>
              </summary>

              <ul>
                {item.children.map((child, idx) => {
                  const isActive = child.match?.(pathname);

                  return (
                    <li key={idx}>
                      <Link
                        href={child.href}
                        className={`hover:text-violet-500 ${isActive ? "active" : ""}`}
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

export default SideBarAdminInduk;
