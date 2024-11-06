import React from 'react'
import RightSidebarPetajabatan from '@/components/micro-component/Right-sidebar-petajabatan';
import PetaJabatan from '@/components/micro-component/Peta-jabatan';
import { prisma } from './lib/db';

function potongKalimat(kalimat, max) {
    if (kalimat.length <= max) {
      return kalimat;
    }
    return kalimat.slice(0, max) + "...";
  }

const Home = async () => {

    const jabatan = await prisma.jabatan.findMany({
        include:{
            _count:{
                select:{
                    pegawai:true
                }
            },
            pegawai:{
                include:{
                    pendidikan:true
                }
            },
            tugas:true
        }
    })

    jabatan.forEach(jab => {
        jab.totalKebutuhanPegawai = jab.tugas.reduce((sum, tugas) => sum + tugas.KebutuhanPegawai, 0);
    });

    
  return (
      <>
        <RightSidebarPetajabatan>
            <div className="overflow-x-auto max-h-full pb-32">
                <table className="table table-xs table-pin-rows table-pin-cols">
                                <thead>
                                    <tr >
                                        <td className='py-4'>JABATAN</td>
                                        <td>KJ</td>
                                        <td>B</td>
                                        <td>ABK</td>
                                        <td>-/+</td>
                                    </tr>
                                </thead>

                                <tbody className=''>
                                    {jabatan.length > 0 &&
                                        jabatan.map(item => (
                                            <tr key={item.id} className='odd:bg-cyan-950 '>
                                                <td className="py-2">
                                                    <div className="tooltip tooltip-bottom flex justify-start items-center" data-tip={item.namaJabatan}>
                                                        {potongKalimat(item.namaJabatan, 25)}
                                                    </div>
                                                </td>
                                                <td>
                                                    {item.kJ}
                                                </td>
                                                <td>{item._count.pegawai}</td>
                                                <td>{Math.round(item.totalKebutuhanPegawai.toFixed(2))}</td>
                                                <td>{item._count.pegawai - Math.round(item.totalKebutuhanPegawai.toFixed(2))}</td>
                                            </tr>
                                        ))
                                    }
                                    
                                </tbody>
                                
                </table>
            </div>
        </RightSidebarPetajabatan>
        <PetaJabatan />
    </>
   
  )
}

export default Home

