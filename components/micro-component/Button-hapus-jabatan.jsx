'use client'
import { deleteJabatanById } from '@/app/actions/deleteJabatanById';
import React from 'react'
import { MdDelete } from "react-icons/md";

const ButtonHapusJabatan = ({id, namaJabtan}) => {

    const handleHapus = async (id) => {

        await deleteJabatanById(id)
        document.getElementById(`my_modal_${id}`).close()
    }
  return (
    <>
        <MdDelete onClick={()=>document.getElementById(`my_modal_${id}`).showModal()} className='text-red-400 hover:text-red-600 cursor-pointer' />
        
        
        <dialog id={`my_modal_${id}`} className="modal">
            <div className="modal-box">
                {/* <form method="dialog" className='flex justify-end items-start'>
                    <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                </form> */}
                <h3 className="font-bold text-lg">Warning!</h3>
                <p className="py-4">Apakah anda yakin ingin menghapus jabatan {namaJabtan}</p>
                <div className="modal-action justify-end flex flex-row gap-3">
                    <button onClick={()=> handleHapus(id)} className="btn">Hapus</button>
                    <form method="dialog">
                        <button className="btn">Batal</button>
                    </form>
                </div>
            </div>
        </dialog>
    </>
  )
}
// 

export default ButtonHapusJabatan