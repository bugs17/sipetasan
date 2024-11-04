import React from 'react'
import { prisma } from '../lib/db';
import FormInputJabatan from '@/components/micro-component/Form-Input-Jabatan';
import ButtonHapusJabatan from '@/components/micro-component/Button-hapus-jabatan';


const Jabtan = async () => {

    const data = await prisma.jabatan.findMany()


  return (
    <div className='w-full h-full flex'>
        <div className='flex-grow w-[70%] h-full flex justify-center pt-32'>

        <div className='flex flex-col gap-5 w-64 items-center'>

        <FormInputJabatan />
                <p className='absolute bottom-5 font-mono text-xs max-w-xs text-justify'>Tambahkan data jabatan pada form diatas. dan list jabatan yang sudah ditambahkan dapat dilihat pada kolom list jabatan di sebelah kanan.</p>
        </div>
        </div>
        <div className='flex-none h-full  border-l-[1px] border-slate-700 justify-center items-center overflow-y-auto' >
            <div className='w-full h-20 flex justify-center items-center border-b-[1px] border-slate-700'>
                <span className='font-semibold'>List Jabatan</span>
            </div>
            <ul className='flex flex-col gap-4 p-5 px-8 mb-20'>

            {data.length > 0 ?
                data.map((item) => (
                    <li key={item.id} className='flex flex-row items-center justify-between gap-5'>{item.namaJabatan} <ButtonHapusJabatan id={item.id} namaJabtan={item.namaJabatan} /></li>
                ))
                :
                <li className='flex flex-row items-center justify-between gap-5'>BELUM ADA JABATAN</li>
            }
                
            </ul>
        </div>

        
    </div>
  )
}

export default Jabtan