import React from 'react'
import { prisma } from '../lib/db'
import Link from 'next/link'

const page = async () => {
    const jabatan = await prisma.jabatan.findMany()

    function formatString(text) {
        return "/" + "uraian-tugas/" + text.toLowerCase()
          .replace(/&/g, "dan")    // Mengganti & dengan "dan"
          .replace(/[/ ]/g, "-");   // Mengganti / dan spasi dengan -
    }
    
  return (
    <div className='p-5 h-full overflow-y-auto '>
        
        <div className=" h-full">

        <div className='pb-32'>

          <div className="overflow-hidden rounded-lg border border-gray-300 ">
            <table className="table w-full ">
              <thead>
                <tr className="border-b border-gray-300 ">
                  <th className="border-r border-gray-300 flex justify-center text-white">Nama Jabatan</th>
                  <th className="border-r border-gray-300 text-center align-middle text-white">Action</th>
                  
                </tr>
              </thead>
              <tbody>
              {jabatan.length > 0 &&
                jabatan.map(item => (

                    <tr key={item.id} className="bg-base-200 border-b border-gray-300">
                        <td className="border-r border-gray-300">{item.namaJabatan}</td>
                        <td className="border-r border-gray-300 flex justify-center">
                            <Link href={`/tugas?id=${item.id}`} className="btn hover:bg-violet-900 bg-violet-600 hover:text-white text-black btn-xs">Submit</Link>
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