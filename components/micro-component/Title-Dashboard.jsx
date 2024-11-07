'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import Clock from './Clock'

const TitleDashboard = () => {
    const pathename = usePathname()
    const editPegawai = pathename.includes('/edit-pegawai')
  return (
    <div className='flex flex-row w-full justify-between items-center'>
    <span className='font-semibold'>
        {
            pathename === '/' ? 'Peta Jabatan' :
            pathename === '/setting-pegawai' ? 'List Pegawai' :
            pathename === '/setting-jabatan' ? 'Jabatan' :
            pathename === '/add-pegawai' ? 'Tambah Pegawai' :
            pathename === '/peta-jabatan-opd' ? 'Peta Jabatan' :
            pathename === '/proyeksi-kebutuhan' ? 'PROYEKSI KEBUTUHAN PEGAWAI 5 TAHUN KE DEPAN' :
            pathename.includes('/edit-pegawai') ? 'Edit Data Pegawai' :
            pathename.includes('/uraian-tugas') ? 'Uraian Tugas' :
            pathename.includes('/setting-uraian-tugas') ? 'Setting Uraian Tugas' :
            pathename.includes('/add-tugas') ? 'Setting Uraian Tugas' : ""

        }
    </span>
    <Clock />

    <span className='text-slate-400 text-xs font-mono'>BIRO ORGANISASI</span>

    </div>
  )
}

export default TitleDashboard