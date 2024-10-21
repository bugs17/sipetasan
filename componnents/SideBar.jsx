'use client'
import React from 'react'
import { MdSpaceDashboard } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { BsDiagram3Fill } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const pathname = usePathname()
  return (
    <ul className="menu w-full">
                <li >
                  <Link href={'/'} className={`hover:text-violet-500 ${pathname === '/' && 'active'}`}>
                  <MdSpaceDashboard />
                  <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link href={'/proyeksi-kebutuhan'} className={`hover:text-violet-500 ${pathname === '/proyeksi-kebutuhan' && 'active'}`}>
                  <IoIosPeople />
                    <span>Proyeksi kebutuhan</span>
                  </Link>
                </li>
                
                <li>
                  <details >
                    <summary className="hover:text-violet-500">
                      <BsDiagram3Fill />
                      <span>Peta Jabatan</span>
                    </summary>
                    <ul>
                      <li><a className="hover:text-violet-500">Submenu 1</a></li>
                      <li><a className="hover:text-violet-500">Submenu 2</a></li>
                      
                      
                    </ul>
                  </details>
                </li>
                <li>
                  <details open={pathname === '/setting-pegawai' || pathname === '/add-pegawai' || pathname === '/setting-jabatan'}>
                    <summary className="hover:text-violet-500">
                      <IoSettingsSharp />
                      <span >Settings</span>
                    </summary>
                    <ul>
                      <li><Link href={'/setting-jabatan'} className={`hover:text-violet-500 ${pathname === '/setting-jabatan' && 'active'}`}>Jabatan</Link></li>
                      <li><Link href={'/setting-pegawai'} className={`hover:text-violet-500 ${pathname === '/setting-pegawai' || pathname === '/add-pegawai' ? 'active' : ''}`}>Pegawai</Link></li>
                      
                      
                    </ul>
                  </details>
                </li>
                
    </ul>
  )
}

export default SideBar