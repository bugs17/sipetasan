"use client"
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Search, X, 
  FileText, ExternalLink, Check, RotateCcw,
  Calendar, User, ArrowRight, Eye, ShieldCheck, Ban, Loader2,
  Maximize2, Minimize2
} from 'lucide-react';

const AdminIndukMutasi = () => {
  const [activeTab, setActiveTab] = useState('pending'); 
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeDocId, setActiveDocId] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [documentStatus, setDocumentStatus] = useState({});
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => { setIsLoading(true); clearTimeout(timer); };
  }, [activeTab]);

  const [allData, setAllData] = useState([
    { 
      id: 'MUT-2026-001', 
      nama: 'Bambang Heru', 
      nip: '19880211001', 
      opdAsal: 'Dinas Kesehatan', 
      opdTujuan: 'Dinas Pendidikan',
      tglKirim: '12 Feb 2026',
      status: 'pending',
      dokumen: [
        { id: 'd1', nama: 'Surat Permohonan', file: 'sp_bambang.pdf', status: 'idle' },
        { id: 'd2', nama: 'SK Pangkat Terakhir', file: 'sk_pangkat.pdf', status: 'idle' },
        { id: 'd3', nama: 'Surat Bebas Temuan', file: 'bebas_temuan.pdf', status: 'idle' }
      ]
    },
    { 
      id: 'MUT-2026-003', 
      nama: 'Andi Wijaya', 
      nip: '19850320003', 
      opdAsal: 'Sekretariat Daerah', 
      opdTujuan: 'Inspektorat',
      tglKirim: '10 Feb 2026',
      status: 'approved',
      catatanAdmin: "Seluruh berkas sesuai dengan persyaratan.",
      dokumen: [
        { id: 'd1', nama: 'Surat Permohonan', file: 'sp_andi.pdf', status: 'approved' },
        { id: 'd2', nama: 'SK Pangkat Terakhir', file: 'sk_pangkat_andi.pdf', status: 'approved' },
        { id: 'd3', nama: 'Surat Bebas Temuan', file: 'bebas_temuan_andi.pdf', status: 'approved' }
      ]
    },
    { 
      id: 'MUT-2026-004', 
      nama: 'Siti Aminah', 
      nip: '19920515004', 
      opdAsal: 'Dinas Perhubungan', 
      opdTujuan: 'Bappeda',
      tglKirim: '09 Feb 2026',
      status: 'rejected',
      catatanAdmin: "Formasi pada OPD tujuan sudah penuh untuk tahun anggaran ini.",
      dokumen: [
        { id: 'd1', nama: 'Surat Permohonan', file: 'sp_siti.pdf', status: 'rejected' },
        { id: 'd2', nama: 'SK Pangkat Terakhir', file: 'sk_siti.pdf', status: 'approved' },
        { id: 'd3', nama: 'Surat Bebas Temuan', file: 'temuan_siti.pdf', status: 'approved' }
      ]
    },
    { 
      id: 'MUT-2026-005', 
      nama: 'Rizky Pratama', 
      nip: '19900828005', 
      opdAsal: 'Dinas Sosial', 
      opdTujuan: 'Dinas Kominfo',
      tglKirim: '08 Feb 2026',
      status: 'revised',
      catatanAdmin: "SK Pangkat Terakhir yang diunggah sudah kadaluarsa, mohon unggah SK terbaru.",
      dokumen: [
        { id: 'd1', nama: 'Surat Permohonan', file: 'sp_rizky.pdf', status: 'approved' },
        { id: 'd2', nama: 'SK Pangkat Terakhir', file: 'sk_pangkat_old.pdf', status: 'revised' },
        { id: 'd3', nama: 'Surat Bebas Temuan', file: 'bebas_rizky.pdf', status: 'approved' }
      ]
    }
  ]);

  const filteredData = allData.filter(item => {
    const matchTab = activeTab === 'pending' ? item.status === 'pending' : item.status !== 'pending';
    const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || item.nip.includes(searchQuery);
    return matchTab && matchSearch;
  });

  const handleOpenReview = (request) => {
    setSelectedRequest(request);
    setAdminNote(request.catatanAdmin || "");
    setActiveDocId(request.dokumen[0]?.id);
    const initialStatus = {};
    request.dokumen.forEach(doc => initialStatus[doc.id] = doc.status);
    setDocumentStatus(initialStatus);
  };

  const toggleDocStatus = (e, docId, status) => {
    e.stopPropagation();
    if (selectedRequest.status !== 'pending') return;
    setDocumentStatus(prev => ({ ...prev, [docId]: status }));
  };

  const activeDocData = selectedRequest?.dokumen.find(d => d.id === activeDocId);
  const allDocsApproved = selectedRequest && selectedRequest.dokumen.every(doc => documentStatus[doc.id] === 'approved');
  const anyDocRevised = selectedRequest && selectedRequest.dokumen.some(doc => documentStatus[doc.id] === 'revised');

  return (
    <div className="h-full w-full flex flex-col overflow-hidden text-white font-sans">
      
      {/* --- HEADER DASHBOARD --- */}
      <div className="px-8 pt-8 shrink-0 flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">Verifikasi Induk</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Panel Kendali Mutasi Antar Satuan Kerja</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input 
              type="text" 
              placeholder="Cari NIP / Nama..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] w-64 focus:outline-none focus:border-[#6d28d9]/50 transition-all text-white"
            />
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-hidden p-8 flex flex-col gap-6">
        <div className="flex justify-end gap-8 border-b border-white/5 shrink-0">
          {['pending', 'completed'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-[#6d28d9]' : 'text-gray-600 hover:text-gray-400'}`}
            >
              {tab === 'pending' ? 'Perlu Review' : 'Selesai Verifikasi'}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#6d28d9] shadow-[0_0_10px_#6d28d9]" />}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
             <div className="space-y-4 animate-pulse">
                {[1,2,3].map(i => <div key={i} className="h-24 bg-white/[0.02] rounded-[2rem] border border-white/5" />)}
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredData.map((item) => (
                <div 
                  key={item.id}
                  className="group bg-[#1a1a1e]/40 backdrop-blur-2xl hover:bg-[#1a1a1e]/60 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between transition-all shadow-xl"
                >
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center justify-center p-4 bg-black/60 rounded-2xl border border-white/5 min-w-[100px]">
                      <span className="text-[10px] font-black text-[#6d28d9]">{item.id.split('-')[2]}</span>
                      <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest text-center">Antrian</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.nama}</h4>
                        {item.status !== 'pending' && (
                          <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${
                            item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                            item.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {item.status}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                        <User size={10} /> {item.nip} • <Calendar size={10} /> {item.tglKirim}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 px-6 border-l border-white/5">
                      <div className="text-right">
                        <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Asal</p>
                        <p className="text-[10px] text-gray-300 font-bold">{item.opdAsal}</p>
                      </div>
                      <ArrowRight size={14} className="text-[#6d28d9]" />
                      <div>
                        <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Tujuan</p>
                        <p className="text-[10px] text-gray-300 font-bold">{item.opdTujuan}</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleOpenReview(item)}
                    className={`flex items-center gap-3 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${item.status === 'pending' ? 'bg-[#6d28d9]/10 hover:bg-[#6d28d9] text-[#6d28d9] hover:text-white border-[#6d28d9]/20' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
                  >
                    {item.status === 'pending' ? 'Periksa Berkas' : 'Lihat Detail'} <Eye size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- FULL SCREEN MODAL REVIEW --- */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#0f0f11] animate-in fade-in zoom-in-95 duration-300">
          
          {/* Header Modal Full Width */}
          <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#6d28d9]/20 rounded-xl text-[#6d28d9]"><ShieldCheck size={20} /></div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Verifikator Induk System</h3>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Peninjauan Berkas Mutasi Antar Satuan Kerja</p>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-white/10 mx-2" />
              <div className="flex flex-col">
                <span className="text-[10px] text-[#6d28d9] font-black uppercase tracking-widest">{selectedRequest.nama}</span>
                <span className="text-[9px] text-gray-500 font-medium tracking-tight">ID: {selectedRequest.id} — NIP: {selectedRequest.nip}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedRequest(null)} 
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-red-500/20"
            >
              Tutup Panel <X size={16}/>
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-row">
            {/* Left Sidebar: Document Checklist (Wider for better readability) */}
            <div className="w-[450px] border-r border-white/5 flex flex-col bg-black/20">
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
                <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <FileText size={12} /> Persyaratan Dokumen
                </h5>
                
                {selectedRequest.dokumen.map((doc) => (
                  <div 
                    key={doc.id} 
                    onClick={() => setActiveDocId(doc.id)}
                    className={`p-5 rounded-[1.8rem] border transition-all cursor-pointer relative group ${
                      activeDocId === doc.id 
                      ? 'bg-[#6d28d9]/10 border-[#6d28d9] shadow-[0_0_25px_rgba(109,40,217,0.15)]' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1 group-hover:text-[#6d28d9] transition-colors">Digital Archive</span>
                        <span className="text-xs font-bold text-white tracking-wide">{doc.nama}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {documentStatus[doc.id] === 'approved' && <div className="p-1 bg-emerald-500 rounded-full text-white"><Check size={10} strokeWidth={4} /></div>}
                        {documentStatus[doc.id] === 'revised' && <div className="p-1 bg-amber-500 rounded-full text-white"><RotateCcw size={10} strokeWidth={4} /></div>}
                        {documentStatus[doc.id] === 'rejected' && <div className="p-1 bg-red-500 rounded-full text-white"><X size={10} strokeWidth={4} /></div>}
                      </div>
                    </div>

                    {selectedRequest.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button 
                          onClick={(e) => toggleDocStatus(e, doc.id, 'approved')}
                          className={`py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${documentStatus[doc.id] === 'approved' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/5 text-gray-500 hover:text-emerald-400 border border-white/5'}`}
                        >
                          <Check size={12}/> Valid
                        </button>
                        <button 
                          onClick={(e) => toggleDocStatus(e, doc.id, 'revised')}
                          className={`py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${documentStatus[doc.id] === 'revised' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-white/5 text-gray-500 hover:text-amber-400 border border-white/5'}`}
                        >
                          <RotateCcw size={12}/> Revisi
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-6 border-t border-white/5">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Catatan Verifikasi Internal</label>
                  <textarea 
                    readOnly={selectedRequest.status !== 'pending'}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Contoh: Berkas tidak sesuai format asli atau masa berlaku habis..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] p-5 text-xs text-white outline-none h-32 resize-none focus:border-[#6d28d9]/50 transition-all placeholder:text-gray-700 font-medium leading-relaxed"
                  />
                </div>
              </div>

              {/* Action Footer Sidebar */}
              {selectedRequest.status === 'pending' && (
                <div className="p-6 bg-black/40 border-t border-white/5 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button className="flex-1 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-600/10">
                      <Ban size={14} /> Reject
                    </button>
                    <button 
                      disabled={!anyDocRevised}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${anyDocRevised ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/20' : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'}`}
                    >
                      <RotateCcw size={14} /> Revisi
                    </button>
                  </div>
                  <button 
                    disabled={!allDocsApproved}
                    className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${allDocsApproved ? 'bg-[#6d28d9] text-white shadow-[0_0_30px_rgba(109,40,217,0.3)]' : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'}`}
                  >
                    <CheckCircle2 size={16} /> Finalize & Approve Mutasi
                  </button>
                </div>
              )}
            </div>

            {/* Right Side: High Performance Document Viewer */}
            <div className="flex-1 bg-[#050505] flex flex-col relative">
              {activeDocData ? (
                <>
                  {/* Floating Toolbar Viewer */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-6 py-3 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
                    <div className="flex items-center gap-4 border-r border-white/10 pr-4">
                      <div className="p-1.5 bg-red-500/20 text-red-500 rounded-lg"><FileText size={16}/></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-white tracking-wider">{activeDocData.nama}</span>
                        <span className="text-[8px] text-gray-500 font-bold">{activeDocData.file}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pl-2 text-[9px] font-black uppercase text-gray-400 tracking-widest">
                       Preview Mode <Maximize2 size={12} className="ml-1" />
                    </div>
                  </div>

                  <div className="flex-1 p-8 pt-24 overflow-hidden flex flex-col items-center">
                    {/* Simulated PDF Paper */}
                    <div className="w-full max-w-4xl h-full bg-[#1a1a1e] rounded-t-3xl border-x border-t border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                       <Loader2 size={40} className="text-[#6d28d9] animate-spin mb-6 relative z-10" />
                       <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-600 relative z-10">Decrypting Document...</p>
                       <div className="mt-8 px-8 py-3 bg-white/5 rounded-xl border border-white/5 text-[9px] font-bold text-gray-500 uppercase tracking-widest relative z-10">
                          Secure Content — Internal Government Use Only
                       </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                   <FileText size={80} strokeWidth={1} className="mb-6" />
                   <h2 className="text-xl font-black uppercase tracking-[0.5em]">No Selection</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; }.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(109, 40, 217, 0.3); }`}</style>
    </div>
  );
};

export default AdminIndukMutasi;