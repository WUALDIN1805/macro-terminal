// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

export function DashboardMatrix() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // 🔐 TU FILTRO DE SEGURIDAD Y CARGA ORIGINAL
        const sheetId = '1zBuC8HsuIw9IjK4PgU32b-rsOM4AMQIS6j4nnA74D8Y';
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0&t=${new Date().getTime()}`;
        
        const response = await fetch(url);
        const csvText = await response.text();
        
        // Separador inteligente para no romper decimales
        const rows = csvText.split(/\r?\n/).filter(row => row.trim() !== "");
        const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const jsonData = rows.slice(1).map(row => {
          const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
          const obj = {};
          headers.forEach((header, i) => {
            obj[header] = values[i] ? values[i].trim().replace(/"/g, '') : "";
          });
          return obj;
        }).filter(item => item.Par || item["Par "] || item["PAR"]);

        setData(jsonData);
      } catch (error) {
        console.error("Error en Matrix:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getBiasStyle = (bias) => {
    if (bias?.includes("Alcista")) return "bg-green-500/20 text-green-400 border border-green-500/50";
    if (bias?.includes("Bajista")) return "bg-red-500/20 text-red-400 border border-red-500/50";
    return "bg-zinc-800 text-zinc-400";
  }

  if (loading) return <div className="p-20 text-center text-zinc-500 animate-pulse font-bold tracking-tighter uppercase">Sincronizando con Google Sheets...</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-2 px-4">
        <thead>
          <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">
            <th className="pb-4 pl-4">Paridad</th>
            <th className="pb-4 text-center">Bias</th>
            <th className="pb-4 text-center">Tasas</th>
            <th className="pb-4 text-center">Bonds</th>
            <th className="pb-4 text-center">COT</th>
            <th className="pb-4 text-center">Retail</th>
            <th className="pb-4 text-center">Macro</th>
            <th className="pb-4 text-center pr-4">Total</th>
          </tr>
        </thead>
        <tbody className="text-[11px] font-mono">
          {data.map((item, index) => (
            <tr key={index} className="bg-zinc-900/50 hover:bg-zinc-800/80 transition-all group">
              <td className="py-4 pl-4 rounded-l-xl border-y border-l border-white/5">
                <span className="text-white font-bold group-hover:text-blue-400 transition-colors">
                  {item.Par || item["Par "] || "---"}
                </span>
              </td>
              <td className="py-4 text-center border-y border-white/5">
                <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase ${getBiasStyle(item["BIAS (Sesgo)"] || item["BIAS"])}`}>
                  {item["BIAS (Sesgo)"] || item["BIAS"] || "Neutral"}
                </span>
              </td>
              <td className="py-4 text-center border-y border-white/5 text-zinc-300">{item["Diferencial Tasas"] || "0"}</td>
              <td className="py-4 text-center border-y border-white/5 text-zinc-300">{item["Diferencial Bonos"] || "0"}</td>
              <td className="py-4 text-center border-y border-white/5 text-zinc-300">{item["COT Score"] || "0"}</td>
              <td className="py-3 px-4 text-center">{item["Retail Score"] || "0"}</td>
              <td className="py-4 text-center border-y border-white/5 text-zinc-300 font-bold">{item["Score MACRO (Suma)"] || "0"}</td>
              <td className="py-4 text-center rounded-r-xl border-y border-r border-white/5 pr-4 text-white font-black text-sm">
                {item["SCORE TOTAL"] || "0"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}