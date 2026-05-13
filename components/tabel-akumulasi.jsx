import { cn } from "@/app/lib/cd";
import useAkumulasiTabelStore from "@/app/store/akumulasiTabelStore";
import { useMemo, useRef, useCallback } from "react";
import { HiOutlineSave } from "react-icons/hi";
import { toPng } from 'html-to-image'; // Import dari html-to-image

const TabelAkumulasi = ({ list = [] }) => {
  const { shown } = useAkumulasiTabelStore();
  const tableRef = useRef(null);

  // 1. Transform data tree menjadi array akumulasi
  const displayData = useMemo(() => {
    if (!list || Object.keys(list).length === 0) return [];
    return transformDataToAkumulasi(list);
  }, [list]);

  // 2. Kalkulasi Total
  const total = useMemo(() => {
    return displayData.reduce(
      (acc, curr) => ({
        b: acc.b + curr.b,
        k: acc.k + curr.k,
        s: acc.s + curr.s,
      }),
      { b: 0, k: 0, s: 0 }
    );
  }, [displayData]);

  // 3. Fungsi Export menggunakan html-to-image
  const handleExportPNG = useCallback(async () => {
    if (!tableRef.current) return;

    const node = tableRef.current;
    const actualWidth = node.scrollWidth;
    const actualHeight = node.scrollHeight;

    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: null, // Transparan
        width: actualWidth,
        height: actualHeight,
        style: {
          transform: "scale(1)",
          margin: "0",
          padding: "0",
          width: `${actualWidth}px`,
          height: `${actualHeight}px`,
        },
      });

      const link = document.createElement("a");
      link.download = `Akumulasi-Jabatan-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export error:", err);
    }
  }, []);

  return (
    <div 
      className={cn(
        'fixed top-[70px] p-5 z-50 transition-all duration-500 ease-in-out flex flex-col gap-3', 
        shown ? "right-5" : "-right-[500px]" 
      )}
    >
      {/* Container yang akan di-capture */}
      <div ref={tableRef} className="rounded-md border border-black overflow-hidden bg-white shadow-sm">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="border-b border-black bg-gray-50">
              <th className="px-4 py-2 text-left text-[11px] font-bold uppercase border-r border-black text-black tracking-tight">
                Kelas Jabatan
              </th>
              <th className="px-4 py-2 text-center text-[11px] font-bold uppercase border-r border-black text-black">B</th>
              <th className="px-4 py-2 text-center text-[11px] font-bold uppercase border-r border-black text-black">K</th>
              <th className="px-4 py-2 text-center text-[11px] font-bold uppercase text-black">S</th>
            </tr>
          </thead>
          <tbody>
            {displayData.length > 0 ? (
              displayData.map((row, idx) => (
                <tr key={row.kelas} className="border-b border-black">
                  <td className="px-4 py-2 text-xs font-semibold border-r border-black text-black">Kelas {row.kelas}</td>
                  <td className="px-4 py-2 text-xs text-center border-r border-black font-medium text-black">{row.b}</td>
                  <td className="px-4 py-2 text-xs text-center border-r border-black font-medium text-black">{row.k}</td>
                  <td className={cn(
                    "px-4 py-2 text-xs text-center font-semibold",
                    row.s < 0 ? "text-red-600" : "text-black"
                  )}>
                    {row.s}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-black">
                <td colSpan="4" className="px-4 py-4 text-center text-xs text-gray-500">Tidak ada data</td>
              </tr>
            )}
            <tr className="bg-gray-50">
              <td className="px-4 py-2 text-xs font-bold border-r border-black text-black">Jumlah</td>
              <td className="px-4 py-2 text-xs text-center border-r border-black font-bold text-black">{total.b}</td>
              <td className="px-4 py-2 text-xs text-center border-r border-black font-bold text-black">{total.k}</td>
              <td className="px-4 py-2 text-xs text-center font-bold text-black">{total.s}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Button Save */}
      <div className="flex justify-end">
        <button
          onClick={handleExportPNG}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95 text-xs font-bold"
        >
          <HiOutlineSave size={16} />
          <span>SIMPAN PNG</span>
        </button>
      </div>
    </div>
  );
};

export default TabelAkumulasi;



const transformDataToAkumulasi = (node) => {
  const result = {};

  // Fungsi rekursif untuk menelusuri setiap node
  const traverse = (item) => {
    const kj = item.kJ || 0;
    
    if (kj > 0) {
      if (!result[kj]) {
        result[kj] = { kelas: kj.toString(), b: 0, k: 0, s: 0 };
      }
      
      // Akumulasi nilai
      result[kj].b += (item.b || 0);
      result[kj].k += (item.abk || 0); // ABK di data kamu adalah target (K)
    }

    // Telusuri anak-anaknya jika ada
    if (item.children && item.children.length > 0) {
      item.children.forEach(traverse);
    }
  };

  traverse(node);

  // Ubah object ke array, hitung S (Selisih), dan urutkan dari kelas tertinggi
  return Object.values(result)
    .map(item => ({
      ...item,
      s: item.k - item.b // S = K - B
    }))
    .sort((a, b) => parseInt(b.kelas) - parseInt(a.kelas));
};