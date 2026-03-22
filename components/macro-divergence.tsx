// @ts-nocheck
"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MacroDivergence() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMacro() {
      try {
        const sheetId = '1zBuC8HsuIw9IjK4PgU32b-rsOM4AMQIS6j4nnA74D8Y';
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0&t=${new Date().getTime()}`;
        const response = await fetch(url);
        const csvText = await response.text();
        const rows = csvText.split(/\r?\n/).filter(row => row.trim() !== "");
        const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const jsonData = rows.slice(1).map(row => {
          const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
          const obj = {};
          headers.forEach((header, i) => { obj[header] = values[i]?.trim().replace(/"/g, '') || ""; });
          return obj;
        }).filter(item => item.Par || item["Par "]);
        setData(jsonData);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    fetchMacro();
  }, []);

  // Ordenamos por "Score MACRO (Suma)" para el ranking
  const ranking = [...data].sort((a, b) => 
    parseFloat(String(b["Score MACRO (Suma)"]).replace(',', '.')) - 
    parseFloat(String(a["Score MACRO (Suma)"]).replace(',', '.'))
  ).slice(0, 8);

  if (loading) return <div className="p-20 text-center text-white animate-pulse">CARGANDO MACRO RANKING...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-white uppercase italic">Pilar II: Macro Divergence</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ranking.map((item, i) => (
          <Card key={i} className="bg-black border-white/10 hover:border-blue-500/50 transition-all">
            <CardContent className="pt-6">
              <p className="text-[10px] font-bold text-zinc-500 uppercase">#{i + 1} {item.Par || item["Par "]}</p>
              <div className="text-2xl font-black text-white">{item["Score MACRO (Suma)"]}</div>
              <p className="text-[10px] text-zinc-600 mt-1">Economic Strength Score</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}