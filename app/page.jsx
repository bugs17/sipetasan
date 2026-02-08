// import React from 'react'
// import RightSidebarPetajabatan from '@/components/micro-component/Right-sidebar-petajabatan';
// import PetaJabatan from '@/components/micro-component/Peta-jabatan';
// import { prisma } from '../lib/db';

// function potongKalimat(kalimat, max) {
//     if (kalimat.length <= max) {
//       return kalimat;
//     }
//     return kalimat.slice(0, max) + "...";
//   }

const Landing = async () => {

    // const jabatan = await prisma.jabatan.findMany({
    //     include:{
    //         _count:{
    //             select:{
    //                 pegawai:true
    //             }
    //         },
    //         pegawai:{
    //             include:{
    //                 pendidikan:true
    //             }
    //         },
    //         tugas:true
    //     }
    // })

    // jabatan.forEach(jab => {
    //     jab.totalKebutuhanPegawai = jab.tugas.reduce((sum, tugas) => sum + tugas.KebutuhanPegawai, 0);
    // });

    
  return (
      <div>
        Haloo from landing
      </div>
   
  )
}

export default Landing

