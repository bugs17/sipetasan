import React from 'react'
import { prisma } from '../lib/db';

function getYearsFromNowToNextFive() {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let i = 0; i < 5; i++) {
        years.push(currentYear + i);
    }

    return years;
}

const page = async () => {

    const getTahun = getYearsFromNowToNextFive()

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


    const cekJumlahPensiun = (pegawai, tahun) => {
        let jumlah = 0;
    
        pegawai.map(item => {
            if (item.tahunPensiun === tahun) {
                jumlah++;
            }
        })
    
        if (jumlah > 0) {
            return jumlah
        }else{
            return '-'
        }
    };

   const kebutuhan = await prisma.kebutuhanPegawai.findMany()

   const cekKebutuhanPegawai = (tahun, idJabatan) => {
    let jumlah = 0;
    kebutuhan.map(keb => {
        if (keb.tahunKebutuhan === tahun && keb.idJabatan === parseInt(idJabatan)) {
            jumlah = keb.jumlahKebutuhan
        }
    })

    if (jumlah > 0) {
        return jumlah
    }else{
        return '-'
    }
   }
    
    

  return (
    <div className='w-full h-full'>
        <div className='py-5 px-1 w-full h-auto flex flex-row justify-between items-center'>
            <div className='flex justify-center items-center w-full'>
                
            </div>
            <div className='flex flex-row gap-3 justify-center items-center w-full'>
                <div className='flex flex-row gap-2 items-center'>
                    <div className='h-3 w-3 rounded-full bg-red-500' />
                    <span className='text-xs text-white'>JUMLAH YANG AKAN PENSIUN</span>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                    <div className='h-3 w-3 rounded-full bg-yellow-500' />
                    <span className='text-xs text-white'>PEGAWAI YANG DIBUTUHKAN</span>
                </div>
            </div>
            <div className='flex flex-row gap-3 justify-center items-center w-full'>
                
            </div>
        </div>
        <div className='w-full overflow-y-auto py-8 px-3'>
        <div className="overflow-x-auto w-full rounded-lg border border-gray-300 ">
            <table className="table w-full ">
                <thead>
                    <tr className="border-b border-gray-300">
                        <th className="border-r border-gray-300"></th>
                        <th className="border-r border-gray-300 text-center align-middle text-white">NAMA UNIT ORGANISASI DAN NAMA JABATAN</th>
                        <th className="border-r border-gray-300 text-center align-middle text-white">BEZETTING PEGAWAI SAAT INI</th>
                        <th className='border-r border-gray-300 text-center align-middle text-white'>KEBUTUHAN PEGAWAI BERDASARKAN ABK</th>
                        {getTahun.map((tahun, index) => (
                            <th key={index} className='border-r border-gray-300 text-center align-middle text-white bg-red-600'>{tahun}</th>
                        ))}
                        {getTahun.map((tahun, index) => (
                            <th key={index + 1} className='border-r border-gray-300 text-center align-middle text-white bg-yellow-600'>{tahun}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                        
                        {jabatan.length > 0 &&
                            
                            jabatan.map((item, index) => (
                                <tr key={index} className="bg-base-200 border-b border-gray-300">
                                    <td className="border-r border-gray-300 text-center">{index + 1}</td>
                                    <td className="border-r border-gray-300">{item.namaJabatan}</td>
                                    <td className="border-r border-gray-300 text-center">{item.pegawai.length}</td>
                                    <td className="border-r text-center">{Math.round(item.totalKebutuhanPegawai.toFixed(2))}</td>
                                    {getTahun.map((tahun, index) => (
                                        <td key={index} className={`border-r text-center  ${cekJumlahPensiun(item.pegawai, tahun) !== '-' ? 'text-black bg-red-500 font-semibold' : 'text-slate-800'}`}>
                                            <div className='tooltip' data-tip={`Pegawai yang pensiun di tahun ${tahun}`}>
                                                {cekJumlahPensiun(item.pegawai, tahun)}
                                            </div>
                                        </td>
                                    ))}
                                    {getTahun.map((tahun, index) => (
                                        <td key={index + 1} className={`border-r text-center  ${cekKebutuhanPegawai(tahun, item.id) !== '-' ? 'text-black bg-yellow-500 font-semibold' : 'text-slate-800'} `}>
                                            <div className='tooltip' data-tip={`Pegawai yang dibutuhkan di tahun ${tahun}`}>
                                                {cekKebutuhanPegawai(tahun, item.id)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        
                        }
                        
                </tbody>
            </table>
        </div>
        </div>
    </div>
  )
}

export default page