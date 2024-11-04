"use client"
import { hapusTugas } from '@/app/actions/hapusTugas';
import React, { useState } from 'react'
import { MdDelete } from "react-icons/md";


const ButtonHapusTugas = ({tugas, idJabatan}) => {

    const [isSubmit, setIsSubmit] = useState(false)
    

    const handleHapus = async () => {
        setIsSubmit(true)
        const response = await hapusTugas(tugas.id, idJabatan)
        if (response) {
            alert("Data berhasil di Hapus! 🧨")
            setIsSubmit(false)
            document.getElementById(`modal_delete_tugas_${tugas.id}`).close()
        }
        setIsSubmit(false)
    }

  return (
    <>
    <MdDelete onClick={() => document.getElementById(`modal_delete_tugas_${tugas.id}`).showModal()} className="text-red-400 hover:text-red-600 cursor-pointer" />

    <dialog id={`modal_delete_tugas_${tugas.id}`} className="modal">
            <div className="modal-box">
                
                <h3 className="font-bold text-lg text-center ">Warning!.</h3>

                <p>Apakah anda yaking ingin menghapus: <br/><br/> {tugas.namaTugas}</p>
                <div className="modal-action justify-center flex flex-row gap-3">

                    {isSubmit ? 
                    (
                        <span className="loading loading-spinner text-accent"></span>
                    )
                    :
                    (
                        <>
                            <button onClick={handleHapus} className="btn text-black bg-red-500 hover:bg-red-800 hover:text-white">Hapus</button>
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

export default ButtonHapusTugas