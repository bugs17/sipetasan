import { prisma } from "@/app/lib/db";
import React from "react";
import FilterTahun from "./FilterTahun";

// helper function: Sekarang menerima parameter startYear
function getYearsFromNowToNextFive(startYear) {
    const years = [];
    for (let i = 0; i < 5; i++) {
        years.push(startYear + i);
    }
    return years;
}

// helper function
function hitungAbk(data){
    if (data.length === 0) return 0;
    return Math.round(data.reduce((total, tugas) => total + tugas.KebutuhanPegawai, 0));
}

// helper function
const cekJumlahPensiun = (pegawai, tahun) => {
    let jumlah = 0;
    pegawai.map(item => {
        if (item.tahunPensiun === tahun) {
            jumlah++;
        }
    })
    return jumlah > 0 ? jumlah : '-';
};

// helper function
const cekKebutuhanPegawai = (pegawai, tahun) => {
    let jumlah = 0;
    pegawai.map(item => {
        if (item.tahunKebutuhan === tahun) {
            jumlah++;
        }
    })
    return jumlah > 0 ? jumlah : '-';
}

// main component
const ProyeksiPegawaiRoleOpd2 = async ({ searchParams }) => {
    // Logika Filter Tahun
    const currentYear = new Date().getFullYear();
    const startYear = searchParams?.start ? parseInt(searchParams.start) : currentYear;
    const getTahun = getYearsFromNowToNextFive(startYear);

    // Opsi pilihan tahun untuk dropdown (2 tahun ke belakang, 3 tahun ke depan)
    const filterOptions = [2024, 2025, 2026, 2027, 2028];

    const jabatan = await prisma.jabatan.findMany({
        include:{
            _count:{ select:{ pegawai:true } },
            pegawai:{ include:{ pendidikan:true, bawahan:true } },
            tugas:true
        }
    });

    const allPegawai = await prisma.pegawai.findMany({
        include: {
            jabatan: {
                include:{
                    tugas:true,
                    _count:{ select:{ pegawai:true } }
                }
            },
            pendidikan:true
        },
    });

    const pegawaiMap = new Map();
    allPegawai.forEach((pegawaiItem) => pegawaiMap.set(pegawaiItem.id, { ...pegawaiItem, bawahan: [] }));

    const rootPegawai = [];
    pegawaiMap.forEach((pegawaiItem) => {
        if (pegawaiItem.atasanId) {
            const atasan = pegawaiMap.get(pegawaiItem.atasanId);
            if (atasan) atasan.bawahan.push(pegawaiItem);
        } else {
            rootPegawai.push(pegawaiItem);
        }
    });

    const pegawai = rootPegawai;
    
    return (
        <div className='w-full min-h-screen text-slate-300 p-4 font-sans'>
            {/* Header */}
             <div className="relative z-10 mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                 <div>
                     <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">Proyeksi <span className="text-[#6d28d9]">Pegawai.</span></h2>
                     <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Monitoring Bezetting & ABK 5 Tahun Kedepan ({startYear} - {startYear + 4})</p>
                 </div>

                 <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
                    {/* Memanggil Component Filter yang sudah kamu buat */}
                    <FilterTahun
                        currentYear={currentYear} 
                        filterOptions={filterOptions} 
                        startYear={startYear} 
                    />

                    <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />

                     <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                         <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                         <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Pensiun</span>
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                         <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                         <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">Kebutuhan</span>
                     </div>
                 </div>
             </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#161b22]/50 backdrop-blur-md shadow-2xl">
                <table className="table w-full border-collapse">
                    <thead className="bg-[#1c2128]">
                        <tr className="text-slate-500 text-[10px] font-black uppercase tracking-wider">
                            <th className="p-4 border-r border-white/5">#</th>
                            <th className="p-4 border-r border-white/5 min-w-[300px]">Nama Unit & Jabatan</th>
                            <th className="p-4 border-r border-white/5 text-center">Bez.</th>
                            <th className='p-4 border-r border-white/5 text-center'>ABK</th>
                            {getTahun.map((tahun) => (
                                <th key={tahun} className='p-4 border-r border-white/5 text-center bg-rose-500/10 text-rose-400 font-bold'>{tahun}</th>
                            ))}
                            {getTahun.map((tahun) => (
                                <th key={`req-${tahun}`} className='p-4 border-r border-white/5 text-center bg-amber-500/10 text-amber-400 font-bold'>{tahun}</th>
                            ))}
                        </tr>
                    </thead>
                    {pegawai.length > 0 && pegawai.map((kepala, index) => (
                        <tbody key={index} className="border-b border-white/5">
                            {/* LEVEL 1: KEPALA */}
                            <tr className="hover:bg-indigo-500/5 transition-colors border-b border-white/5">
                                <td className="p-4 text-center text-indigo-500 font-black border-r border-white/5">#</td>
                                <td className="p-4 font-black text-white border-r border-white/5 uppercase tracking-tight text-sm">{kepala.jabatan.namaJabatan}</td>
                                <td className="p-4 text-center border-r border-white/5 font-mono">{kepala.jabatan._count.pegawai}</td>
                                <td className="p-4 text-center border-r border-white/5 font-mono text-indigo-400">{hitungAbk(kepala.jabatan.tugas)}</td>
                                {getTahun.map((t, idx) => (
                                    <td key={idx} className={`p-4 text-center border-r border-white/5 font-bold ${cekJumlahPensiun([kepala], t) !== '-' ? 'bg-rose-500 text-white shadow-inner' : 'text-slate-700'}`}>
                                        {cekJumlahPensiun([kepala], t)}
                                    </td>
                                ))}
                                {getTahun.map((t, idx) => (
                                    <td key={idx} className={`p-4 text-center border-r border-white/5 font-bold ${cekKebutuhanPegawai([kepala], t) !== '-' ? 'bg-amber-500 text-black shadow-inner' : 'text-slate-700'}`}>
                                        {cekKebutuhanPegawai([kepala], t)}
                                    </td>
                                ))}
                            </tr>

                            {/* LEVEL 2: KABAG */}
                            {kepala.bawahan.length > 0 && kepala.bawahan.map((kabag, kabIdx) => (
                                <React.Fragment key={kabIdx}>
                                    <tr className="bg-white/[0.02] hover:bg-white/[0.05] transition-colors border-b border-white/5">
                                        <td className="p-4 text-center text-orange-500 font-bold border-r border-white/5">#</td>
                                        <td className="p-4 pl-10 font-bold text-slate-300 border-r border-white/5 text-xs uppercase">{kabag.jabatan.namaJabatan}</td>
                                        <td className="p-4 text-center border-r border-white/5 font-mono">{kabag.jabatan._count.pegawai}</td>
                                        <td className="p-4 text-center border-r border-white/5 font-mono text-orange-400">{hitungAbk(kabag.jabatan.tugas)}</td>
                                        {getTahun.map((t, idx) => (
                                            <td key={idx} className={`p-4 text-center border-r border-white/5 ${cekJumlahPensiun([kabag], t) !== '-' ? 'bg-rose-500/80 text-white font-black' : 'text-slate-700'}`}>
                                                {cekJumlahPensiun([kabag], t)}
                                            </td>
                                        ))}
                                        {getTahun.map((t, idx) => (
                                            <td key={idx} className={`p-4 text-center border-r border-white/5 ${cekKebutuhanPegawai([kabag], t) !== '-' ? 'bg-amber-500/80 text-black font-black' : 'text-slate-700'}`}>
                                                {cekKebutuhanPegawai([kabag], t)}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* LEVEL 3: KASUBAG */}
                                    {kabag.bawahan.length > 0 && kabag.bawahan.map((kasubag, kasIdx) => (
                                        <React.Fragment key={kasIdx}>
                                            <tr className="bg-white/[0.04] hover:bg-white/[0.07] transition-colors border-b border-white/5">
                                                <td className="p-4 text-center text-lime-500 border-r border-white/5">#</td>
                                                <td className="p-4 pl-16 font-semibold text-slate-400 border-r border-white/5 text-xs italic">{kasubag.jabatan.namaJabatan}</td>
                                                <td className="p-4 text-center border-r border-white/5 font-mono">{kasubag.jabatan._count.pegawai}</td>
                                                <td className="p-4 text-center border-r border-white/5 font-mono text-lime-400">{hitungAbk(kasubag.jabatan.tugas)}</td>
                                                {getTahun.map((t, idx) => (
                                                    <td key={idx} className={`p-4 text-center border-r border-white/5 ${cekJumlahPensiun([kasubag], t) !== '-' ? 'bg-rose-500/60 text-white font-black' : 'text-slate-800'}`}>
                                                        {cekJumlahPensiun([kasubag], t)}
                                                    </td>
                                                ))}
                                                {getTahun.map((t, idx) => (
                                                    <td key={idx} className={`p-4 text-center border-r border-white/5 ${cekKebutuhanPegawai([kasubag], t) !== '-' ? 'bg-amber-500/60 text-black font-black' : 'text-slate-800'}`}>
                                                        {cekKebutuhanPegawai([kasubag], t)}
                                                    </td>
                                                ))}
                                            </tr>

                                            {/* STAF: S1, D3, SMA */}
                                            {(() => {
                                                const types = [
                                                    { key: "S1", data: kasubag.bawahan.filter(i => i.pendidikan.namaPendidikan === "S1") },
                                                    { key: "D3", data: kasubag.bawahan.filter(i => i.pendidikan.namaPendidikan === "D3") },
                                                    { key: "SMA", data: kasubag.bawahan.filter(i => i.pendidikan.namaPendidikan === "SMA") }
                                                ];
                                                return types.map(group => group.data.length > 0 && (
                                                    <tr key={group.key} className="bg-black/20 hover:bg-black/40 transition-colors border-b border-white/5">
                                                        <td className="p-4 text-center text-teal-500 border-r border-white/5 text-[10px]">STAF</td>
                                                        <td className="p-4 pl-24 text-[11px] text-slate-500 border-r border-white/5 uppercase font-medium">
                                                            {group.data[0].jabatan.namaJabatan} <span className="text-teal-600 font-black ml-1">[{group.key}]</span>
                                                        </td>
                                                        <td className="p-4 text-center border-r border-white/5 font-mono text-xs">{group.data.length}</td>
                                                        <td className="p-4 text-center border-r border-white/5 font-mono text-xs text-teal-400">{hitungAbk(group.data[0].jabatan.tugas)}</td>
                                                        {getTahun.map((t, idx) => (
                                                            <td key={idx} className={`p-4 text-center border-r border-white/5 text-xs ${cekJumlahPensiun(group.data, t) !== '-' ? 'bg-rose-500/40 text-rose-200 font-bold' : 'text-slate-800'}`}>
                                                                {cekJumlahPensiun(group.data, t)}
                                                            </td>
                                                        ))}
                                                        {getTahun.map((t, idx) => (
                                                            <td key={idx} className={`p-4 text-center border-r border-white/5 text-xs ${cekKebutuhanPegawai(group.data, t) !== '-' ? 'bg-amber-500/40 text-amber-200 font-bold' : 'text-slate-800'}`}>
                                                                {cekKebutuhanPegawai(group.data, t)}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ));
                                            })()}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    ))}
                </table>
            </div>
        </div>
    );
};

export default ProyeksiPegawaiRoleOpd2;