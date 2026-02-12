"use client"; // Wajib ada untuk interaktivitas

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterTahun({ currentYear, filterOptions, startYear }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (e) => {
        const year = e.target.value;
        // Update URL query parameter tanpa reload halaman penuh
        const params = new URLSearchParams(searchParams.toString());
        params.set("start", year);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-3 bg-black/20 p-2 rounded-2xl border border-white/5">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Mulai Tahun:</label>
            <select 
                value={startYear}
                onChange={handleChange}
                className="bg-[#1c2128] text-white text-xs font-bold py-2 px-4 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
                {filterOptions.map(year => (
                    <option key={year} value={year}>
                        {year} {year === currentYear ? '(Sekarang)' : ''}
                    </option>
                ))}
            </select>
        </div>
    );
}