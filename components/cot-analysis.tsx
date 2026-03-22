// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function COTAnalysis() {
  const [data, setData] = useState([])
  const [selectedPair, setSelectedPair] = useState("EUR/USD")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const sheetId = '1zBuC8HsuIw9IjK4PgU32b-rsOM4AMQIS6j4nnA74D8Y';
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0&t=${Date.now()}`;
        const response = await fetch(url);
        const csvText = await response.text();
        const rows = csvText.split(/\r?\n/).filter(row => row.trim() !== "");
        const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, '').toUpperCase());
        
        const jsonData = rows.slice(1).map(row => {
          const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
          const obj = {};
          headers.forEach((header, i) => { obj[header] = values[i]?.trim().replace(/"/g, '') || "0"; });
          return obj;
        });
        setData(jsonData);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    fetchData();
  }, []);

  // FILTRADO POR PAR (Lo que hacía que tu panel se moviera)
  const currentPair = data.find(d => d.PAR === selectedPair || d["PAR "] === selectedPair) || {};
  
  const cot = parseFloat(String(currentPair["COT SCORE"] || "0").replace(',', '.'));
  const retail = parseFloat(String(currentPair["RETAIL SCORE"] || "0").replace(',', '.'));

  const chartData = [
    { name: "INSTITUCIONAL (COT)", value: cot, fill: cot >= 0 ? "#22c55e" : "#ef4444" },
    { name: "RETAIL (SENTIMENT)", value: retail, fill: retail >= 0 ? "#ef4444" : "#22c55e" } 
  ];

  if (loading) return <div className="p-20 text-center text-white font-bold animate-pulse">RESTAURANDO PANEL...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Pilar I: Smart Money Flow</h1>
        <Select value={selectedPair} onValueChange={setSelectedPair}>
          <SelectTrigger className="w-48 bg-black border-white/20 text-white font-bold">
            <SelectValue placeholder="Seleccionar Par" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-white/10 text-white">
            {data.map((d, i) => (
              <SelectItem key={i} value={d.PAR || d["PAR "]}>
                {d.PAR || d["PAR "]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-black border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Comparativa de Sentimiento</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 30, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111" horizontal={false} />
                <XAxis type="number" hide domain={[-10, 10]} />
                <YAxis dataKey="name" type="category" stroke="#fff" fontSize={10} font-weight="bold" width={120} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#000', border: '1px solid #333'}} />
                <ReferenceLine x={0} stroke="#fff" strokeWidth={2} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={45}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-black border-white/10 p-4 text-center">
              <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">COT Net Score</p>
              <div className={`text-6xl font-black ${cot >= 0 ? "text-green-500" : "text-red-500"}`}>
                {cot > 0 ? `+${cot}` : cot}
              </div>
          </Card>
          <Card className="bg-black border-white/10 p-4 text-center">
              <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Retail Score</p>
              <div className={`text-6xl font-black ${retail >= 0 ? "text-red-500" : "text-green-500"}`}>
                {retail > 0 ? `+${retail}` : retail}
              </div>
          </Card>
        </div>
      </div>
    </div>
  )
}