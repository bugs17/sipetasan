"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FaTasks } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { BsDiagram3Fill } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import { FaDownload } from "react-icons/fa6";

/**
 * Base path dashboard
 * gampang diganti kalau nanti berubah
 */
const BASE_PATH = "/dashboard";

/**
 * Menu configuration
 */
const menuConfig = [
  {
    label: "Peta Jabatan",
    href: `${BASE_PATH}`,
    icon: <BsDiagram3Fill />,
    match: (pathname) => pathname === BASE_PATH,
  },
  {
    label: "Proyeksi Kebutuhan",
    href: `${BASE_PATH}/proyeksi-kebutuhan`,
    icon: <IoIosPeople />,
    match: (pathname) => pathname === `${BASE_PATH}/proyeksi-kebutuhan`,
  },
  {
    label: "Uraian Tugas",
    href: `${BASE_PATH}/uraian-tugas`,
    icon: <FaTasks />,
    match: (pathname) =>
      pathname === `${BASE_PATH}/uraian-tugas` ||
      pathname.includes(`${BASE_PATH}/tugas`),
  },
  {
    label: "Master",
    icon: <IoSettingsSharp />,
    type: "group",
    openWhen: (pathname) =>
      pathname.startsWith(`${BASE_PATH}/setting`) ||
      pathname.startsWith(`${BASE_PATH}/add`),
    children: [
      // {
      //   label: "Seting Jabatan",
      //   href: `${BASE_PATH}/setting-jabatan`,
      //   match: (pathname) => pathname === `${BASE_PATH}/setting-jabatan`,
      // },
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
      {
        label: "Seting User",
        href: `${BASE_PATH}/setting-user`,
        match: (pathname) =>
          pathname === `${BASE_PATH}/setting-user` ||
          pathname.includes(`${BASE_PATH}/setting-user`),
      },
    ],
  },
  // {
  //   label: 'Download',
  //   icon: <FaDownload />,
  //   type: 'group',
  //   children: [
  //     {
  //       label: 'Peta Jabatan',
  //       href: '',
  //     },
  //     {
  //       label: 'Proyeksi Kebutuhan',
  //       href: '',
  //     },
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
        // =====================
        // SINGLE MENU
        // =====================
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

        // =====================
        // GROUP MENU
        // =====================
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
