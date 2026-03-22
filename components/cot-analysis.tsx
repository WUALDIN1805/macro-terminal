// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, ReferenceLine
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, TrendingUp } from "lucide-react"

export function COTAnalysis() {
  const [data, setData] = useState([])
  const [selectedPair, setSelectedPair] = useState("EUR/USD")
  const [loading, setLoading] = useState(true)

  // 📡 CONEXIÓN DIRECTA AL EXCEL
  useEffect(() => {
    async function fetchCOT() {
      try {
        const sheetId = '1zBuC8HsuIw9IjK4PgU32b-rsOM4AMQIS6j4nnA74D8Y';
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0&t=${new Date().getTime()}`;
        const response = await fetch(url);
        const csvText = await response.text();
        const rows = csvText.split('\n').filter(row => row.trim() !== '');
        const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const jsonData = rows.slice(1).map(row => {
          const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
          const obj = {};
          headers.forEach((header, i) => { obj[header] = values[i]?.trim().replace(/"/g, '') || ""; });
          return obj;
        });
        setData(jsonData);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    fetchCOT();
  }, []);

  // Filtrar datos para el par seleccionado
  const currentPairData = data.find(d => (d.Par || d["Par "]) === selectedPair) || {};
  
  // Extraer valores numéricos (limpiando comas de decimales si existen)
  const netPos = parseFloat(String(currentPairData["COT Score"] || 0).replace(',', '.'));
  const retailPos = parseFloat(String(currentPairData["Retail Score"] || 0).replace(',', '.'));
  
  // Simulamos un histórico simple basado en el score actual para el gráfico
  const chartData = [
    { name: "Prev", net: netPos * 0.8 },
    { name: "Current", net: netPos }
  ];

  if (loading) return <div className="p-20 text-center text-zinc-500 animate-pulse">CARGANDO FLUJOS COT...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">Pilar I: Smart Money Flow</h1>
        <Select value={selectedPair} onValueChange={setSelectedPair}>
          <SelectTrigger className="w-44 bg-zinc-900 border-zinc-800 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
            {data.map((d, i) => (
              <SelectItem key={i} value={d.Par || d["Par "]}>{d.Par || d["Par "]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
              <Wallet className="w-4 h-4" /> COT Net Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-black ${netPos >= 0 ? "text-green-500" : "text-red-500"}`}>
              {netPos > 0 ? "+" : ""}{netPos}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Retail Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-black ${retailPos <= 0 ? "text-green-500" : "text-red-500"}`}>
              {retailPos > 0 ? "+" : ""}{retailPos}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader><CardTitle className="text-sm text-white">Institutional Positioning Trend</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333'}} />
              <ReferenceLine y={0} stroke="#666" />
              <Bar dataKey="net" fill={netPos >= 0 ? "#22c55e" : "#ef4444"} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}