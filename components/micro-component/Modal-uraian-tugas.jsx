"use client"
import { addUraianTugas } from '@/app/actions/addUraianTugas'
import React, { useState } from 'react'

const ModalUraianTugas = ({idTugas, jumlahBebanKerja, waktuPenyelesaian, waktuEfektif}) => {

    const [value, setValue] = useState({
        jumlahBebanKerja:jumlahBebanKerja,
        waktuPenyelesaian: waktuPenyelesaian,
        waktuEfektif:waktuEfektif
    })

    const [isSubmit, setIsSubmit] = useState(false)

    const closeModal = () => {
        setValue({
            jumlahBebanKerja:jumlahBebanKerja,
            waktuPenyelesaian:waktuPenyelesaian,
            waktuEfektif:waktuEfektif
        })

        document.getElementById(`my_modal_${idTugas}`).close()
    }

    const handleSubmit = async () => {
        setIsSubmit(true)
        const result = await addUraianTugas(idTugas,value.jumlahBebanKerja, value.waktuPenyelesaian,value.waktuEfektif)
        if (result) {
            setIsSubmit(true)
            document.getElementById(`my_modal_${idTugas}`).close()
        }else{
            alert("Gagal menyimpan data")
            setIsSubmit(false)
        }
        
    }

  return (
    <>
        <button onClick={()=>document.getElementById(`my_modal_${idTugas}`).showModal()} className="btn btn-accent btn-xs">Isi</button>
        <dialog id={`my_modal_${idTugas}`} className="modal">
            <div className="modal-box flex flex-col items-center">
                
                <div className='flex flex-col gap-5'>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Jumlah Beban kerja 1 Tahun</span>
                        </div>
                        <input onChange={e => setValue(prev => ({...prev, jumlahBebanKerja:e.target.value}))} value={value.jumlahBebanKerja} type="number" placeholder="Masukan nilai disini" className="input input-bordered w-full max-w-xs" />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Waktu Penyelesaian (Dalam hitungan JAM)</span>
                        </div>
                        <input onChange={e => setValue(prev => ({...prev, waktuPenyelesaian:e.target.value}))} value={value.waktuPenyelesaian} type="number" placeholder="Masukan nilai disini" className="input input-bordered w-full max-w-xs" />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Waktu Efektif Penyelesaian</span>
                        </div>
                        <input onChange={e => setValue(prev => ({...prev, waktuEfektif:e.target.value}))} value={value.waktuEfektif} type="number" placeholder="Masukan nilai disini" className="input input-bordered w-full max-w-xs" />
                    </label>
                </div>
                <div className="modal-action justify-end flex flex-row gap-3">
                    <button onClick={handleSubmit} className="btn bg-violet-700 hover:bg-violet-400 text-white">Simpan</button>
                    <button onClick={closeModal} className="btn">Batal</button>
                    
                </div>
            </div>
        </dialog>
    </>
  )
}

export default ModalUraianTugas