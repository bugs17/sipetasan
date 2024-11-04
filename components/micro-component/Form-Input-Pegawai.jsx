'use client'
import { addPegawai } from '@/app/actions/addPegawai'
import React, { useRef, useState } from 'react'

const FormInputPegawai = ({pendidikan, jabatan, pegawai}) => {
    const [nama, setNama] = useState('')
    const [nip, setNip] = useState('')
    const [tanggalLahir, setTanggalLahir] = useState('')
    const [tempatLahir, setTempatLahir] = useState('')
    const [pendidikanInput, setPendidikanInput] = useState('')
    const [jabatanInput, setJabatanInput] = useState('')
    const [atasan, setAtasan] = useState('')
    const [kj, setKj] = useState(null)

    const ref = useRef(null)
    const refPendidikan = useRef(null)
    const refJabatan = useRef(null)
    const refAtasan = useRef(null)



    const [isSubmit, setIsSubmit] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !nama ||
            !nip ||
            !tanggalLahir ||
            !tempatLahir ||
            !pendidikanInput ||
            !jabatanInput ||
            !kj
          ) {
            alert('Semua kolom harus diisi!');
            return;
          }

        setIsSubmit(true)
        
        await addPegawai(nama, nip, tanggalLahir, tempatLahir, pendidikanInput, jabatanInput, atasan, kj)
        ref.current.reset()
        refPendidikan.current.selectedIndex = 0
        refJabatan.current.selectedIndex = 0
        if (atasan !== '') {
            refAtasan.current.selectedIndex = 0
        }
        setIsSubmit(false)
        setPendidikanInput(''); // Atau set ke value default yang diinginkan
        setJabatanInput(''); // Atau set ke value default yang diinginkan
        setNama('')
        setNip('')
        setTanggalLahir('')
        setTempatLahir('')
        setAtasan('')
        setKj(null)
    }

  return (
    <form onSubmit={handleSubmit} ref={ref} className='w-full items-center flex flex-col justify-center gap-6'>
        <div className="w-full flex justify-center gap-4">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Nama pegawai<span className='text-red-600'>*</span></span>
                    
                </div>
                <input onChange={e => setNama(e.target.value)} required type="text" placeholder="Masukan nama lengkap pegawai" className="input input-bordered w-full max-w-xs" />
            </label>
            
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">NIP<span className='text-red-600'>*</span></span>
                </div>
                <input onChange={e => setNip(e.target.value)} required type="number" placeholder="Nip" className="input input-bordered w-full max-w-xs" />
            </label>
        </div>

        <div className="w-full flex justify-center gap-4">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Tanggal lahir<span className='text-red-600'>*</span></span>
                </div>
                <input onChangeCapture={e => setTanggalLahir(e.target.value)} required type="date" className="input input-bordered w-full max-w-xs" />
            </label>

            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Tempat lahir<span className='text-red-600'>*</span></span>
                </div>
                <input onChange={e => setTempatLahir(e.target.value)} required type="text" placeholder="Masukan tempat lahir" className="input input-bordered w-full max-w-xs" />
            </label>
        </div>

        <div className="w-full flex justify-center gap-4">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Pendidikan<span className='text-red-600'>*</span></span>
                </div>
                <select ref={refPendidikan} className="select select-bordered" onChange={e => setPendidikanInput(e.target.value)}>
                    <option disabled selected>Pilih pendidikan</option>
                    {pendidikan.length > 0 && 
                        pendidikan.map(item => (
                            <option key={item.id} value={item.id}>{item.namaPendidikan}</option>
                        ))
                    }
                </select>
            </label>
            
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Jabatan<span className='text-red-600'>*</span></span>
                </div>
                <select ref={refJabatan} className="select select-bordered" onChange={e => setJabatanInput(e.target.value)}>
                    <option disabled selected>Pilih Jabatan</option>
                    {jabatan.length > 0 && 
                        jabatan.map(item => (
                            <option key={item.id} value={item.id}>{item.namaJabatan}</option>
                        ))
                    }
                </select>
            </label>
        </div>

                <div className='w-full flex justify-center gap-4'>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Kelas Jabatan (KJ)<span className='text-red-600'>*</span></span>
                    </div>
                    <input onChange={e => setKj(e.target.value)} required type="number" placeholder="Kelas Jabatan" className="input input-bordered w-full max-w-xs" />
                </label>
                {pegawai.length > 0 &&
                    (
                        <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Atasan</span>
                                </div>
                                <select ref={refAtasan} className="select select-bordered" onChange={e => setAtasan(e.target.value)}>
                                    <option disabled selected>Pilih Atasan</option>
                                    {pegawai.length > 0 &&
                                        pegawai.map(item => (
                                            <option key={item.id} value={item.id}>{item.nama}</option>
                                        ))
                                    }

                                </select>
                        </label>
                    )
                }
                </div>
        
            
            <button disabled={isSubmit} type='submit' className="btn btn-accent w-full max-w-xs mt-5">{isSubmit ? 'Menyimpan...' : 'Simpan'}</button>
            
    </form>
  )
}

export default FormInputPegawai