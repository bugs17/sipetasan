import React from 'react'
import RightSidebarPetajabatan from '@/components/micro-component/Right-sidebar-petajabatan';
import PetaJabatan from '@/components/micro-component/Peta-jabatan';
import { prisma } from '../lib/db';
import { auth } from "@clerk/nextjs/server";
import InstansiCard from '@/components/PetaJabatanInduk';
import ProyeksiInduk from '@/components/ProyeksiPegawaiInduk';

function potongKalimat(kalimat, max) {
    if (kalimat.length <= max) {
      return kalimat;
    }
    return kalimat.slice(0, max) + "...";
  }

const Home = async () => {
    const { userId } = auth();

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

    const user = await prisma.user.findFirst({
        where:{
            clerkUserId:userId
        }
    })

    const role = user.role

    const renderDashboard = () => {
        if (role === 'ADMIN_INDUK') {
            return <InstansiCard />
        }else if (role === 'ADMIN_OPD') {
            return <PetaJabatan />
        }else if (role === 'PIMPINAN') {
            return <div >Pimpinan dashboard</div>
        }
    }



    
  return (
      <>
        {role === 'ADMIN_OPD' && (
            <RightSidebarPetajabatan>
                <div className="space-y-4">
                {/* Header Kecil di dalam Sidebar */}
                <div className="px-1 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Ringkasan Formasi</span>
                    <span className="text-[9px] bg-[#6d28d9]/20 text-[#6d28d9] px-2 py-0.5 rounded-full border border-[#6d28d9]/30">
                    {jabatan.length} Jabatan
                    </span>
                </div>

                <div className="overflow-x-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
                    <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/[0.03]">
                        <th className="w-[50%] p-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Jabatan</th>
                        <th className="w-[10%] p-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">KJ</th>
                        <th className="w-[10%] p-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">B</th>
                        <th className="w-[10%] p-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">ABK</th>
                        <th className="w-[20%] p-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">+/-</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-white/[0.05]">
                        {jabatan.map((item, index) => {
                        const selisih = item._count.pegawai - Math.round(item.totalKebutuhanPegawai);
                        // Logika: Item ke-1 dan ke-2 (index 0 & 1) tooltipnya muncul ke bawah (top-10)
                        const isTopItem = index < 2;

                        return (
                            <tr key={item.id} className="group hover:bg-white/[0.04] transition-colors">
                            <td className="p-3 relative overflow-visible">
                                <div className="group/tooltip flex flex-col w-full cursor-help">
                                
                                {/* Teks Jabatan */}
                                <span className="text-[11px] font-bold text-gray-200 group-hover:text-[#6d28d9] transition-colors leading-tight truncate block w-[160px]">
                                    {item.namaJabatan}
                                </span>

                                {/* Custom Floating Tooltip (Dinamis) */}
                                <div className={`
                                    absolute left-4 z-[100] w-64 pointer-events-none 
                                    opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300
                                    ${isTopItem 
                                    ? 'top-10 translate-y-[-10px] group-hover/tooltip:translate-y-0' 
                                    : 'bottom-10 translate-y-2 group-hover/tooltip:translate-y-0'
                                    }
                                `}>
                                    <div className="bg-[#1a1a1e] border border-white/10 backdrop-blur-2xl p-3 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-2 border-l-[#6d28d9]">
                                    <p className="text-[10px] leading-relaxed text-gray-200 font-medium">
                                        {item.namaJabatan}
                                    </p>
                                    <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                        <span>Detail Jabatan</span>
                                        <span className="text-[#6d28d9]">Active</span>
                                    </div>
                                    </div>
                                    
                                    {/* Ekor Tooltip (Dinamis) */}
                                    <div className={`
                                    w-3 h-3 bg-[#1a1a1e] border-white/10 rotate-45 absolute left-4
                                    ${isTopItem 
                                        ? '-top-1.5 border-l border-t' 
                                        : '-bottom-1.5 border-r border-b'
                                    }
                                    `}></div>
                                </div>

                                <span className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-tighter">
                                    KJ: {item.kJ}
                                </span>
                                </div>
                            </td>
                            <td className="p-2 text-center text-[10px] font-mono text-gray-400">{item.kJ}</td>
                            <td className="p-2 text-center text-[10px] font-bold text-gray-300">{item._count.pegawai}</td>
                            <td className="p-2 text-center text-[10px] font-bold text-gray-300">{Math.round(item.totalKebutuhanPegawai)}</td>
                            <td className="p-2 text-center">
                                <span className={`inline-block min-w-[35px] text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                                    selisih < 0 ? 'text-red-400 bg-red-400/10' : selisih > 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-500 bg-gray-500/10'
                                }`}>
                                    {selisih > 0 ? `+${selisih}` : selisih}
                                </span>
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                </div>
                
                {/* Footer Info */}
                <p className="text-[9px] text-gray-600 italic px-2">
                    * B: Bezetting (Jumlah Saat Ini), ABK: Analisis Beban Kerja
                </p>
                </div>
            </RightSidebarPetajabatan>
            )}
        {/* <PetaJabatan /> */}
        {renderDashboard()}
    </>
   
  )
}

export default Home

