import React from 'react'
import { prisma } from '../lib/db'
import Link from 'next/link'

const page = async () => {

    const jabatan = await prisma.jabatan.findMany({
        include:{
            tugas:true
        }
    })

  return (
    <div className='p-5 h-full overflow-y-auto '>
        <div className=" h-full">

        <div className='pb-32'>

          <div className="overflow-hidden rounded-lg border border-gray-300 ">
            <table className="table w-full ">
              {/* head */}
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="border-r border-gray-300"></th>
                  <th className="border-r border-gray-300 text-center align-middle">Nama Jabatan</th>
                  <th className="border-r border-gray-300 text-center align-middle">Total Uraian Tugas</th>
                  <th className='text-center align-middle'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jabatan.length > 0 &&
                    jabatan.map((item, index) => (
                    <tr key={index} className="bg-base-200 border-b border-gray-300">
                        <td className="border-r border-gray-300 text-center">{index + 1}</td>
                        <td className="border-r border-gray-300">{item.namaJabatan}</td>
                        <td className="border-r border-gray-300 text-center">{item.tugas.length}</td>
                        <td className="border-r border-gray-300 flex justify-center">
                            <Link href={`/add-tugas?id=${item.id}`} className="btn text-black bg-violet-600 hover:bg-violet-800 hover:text-white btn-xs">Tambah</Link>
                        </td>
                    </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>

        </div>
    </div>
  )
}

export default page