"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  ClipboardList,
  Settings,
  Download,
  Shuffle,
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
    icon: <LayoutGrid size={20} />,
    match: (pathname) => pathname === BASE_PATH,
  },
  {
    label: "Proyeksi Kebutuhan",
    href: `${BASE_PATH}/proyeksi-kebutuhan`,
    icon: <Users size={20} />,
    match: (pathname) => pathname === `${BASE_PATH}/proyeksi-kebutuhan`,
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
    label: "Master",
    icon: <Settings size={20} />,
    type: "group",
    openWhen: (pathname) =>
      pathname.startsWith(`${BASE_PATH}/setting`) ||
      pathname.startsWith(`${BASE_PATH}/add`),
    children: [
      {
        label: "Seting Pegawai",
        href: `${BASE_PATH}/setting-pegawai`,
        match: (pathname) =>
          pathname === `${BASE_PATH}/setting-pegawai` ||
          pathname === `${BASE_PATH}/add-pegawai`,
      },
      {
        label: "Seting Uraian Tugas",
        href: `${BASE_PATH}/setting-uraian-tugas`,
        match: (pathname) =>
          pathname === `${BASE_PATH}/setting-uraian-tugas` ||
          pathname.includes(`${BASE_PATH}/add-tugas`),
      },
    ],
  },
  {
    label: "Download",
    icon: <Download size={20} />,
    type: "group",
    children: [
      {
        label: "Peta Jabatan",
        href: "#",
      },
      {
        label: "Proyeksi Kebutuhan",
        href: "#",
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
];

/**
 * Sidebar Component
 */
const SideBarAdminOpd = () => {
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
