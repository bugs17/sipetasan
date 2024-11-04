import Link from 'next/link';
import React from 'react'
import { FaUserEdit } from "react-icons/fa";
import ButtonDeletePegawai from './ButtonDeletePegawai';



const TrPegawai = ({no, nama, nip, ttl,tempatLahir,pendidikan,jabatan, id}) => {

  function potongKalimat(kalimat, max) {
    if (kalimat.length <= max) {
      return kalimat;
    }
    return kalimat.slice(0, max) + "...";
  }

  const date = new Date(ttl)
  const tgl = date.getDate()
  const bln = date.getMonth() + 1
  const thn = date.getFullYear()

  
  return (
    <tr className="bg-base-200 border-b border-gray-300">
        <td className="border-r border-gray-300">{no + 1 || '-'}</td>
        <td className="border-r border-gray-300">
            <div className='tooltip' data-tip={nama || 'Kosong'}>
                {nama ? potongKalimat(nama, 10) : '---'}
            </div>
        </td>
        <td className="border-r border-gray-300">
              <div className='tooltip' data-tip={nip || 'Kosong'}>
              {nip ? nip : '---'}
              </div>
        </td>
        <td className="border-r border-gray-300">
                <div className='tooltip' data-tip={`${tempatLahir}, ${tgl}-${bln}-${thn}` || 'Kosong'}>
                  {tempatLahir ? `${tempatLahir}, ${tgl}-${bln}-${thn}` : '---'}
                </div>
        </td>
        
        <td className="border-r border-gray-300">
                <div className='tooltip flex justify-center items-center' data-tip={pendidikan || 'Kosong'}>
                  {pendidikan ? pendidikan : '---'}
                </div>
        </td>
        <td className="border-r border-gray-300">
                <div className='tooltip' data-tip={jabatan || 'Kosong'}>
                  {jabatan ? potongKalimat(jabatan, 15) : '---'}
                </div>
        </td>
        
        <td className='flex flex-row h-full justify-center items-center gap-5'>
            {nama &&<Link href={`/edit-pegawai?id=${id}`} className='tooltip' data-tip="Edit">
                  <FaUserEdit className='text-violet-400 hover:text-violet-600 cursor-pointer' />
            </Link>}
            {nama &&<div className='tooltip' data-tip="Hapus">
                <ButtonDeletePegawai id={id} />
            </div>}
        </td>
    </tr>
  )
}

export default TrPegawai