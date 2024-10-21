import React from 'react'
import { MdDelete } from "react-icons/md";


const Jabtan = () => {
  return (
    <div className='w-full h-full flex'>
        <div className='flex-grow w-[70%] h-full flex justify-center pt-32'>

        <div className='flex flex-col gap-5 w-64 items-center'>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Jabatan</span>
                </div>
                <input type="text" placeholder="Masukan Jenis Jabatan" className="input input-bordered w-full max-w-xs" />
            </label>
            <div className='flex justify-center w-full'>
                <button className="btn btn-accent w-full">Simpan</button>
            </div>
                <p className='absolute bottom-5 font-mono text-xs max-w-xs text-justify'>Tambahkan data jabatan pada form diatas. dan list jabatan yang sudah ditambahkan dapat dilihat pada kolom list jabatan di sebelah kanan.</p>
        </div>
        </div>
        <div className='flex-none h-full  border-l-[1px] border-slate-700 justify-center items-center overflow-y-auto' >
            <div className='w-full h-20 flex justify-center items-center border-b-[1px] border-slate-700'>
                <span className='font-semibold'>List Jabatan</span>
            </div>
            <ul className='flex flex-col gap-4 p-5 px-8 mb-20'>
                <li className='flex flex-row items-center justify-between gap-5'>KEPALA DINAS <MdDelete className='text-red-400 hover:text-red-600 cursor-pointer' /></li>
                <li className='flex flex-row items-center justify-between gap-5'>KEPALA DINAS GANTENG <MdDelete className='text-red-400 hover:text-red-600 cursor-pointer' /></li>
                
            </ul>
        </div>
    </div>
  )
}

export default Jabtan