"use client";
import { BiLoaderAlt } from "react-icons/bi";
import {
  HiOutlineSave,
  HiOutlineZoomIn,
  HiOutlineZoomOut,
} from "react-icons/hi";

const ControllPanelPetaJabatanAdminInduk = ({
  scale,
  setScale,
  setPosition,
  handleDownloadImage,
  isDownloading,
}) => {
  return (
    <div className="fixed right-6 bottom-6 z-[40] flex flex-row items-center gap-4 transition-all duration-300">
      {/* CSS Tooltip Utility */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .tooltip-trigger { position: relative; display: flex; align-items: center; }
          .tooltip-content {
            position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%);
            padding: 6px 10px; border-radius: 10px; background: rgba(26, 26, 30, 0.95); 
            border: 1px solid rgba(255,255,255,0.1); backdrop-blur-md;
            color: white; font-size: 9px; font-weight: 800; text-transform: uppercase; white-space: nowrap;
            pointer-events: none; opacity: 0; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4);
          }
          .tooltip-trigger:hover .tooltip-content { opacity: 1; bottom: 140%; }
        `,
        }}
      />

      {/* VIEWPORT DOCK */}
      <div className="flex items-center gap-2 p-2 rounded-[1.5rem] bg-[#1a1a1e]/80 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all opacity-60 hover:opacity-100 group/dock">
        <div className="tooltip-trigger">
          <button
            onClick={() => setScale((s) => Math.min(s + 0.1, 2))}
            className="p-2.5 bg-white/5 text-white/70 rounded-xl border border-white/5 hover:bg-indigo-600 hover:text-white transition-all"
          >
            <HiOutlineZoomIn size={16} />
          </button>
          <div className="tooltip-content">Zoom In</div>
        </div>

        <div className="tooltip-trigger">
          <button
            onClick={() => {
              setScale(0.7);
              setPosition({ x: 0, y: 0 });
            }}
            className="p-2.5 bg-white/5 text-white/50 rounded-xl border border-white/5 hover:bg-slate-700 hover:text-white text-[8px] font-black min-w-[45px]"
          >
            {Math.round(scale * 100)}%
          </button>
          <div className="tooltip-content">Reset View</div>
        </div>

        <div className="tooltip-trigger">
          <button
            onClick={() => setScale((s) => Math.max(s - 0.1, 0.2))}
            className="p-2.5 bg-white/5 text-white/70 rounded-xl border border-white/5 hover:bg-indigo-600 hover:text-white transition-all"
          >
            <HiOutlineZoomOut size={16} />
          </button>
          <div className="tooltip-content">Zoom Out</div>
        </div>

        <div className="h-6 w-[1px] bg-white/10 mx-1"></div>

        <div className="tooltip-trigger">
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className={`p-2.5 rounded-xl transition-all shadow-xl ${isDownloading ? "bg-indigo-600 text-white" : "bg-white text-[#1a1a1e] hover:scale-110"}`}
          >
            {isDownloading ? (
              <BiLoaderAlt className="animate-spin" size={16} />
            ) : (
              <HiOutlineSave size={16} />
            )}
          </button>
          <div className="tooltip-content">Ekspor PNG</div>
        </div>
      </div>
    </div>
  );
};

export default ControllPanelPetaJabatanAdminInduk;
