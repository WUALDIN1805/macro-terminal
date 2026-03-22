// @ts-nocheck
"use client"

import { useState, useEffect } from "react"

export function DashboardMatrix() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const sheetId = '1zBuC8HsuIw9IjK4PgU32b-rsOM4AMQIS6j4nnA74D8Y';
        // URL de exportación directa de Google
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0&t=${new Date().getTime()}`;
        
        const response = await fetch(url);
        const csvText = await response.text();
        
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
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-20 text-center text-zinc-500 animate-pulse font-bold uppercase">Sincronizando datos...</div>

  return (
    <div className="overflow-x-auto bg-[#0a0a0a]">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10 bg-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <th className="py-4 px-4">Paridad</th>
            <th className="py-4 px-4 text-center">Bias</th>
            <th className="py-4 px-4 text-center">Tasas</th>
            <th className="py-4 px-4 text-center">Bonds</th>
            <th className="py-4 px-4 text-center">COT</th>
            <th className="py-4 px-4 text-center">Retail</th>
            <th className="py-4 px-4 text-center">Macro</th>
            <th className="py-4 px-4 text-center">Total</th>
          </tr>
        </thead>
        <tbody className="text-white font-mono text-[11px]">
          {data.map((item, index) => (
            <tr key={index} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-3 px-4 font-bold text-blue-400">{item.Par || item["Par "] || "---"}</td>
              <td className="py-3 px-4 text-center uppercase">{item["BIAS (Sesgo)"] || item["BIAS"] || "Neutral"}</td>
              <td className="py-3 px-4 text-center">{item["Diferencial Tasas"] || "0"}</td>
              <td className="py-3 px-4 text-center">{item["Diferencial Bonos"] || "0"}</td>
              <td className="py-3 px-4 text-center">{item["COT Score"] || "0"}</td>
              <td className="py-3 px-4 text-center">{item["Retail Score"] || "0"}</td>
              <td className="py-3 px-4 text-center">{item["Score MACRO (Suma)"] || "0"}</td>
              <td className="py-3 px-4 text-center font-bold text-green-400">{item["SCORE TOTAL"] || "0"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}