"use client"

import { useState } from "react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ReferenceLine
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileText, TrendingUp, Wallet } from "lucide-react"

// Mock COT data for different pairs
const cotData = {
  "EUR/USD": [
    { week: "W1", longs: 185000, shorts: 125000, net: 60000 },
    { week: "W2", longs: 192000, shorts: 118000, net: 74000 },
    { week: "W3", longs: 178000, shorts: 132000, net: 46000 },
    { week: "W4", longs: 195000, shorts: 115000, net: 80000 },
    { week: "W5", longs: 210000, shorts: 108000, net: 102000 },
    { week: "W6", longs: 205000, shorts: 112000, net: 93000 },
    { week: "W7", longs: 218000, shorts: 105000, net: 113000 },
    { week: "W8", longs: 225000, shorts: 98000, net: 127000 },
  ],
  "GBP/USD": [
    { week: "W1", longs: 45000, shorts: 38000, net: 7000 },
    { week: "W2", longs: 52000, shorts: 35000, net: 17000 },
    { week: "W3", longs: 48000, shorts: 42000, net: 6000 },
    { week: "W4", longs: 55000, shorts: 32000, net: 23000 },
    { week: "W5", longs: 60000, shorts: 28000, net: 32000 },
    { week: "W6", longs: 58000, shorts: 30000, net: 28000 },
    { week: "W7", longs: 63000, shorts: 25000, net: 38000 },
    { week: "W8", longs: 68000, shorts: 22000, net: 46000 },
  ],
  "USD/JPY": [
    { week: "W1", longs: 85000, shorts: 120000, net: -35000 },
    { week: "W2", longs: 78000, shorts: 135000, net: -57000 },
    { week: "W3", longs: 82000, shorts: 128000, net: -46000 },
    { week: "W4", longs: 72000, shorts: 145000, net: -73000 },
    { week: "W5", longs: 68000, shorts: 152000, net: -84000 },
    { week: "W6", longs: 70000, shorts: 148000, net: -78000 },
    { week: "W7", longs: 65000, shorts: 158000, net: -93000 },
    { week: "W8", longs: 62000, shorts: 165000, net: -103000 },
  ],
}

// US 10Y Yield data
const yieldData = [
  { date: "Jan", yield: 4.25, cotFlow: 60 },
  { date: "Feb", yield: 4.32, cotFlow: 74 },
  { date: "Mar", yield: 4.18, cotFlow: 46 },
  { date: "Apr", yield: 4.45, cotFlow: 80 },
  { date: "May", yield: 4.52, cotFlow: 102 },
  { date: "Jun", yield: 4.48, cotFlow: 93 },
  { date: "Jul", yield: 4.65, cotFlow: 113 },
  { date: "Aug", yield: 4.72, cotFlow: 127 },
]

const pairs = Object.keys(cotData)

export function COTAnalysis() {
  const [selectedPair, setSelectedPair] = useState("EUR/USD")
  const [rawText, setRawText] = useState("")
  const [isParsed, setIsParsed] = useState(false)

  const currentData = cotData[selectedPair as keyof typeof cotData]
  const latestData = currentData[currentData.length - 1]
  const previousData = currentData[currentData.length - 2]
  const netChange = latestData.net - previousData.net

  // Smart Money Index calculation (simplified)
  const smartMoneyIndex = Math.min(100, Math.max(0, 50 + (latestData.net / 2000)))

  const handleParse = () => {
    // Simulate parsing
    setIsParsed(true)
  }

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pilar I: Smart Money Flow</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Análisis COT - Posicionamiento de Non-Commercials (Institucionales)
          </p>
        </div>
        <Select value={selectedPair} onValueChange={setSelectedPair}>
          <SelectTrigger className="w-40 bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {pairs.map((pair) => (
              <SelectItem key={pair} value={pair}>{pair}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Net Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-mono ${latestData.net > 0 ? "text-buy" : "text-sell"}`}>
              {latestData.net > 0 ? "+" : ""}{latestData.net.toLocaleString()}
            </div>
            <p className={`text-xs mt-1 ${netChange > 0 ? "text-buy" : "text-sell"}`}>
              {netChange > 0 ? "▲" : "▼"} {Math.abs(netChange).toLocaleString()} vs last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Smart Money Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`text-2xl font-bold font-mono ${smartMoneyIndex > 60 ? "text-buy" : smartMoneyIndex < 40 ? "text-sell" : "text-muted-foreground"}`}>
                {smartMoneyIndex.toFixed(0)}
              </div>
              <div className="flex-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${smartMoneyIndex > 60 ? "bg-buy" : smartMoneyIndex < 40 ? "bg-sell" : "bg-macro"}`}
                    style={{ width: `${smartMoneyIndex}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-sell">Bearish</span>
                  <span className="text-[10px] text-buy">Bullish</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Long/Short Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground">
              {(latestData.longs / latestData.shorts).toFixed(2)}
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-buy">L: {(latestData.longs / 1000).toFixed(0)}K</span>
              <span className="text-sell">S: {(latestData.shorts / 1000).toFixed(0)}K</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COT Position Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Non-Commercial Positions</CardTitle>
            <CardDescription>Weekly Longs vs Shorts - {selectedPair}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="longs" name="Longs" fill="var(--buy)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="shorts" name="Shorts" fill="var(--sell)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Net Position Trend */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Net Position Trend</CardTitle>
            <CardDescription>Weekly Net Change - {selectedPair}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="var(--muted-foreground)" />
                  <Bar 
                    dataKey="net" 
                    name="Net Position"
                    fill="var(--buy)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* US 10Y Yield Correlation */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">US 10Y Yield vs COT Flow</CardTitle>
          <CardDescription>Refuge flow correlation with institutional positioning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis 
                  yAxisId="left" 
                  stroke="var(--macro)" 
                  fontSize={12}
                  domain={[4, 5]}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="var(--buy)" 
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="yield" 
                  name="US 10Y Yield (%)"
                  stroke="var(--macro)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--macro)", r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="cotFlow" 
                  name="COT Flow (K)"
                  stroke="var(--buy)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--buy)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Raw COT Data Parser */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            CFTC COT Data Parser
          </CardTitle>
          <CardDescription>Paste raw CFTC Commitment of Traders text data for parsing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste raw COT data from CFTC website here..."
            className="min-h-32 bg-background border-border font-mono text-xs"
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value)
              setIsParsed(false)
            }}
          />
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleParse}
              disabled={!rawText}
              className="bg-buy hover:bg-buy/90 text-background"
            >
              Parse Data
            </Button>
            {isParsed && (
              <span className="text-sm text-buy">
                ✓ Data parsed successfully
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
