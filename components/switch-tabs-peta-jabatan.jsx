"use client";

import useTabsStore from "@/app/store/tabsStore";

const SwitchPetaJabatan = () => {
    const {activeTab, setActiveTab, disabledAll} = useTabsStore()
  return (
    <div className="flex flex-row w-full items-center justify-between">
        <div></div>
        <div></div>

    <div className={`flex items-center gap-1 p-1.5 rounded-[1.5rem] bg-[#1a1a1e]/80 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all group/tabs ${
  disabledAll ? "opacity-40 pointer-events-none grayscale" : "opacity-100"
}`}>
  
  {/* Tab Struktural */}
  <button
    disabled={disabledAll}
    onClick={() => setActiveTab('struktural')}
    className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 ${
      activeTab === 'struktural'
        ? "bg-[#6d28d9] text-white shadow-lg shadow-[#6d28d9]/20"
        : "bg-transparent text-white/40 hover:bg-white/5 hover:text-white/70"
    }`}
  >
    <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'struktural' ? "bg-white animate-pulse" : "bg-white/20"}`} />
    Struktural
  </button>

  {/* Tab Fungsional */}
  <button
    disabled={disabledAll}
    onClick={() => setActiveTab('fungsional')}
    className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 ${
      activeTab === 'fungsional'
        ? "bg-[#6d28d9] text-white shadow-lg shadow-[#6d28d9]/20"
        : "bg-transparent text-white/40 hover:bg-white/5 hover:text-white/70"
    }`}
  >
    <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'fungsional' ? "bg-white animate-pulse" : "bg-white/20"}`} />
    Fungsional
  </button>

</div>
    </div>
  );
}

export default SwitchPetaJabatan