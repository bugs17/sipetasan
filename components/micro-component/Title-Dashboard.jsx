'use client'
import { usePathname } from 'next/navigation'
import React from 'react'

const TitleDashboard = () => {
    const pathename = usePathname()
    const editPegawai = pathename.includes('/edit-pegawai')
  return (
    <span>
        {
            pathename === '/' ? 'Dashboard' :
            pathename === '/setting-pegawai' ? 'List Pegawai' :
            pathename === '/setting-jabatan' ? 'Jabatan' :
            pathename === '/add-pegawai' ? 'Tambah Pegawai' :
            pathename === '/peta-jabatan-opd' ? 'Peta Jabatan' :
            pathename.includes('/edit-pegawai') ? 'Edit Data Pegawai' :
            pathename.includes('/uraian-tugas') ? 'Uraian Tugas' :
            pathename.includes('/setting-uraian-tugas') ? 'Setting Uraian Tugas' :
            pathename.includes('/add-tugas') ? 'Setting Uraian Tugas' : ""

        }
    </span>
  )
}

export default TitleDashboard