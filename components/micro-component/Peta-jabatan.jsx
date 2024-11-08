"use client"
import React, { useEffect, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Import Tree dari `react-organizational-chart` hanya di sisi client
const Tree = dynamic(() => import('react-organizational-chart').then(mod => mod.Tree), { ssr: false });
const TreeNode = dynamic(() => import('react-organizational-chart').then(mod => mod.TreeNode), { ssr: false });




const Kepala = ({ jabatan, nama, nip, kj, b, abk, kurleb }) => {
    return (
        <div
            
            className='inline-flex overflow-hidden flex-col rounded-md justify-center items-center border-[1px] border-violet-500'
        >
            <div className='flex flex-row'>
                <div className=''>
                <table className="table w-full ">
                    <thead className='bg-violet-500'>
                    <tr className="">
                        <th className="flex justify-center text-white">{jabatan}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="">
                            <td className="">
                                <div className='flex flex-col'>
                                    <span className='font-semibold text-white'>{nama}</span>
                                    <span className='font-mono text-white'>NIP. {nip}</span>
                                </div>
                            </td>
                            
                        </tr>
                    </tbody>
                </table>
                </div>
                <div className=''>
                    <table className="table w-full h-full">
                        <thead className='bg-violet-500'>
                        <tr >
                            <th className="flex justify-center text-white">KJ</th>
                            <th className="text-center align-middle text-white">B</th>
                            <th className="text-center align-middle text-white">ABK</th>
                            <th className="text-center align-middle text-white">-/+</th>
                            
                        </tr>
                        </thead>
                        <tbody>
                            <tr className='bg-violet-500'>
                                    <td className="text-white">{kj || 0}</td>
                                    <td className=" text-white">{b || 0}</td>
                                    <td className="text-white">{abk || 0}</td>
                                    <td className="text-white">{kurleb || 0}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Kabag = ({ jabatan, nama, nip, kj, b, abk, kurleb}) => {
    return (
        <div
            
            className={`inline-flex overflow-hidden flex-col rounded-md justify-center items-center border-[1px] border-orange-500 `}
        >
            <div className='flex flex-row'>
                <div className=''>
                <table className="table w-full ">
                    <thead className='bg-orange-500'>
                    <tr className="">
                        <th className="flex justify-center text-white">{jabatan}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="">
                            <td className="">
                                <div className='flex flex-col text-center'>
                                    <span className='font-semibold text-white'>{nama}</span>
                                    <span className='font-mono text-white'>NIP. {nip}</span>
                                </div>
                            </td>
                            
                        </tr>
                    </tbody>
                </table>
                </div>
                <div className=''>
                    <table className="table w-full h-full">
                        <thead className='bg-orange-500'>
                        <tr >
                            <th className="flex justify-center text-white">KJ</th>
                            <th className="text-center align-middle text-white">B</th>
                            <th className="text-center align-middle text-white">ABK</th>
                            <th className="text-center align-middle text-white">-/+</th>
                            
                        </tr>
                        </thead>
                        <tbody>
                            <tr className='bg-orange-500'>
                                    <td className="text-white">{kj || 0}</td>
                                    <td className=" text-white">{b || 0}</td>
                                    <td className="text-white">{abk || 0}</td>
                                    <td className="text-white">{kurleb || 0}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Kasubag = ({ jabatan, nama, nip, kj, b, abk, kurleb }) => {
    return (
        <div
            className={`inline-flex overflow-hidden flex-col rounded-md justify-center items-center border-[1px] border-lime-300 `}
        >
            <div className='flex flex-row'>
                <div className=''>
                <table className="table w-full ">
                    <thead className='bg-lime-600'>
                    <tr className="">
                        <th className="flex justify-center text-white">{jabatan}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="">
                            <td className="">
                                <div className='flex flex-col text-center'>
                                    <span className='font-semibold text-white'>{nama}</span>
                                    <span className='font-mono text-white'>NIP. {nip}</span>
                                </div>
                            </td>
                            
                        </tr>
                    </tbody>
                </table>
                </div>
                <div className=''>
                    <table className="table w-full h-full">
                        <thead className='bg-lime-600'>
                        <tr >
                            <th className="flex justify-center text-white">KJ</th>
                            <th className="text-center align-middle text-white">B</th>
                            <th className="text-center align-middle text-white">ABK</th>
                            <th className="text-center align-middle text-white">-/+</th>
                            
                        </tr>
                        </thead>
                        <tbody>
                            <tr className='bg-lime-600'>
                                    <td className="text-white">{kj || 0}</td>
                                    <td className=" text-white">{b || 0}</td>
                                    <td className="text-white">{abk || 0}</td>
                                    <td className="text-white">{kurleb || 0}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Staf = ({ jabatan, dataDiri, kj, b, abk, kurleb }) => {
    return (
        <div
            className={`inline-flex overflow-hidden flex-col rounded-md justify-center items-center border-[1px] border-slate-600 `}
        >
            <div className='flex flex-row'>
                <div className=''>
                <table className="table w-full ">
                    <thead className='bg-teal-600'>
                    <tr className="">
                        <th></th>
                        <th className="flex justify-center text-white">{jabatan}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dataDiri.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td> {/* Kolom nomor urut */}
                            <td className='flex flex-col'>
                                <span className='font-semibold text-white'>{item.nama}</span>
                                <span className='text-white'>NIP. {item.nip}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                <div className=''>
                    <table className="table w-full h-full">
                        <thead className='bg-teal-600'>
                        <tr >
                            <th className="flex justify-center text-white">KJ</th>
                            <th className="text-center align-middle text-white">B</th>
                            <th className="text-center align-middle text-white">ABK</th>
                            <th className="text-center align-middle text-white">-/+</th>
                            
                        </tr>
                        </thead>
                        <tbody>
                            <tr className='bg-teal-600'>
                                    <td className="text-white">{kj || 0}</td>
                                    <td className=" text-white">{b || 0}</td>
                                    <td className="text-white">{abk || 0}</td>
                                    <td className="text-white">{kurleb || 0}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const PetaJabatan = () => {

    const [pegawai, setPegawai] = useState([])

    useEffect(() => {
        const getPegawai = async () => {
            const url = "/api/pegawai"
            const response = await axios.get(url, {
                headers:{
                    'Accept':'application/json',
                }
            })

            if (response.status === 200) {
                setPegawai(response.data.pegawai)
            }
        }
        getPegawai()
    }, [])



function formatJabatan(jabatan) {
    if (jabatan.includes("KEPALA BAGIAN")) {
        return jabatan.replace("KEPALA BAGIAN", "KABAG");
    } else if (jabatan.includes("KEPALA SUB BAGIAN")) {
        return jabatan.replace("KEPALA SUB BAGIAN", "KASUBAG");
    }
    return jabatan; // Jika tidak mengandung "KEPALA BAGIAN" atau "KEPALA SUB BAGIAN", kembalikan string asli
}

function hitungAbk(data){
    if (data.length === 0) {
        return 0
    }else{
        return Math.round(data.reduce((total, tugas) => total + tugas.KebutuhanPegawai, 0))
    }
}


  return (
    <TransformWrapper
            initialScale={0.4}
            minScale={0.1}
            maxScale={5}
            centerZoomedOut
            wheel={{ step: 0.1 }}
            disablePadding
            
            smooth
            
            
        >
        {console.log(pegawai)}
            <TransformComponent wrapperStyle={{ cursor:'grab', overflow:'visible', width:'100%', height:'100%', }}>
                    {pegawai.length > 0 &&
                        pegawai.map((kepala) => (
                            <Tree key={kepala.id} nodePadding='10px' lineStyle='solid' lineWidth='2px' lineHeight='40px' lineBorderRadius="20px" lineColor="#8b5cf6" label={<Kepala kj={kepala.jabatan.kJ} b={kepala.jabatan._count.pegawai} abk={hitungAbk(kepala.jabatan.tugas)} kurleb={kepala.jabatan._count.pegawai - hitungAbk(kepala.jabatan.tugas)} jabatan={formatJabatan(kepala.jabatan.namaJabatan)} nama={kepala.nama} nip={kepala.nip} />}>
                                {kepala.bawahan.length > 0 &&
                                    kepala.bawahan.map((kabag) => (
                                        <TreeNode key={kabag.id} label={<Kabag  jabatan={formatJabatan(kabag.jabatan.namaJabatan)} nama={kabag.nama} nip={kabag.nip} kj={kabag.jabatan.kJ} b={kabag.jabatan._count.pegawai} abk={hitungAbk(kabag.jabatan.tugas)} kurleb={kabag.jabatan._count.pegawai - hitungAbk(kabag.jabatan.tugas)} />}>
                                            {kabag.bawahan.length > 0 &&
                                                kabag.bawahan.map((kasubag) => (
                                                    <TreeNode key={kasubag.id} label={<Kasubag jabatan={formatJabatan(kasubag.jabatan.namaJabatan)} nama={kasubag.nama} nip={kasubag.nip} kj={kasubag.jabatan.kJ} b={kasubag.jabatan._count.pegawai} abk={hitungAbk(kasubag.jabatan.tugas)} kurleb={kasubag.jabatan._count.pegawai - hitungAbk(kasubag.jabatan.tugas)} />}>
                                                        {kasubag.bawahan.length > 0 && (() => {


                                                            const bawahanS1 = kasubag.bawahan.filter(item => item.pendidikan.namaPendidikan === "S1")
                                                            const bawahanD3 = kasubag.bawahan.filter(item => item.pendidikan.namaPendidikan === "D3")
                                                            const bawahanSMA = kasubag.bawahan.filter(item => item.pendidikan.namaPendidikan === "SMA")

                                                            if(bawahanS1.length > 0){
                                                                return (<TreeNode  label={<Staf dataDiri={bawahanS1} kj={bawahanS1[0].jabatan.kJ} b={bawahanS1.length} jabatan={formatJabatan(bawahanS1[0].jabatan.namaJabatan)} abk={hitungAbk(bawahanS1[0].jabatan.tugas)} kurleb={bawahanS1.length - hitungAbk(bawahanS1[0].jabatan.tugas)} />} >
                                                                        {bawahanD3.length > 0 && (
                                                                            <TreeNode  label={<Staf dataDiri={bawahanD3} kj={bawahanD3[0].jabatan.kJ} b={bawahanD3.length} jabatan={formatJabatan(bawahanD3[0].jabatan.namaJabatan)} abk={hitungAbk(bawahanD3[0].jabatan.tugas)} kurleb={bawahanD3.length - hitungAbk(bawahanD3[0].jabatan.tugas)} />} >
                                                                                {bawahanSMA.length > 0 && (
                                                                                    <TreeNode  label={<Staf dataDiri={bawahanSMA} kj={bawahanSMA[0].jabatan.kJ} b={bawahanSMA.length} jabatan={formatJabatan(bawahanSMA[0].jabatan.namaJabatan)} abk={hitungAbk(bawahanSMA[0].jabatan.tugas)} kurleb={bawahanSMA.length - hitungAbk(bawahanSMA[0].jabatan.tugas)} />} ></TreeNode>
                                                                                )}
                                                                            </TreeNode>
                                                                        )}
                                                                        </TreeNode>)
                                                            }
                                                        })()
                                                        }

                                                        


                                                    </TreeNode>
                                                ))
                                            }
                                        </TreeNode>
                                    ))
                                }
                            </Tree>
                        ))
                    }
                    
            </TransformComponent>
        </TransformWrapper>
  )
}

export default PetaJabatan