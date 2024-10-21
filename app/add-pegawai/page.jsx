import Link from 'next/link';
import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";

const Pegawai = () => {
  return (
    <div className='p-5 h-full overflow-y-auto'>
    <div className='w-full h-10 flex flex-row items-center'>
        <Link href={'/setting-pegawai'} className='flex flex-row items-center gap-2 group'>
            <IoMdArrowRoundBack className='group-hover:text-violet-400' />
            <span className='group-hover:text-violet-400'>Kembali</span>
        </Link>
    </div>
        <div className='w-full items-center flex flex-col justify-center gap-6 pb-40'>

        <div className="w-full flex justify-center gap-4">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Nama pegawai<span className='text-red-600'>*</span></span>
                    
                </div>
                <input type="text" placeholder="Masukan nama lengkap pegawai" className="input input-bordered w-full max-w-xs" />
            </label>
            
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">NIP<span className='text-red-600'>*</span></span>
                </div>
                <input type="number" placeholder="Nip" className="input input-bordered w-full max-w-xs" />
            </label>
        </div>

        <div className="w-full flex justify-center gap-4">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Tanggal lahir<span className='text-red-600'>*</span></span>
                </div>
                <input type="date" className="input input-bordered w-full max-w-xs" />
            </label>

            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Tempat lahir<span className='text-red-600'>*</span></span>
                </div>
                <input type="text" placeholder="Masukan tempat lahir" className="input input-bordered w-full max-w-xs" />
            </label>
        </div>

        <div className="w-full flex justify-center gap-4">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Pendidikan<span className='text-red-600'>*</span></span>
                </div>
                <select className="select select-bordered">
                    <option disabled selected>Pick one</option>
                    <option>Star Wars</option>
                    <option>Harry Potter</option>
                    <option>Lord of the Rings</option>
                    <option>Planet of the Apes</option>
                    <option>Star Trek</option>
                </select>
            </label>
            
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Jabatan<span className='text-red-600'>*</span></span>
                </div>
                <select className="select select-bordered">
                    <option disabled selected>Pick one</option>
                    <option>Star Wars</option>
                    <option>Harry Potter</option>
                    <option>Lord of the Rings</option>
                    <option>Planet of the Apes</option>
                    <option>Star Trek</option>
                </select>
            </label>
        </div>
            
            <button className="btn btn-accent w-full max-w-xs mt-5">Simpan</button>
            
        </div>
    </div>
  )
}

export default Pegawai