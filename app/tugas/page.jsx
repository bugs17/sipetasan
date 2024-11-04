import React from 'react'
import { FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { prisma } from '../lib/db';
import ButtonBackUraianTugas from '@/components/micro-component/button-back-uraian-tugas';
import ModalUraianTugas from '@/components/micro-component/Modal-uraian-tugas';


const page = async ({searchParams}) => {

    const {id} = searchParams
 
    const tugas = await prisma.tugas.findMany({
        where:{
            jabatanId:parseInt(id)
        }
    })

  return (
    <div className='p-5 '>
      <div className='flex justify-between items-center'>
        <div>
            <ButtonBackUraianTugas />
        </div>
            <h3 className='font-semibold'>Uraian Tugas Kepala Biro Organisasi</h3>
        <div>

        </div>
      </div>

      <div className='overflow-hidden rounded-lg border border-gray-300 mt-8'>
          <table className="table w-full ">
                  <thead>
                    <tr className="border-b border-gray-300 ">
                      <th className="border-r border-gray-300 flex justify-center text-white">Uraian Tugas</th>
                      <th className="border-r border-gray-300 text-center align-middle text-white">Status</th>
                      <th className="border-r border-gray-300 text-center align-middle text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>

                  {tugas.length > 0 &&
                    tugas.map(item => (
                        <tr key={item.id} className="bg-base-200 border-b border-gray-300">
                            <td className="border-r border-gray-300">
                                {item.namaTugas}
                            </td>
                            <td className="border-r border-gray-300 text-center align-middle">
                            <div className="flex justify-center items-center h-full">
                                {item.jumlahBebanKerjaSetahun > 0 || item.waktuEfektifPenyelesaian > 0 || item.waktuPenyelesaianDalamJam ?
                                    <FaCheck className='text-green-500' />
                                    :
                                    <FaTimes className="text-red-500" />
                                }
                            </div>
                            </td>
                            <td className="border-r border-gray-300 text-center align-middle">
                                <ModalUraianTugas idTugas={item.id} jumlahBebanKerja={item.jumlahBebanKerjaSetahun} waktuPenyelesaian={item.waktuPenyelesaianDalamJam} waktuEfektif={item.waktuEfektifPenyelesaian} />
                            </td>
                        </tr>
                    ))
                  }
                  </tbody>
          </table>
      </div>
    </div>
  )
}

export default page