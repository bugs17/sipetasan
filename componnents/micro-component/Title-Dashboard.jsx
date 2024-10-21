'use client'
import { usePathname } from 'next/navigation'
import React from 'react'

const TitleDashboard = () => {
    const pathename = usePathname()
  return (
    <span>
        {
            pathename === '/' ? 'Dashboard' :
            pathename === '/setting-pegawai' ? 'List Pegawai' :
            pathename === '/setting-jabatan' ? 'Jabatan' :
            pathename === '/add-pegawai' ? 'Tambah Pegawai' : '😩'

        }
    </span>
  )
}

export default TitleDashboard