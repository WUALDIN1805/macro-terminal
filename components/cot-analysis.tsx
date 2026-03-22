// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, TrendingUp } from "lucide-react"

export function COTAnalysis() {
  const [data, setData] = useState([])
  const [selectedPair, setSelectedPair] = useState("EUR/USD")
  const [loading, setLoading] = useState(true)

  // 📡 CONEXIÓN DIRECTA AL EXCEL CON REFRESH FORZADO
  useEffect(() => {
    async function fetchCOT() {
      try {
        const sheetId = '1zBuC8HsuIw9IjK4PgU32b-rsOM4AMQIS6j4nnA74D8Y';
        // Añadimos timestamp para evitar caché de Google
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

        console.log("Datos COT cargados:", jsonData); // Para diagnóstico
        setData(jsonData);
      } catch (e) { console.error("Error crítico COT:", e); } finally { setLoading(false); }
    }
    fetchCOT();
  }, []);

  // Filtrar datos para el par seleccionado
  const currentPairData = data.find(d => (d.Par || d["Par "] || d["PAR"]) === selectedPair) || {};
  
  // 🛠️ CORRECCIÓN DE COLUMNAS: Leemos "COT Score" y "Retail Score" de tu Excel
  const cotScoreRaw = currentPairData["COT Score"] || currentPairData["COT"] || "0";
  const retailScoreRaw = currentPairData["Retail Score"] || currentPairData["Retail"] || "0";
  
  // Limpiamos los datos (quitamos comas de decimales y convertimos a número)
  const netPos = parseFloat(String(cotScoreRaw).replace(',', '.'));
  const retailPos = parseFloat(String(retailScoreRaw).replace(',', '.'));
  
  // Simulamos un histórico simple basado en el score actual para el gráfico
  const chartData = [
    { name: "W1", net: netPos * 0.7 },
    { name: "W2", net: netPos * 0.9 },
    { name: "Current", net: netPos }
  ];

  if (loading) return <div className="p-20 text-center text-zinc-600 animate-pulse font-bold tracking-widest uppercase text-xs">Sincronizando Pilar I COT...</div>
  if (data.length === 0) return <div className="p-20 text-center text-red-500 font-bold uppercase text-xs">Error: No se encontraron datos en el Excel</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Pilar I: Smart Money Flow</h1>
        <Select value={selectedPair} onValueChange={setSelectedPair}>
          <SelectTrigger className="w-48 bg-zinc-950 border-zinc-800 text-white font-bold">
            <SelectValue placeholder="Seleccionar Par" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
            {data.map((d, i) => {
              const pairName = d.Par || d["Par "] || d["PAR"];
              return pairName && <SelectItem key={i} value={pairName}>{pairName}</SelectItem>
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TARJETA COT SCORE */}
        <Card className="bg-zinc-950 border-zinc-800 shadow-xl rounded-xl">
          <CardHeader className="pb-2 border-b border-white/5 mb-4">
            <CardTitle className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-2 tracking-widest">
              <Wallet className="w-4 h-4 text-blue-500" /> COT Net Score (Institucionales)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-5xl font-black font-mono tracking-tighter ${netPos >= 0 ? "text-green-400" : "text-red- red-400"}`}>
              {isNaN(netPos) ? "---" : (netPos > 0 ? "+" : "") + netPos}
            </div>
            <p className="text-xs text-zinc-500 mt-2">Puntuación basada en el posicionamiento neto actual.</p>
          </CardContent>
        </Card>

        {/* TARJETA RETAIL SENTIMENT */}
        <Card className="bg-zinc-950 border-zinc-800 shadow-xl rounded-xl">
          <CardHeader className="pb-2 border-b border-white/5 mb-4">
            <CardTitle className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-2 tracking-widest">
              <TrendingUp className="w-4 h-4 text-yellow-500" /> Retail Sentiment Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* OJO: Aquí la lógica suele ser inversa (Retail alto = señal contraria) */}
            <div className={`text-5xl font-black font-mono tracking-tighter ${retailPos <= 0 ? "text-green-400" : "text-red-400"}`}>
              {isNaN(retailPos) ? "---" : (retailPos > 0 ? "+" : "") + retailPos}
            </div>
            <p className="text-xs text-zinc-500 mt-2">Puntuación del sentimiento minorista (Sentimiento Contrario).</p>
          </CardContent>
        </Card>
      </div>

      {/* GRÁFICO DE TENDENCIA */}
      <Card className="bg-zinc-950 border-zinc-800 shadow-xl rounded-xl">
        <CardHeader className="border-b border-white/5 mb-6"><CardTitle className="text-sm font-bold text-white uppercase tracking-tight">Institutional Positioning Trend (COT Score)</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="name" stroke="#666" fontSize={12} font-weight="bold" />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{backgroundColor: '#050505', border: '1px solid #222', borderRadius: '8px'}} 
                labelStyle={{color: '#fff', fontWeight: 'bold'}}
              />
              <ReferenceLine y={0} stroke="#666" strokeWidth={2} />
              <Bar dataKey="net" name="COT Score" fill={netPos >= 0 ? "#22c55e" : "#ef4444"} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}