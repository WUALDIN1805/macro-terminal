// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, TrendingUp } from "lucide-react"

export function COTAnalysis() {
  const [data, setData] = useState([])
  const [selectedPair, setSelectedPair] = useState("EUR/USD")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCOT() {
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
        }).filter(item => item.Par || item["Par "] || item["PAR"]);

        setData(jsonData);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    fetchCOT();
  }, []);

  const currentPairData = data.find(d => (d.Par || d["Par "] || d["PAR"]) === selectedPair) || {};
  
  // LEER DATOS EXACTOS DEL EXCEL
  const cotScore = parseFloat(String(currentPairData["COT Score"] || "0").replace(',', '.'));
  const retailScore = parseFloat(String(currentPairData["Retail Score"] || "0").replace(',', '.'));

  // Estructura para el gráfico de barras (COMO LO TENÍAS ANTES)
  const chartData = [
    { name: "INSTITUCIONAL (COT)", value: cotScore, fill: cotScore >= 0 ? "#22c55e" : "#ef4444" },
    { name: "RETAIL (SENTIMENT)", value: retailScore, fill: retailScore >= 0 ? "#ef4444" : "#22c55e" } 
  ];

  if (loading) return <div className="p-20 text-center text-white animate-pulse">CARGANDO SENTIMIENTO...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Pilar I: Smart Money vs Retail</h1>
        <Select value={selectedPair} onValueChange={setSelectedPair}>
          <SelectTrigger className="w-48 bg-black border-white/20 text-white font-bold">
            <SelectValue placeholder="Par" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-white/10 text-white">
            {data.map((d, i) => (
              <SelectItem key={i} value={d.Par || d["Par "] || d["PAR"]}>
                {d.Par || d["Par "] || d["PAR"]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRÁFICO GRANDE (Izquierda) */}
        <Card className="lg:col-span-2 bg-black border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Market Sentiment Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111" horizontal={false} />
                <XAxis type="number" hide domain={[-100, 100]} />
                <YAxis dataKey="name" type="category" stroke="#fff" fontSize={10} font-weight="bold" width={100} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#000', border: '1px solid #333'}} />
                <ReferenceLine x={0} stroke="#fff" strokeWidth={2} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* DATOS NUMÉRICOS (Derecha) */}
        <div className="space-y-6">
          <Card className="bg-black border-white/10 p-2">
            <CardContent className="pt-4 text-center">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">COT Net Score</p>
              <div className={`text-5xl font-black ${cotScore >= 0 ? "text-green-500" : "text-red-500"}`}>
                {cotScore > 0 ? `+${cotScore}` : cotScore}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-white/10 p-2">
            <CardContent className="pt-4 text-center">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Retail Score</p>
              <div className={`text-5xl font-black ${retailScore >= 0 ? "text-red-500" : "text-green-500"}`}>
                {retailScore > 0 ? `+${retailScore}` : retailScore}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}