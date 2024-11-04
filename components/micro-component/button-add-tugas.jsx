"use client"
import React from 'react'

const ButtonAddTugas = () => {
  return (
    <>
        <button onClick={()=>document.getElementById(`modal_add_tugas`).showModal()} className="btn text-black bg-violet-600 hover:bg-violet-800 hover:text-white">+ Tambah</button>

        <dialog id={`modal_add_tugas`} className="modal">
            <div className="modal-box">
                
                <h3 className="font-bold text-lg text-center ">Tambah URAIAN TUGAS.</h3>

                <div className='flex flex-col gap-3 pt-3'>
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Uraian Tugas</span>
                        </div>
                        <textarea className="textarea textarea-bordered h-24" placeholder="URAIAN TUGAS"></textarea>
                    </label>
                    
                    <label className="form-control w-full max-w-full">
                            <div className="label">
                                <span className="label-text">Hasil Kerja </span>
                            </div>
                            <input type="text" placeholder="Hasil" className="input input-bordered w-full" />
                    </label>
                </div>

                <div className="modal-action justify-center flex flex-row gap-3">
                    <button onClick={()=> {}} className="btn text-black bg-violet-600 hover:bg-violet-800 hover:text-white">Simpan</button>
                    <form method="dialog">
                        <button className="btn">Batal</button>
                    </form>
                </div>
            </div>
        </dialog>
    </>
  )
}

export default ButtonAddTugas