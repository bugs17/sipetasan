'use client'
import React from 'react'
import { FaTasks } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { BsDiagram3Fill } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const pathname = usePathname()
  return (
    <ul className="menu w-full">
                
                <li>
                  <Link href={'/peta-jabatan-opd'} className={`hover:text-violet-500 ${pathname === '/peta-jabatan-opd' && 'active'}`}>
                    <BsDiagram3Fill />
                    <span>Peta Jabatan</span>
                  </Link>
                </li>
                <li>
                  <Link href={'/proyeksi-kebutuhan'} className={`hover:text-violet-500 ${pathname === '/proyeksi-kebutuhan' && 'active'}`}>
                  <IoIosPeople />
                    <span>Proyeksi kebutuhan</span>
                  </Link>
                </li>
                <li>
                  <Link href={'/uraian-tugas'} className={`hover:text-violet-500 ${pathname === '/uraian-tugas' || pathname.includes('/tugas') ? 'active' : ''}`}>
                    <FaTasks />
                    <span>Uraian Tugas</span>
                  </Link>
                </li>
                <li>
                  <details open={pathname === '/setting-pegawai' || pathname === '/add-pegawai' || pathname === '/setting-jabatan' || pathname === '/add-tugas' || pathname.includes('/setting-uraian-tugas')}>
                    <summary className="hover:text-violet-500">
                      <IoSettingsSharp />
                      <span >Settings</span>
                    </summary>
                    <ul>
                      <li><Link href={'/setting-jabatan'} className={`hover:text-violet-500 ${pathname === '/setting-jabatan' && 'active'}`}>Jabatan</Link></li>
                      <li><Link href={'/setting-pegawai'} className={`hover:text-violet-500 ${pathname === '/setting-pegawai' || pathname === '/add-pegawai' ? 'active' : ''}`}>Pegawai</Link></li>
                      <li><Link href={'/setting-uraian-tugas'} className={`hover:text-violet-500 ${pathname === '/setting-uraian-tugas' || pathname.includes('/add-tugas')  ? 'active' : ''}`}>Uraian Tugas</Link></li>
                      
                      
                    </ul>
                  </details>
                </li>
                
    </ul>
  )
}

export default SideBar