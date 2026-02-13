"use client"
import React, { useState, useEffect } from 'react';
import { 
  FileText, Send, Clock, CheckCircle2, AlertCircle, 
  Upload, ArrowRightLeft, Plus, Search, X, ChevronDown
} from 'lucide-react';

const MutasiOPD = () => {
  const [activeTab, setActiveTab] = useState('pengajuan');
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Efek simulasi loading awal
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // State Form
  const [formData, setFormData] = useState({
    nip: '',
    jenis: 'Antar OPD',
    tujuan: '',
    alasan: ''
  });

  const daftarInstansi = [
    "Dinas Kesehatan",
    "Dinas Pendidikan dan Kebudayaan",
    "Dinas Komunikasi dan Informatika",
    "Badan Kepegawaian Daerah",
    "Sekretariat Daerah",
    "Inspektorat Daerah"
  ];

  const historyMutasi = [
    { id: 'TRX001', nama: 'Bambang Heru', nip: '19880211001', jenis: 'Antar OPD', status: 'Revisi', tgl: '12 Feb 2026', catatan: 'Dokumen SK pangkat terakhir kurang jelas (blur).', waktuUpdate: '14 Feb 2026 09:00' },
    { id: 'TRX002', nama: 'Siska Amelia', nip: '19920514002', jenis: 'Internal OPD', status: 'Proses', tgl: '10 Feb 2026', catatan: null, waktuUpdate: '11 Feb 2026 15:30' },
    { id: 'TRX003', nama: 'Andi Wijaya', nip: '19850320003', jenis: 'Antar OPD', status: 'Approved', tgl: '05 Feb 2026', catatan: 'Mutasi disetujui, SK sedang dicetak.', waktuUpdate: '06 Feb 2026 10:00' },
    { id: 'TRX004', nama: 'Rina Puspita', nip: '19900101004', jenis: 'Antar OPD', status: 'Proses', tgl: '01 Feb 2026', catatan: null, waktuUpdate: '02 Feb 2026 08:45' },
    { id: 'TRX005', nama: 'Dedi Kurniawan', nip: '19870612005', jenis: 'Internal OPD', status: 'Ditolak', tgl: '28 Jan 2026', catatan: 'Formasi pada unit kerja tujuan sudah penuh.', waktuUpdate: '30 Jan 2026 13:20' },
  ];

  const filteredHistory = historyMutasi.filter(item => 
    item.nama.toLowerCase().includes(searchHistory.toLowerCase()) || 
    item.nip.includes(searchHistory)
  );

  const handleHistoryClick = (item) => {
    if (item.status === 'Revisi') {
      setFormData({
        nip: item.nip,
        jenis: item.jenis,
        tujuan: "Dinas Kesehatan",
        alasan: 'Perbaikan dokumen sesuai instruksi revisi.'
      });
      setActiveTab('pengajuan');
    } else {
      setSelectedHistory(item);
      setIsModalOpen(true);
    }
  };

  // --- SKELETON COMPONENTS ---
  const FormSkeleton = () => (
    <div className="h-full w-full grid grid-cols-12 gap-6 overflow-hidden animate-pulse">
      <div className="col-span-8 h-full bg-[#1a1a1e]/20 border border-white/5 p-8 rounded-[2.5rem]">
        <div className="flex gap-4 mb-8"><div className="w-12 h-12 bg-white/5 rounded-2xl"></div><div className="space-y-2"><div className="w-32 h-4 bg-white/5 rounded"></div><div className="w-48 h-2 bg-white/5 rounded"></div></div></div>
        <div className="grid grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className={`space-y-2 ${i > 2 ? 'col-span-2' : ''}`}><div className="w-20 h-2 bg-white/5 rounded"></div><div className="w-full h-12 bg-white/5 rounded-xl"></div></div>)}
        </div>
      </div>
      <div className="col-span-4 h-full bg-[#1a1a1e]/20 border border-white/5 p-8 rounded-[2.5rem] space-y-4">
        <div className="w-32 h-4 bg-white/5 rounded mb-6"></div>
        {[1,2,3].map(i => <div key={i} className="w-full h-16 bg-white/5 rounded-2xl"></div>)}
        <div className="w-full h-14 bg-white/5 rounded-2xl mt-auto"></div>
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="space-y-3 animate-pulse">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="bg-[#1a1a1e]/10 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <div className="w-12 h-12 bg-white/5 rounded-2xl"></div>
            <div className="space-y-2"><div className="w-40 h-4 bg-white/5 rounded"></div><div className="w-24 h-2 bg-white/5 rounded"></div></div>
          </div>
          <div className="w-20 h-4 bg-white/5 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col overflow-hidden animate-in fade-in duration-700 relative">
      
      {/* --- MODAL DETAIL STATUS --- */}
      {isModalOpen && selectedHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#1a1a1e] border border-white/10 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-gray-500 hover:text-white transition-colors"><X size={20}/></button>
            <div className="text-center space-y-4">
                <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center border ${
                    selectedHistory.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                    selectedHistory.status === 'Ditolak' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                    'bg-blue-500/10 border-blue-500/20 text-blue-500'
                }`}>
                    {selectedHistory.status === 'Approved' ? <CheckCircle2 size={32} /> : 
                     selectedHistory.status === 'Ditolak' ? <AlertCircle size={32} /> : <Clock size={32} />}
                </div>
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">{selectedHistory.status}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">ID Pengajuan: {selectedHistory.id}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-left space-y-3">
                    <div><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Nama Pegawai</p><p className="text-xs text-white font-bold">{selectedHistory.nama}</p></div>
                    <div><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Update Terakhir</p><p className="text-xs text-white/80">{selectedHistory.waktuUpdate}</p></div>
                    {selectedHistory.catatan && (
                        <div className="pt-2 border-t border-white/5">
                            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1">Catatan Admin Induk</p>
                            <p className="text-xs text-gray-300 italic leading-relaxed">"{selectedHistory.catatan}"</p>
                        </div>
                    )}
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-row items-center justify-between px-8 py-6 shrink-0 ">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Mutasi Pegawai</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Manajemen Pengajuan Perpindahan Tugas Aparatur</p>
        </div>

        <div className="flex items-center gap-4">
          {activeTab === 'status' && (
            <div className="relative animate-in slide-in-from-right-4">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
              <input 
                type="text" 
                placeholder="Cari Nama / NIP..." 
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] text-white focus:outline-none focus:border-[#6d28d9]/50 w-64 transition-all"
              />
            </div>
          )}
          <div className="flex gap-1 p-1 bg-black/20 border border-white/10 rounded-xl backdrop-blur-xl">
            <button onClick={() => {setActiveTab('pengajuan'); setIsLoading(true);}} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${activeTab === 'pengajuan' ? 'bg-[#6d28d9] text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}`}><Plus size={12} /> Pengajuan</button>
            <button onClick={() => {setActiveTab('status'); setIsLoading(true);}} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${activeTab === 'status' ? 'bg-[#6d28d9] text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}`}><Clock size={12} /> Riwayat</button>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className={`flex-1 overflow-hidden relative px-8 ${activeTab === 'pengajuan' && "pb-4"}`}>
        {isLoading ? (
          activeTab === 'pengajuan' ? <FormSkeleton /> : <ListSkeleton />
        ) : (
          activeTab === 'pengajuan' ? (
            <div className="h-full w-full grid grid-cols-12 gap-6 overflow-hidden">
              <div className="col-span-8 h-full">
                <div className="bg-[#1a1a1e]/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-8 shrink-0">
                    <div className="p-3 bg-[#6d28d9]/10 rounded-2xl border border-[#6d28d9]/20 text-[#6d28d9]"><ArrowRightLeft size={24} /></div>
                    <div><h4 className="text-sm font-bold text-white uppercase tracking-tight">Formulir Permohonan</h4><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Data ini akan diverifikasi oleh Admin Induk</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 flex-1 content-start">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Cari Pegawai (NIP)</label>
                      <div className="relative"><Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" /><input type="text" value={formData.nip} onChange={(e) => setFormData({...formData, nip: e.target.value})} placeholder="Masukkan NIP Pegawai..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#6d28d9]/50 transition-all" /></div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Jenis Mutasi</label>
                      <div className="relative"><select value={formData.jenis} onChange={(e) => setFormData({...formData, jenis: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none focus:border-[#6d28d9]/50 appearance-none cursor-pointer"><option className="bg-[#1a1a1e]">Antar OPD</option><option className="bg-[#1a1a1e]">Internal OPD</option></select><ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" /></div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Instansi Tujuan</label>
                      <div className="relative"><select value={formData.tujuan} onChange={(e) => setFormData({...formData, tujuan: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none focus:border-[#6d28d9]/50 appearance-none cursor-pointer"><option value="" className="bg-[#1a1a1e]">-- Pilih Instansi Tujuan --</option>{daftarInstansi.map((instansi, i) => (<option key={i} value={instansi} className="bg-[#1a1a1e]">{instansi}</option>))}</select><ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" /></div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Alasan Perpindahan</label>
                      <textarea rows="4" value={formData.alasan} onChange={(e) => setFormData({...formData, alasan: e.target.value})} placeholder="Jelaskan alasan mutasi secara mendetail..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none focus:border-[#6d28d9]/50 transition-all resize-none"></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-4 h-full flex flex-col">
                <div className="bg-[#1a1a1e]/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl h-full flex flex-col">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-6 shrink-0">Persyaratan Dokumen</h4>
                  <div className="space-y-4 flex-1 overflow-hidden">
                    {[ 'Surat Permohonan', 'SK Pangkat Terakhir', 'Surat Bebas Temuan' ].map((doc, idx) => (
                      <div key={idx} className="group relative">
                        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl group-hover:bg-[#6d28d9]/5 group-hover:border-[#6d28d9]/30 transition-all">
                          <div className="flex items-center gap-3"><FileText size={18} className="text-gray-500 group-hover:text-[#6d28d9]" /><span className="text-[10px] font-bold text-gray-300 uppercase">{doc}</span></div>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" /><Upload size={14} className="text-gray-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-4 bg-[#6d28d9] hover:bg-[#7c3aed] text-white rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#6d28d9]/20 shrink-0 uppercase tracking-[0.2em] text-[10px] font-black">Kirim Pengajuan <Send size={14} /></button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-3">
                {filteredHistory.length > 0 ? filteredHistory.map((item) => (
                  <div key={item.id} onClick={() => handleHistoryClick(item)} className="bg-[#1a1a1e]/20 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.03] transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${item.status === 'Revisi' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : item.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : item.status === 'Ditolak' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                        {item.status === 'Revisi' ? <AlertCircle size={20} /> : item.status === 'Approved' ? <CheckCircle2 size={20} /> : item.status === 'Ditolak' ? <X size={20} /> : <Clock size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3"><h4 className="text-sm font-bold text-white">{item.nama}</h4><span className="text-[8px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-gray-400 font-mono tracking-tighter">{item.id}</span></div>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">{item.jenis} • {item.tgl}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      {item.catatan && (<div className="hidden lg:block max-w-[250px]"><p className={`text-[9px] italic leading-relaxed line-clamp-2 ${item.status === 'Ditolak' ? 'text-red-400/80' : 'text-amber-500/80'}`}>"{item.catatan}"</p></div>)}
                      <div className="text-right min-w-[100px]"><span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'Revisi' ? 'text-amber-500' : item.status === 'Approved' ? 'text-emerald-500' : item.status === 'Ditolak' ? 'text-red-500' : 'text-blue-500'}`}>{item.status}</span></div>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-64 opacity-20"><Search size={48} strokeWidth={1} /><p className="text-[10px] font-black uppercase tracking-[0.4em] mt-4">Data tidak ditemukan</p></div>
                )}
              </div>
            </div>
          )
        )}
      </div>
      <style jsx>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; }.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(109, 40, 217, 0.3); }`}</style>
    </div>
  );
};

export default MutasiOPD;