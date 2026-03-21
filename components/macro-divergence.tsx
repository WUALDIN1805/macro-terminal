"use client"

import { useState } from "react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrendingUp, TrendingDown, Minus, Trophy } from "lucide-react"

// Interest rate data for major central banks
const interestRateData = [
  { month: "Sep", USD: 5.25, EUR: 4.50, GBP: 5.25, JPY: -0.10, AUD: 4.10, CAD: 5.00, NZD: 5.50, CHF: 1.75 },
  { month: "Oct", USD: 5.25, EUR: 4.50, GBP: 5.25, JPY: -0.10, AUD: 4.10, CAD: 5.00, NZD: 5.50, CHF: 1.75 },
  { month: "Nov", USD: 5.25, EUR: 4.50, GBP: 5.25, JPY: -0.10, AUD: 4.35, CAD: 5.00, NZD: 5.50, CHF: 1.75 },
  { month: "Dec", USD: 5.25, EUR: 4.50, GBP: 5.25, JPY: -0.10, AUD: 4.35, CAD: 5.00, NZD: 5.50, CHF: 1.75 },
  { month: "Jan", USD: 5.25, EUR: 4.50, GBP: 5.25, JPY: 0.00, AUD: 4.35, CAD: 5.00, NZD: 5.50, CHF: 1.75 },
  { month: "Feb", USD: 5.25, EUR: 4.50, GBP: 5.25, JPY: 0.10, AUD: 4.35, CAD: 5.00, NZD: 5.50, CHF: 1.50 },
  { month: "Mar", USD: 5.25, EUR: 4.25, GBP: 5.25, JPY: 0.10, AUD: 4.35, CAD: 4.75, NZD: 5.50, CHF: 1.50 },
  { month: "Apr", USD: 5.00, EUR: 4.25, GBP: 5.00, JPY: 0.25, AUD: 4.35, CAD: 4.75, NZD: 5.25, CHF: 1.50 },
]

// Macro economic data for 8 economies
const macroData = [
  { 
    country: "United States", 
    code: "USD", 
    flag: "🇺🇸",
    gdp: 2.5, 
    cpi: 3.2, 
    unemployment: 3.8, 
    pmi: 52.5,
    score: 78,
    trend: "up"
  },
  { 
    country: "Eurozone", 
    code: "EUR", 
    flag: "🇪🇺",
    gdp: 0.4, 
    cpi: 2.8, 
    unemployment: 6.4, 
    pmi: 47.8,
    score: 52,
    trend: "down"
  },
  { 
    country: "United Kingdom", 
    code: "GBP", 
    flag: "🇬🇧",
    gdp: 0.2, 
    cpi: 3.4, 
    unemployment: 4.2, 
    pmi: 49.2,
    score: 48,
    trend: "neutral"
  },
  { 
    country: "Japan", 
    code: "JPY", 
    flag: "🇯🇵",
    gdp: 1.9, 
    cpi: 2.8, 
    unemployment: 2.4, 
    pmi: 50.1,
    score: 62,
    trend: "up"
  },
  { 
    country: "Australia", 
    code: "AUD", 
    flag: "🇦🇺",
    gdp: 1.5, 
    cpi: 3.6, 
    unemployment: 4.1, 
    pmi: 50.8,
    score: 58,
    trend: "neutral"
  },
  { 
    country: "Canada", 
    code: "CAD", 
    flag: "🇨🇦",
    gdp: 1.1, 
    cpi: 2.9, 
    unemployment: 6.1, 
    pmi: 49.5,
    score: 45,
    trend: "down"
  },
  { 
    country: "New Zealand", 
    code: "NZD", 
    flag: "🇳🇿",
    gdp: 0.8, 
    cpi: 4.0, 
    unemployment: 4.3, 
    pmi: 48.2,
    score: 42,
    trend: "down"
  },
  { 
    country: "Switzerland", 
    code: "CHF", 
    flag: "🇨🇭",
    gdp: 1.3, 
    cpi: 1.4, 
    unemployment: 2.3, 
    pmi: 51.2,
    score: 72,
    trend: "up"
  },
]

// Radar chart data for country comparison
const getRadarData = (country1: string, country2: string) => {
  const c1 = macroData.find(c => c.code === country1)
  const c2 = macroData.find(c => c.code === country2)
  if (!c1 || !c2) return []
  
  return [
    { metric: "GDP", [country1]: Math.max(0, c1.gdp * 20 + 50), [country2]: Math.max(0, c2.gdp * 20 + 50) },
    { metric: "Employment", [country1]: 100 - c1.unemployment * 10, [country2]: 100 - c2.unemployment * 10 },
    { metric: "Inflation Control", [country1]: Math.max(0, 100 - (c1.cpi - 2) * 20), [country2]: Math.max(0, 100 - (c2.cpi - 2) * 20) },
    { metric: "PMI", [country1]: c1.pmi, [country2]: c2.pmi },
    { metric: "Overall", [country1]: c1.score, [country2]: c2.score },
  ]
}

const currencyCodes = macroData.map(c => c.code)

export function MacroDivergence() {
  const [compareBase, setCompareBase] = useState("EUR")
  const [compareQuote, setCompareQuote] = useState("USD")

  const radarData = getRadarData(compareBase, compareQuote)
  const baseCountry = macroData.find(c => c.code === compareBase)
  const quoteCountry = macroData.find(c => c.code === compareQuote)

  const rankedCountries = [...macroData].sort((a, b) => b.score - a.score)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-buy" />
      case "down": return <TrendingDown className="w-4 h-4 text-sell" />
      default: return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-buy"
    if (score >= 50) return "text-macro"
    return "text-sell"
  }

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.dataKey}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}%
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pilar II: Macro Divergence</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Análisis de divergencia económica y diferenciales de tasas de interés
        </p>
      </div>

      {/* Country Ranking */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="w-4 h-4 text-buy" />
            Country Macro Ranking
          </CardTitle>
          <CardDescription>Ranking basado en fortaleza económica general</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rankedCountries.map((country, index) => (
              <div 
                key={country.code}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border
                  ${index === 0 ? "border-buy bg-buy/5" : "border-border bg-muted/20"}
                `}
              >
                <span className="text-lg font-bold text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="text-2xl">{country.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{country.code}</span>
                    {getTrendIcon(country.trend)}
                  </div>
                  <span className={`text-lg font-bold font-mono ${getScoreColor(country.score)}`}>
                    {country.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interest Rate Differentials Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Interest Rate Differentials</CardTitle>
          <CardDescription>Central bank policy rates over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={interestRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[-1, 6]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="USD" stroke="var(--buy)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="EUR" stroke="var(--macro)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="GBP" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="JPY" stroke="var(--sell)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="AUD" stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="CAD" stroke="#06b6d4" strokeWidth={1} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Comparison */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Macro Comparison</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              <Select value={compareBase} onValueChange={setCompareBase}>
                <SelectTrigger className="w-24 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {currencyCodes.map((code) => (
                    <SelectItem key={code} value={code}>{code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">vs</span>
              <Select value={compareQuote} onValueChange={setCompareQuote}>
                <SelectTrigger className="w-24 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {currencyCodes.map((code) => (
                    <SelectItem key={code} value={code}>{code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                  <Radar 
                    name={compareBase} 
                    dataKey={compareBase} 
                    stroke="var(--buy)" 
                    fill="var(--buy)" 
                    fillOpacity={0.3}
                  />
                  <Radar 
                    name={compareQuote} 
                    dataKey={compareQuote} 
                    stroke="var(--macro)" 
                    fill="var(--macro)" 
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {baseCountry && quoteCountry && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Analysis: </span>
                  {baseCountry.score > quoteCountry.score ? (
                    <>
                      <span className="text-buy">{compareBase}</span> shows stronger macro fundamentals with a score of{" "}
                      <span className="font-mono text-buy">{baseCountry.score}</span> vs{" "}
                      <span className="text-macro">{compareQuote}</span>&apos;s{" "}
                      <span className="font-mono text-macro">{quoteCountry.score}</span>.
                      Consider <span className="text-buy">long {compareBase}/{compareQuote}</span> bias.
                    </>
                  ) : baseCountry.score < quoteCountry.score ? (
                    <>
                      <span className="text-macro">{compareQuote}</span> shows stronger macro fundamentals with a score of{" "}
                      <span className="font-mono text-macro">{quoteCountry.score}</span> vs{" "}
                      <span className="text-buy">{compareBase}</span>&apos;s{" "}
                      <span className="font-mono text-buy">{baseCountry.score}</span>.
                      Consider <span className="text-sell">short {compareBase}/{compareQuote}</span> bias.
                    </>
                  ) : (
                    <>
                      Both economies show similar macro strength. Consider <span className="text-muted-foreground">neutral</span> stance.
                    </>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Macro Data Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Economic Indicators</CardTitle>
            <CardDescription>Key metrics for major economies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Country</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">GDP %</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">CPI %</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Unemp %</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">PMI</th>
                  </tr>
                </thead>
                <tbody>
                  {macroData.map((country) => (
                    <tr key={country.code} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span className="font-medium">{country.code}</span>
                        </div>
                      </td>
                      <td className={`py-2 px-2 text-right font-mono ${country.gdp > 1 ? "text-buy" : country.gdp < 0 ? "text-sell" : "text-muted-foreground"}`}>
                        {country.gdp.toFixed(1)}
                      </td>
                      <td className={`py-2 px-2 text-right font-mono ${country.cpi < 3 ? "text-buy" : country.cpi > 4 ? "text-sell" : "text-macro"}`}>
                        {country.cpi.toFixed(1)}
                      </td>
                      <td className={`py-2 px-2 text-right font-mono ${country.unemployment < 4 ? "text-buy" : country.unemployment > 5 ? "text-sell" : "text-muted-foreground"}`}>
                        {country.unemployment.toFixed(1)}
                      </td>
                      <td className={`py-2 px-2 text-right font-mono ${country.pmi > 50 ? "text-buy" : "text-sell"}`}>
                        {country.pmi.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
              <span><span className="inline-block w-2 h-2 rounded-full bg-buy mr-1" />Strong</span>
              <span><span className="inline-block w-2 h-2 rounded-full bg-macro mr-1" />Moderate</span>
              <span><span className="inline-block w-2 h-2 rounded-full bg-sell mr-1" />Weak</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
