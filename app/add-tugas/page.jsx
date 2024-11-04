import Link from 'next/link';
import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";

import { prisma } from '../lib/db';
import ButtonAddTugas from '@/components/micro-component/button-add-tugas';


const page = async ({searchParams}) => {
    const {id} = searchParams

    const jabatan = await prisma.jabatan.findFirst({
        where:{
            id:parseInt(id)
        },
        include:{
            tugas:true
        }
    })

    

  return (
    <div className='w-full h-full'>
        <div className='py-5 px-3 w-full h-auto flex flex-row justify-between items-center'>
            <Link href={'/setting-uraian-tugas'} className='flex  flex-row items-center justify-start gap-2 group'>
                <IoMdArrowRoundBack className='group-hover:text-violet-400' />
                <span className='group-hover:text-violet-400'>Kembali</span>
            </Link>
            <div className='flex justify-center items-center w-full'>
                <span>{jabatan.namaJabatan}</span>
            </div>
            <div className='flex justify-end items-center'>
                <ButtonAddTugas />
            </div>
        </div>
        <div className='w-full overflow-y-auto p-8'>
        <div className="overflow-hidden rounded-lg border border-gray-300 ">
            <table className="table w-full ">
              {/* head */}
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="border-r border-gray-300"></th>
                  <th className="border-r border-gray-300 text-center align-middle">URAIAN TUGAS</th>
                  <th className="border-r border-gray-300 text-center align-middle">HASIL KERJA</th>
                  <th className='text-center align-middle'>Actions</th>
                </tr>
              </thead>
              <tbody>

                {jabatan.tugas.length > 0 ?
                    jabatan.tugas.map((item, index) => 
                        (
                            <tr key={index} className="bg-base-200 border-b border-gray-300">
                                <td className="border-r border-gray-300 text-center">{index + 1}</td>
                                <td className="border-r border-gray-300 text-xs text-white">{item.namaTugas}</td>
                                <td className="border-r border-gray-300 text-xs text-white">{item.hasil}</td>
                                <td>
                                    <div className="flex flex-row h-full justify-center items-center gap-3">
                                        <Link href={`/`} className="tooltip" data-tip="Edit">
                                            <MdEditDocument className="text-violet-400 hover:text-violet-600 cursor-pointer" />
                                        </Link>
                                        <div className="tooltip" data-tip="Hapus">
                                            <MdDelete className="text-red-400 hover:text-red-600 cursor-pointer" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )
                    )
                :
                (
                    <tr className="bg-base-200 border-b border-gray-300">
                        <td className="border-r border-gray-300 text-center">-</td>
                        <td className="border-r border-gray-300">-----</td>
                        <td className="border-r border-gray-300 text-center">------</td>
                        <td className="border-r  flex justify-center">
                            ---- ---
                        </td>
                    </tr>
                )
                }
              </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}

export default page