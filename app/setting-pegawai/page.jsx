import React from 'react'
import { FaPlus } from "react-icons/fa";
import Link from 'next/link';
import TrPegawai from '@/components/micro-component/Tr-Pegawai';
import { prisma } from '../lib/db';

const SettingPegawai = async () => {
    let pegawai = await prisma.pegawai.findMany({
      include:{
        jabatan:true,
        pendidikan:true
      }
    }) ;
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
                  <th className="border-r border-gray-300 text-center align-middle">Pendidikan</th>
                  <th className="border-r border-gray-300 text-center align-middle">Jabatan</th>
                  <th className='text-center align-middle'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {pegawai.length > 0 ?
                  
                  pegawai.map((item, index) => 
                    (<TrPegawai id={item.id} key={index} no={index} nama={item.nama} jabatan={item.jabatan.namaJabatan} nip={item.nip} ttl={item.tanggalLahir} tempatLahir={item.tempatLahir} pendidikan={item.pendidikan.namaPendidikan}  />)
                  )
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