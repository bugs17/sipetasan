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
                    pendidikan:true,
                    bawahan:true
                }
            },
            tugas:true
        }
    })

    let pegawai = []
    const allPegawai = await prisma.pegawai.findMany({
        include: {
            jabatan: {
                include:{
                    tugas:true,
                    _count:{
                        select:{
                            pegawai:true
                        }
                    }
                }
            },
            pendidikan:true
        },
    });

    // Step 2: Index semua pegawai berdasarkan ID untuk akses cepat
    const pegawaiMap = new Map();
    allPegawai.forEach((pegawaiItem) => pegawaiMap.set(pegawaiItem.id, { ...pegawaiItem, bawahan: [] }));

    // Step 3: Buat hirarki dengan menambahkan pegawai ke `bawahan` atasan mereka
    const rootPegawai = [];

    pegawaiMap.forEach((pegawaiItem) => {
        if (pegawaiItem.atasanId) {
            const atasan = pegawaiMap.get(pegawaiItem.atasanId);
            if (atasan) {
                atasan.bawahan.push(pegawaiItem);
            }
        } else {
            rootPegawai.push(pegawaiItem); // Pegawai tanpa atasan (teratas)
        }
    });

    pegawai = rootPegawai;
    

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


   const cekKebutuhanPegawai = (pegawai, tahun) => {
    let jumlah = 0;
    pegawai.map(item => {
        if (item.tahunKebutuhan === tahun) {
            jumlah++
        }
    })

    if (jumlah > 0) {
        return jumlah
    }else{
        return '-'
    }
   }


    
    function hitungAbk(data){
        if (data.length === 0) {
            return 0
        }else{
            return Math.round(data.reduce((total, tugas) => total + tugas.KebutuhanPegawai, 0))
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
                        {pegawai.length > 0 &&
                            pegawai.map((kepala, index) => 
                                (
                                <tbody key={index}>
                                    <tr  className="bg-base-200 border-b border-gray-300">
                                        <td className="border-r border-gray-300 text-center text-violet-500">#</td>
                                        <td className="border-r border-gray-300 font-semibold">{kepala.jabatan.namaJabatan}</td>
                                        <td className="border-r border-gray-300 text-center">{kepala.jabatan._count.pegawai}</td>
                                        <td className="border-r text-center">{kepala.jabatan._count.pegawai - hitungAbk(kepala.jabatan.tugas)}</td>
                                        {getTahun.map((tahun, index) => (
                                            <td key={index} className={`border-r text-center  ${cekJumlahPensiun(pegawai, tahun) !== '-' ? 'text-black bg-red-500 font-semibold' : 'text-slate-800'}`}>
                                                <div className='tooltip' data-tip={`Pegawai yang pensiun di tahun ${tahun}`}>
                                                    {cekJumlahPensiun(pegawai, tahun)}
                                                </div>
                                            </td>
                                        ))}
                                        {getTahun.map((tahun, index) => (
                                            <td key={index + 1} className={`border-r text-center  ${cekKebutuhanPegawai(pegawai, tahun) !== '-' ? 'text-black bg-yellow-500 font-semibold' : 'text-slate-800'} `}>
                                                <div className='tooltip' data-tip={`Pegawai yang dibutuhkan di tahun ${tahun}`}>
                                                    {cekKebutuhanPegawai(pegawai, tahun)}
                                                </div>
                                            </td>
                                        ))}

                                    </tr>

                                    {kepala.bawahan.length > 0 && (
                                        kepala.bawahan.map((kabag, index) => 
                                            (
                                                <React.Fragment key={index}>
                                                    <tr key={index} className="bg-base-200 border-b border-gray-300">
                                                    <td className="border-r border-gray-300 text-center text-orange-500">#</td>
                                                    <td className="border-r border-gray-300 font-semibold">{kabag.jabatan.namaJabatan}</td>
                                                    <td className="border-r border-gray-300 text-center">{kabag.jabatan._count.pegawai}</td>
                                                    <td className="border-r text-center">{kabag.jabatan._count.pegawai - hitungAbk(kabag.jabatan.tugas)}</td>
                                                    {getTahun.map((tahun, index) => (
                                                        <td key={index} className={`border-r text-center  ${cekJumlahPensiun(kepala.bawahan, tahun) !== '-' ? 'text-black bg-red-500 font-semibold' : 'text-slate-800'}`}>
                                                            <div className='tooltip' data-tip={`Pegawai yang pensiun di tahun ${tahun}`}>
                                                                {cekJumlahPensiun(kepala.bawahan, tahun)}
                                                            </div>
                                                        </td>
                                                    ))}
                                                    {getTahun.map((tahun, index) => (
                                                        <td key={index + 1} className={`border-r text-center  ${cekKebutuhanPegawai(kepala.bawahan, tahun) !== '-' ? 'text-black bg-yellow-500 font-semibold' : 'text-slate-800'} `}>
                                                            <div className='tooltip' data-tip={`Pegawai yang dibutuhkan di tahun ${tahun}`}>
                                                                {cekKebutuhanPegawai(kepala.bawahan, tahun)}
                                                            </div>
                                                        </td>
                                                    ))}
                                                    </tr>
                                                    {kabag.bawahan.length > 0 &&
                                                        kabag.bawahan.map((kasubag, index) => (
                                                            <React.Fragment key={index}>
                                                                <tr key={index} className="bg-base-200 border-b border-gray-300">
                                                                    <td className="border-r border-gray-300 text-center text-lime-600">#</td>
                                                                    <td className="border-r border-gray-300 font-semibold">{kasubag.jabatan.namaJabatan}</td>
                                                                    <td className="border-r border-gray-300 text-center">{kasubag.jabatan._count.pegawai}</td>
                                                                    <td className="border-r text-center">{kasubag.jabatan._count.pegawai - hitungAbk(kasubag.jabatan.tugas)}</td>
                                                                    {getTahun.map((tahun, index) => (
                                                                        <td key={index} className={`border-r text-center  ${cekJumlahPensiun(kabag.bawahan, tahun) !== '-' ? 'text-black bg-red-500 font-semibold' : 'text-slate-800'}`}>
                                                                            <div className='tooltip' data-tip={`Pegawai yang pensiun di tahun ${tahun}`}>
                                                                                {cekJumlahPensiun(kabag.bawahan, tahun)}
                                                                            </div>
                                                                        </td>
                                                                    ))}
                                                                    {getTahun.map((tahun, index) => (
                                                                        <td key={index + 1} className={`border-r text-center  ${cekKebutuhanPegawai(kabag.bawahan, tahun) !== '-' ? 'text-black bg-yellow-500 font-semibold' : 'text-slate-800'} `}>
                                                                            <div className='tooltip' data-tip={`Pegawai yang dibutuhkan di tahun ${tahun}`}>
                                                                                {cekKebutuhanPegawai(kabag.bawahan, tahun)}
                                                                            </div>
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                                {kasubag.bawahan.length > 0 && (() => {
                                                                    const bawahanS1 = kasubag.bawahan.filter(item => item.pendidikan.namaPendidikan === "S1")
                                                                    const bawahanD3 = kasubag.bawahan.filter(item => item.pendidikan.namaPendidikan === "D3")
                                                                    const bawahanSMA = kasubag.bawahan.filter(item => item.pendidikan.namaPendidikan === "SMA")

                                                                    return (
                                                                        <>
                                                                            {bawahanS1.length > 0 && (
                                                                                <tr key={bawahanS1[0].id} className="bg-base-200 border-b border-gray-300">
                                                                                    <td className="border-r border-gray-300 text-center text-teal-600">#</td>
                                                                                    <td className="border-r border-gray-300 text-xs">{bawahanS1[0].jabatan.namaJabatan}</td>
                                                                                    <td className="border-r border-gray-300 text-center">{bawahanS1.length}</td>
                                                                                    <td className="border-r text-center">{bawahanS1.length - hitungAbk(bawahanS1[0].jabatan.tugas)}</td>
                                                                                    {getTahun.map((tahun, index) => (
                                                                                        <td key={index} className={`border-r text-center  ${cekJumlahPensiun(bawahanS1, tahun) !== '-' ? 'text-black bg-red-500 font-semibold' : 'text-slate-800'}`}>
                                                                                            <div className='tooltip' data-tip={`Pegawai yang pensiun di tahun ${tahun}`}>
                                                                                                {cekJumlahPensiun(bawahanS1, tahun)}
                                                                                            </div>
                                                                                        </td>
                                                                                    ))}
                                                                                    {getTahun.map((tahun, index) => (
                                                                                        <td key={index + 1} className={`border-r text-center  ${cekKebutuhanPegawai(bawahanS1, tahun) !== '-' ? 'text-black bg-yellow-500 font-semibold' : 'text-slate-800'} `}>
                                                                                            <div className='tooltip' data-tip={`Pegawai yang dibutuhkan di tahun ${tahun}`}>
                                                                                                {cekKebutuhanPegawai(bawahanS1, tahun)}
                                                                                            </div>
                                                                                        </td>
                                                                                    ))}
                                                                                </tr>)}
                                                                            
                                                                            {bawahanD3.length > 0 && (
                                                                                <tr key={bawahanD3[0].id} className="bg-base-200 border-b border-gray-300">
                                                                                    <td className="border-r border-gray-300 text-center text-xs text-teal-600">#</td>
                                                                                    <td className="border-r border-gray-300 text-xs">{bawahanD3[0].jabatan.namaJabatan}</td>
                                                                                    <td className="border-r border-gray-300 text-center">{bawahanD3.length}</td>
                                                                                    <td className="border-r text-center">{bawahanD3.length - hitungAbk(bawahanD3[0].jabatan.tugas)}</td>
                                                                                    {getTahun.map((tahun, index) => (
                                                                                        <td key={index} className={`border-r text-center  ${cekJumlahPensiun(bawahanD3, tahun) !== '-' ? 'text-black bg-red-500 font-semibold' : 'text-slate-800'}`}>
                                                                                            <div className='tooltip' data-tip={`Pegawai yang pensiun di tahun ${tahun}`}>
                                                                                                {cekJumlahPensiun(bawahanD3, tahun)}
                                                                                            </div>
                                                                                        </td>
                                                                                    ))}
                                                                                    {getTahun.map((tahun, index) => (
                                                                                        <td key={index + 1} className={`border-r text-center  ${cekKebutuhanPegawai(bawahanD3, tahun) !== '-' ? 'text-black bg-yellow-500 font-semibold' : 'text-slate-800'} `}>
                                                                                            <div className='tooltip' data-tip={`Pegawai yang dibutuhkan di tahun ${tahun}`}>
                                                                                                {cekKebutuhanPegawai(bawahanD3, tahun)}
                                                                                            </div>
                                                                                        </td>
                                                                                    ))}
                                                                                </tr>
                                                                            )}

                                                                            {bawahanSMA.length > 0 && (
                                                                                <tr key={bawahanSMA[0].id} className="bg-base-200 border-b border-gray-300">
                                                                                    <td className="border-r border-gray-300 text-center text-xs text-teal-600">#</td>
                                                                                    <td className="border-r border-gray-300 text-xs">{bawahanSMA[0].jabatan.namaJabatan}</td>
                                                                                    <td className="border-r border-gray-300 text-center">{bawahanSMA.length}</td>
                                                                                    <td className="border-r text-center">{bawahanSMA.length - hitungAbk(bawahanSMA[0].jabatan.tugas)}</td>
                                                                                    {getTahun.map((tahun, index) => (
                                                                                        <td key={index} className={`border-r text-center  ${cekJumlahPensiun(bawahanSMA, tahun) !== '-' ? 'text-black bg-red-500 font-semibold' : 'text-slate-800'}`}>
                                                                                            <div className='tooltip' data-tip={`Pegawai yang pensiun di tahun ${tahun}`}>
                                                                                                {cekJumlahPensiun(bawahanSMA, tahun)}
                                                                                            </div>
                                                                                        </td>
                                                                                    ))}
                                                                                    {getTahun.map((tahun, index) => (
                                                                                        <td key={index + 1} className={`border-r text-center  ${cekKebutuhanPegawai(bawahanSMA, tahun) !== '-' ? 'text-black bg-yellow-500 font-semibold' : 'text-slate-800'} `}>
                                                                                            <div className='tooltip' data-tip={`Pegawai yang dibutuhkan di tahun ${tahun}`}>
                                                                                                {cekKebutuhanPegawai(bawahanSMA, tahun)}
                                                                                            </div>
                                                                                        </td>
                                                                                    ))}
                                                                                </tr>
                                                                            )}

                                                                        </>
                                                                    )

                                                                })()}
                                                            </React.Fragment>
                                                        ))
                                                    }
                                                </React.Fragment>
                                            )
                                        )
                                    )}
                                </tbody>
                                )
                            )
                        }
            </table>
        </div>
        </div>
    </div>
  )
}

export default page