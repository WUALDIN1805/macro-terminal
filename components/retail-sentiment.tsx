// @ts-nocheck
"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function RetailSentiment() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRetail() {
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
    fetchRetail();
  }, []);

  // Alertas: Pares con Retail Score extremo (ej: mayor a 7 o menor a -7)
  const alerts = data.filter(d => Math.abs(parseFloat(String(d["Retail Score"]).replace(',', '.'))) >= 7);

  if (loading) return <div className="p-20 text-center text-white animate-pulse">CARGANDO SENTIMIENTO RETAIL...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-white uppercase italic">Pilar III: Retail Contrarian</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.length > 0 ? alerts.slice(0, 4).map((item, i) => {
          const score = parseFloat(String(item["Retail Score"]).replace(',', '.'));
          return (
            <Card key={i} className="bg-black border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <CardHeader>
                <CardTitle className="text-red-500 text-xs font-black uppercase tracking-widest">⚠️ High Conviction Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-3xl font-black text-white">{item.Par || item["Par "]}</span>
                  <span className="text-2xl font-black text-red-500">{score > 0 ? `+${score}` : score}</span>
                </div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold">
                  {score > 0 ? "Extreme Long Bias - Look for Shorts" : "Extreme Short Bias - Look for Longs"}
                </p>
              </CardContent>
            </Card>
          )
        }) : <div className="text-zinc-500 font-bold uppercase text-xs">No extreme retail sentiment detected.</div>}
      </div>
    </div>
  )
}