import { prisma } from "@/app/lib/db";
import React from "react";

// helper function
function getYearsFromNowToNextFive() {

    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let i = 0; i < 5; i++) {
        years.push(currentYear + i);
    }

    return years;
}

// helper function
function hitungAbk(data){
    if (data.length === 0) {
        return 0
    }else{
        return Math.round(data.reduce((total, tugas) => total + tugas.KebutuhanPegawai, 0))
    }
}

// helper function
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

// helper function
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


// main component
const ProyeksiPegawaiRoleOpd = async () => {
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
                                            <td className="border-r text-center">{hitungAbk(kepala.jabatan.tugas)}</td>
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
                                                        <td className="border-r text-center">{hitungAbk(kabag.jabatan.tugas)}</td>
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
                                                                        <td className="border-r text-center">{hitungAbk(kasubag.jabatan.tugas)}</td>
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
                                                                                        <td className="border-r text-center">{hitungAbk(bawahanS1[0].jabatan.tugas)}</td>
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
                                                                                        <td className="border-r text-center">{hitungAbk(bawahanD3[0].jabatan.tugas)}</td>
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
                                                                                        <td className="border-r text-center">{hitungAbk(bawahanSMA[0].jabatan.tugas)}</td>
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

export default ProyeksiPegawaiRoleOpd


// import { prisma } from "@/app/lib/db";
// import React from "react";

// // --- HELPER FUNCTIONS (Tetap sama) ---
// function getYearsFromNowToNextFive() {
//     const currentYear = new Date().getFullYear();
//     const years = [];
//     for (let i = 0; i < 5; i++) { years.push(currentYear + i); }
//     return years;
// }

// function hitungAbk(data) {
//     if (data.length === 0) return 0;
//     return Math.round(data.reduce((total, tugas) => total + tugas.KebutuhanPegawai, 0));
// }

// const cekJumlahPensiun = (pegawai, tahun) => {
//     let jumlah = 0;
//     pegawai.map(item => { if (item.tahunPensiun === tahun) jumlah++; });
//     return jumlah > 0 ? jumlah : '-';
// };

// const cekKebutuhanPegawai = (pegawai, tahun) => {
//     let jumlah = 0;
//     pegawai.map(item => { if (item.tahunKebutuhan === tahun) jumlah++; });
//     return jumlah > 0 ? jumlah : '-';
// }

// // --- MAIN COMPONENT ---
// const ProyeksiPegawaiRoleOpd = async () => {
//     const getTahun = getYearsFromNowToNextFive();
    
//     // Prisma Fetching (Logika Database Anda)
//     const jabatan = await prisma.jabatan.findMany({
//         include: {
//             _count: { select: { pegawai: true } },
//             pegawai: { include: { pendidikan: true, bawahan: true } },
//             tugas: true
//         }
//     });

//     const allPegawai = await prisma.pegawai.findMany({
//         include: {
//             jabatan: { include: { tugas: true, _count: { select: { pegawai: true } } } },
//             pendidikan: true
//         },
//     });

//     const pegawaiMap = new Map();
//     allPegawai.forEach((pegawaiItem) => pegawaiMap.set(pegawaiItem.id, { ...pegawaiItem, bawahan: [] }));
//     const rootPegawai = [];
//     pegawaiMap.forEach((pegawaiItem) => {
//         if (pegawaiItem.atasanId) {
//             const atasan = pegawaiMap.get(pegawaiItem.atasanId);
//             if (atasan) atasan.bawahan.push(pegawaiItem);
//         } else {
//             rootPegawai.push(pegawaiItem);
//         }
//     });

//     const pegawai = rootPegawai;

//     return (
//         <div className="w-full min-h-screen bg-[#212126] text-white p-4 md:p-8 relative overflow-hidden">
//             {/* Grainy Effect Overlay */}
//             <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
//                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
//             </div>

//             {/* Header Section */}
//             <div className="relative z-10 mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
//                 <div>
//                     <h2 className="text-3xl font-black italic tracking-tighter">PROYEKSI <span className="text-[#6d28d9]">BEZETTING.</span></h2>
//                     <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Analisis Kebutuhan & Pensiun Pegawai</p>
//                 </div>

//                 <div className="flex flex-wrap gap-4 bg-white/[0.03] border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
//                     <div className="flex items-center gap-2">
//                         <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
//                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pensiun</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <div className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
//                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Kebutuhan</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Table Container */}
//             <div className="relative z-10 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="border-b border-white/10 bg-white/[0.03]">
//                                 <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Pos</th>
//                                 <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest min-w-[300px]">Unit Organisasi & Jabatan</th>
//                                 <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Bezetting</th>
//                                 <th className="p-4 text-[10px] font-black text-[#6d28d9] uppercase tracking-widest text-center">ABK</th>
//                                 {getTahun.map((tahun) => (
//                                     <th key={tahun} className="p-4 text-[10px] font-black text-red-500/80 uppercase tracking-widest text-center border-l border-white/5">{tahun}</th>
//                                 ))}
//                                 {getTahun.map((tahun) => (
//                                     <th key={`req-${tahun}`} className="p-4 text-[10px] font-black text-yellow-500/80 uppercase tracking-widest text-center border-l border-white/5">{tahun}</th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-white/5">
//                             {pegawai.map((kepala, idx) => (
//                                 <React.Fragment key={idx}>
//                                     {/* Row Style: Level 1 */}
//                                     <tr className="group hover:bg-white/[0.03] transition-colors">
//                                         <td className="p-4 text-xs font-black text-[#6d28d9]">01</td>
//                                         <td className="p-4">
//                                             <div className="text-sm font-bold uppercase tracking-tight">{kepala.jabatan.namaJabatan}</div>
//                                         </td>
//                                         <td className="p-4 text-center font-mono text-sm">{kepala.jabatan._count.pegawai}</td>
//                                         <td className="p-4 text-center font-mono text-sm text-[#6d28d9]">{hitungAbk(kepala.jabatan.tugas)}</td>
//                                         {/* Tahun Pensiun Cells */}
//                                         {getTahun.map((t, i) => (
//                                             <td key={i} className={`p-4 text-center border-l border-white/5 ${cekJumlahPensiun(pegawai, t) !== '-' ? 'bg-red-500/10 text-red-500 font-bold' : 'text-gray-600'}`}>
//                                                 {cekJumlahPensiun(pegawai, t)}
//                                             </td>
//                                         ))}
//                                         {/* Tahun Kebutuhan Cells */}
//                                         {getTahun.map((t, i) => (
//                                             <td key={i} className={`p-4 text-center border-l border-white/5 ${cekKebutuhanPegawai(pegawai, t) !== '-' ? 'bg-yellow-500/10 text-yellow-500 font-bold' : 'text-gray-600'}`}>
//                                                 {cekKebutuhanPegawai(pegawai, t)}
//                                             </td>
//                                         ))}
//                                     </tr>

//                                     {/* Recursive rendering for Bawahan can follow the same glass styling */}
//                                     {kepala.bawahan.map((kabag, kIdx) => (
//                                         <tr key={kIdx} className="group hover:bg-white/[0.03] transition-colors border-l-2 border-[#6d28d9]/20">
//                                             <td className="p-4 text-xs font-black text-gray-600 pl-6">—</td>
//                                             <td className="p-4 pl-8">
//                                                 <div className="text-xs font-semibold text-gray-300 uppercase">{kabag.jabatan.namaJabatan}</div>
//                                             </td>
//                                             {/* ... (Ulangi pola <td> untuk data lainnya) ... */}
//                                         </tr>
//                                     ))}
//                                 </React.Fragment>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProyeksiPegawaiRoleOpd;

// import { prisma } from "@/app/lib/db";
// import React from "react";

// // --- HELPER FUNCTIONS ---
// function getYearsFromNowToNextFive() {
//     const currentYear = new Date().getFullYear();
//     const years = [];
//     for (let i = 0; i < 5; i++) { years.push(currentYear + i); }
//     return years;
// }

// function hitungAbk(data) {
//     if (!data || data.length === 0) return 0;
//     return Math.round(data.reduce((total, tugas) => total + tugas.KebutuhanPegawai, 0));
// }

// const cekJumlahPensiun = (pegawai, tahun) => {
//     let jumlah = 0;
//     pegawai.forEach(item => { if (item.tahunPensiun === tahun) jumlah++; });
//     return jumlah > 0 ? jumlah : '-';
// };

// const cekKebutuhanPegawai = (pegawai, tahun) => {
//     let jumlah = 0;
//     pegawai.forEach(item => { if (item.tahunKebutuhan === tahun) jumlah++; });
//     return jumlah > 0 ? jumlah : '-';
// }

// // --- MAIN COMPONENT ---
// const ProyeksiPegawaiRoleOpd = async () => {
//     const getTahun = getYearsFromNowToNextFive();
    
//     // Fetching Data
//     const allPegawai = await prisma.pegawai.findMany({
//         include: {
//             jabatan: {
//                 include: {
//                     tugas: true,
//                     _count: { select: { pegawai: true } }
//                 }
//             },
//             pendidikan: true
//         },
//     });

//     // Hirarki Mapping
//     const pegawaiMap = new Map();
//     allPegawai.forEach((pegawaiItem) => pegawaiMap.set(pegawaiItem.id, { ...pegawaiItem, bawahan: [] }));
    
//     const rootPegawai = [];
//     pegawaiMap.forEach((pegawaiItem) => {
//         if (pegawaiItem.atasanId) {
//             const atasan = pegawaiMap.get(pegawaiItem.atasanId);
//             if (atasan) atasan.bawahan.push(pegawaiItem);
//         } else {
//             rootPegawai.push(pegawaiItem);
//         }
//     });

//     return (
//         <div className="w-full min-h-screen bg-[#212126] text-white p-4 md:p-8 relative overflow-hidden">
//             {/* Grainy Effect Overlay */}
//             <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
//                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
//             </div>

//             {/* Header */}
//             <div className="relative z-10 mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
//                 <div>
//                     <h2 className="text-3xl font-black italic tracking-tighter uppercase">Proyeksi <span className="text-[#6d28d9]">Pegawai.</span></h2>
//                     <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Monitoring Bezetting & ABK 5 Tahun Kedepan</p>
//                 </div>

//                 <div className="flex flex-wrap gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
//                     <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
//                         <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
//                         <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Pensiun</span>
//                     </div>
//                     <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
//                         <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
//                         <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">Kebutuhan</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Table Container */}
//             <div className="relative z-10 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.01] backdrop-blur-3xl shadow-2xl">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="border-b border-white/10 bg-white/[0.03]">
//                                 <th className="p-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">LVL</th>
//                                 <th className="p-5 text-[10px] font-black text-gray-500 uppercase tracking-widest min-w-[320px]">Unit Kerja / Jabatan</th>
//                                 <th className="p-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center bg-white/[0.02]">Saat Ini</th>
//                                 <th className="p-5 text-[10px] font-black text-[#6d28d9] uppercase tracking-widest text-center bg-[#6d28d9]/5">ABK</th>
//                                 {getTahun.map((tahun) => (
//                                     <th key={`h-p-${tahun}`} className="p-5 text-[10px] font-black text-red-400 uppercase tracking-widest text-center border-l border-white/5">{tahun}</th>
//                                 ))}
//                                 {getTahun.map((tahun) => (
//                                     <th key={`h-k-${tahun}`} className="p-5 text-[10px] font-black text-yellow-400 uppercase tracking-widest text-center border-l border-white/5">{tahun}</th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-white/5 font-mono">
//                             {rootPegawai.map((kepala, idx) => (
//                                 <React.Fragment key={`kepala-${idx}`}>
//                                     {/* --- LEVEL 1 (KEPALA) --- */}
//                                     <tr className="group hover:bg-[#6d28d9]/5 transition-all">
//                                         <td className="p-5 text-[10px] font-black text-[#6d28d9]">01</td>
//                                         <td className="p-5">
//                                             <div className="text-sm font-black text-white uppercase tracking-tight group-hover:translate-x-1 transition-transform">{kepala.jabatan.namaJabatan}</div>
//                                             <div className="text-[9px] text-gray-500 font-bold mt-1 uppercase italic tracking-wider">{kepala.nama}</div>
//                                         </td>
//                                         <td className="p-5 text-center text-sm font-bold bg-white/[0.01]">{kepala.jabatan._count.pegawai}</td>
//                                         <td className="p-5 text-center text-sm font-bold text-[#6d28d9] bg-[#6d28d9]/5">{hitungAbk(kepala.jabatan.tugas)}</td>
//                                         {getTahun.map((t, i) => (
//                                             <td key={`p1-${i}`} className={`p-5 text-center border-l border-white/5 ${cekJumlahPensiun(rootPegawai, t) !== '-' ? 'bg-red-500/20 text-red-400 font-black' : 'text-gray-700'}`}>
//                                                 {cekJumlahPensiun(rootPegawai, t)}
//                                             </td>
//                                         ))}
//                                         {getTahun.map((t, i) => (
//                                             <td key={`k1-${i}`} className={`p-5 text-center border-l border-white/5 ${cekKebutuhanPegawai(rootPegawai, t) !== '-' ? 'bg-yellow-500/20 text-yellow-400 font-black' : 'text-gray-700'}`}>
//                                                 {cekKebutuhanPegawai(rootPegawai, t)}
//                                             </td>
//                                         ))}
//                                     </tr>

//                                     {/* --- LEVEL 2 (KABAG) --- */}
//                                     {kepala.bawahan.map((kabag, kabagIdx) => (
//                                         <React.Fragment key={`kabag-frag-${kabagIdx}`}>
//                                             <tr className="group hover:bg-white/[0.03] transition-all bg-white/[0.01]">
//                                                 <td className="p-5 text-[10px] font-black text-orange-500/50 pl-8">02</td>
//                                                 <td className="p-5 pl-10 border-l border-[#6d28d9]/20">
//                                                     <div className="text-[13px] font-bold text-gray-300 uppercase tracking-tight group-hover:text-white transition-colors">{kabag.jabatan.namaJabatan}</div>
//                                                 </td>
//                                                 <td className="p-5 text-center text-xs text-gray-400">{kabag.jabatan._count.pegawai}</td>
//                                                 <td className="p-5 text-center text-xs text-[#6d28d9]/70">{hitungAbk(kabag.jabatan.tugas)}</td>
//                                                 {getTahun.map((t, i) => (
//                                                     <td key={`p2-${i}`} className={`p-5 text-center border-l border-white/5 ${cekJumlahPensiun(kepala.bawahan, t) !== '-' ? 'bg-red-500/10 text-red-400/80 font-bold' : 'text-gray-800'}`}>
//                                                         {cekJumlahPensiun(kepala.bawahan, t)}
//                                                     </td>
//                                                 ))}
//                                                 {getTahun.map((t, i) => (
//                                                     <td key={`k2-${i}`} className={`p-5 text-center border-l border-white/5 ${cekKebutuhanPegawai(kepala.bawahan, t) !== '-' ? 'bg-yellow-500/10 text-yellow-400/80 font-bold' : 'text-gray-800'}`}>
//                                                         {cekKebutuhanPegawai(kepala.bawahan, t)}
//                                                     </td>
//                                                 ))}
//                                             </tr>

//                                             {/* --- LEVEL 3 (KASUBAG) --- */}
//                                             {kabag.bawahan.map((kasubag, kasubagIdx) => (
//                                                 <tr key={`kasubag-${kasubagIdx}`} className="group hover:bg-white/[0.04] transition-all bg-black/20">
//                                                     <td className="p-4 text-[9px] font-black text-emerald-500/40 pl-12">03</td>
//                                                     <td className="p-4 pl-16 border-l border-emerald-500/10">
//                                                         <div className="text-[11px] font-medium text-gray-500 uppercase group-hover:text-gray-300 transition-colors">{kasubag.jabatan.namaJabatan}</div>
//                                                     </td>
//                                                     <td className="p-4 text-center text-[11px] text-gray-600">{kasubag.jabatan._count.pegawai}</td>
//                                                     <td className="p-4 text-center text-[11px] text-[#6d28d9]/40">{hitungAbk(kasubag.jabatan.tugas)}</td>
//                                                     {getTahun.map((t, i) => (
//                                                         <td key={`p3-${i}`} className={`p-4 text-center border-l border-white/5 ${cekJumlahPensiun(kabag.bawahan, t) !== '-' ? 'bg-red-500/5 text-red-500/50 font-medium' : 'text-gray-900'}`}>
//                                                             {cekJumlahPensiun(kabag.bawahan, t)}
//                                                         </td>
//                                                     ))}
//                                                     {getTahun.map((t, i) => (
//                                                         <td key={`k3-${i}`} className={`p-4 text-center border-l border-white/5 ${cekKebutuhanPegawai(kabag.bawahan, t) !== '-' ? 'bg-yellow-500/5 text-yellow-500/50 font-medium' : 'text-gray-900'}`}>
//                                                             {cekKebutuhanPegawai(kabag.bawahan, t)}
//                                                         </td>
//                                                     ))}
//                                                 </tr>
//                                             ))}
//                                         </React.Fragment>
//                                     ))}
//                                 </React.Fragment>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Footer Style Tag */}
//             <div className="mt-8 flex justify-end">
//                 <span className="text-[8px] font-mono text-gray-600 tracking-[0.4em] uppercase">Data Projection Algorithm v2.1</span>
//             </div>
//         </div>
//     );
// };

// export default ProyeksiPegawaiRoleOpd;