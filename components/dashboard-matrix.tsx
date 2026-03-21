"use client"

import { useState } from "react"
import { 
  Filter,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mapping de banderas
const countryFlags: Record<string, string> = {
  EU: "🇪🇺", US: "🇺🇸", GB: "🇬🇧", JP: "🇯🇵", AU: "🇦🇺",
  CA: "🇨🇦", NZ: "🇳🇿", CH: "🇨🇭", EUR: "🇪🇺", USD: "🇺🇸", GBP: "🇬🇧", JPY: "🇯🇵", AUD: "🇦🇺", CAD: "🇨🇦", NZD: "🇳🇿", CHF: "🇨🇭"
}

type SortDirection = "asc" | "desc"

// Recibimos 'data' desde el archivo jefe (page.tsx)
export function DashboardMatrix({ data = [], isLoading = false }: { data: any[], isLoading?: boolean }) {
  const [sortKey, setSortKey] = useState("BIAS (Sesgo)")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [biasFilter, setBiasFilter] = useState<string[]>([])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("desc")
    }
  }

  // Limpiamos y procesamos los datos que vienen del Excel
  const processedData = data.map(item => ({
    ...item,
    pair: item.Par || "N/A",
    bias: item["BIAS (Sesgo)"] || "Neutral",
    tasas: parseFloat(String(item["Diferencial Tasas"]).replace(',', '.')) || 0,
    bonds: parseFloat(String(item["Diferencial Bonos"]).replace(',', '.')) || 0,
    cot: parseInt(item["COT Score"]) || 0,
    retail: parseInt(item["Retail Score"]) || 0,
    pib: parseFloat(String(item["Diferencial PIB"]).replace(',', '.')) || 0,
    cpi: parseFloat(String(item["Diferencial Inflación"]).replace(',', '.')) || 0,
    desempleo: parseFloat(String(item["Diferencial Desempleo"]).replace(',', '.')) || 0,
    macro: parseFloat(String(item["Score MACRO (Suma)"]).replace(',', '.')) || 0,
    scoreTotal: parseFloat(String(item["SCORE TOTAL"]).replace(',', '.')) || 0,
    base: (item.Par || "").split('/')[0],
    quote: (item.Par || "").split('/')[1]
  }))

  const filteredAndSortedPairs = processedData
    .filter(pair => biasFilter.length === 0 || biasFilter.includes(pair.bias))
    .sort((a, b) => {
      const aVal = a[sortKey as keyof typeof a]
      const bVal = b[sortKey as keyof typeof b]
      
      if (sortKey === "BIAS (Sesgo)") {
        const order = { "Alcista": 3, "Neutral": 2, "Bajista": 1 }
        const aOrder = order[a.bias as keyof typeof order] || 0
        const bOrder = order[b.bias as keyof typeof order] || 0
        return sortDirection === "desc" ? bOrder - aOrder : aOrder - bOrder
      }

      return sortDirection === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
    })

  const getValueColor = (value: number) => {
    if (value > 0) return "text-buy"
    if (value < 0) return "text-sell"
    return "text-muted-foreground"
  }

  const getBiasStyle = (bias: string) => {
    if (bias === "Alcista") return "bg-buy/20 text-buy"
    if (bias === "Bajista") return "bg-sell/20 text-sell"
    return "bg-muted text-muted-foreground"
  }

  const formatValue = (value: number) => {
    return value.toFixed(2).replace('.', ',')
  }

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground animate-pulse">Cargando datos de Google Sheets...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Weekly Directional Matrix</h1>
          <p className="text-sm text-muted-foreground mt-1">Sincronizado con Google Sheets en tiempo real</p>
        </div>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-3 text-left">Par</th>
                <th className="py-3 px-3 text-center">BIAS</th>
                <th className="py-3 px-3 text-center">Tasas</th>
                <th className="py-3 px-3 text-center">Bonds</th>
                <th className="py-3 px-3 text-center">COT</th>
                <th className="py-3 px-3 text-center">Retail</th>
                <th className="py-3 px-3 text-center">MACRO</th>
                <th className="py-3 px-3 text-center">SCORE TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPairs.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 font-mono text-sm">
                      <span>{countryFlags[item.base] || "🌐"}</span>
                      <span className="font-bold">{item.pair}</span>
                      <span>{countryFlags[item.quote] || "🌐"}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getBiasStyle(item.bias)}`}>
                      {item.bias}
                    </span>
                  </td>
                  <td className={`py-2.5 px-3 text-center font-mono text-sm ${getValueColor(item.tasas)}`}>{formatValue(item.tasas)}</td>
                  <td className={`py-2.5 px-3 text-center font-mono text-sm ${getValueColor(item.bonds)}`}>{formatValue(item.bonds)}</td>
                  <td className={`py-2.5 px-3 text-center font-mono text-sm ${getValueColor(item.cot)}`}>{item.cot}</td>
                  <td className={`py-2.5 px-3 text-center font-mono text-sm ${getValueColor(item.retail)}`}>{item.retail}</td>
                  <td className={`py-2.5 px-3 text-center font-mono text-sm font-bold ${getValueColor(item.macro)}`}>{formatValue(item.macro)}</td>
                  <td className={`py-2.5 px-3 text-center font-mono text-sm font-black ${getValueColor(item.scoreTotal)}`}>{formatValue(item.scoreTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}