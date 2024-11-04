'use client'
import { addJabatan } from '@/app/actions/addJabatan'
import React, { useRef, useState } from 'react'

const FormInputJabatan = () => {

    const ref = useRef(null)
    const [isSubmit, setIsSubmit] = useState(false)
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true)
        const data = new FormData(ref.current)
        await addJabatan(data)
        ref.current.reset()
        setIsSubmit(false)
    }

  return (
    <form  ref={ref} onSubmit={handleSubmit} className='flex flex-col gap-5 w-64 items-center'>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Jabatan</span>
                </div>
                    <input required name="input-jabatan" type="text" placeholder="Masukan Jenis Jabatan" className="input input-bordered w-full max-w-xs" />
                   
                
            </label>
            
            <div className='flex justify-center w-full'>
                {isSubmit ? 
                    (<span className="loading loading-spinner text-accent"></span>)
                    :
                    (<button  type='submit' className="btn btn-accent w-full">Tambah</button>)
                }
            </div>
        </form>
  )
}

export default FormInputJabatan