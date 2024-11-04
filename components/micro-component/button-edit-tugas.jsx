"use client"
import { editTugas } from '@/app/actions/editTugas';
import React, { useState } from 'react'
import { MdEditDocument } from "react-icons/md";


const ButtonEditTugas = ({tugas, idJabatan}) => {

    const [uraianTugasInput, setUraianTugasInput] = useState(tugas.namaTugas)
    const [hasilKerjaInput, setHasilKerjaInput] = useState(tugas.hasil)
    const [isSubmit, setIsSubmit] = useState(false)

    const handleEdit = async () => {
        if (uraianTugasInput === '' || hasilKerjaInput === '') {
            alert("Form tidak boleh kosong isi dengan data yang ingin di perbaharui")
            return
        }
        setIsSubmit(true)

        const response = await editTugas(tugas.id, idJabatan, uraianTugasInput, hasilKerjaInput)

        if (response) {
            alert("Data berhasil di edit 😍")
            setIsSubmit(false)
            document.getElementById(`modal_add_tugas_${tugas.id}`).close()
        }else{
            alert("Gagal mengedit uraian tugas, coba lagi! jika terus terjadi laporkan masalah ini ke edmin induk")
            setIsSubmit(false)
        }
    }

  return (
    <>
        <MdEditDocument onClick={()=>document.getElementById(`modal_add_tugas_${tugas.id}`).showModal()} className="text-violet-400 hover:text-violet-600 cursor-pointer" />

        <dialog id={`modal_add_tugas_${tugas.id}`} className="modal">
            <div className="modal-box">
                
                <h3 className="font-bold text-lg text-center ">Edit URAIAN TUGAS.</h3>
                <div className='flex flex-col gap-3 pt-3'>
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Uraian Tugas</span>
                        </div>
                        <textarea value={uraianTugasInput} onChange={e => setUraianTugasInput(e.target.value)} required className="textarea textarea-bordered h-24" placeholder="URAIAN TUGAS"></textarea>
                    </label>
                    
                    <label className="form-control w-full max-w-full">
                            <div className="label">
                                <span className="label-text">Hasil Kerja </span>
                            </div>
                            <input value={hasilKerjaInput} onChange={e => setHasilKerjaInput(e.target.value)} required type="text" placeholder="Hasil" className="input input-bordered w-full" />
                    </label>
                </div>


                
                

                <div className="modal-action justify-center flex flex-row gap-3">

                    {isSubmit ? 
                        (
                            <span className="loading loading-spinner text-accent"></span>
                        )
                        :
                        (
                            <>
                                <button onClick={handleEdit} className="btn text-black bg-violet-600 hover:bg-violet-800 hover:text-white">Simpan</button>
                                <form method="dialog">
                                    <button className="btn">Batal</button>
                                </form>
                            </>
                        )
                    }
                </div>
                
            </div>
        </dialog>
    </>
  )
}

export default ButtonEditTugas