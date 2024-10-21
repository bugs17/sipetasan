import React from 'react'
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const TrPegawai = ({no, nama, nip, ttl, alamat,pendidikan,jabatan}) => {
  return (
    <tr className="bg-base-200 border-b border-gray-300">
        <td className="border-r border-gray-300">{no || '-'}</td>
        <td className="border-r border-gray-300">
            <div className='tooltip' data-tip={nama || 'Kosong'}>
                {nama || '---'}
            </div>
        </td>
        <td className="border-r border-gray-300">
              <div className='tooltip' data-tip={nip || 'Kosong'}>
              {nip || '---'}
              </div>
        </td>
        <td className="border-r border-gray-300">
                <div className='tooltip' data-tip={ttl || 'Kosong'}>
                  {ttl || '---'}
                </div>
        </td>
        <td className="border-r border-gray-300">
                <div className='tooltip' data-tip={alamat || 'Kosong'}>
                  {alamat || '---'}
                </div>
        </td>
        <td className="border-r border-gray-300">
                <div className='tooltip' data-tip={pendidikan || 'Kosong'}>
                  {pendidikan || '---'}
                </div>
        </td>
        <td className="border-r border-gray-300">
                <div className='tooltip' data-tip={jabatan || 'Kosong'}>
                  {jabatan || '---'}
                </div>
        </td>
        
        <td className='flex flex-row h-full justify-center items-center gap-5'>
            {nama &&<div className='tooltip' data-tip="Edit">
                <FaUserEdit className='text-violet-400 hover:text-violet-600 cursor-pointer' />
            </div>}
            {nama &&<div className='tooltip' data-tip="Hapus">
                <MdDelete className='text-red-400 hover:text-red-600 cursor-pointer' />
            </div>}
        </td>
    </tr>
  )
}

export default TrPegawai