'use client'
import { saveEditedPegawai } from '@/app/actions/editPegawai'
import React, { useRef, useState } from 'react'

const FormEditPegawai = ({ pendidikan, jabatan, pegawai, allPegawai}) => {
    

    const ref = useRef(null)
    const refPendidikan = useRef(null)
    const refJabatan = useRef(null)
    const refAtasan = useRef(null)

    const date = pegawai.tanggalLahir.toISOString().split("T")[0]
    const [nama, setNama] = useState(pegawai.nama)
    const [nip, setNip] = useState(pegawai.nip)
    const [tanggalLahir, setTanggalLahir] = useState(date)
    const [tempatLahir, setTempatLahir] = useState(pegawai.tempatLahir)
    const [pendidikanInput, setPendidikanInput] = useState(pegawai.pendidikanId)
    const [jabatanInput, setJabatanInput] = useState(pegawai.jabatanId)
    const [atasanInput, setAtasanInput] = useState(pegawai.atasanId)
    const [kj, setKj] = useState(pegawai.jabatan.kJ)


    const [isSubmit, setIsSubmit] = useState(false)
    




    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmit(true)
        const result = await saveEditedPegawai(pegawai.id, nama, nip, tanggalLahir, tempatLahir, pendidikanInput, jabatanInput, atasanInput, kj)
        if (result) {
            alert("Data telah di perbaharui 😍")
            setIsSubmit(false)
        }else{
            setIsSubmit(false)
        }
    }




    

  return (
    <form onSubmit={handleSubmit} ref={ref} className='w-full items-center flex flex-col justify-center gap-6'>
        <div className="w-full flex justify-center gap-4">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Nama pegawai<span className='text-red-600'>*</span></span>
                </div>
                <input onChange={e => setNama(e.target.value)} value={nama} required type="text" placeholder="Masukan nama lengkap pegawai" className="input input-bordered w-full max-w-xs" />
            </label>
            
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">NIP<span className='text-red-600'>*</span></span>
                </div>
                <input onChange={e => setNip(e.target.value)} value={nip} required type="number" placeholder="Nip" className="input input-bordered w-full max-w-xs" />
            </label>
        </div>

        <div className="w-full flex justify-center gap-4">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Tanggal lahir<span className='text-red-600'>*</span></span>
                </div>
                <input onChangeCapture={e => setTanggalLahir(e.target.value)} value={tanggalLahir} required type="date" className="input input-bordered w-full max-w-xs" />
            </label>

            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Tempat lahir<span className='text-red-600'>*</span></span>
                </div>
                <input onChange={e => setTempatLahir(e.target.value)} value={tempatLahir} required type="text" placeholder="Masukan tempat lahir" className="input input-bordered w-full max-w-xs" />
            </label>
        </div>

        <div className="w-full flex justify-center gap-4">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Pendidikan<span className='text-red-600'>*</span></span>
                </div>
                <select ref={refPendidikan} className="select select-bordered" defaultValue={pendidikanInput} onChange={e => setPendidikanInput(e.target.value)}>
                    <option disabled selected>Pilih pendidikan </option>
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
                <select ref={refJabatan} className="select select-bordered" defaultValue={jabatanInput} onChange={e => setJabatanInput(e.target.value)}>
                    <option disabled selected>Pilih Jabatan</option>
                    {jabatan.length > 0 && 
                        jabatan.map(item => (
                            <option key={item.id} value={item.id}>{item.namaJabatan}</option>
                        ))
                    }
                </select>
            </label>
        </div>
        <div className="w-full flex justify-center gap-4">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Kelas Jabatan (KJ)<span className='text-red-600'>*</span></span>
                    </div>
                    <input onChange={e => setKj(e.target.value)} value={kj} required type="number" placeholder="Masukan Kelas jabatab" className="input input-bordered w-full max-w-xs" />
                </label>
                {pegawai.atasanId !== null &&
                    (
                        <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Atasan</span>
                                </div>
                                <select ref={refAtasan} className="select select-bordered" defaultValue={atasanInput} onChange={e => setAtasanInput(e.target.value)}>
                                    <option disabled selected>Pilih Atasan</option>
                                    {pegawai.atasanId !== null &&
                                        allPegawai.map(item => (
                                            <option key={item.id} value={item.id}>{item.nama}</option>
                                        ))
                                    }

                                </select>
                        </label>
                    )
                }
                
        </div>
            
            <button type='submit' className="btn btn-accent w-full max-w-xs mt-5">{isSubmit ? 'Menyimpan...' : 'Simpan'}</button>
            
    </form>
  )
}

export default FormEditPegawai