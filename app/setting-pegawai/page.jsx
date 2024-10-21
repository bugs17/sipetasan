import React from 'react'
import { FaPlus } from "react-icons/fa";
import Link from 'next/link';
import TrPegawai from '@/componnents/micro-component/Tr-Pegawai';

const SettingPegawai = () => {
    let pegawai = [];
  return (
    <div className='p-5 h-full overflow-y-auto '>
        <div className='w-full flex justify-end'>
            <Link href={'/add-pegawai'} className="btn btn-sm btn-accent mb-5 ml-auto"><FaPlus /> pegawai</Link>
        </div>
        <div className=" h-full">

        <div className='pb-32'>

          <div className="overflow-hidden rounded-lg border border-gray-300 ">
            <table className="table w-full ">
              {/* head */}
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="border-r border-gray-300"></th>
                  <th className="border-r border-gray-300 text-center align-middle">Nama</th>
                  <th className="border-r border-gray-300 text-center align-middle">Nip</th>
                  <th className="border-r border-gray-300 text-center align-middle">TTL</th>
                  <th className="border-r border-gray-300 text-center align-middle">Alamat</th>
                  <th className="border-r border-gray-300 text-center align-middle">Pendidikan</th>
                  <th className="border-r border-gray-300 text-center align-middle">Jabatan</th>
                  <th className='text-center align-middle'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {pegawai.length > 0 ?
                    (<TrPegawai />)
                    :
                    (<TrPegawai />)
                    
                
                }
                
                
              </tbody>
            </table>
          </div>
        </div>

        </div>
    </div>
  )
}

export default SettingPegawai