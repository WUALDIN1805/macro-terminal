"use client"

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertTriangle, Target, Users, TrendingDown, TrendingUp } from "lucide-react"

// Retail sentiment data for major pairs
const sentimentData = [
  { pair: "EUR/USD", longPercent: 32, shortPercent: 68, signal: "contrarian_long" },
  { pair: "GBP/USD", longPercent: 38, shortPercent: 62, signal: "contrarian_long" },
  { pair: "USD/JPY", longPercent: 78, shortPercent: 22, signal: "contrarian_short" },
  { pair: "AUD/USD", longPercent: 45, shortPercent: 55, signal: "neutral" },
  { pair: "USD/CAD", longPercent: 55, shortPercent: 45, signal: "neutral" },
  { pair: "NZD/USD", longPercent: 42, shortPercent: 58, signal: "neutral" },
  { pair: "USD/CHF", longPercent: 72, shortPercent: 28, signal: "contrarian_short" },
  { pair: "EUR/JPY", longPercent: 25, shortPercent: 75, signal: "contrarian_long" },
  { pair: "GBP/JPY", longPercent: 28, shortPercent: 72, signal: "contrarian_long" },
  { pair: "AUD/JPY", longPercent: 35, shortPercent: 65, signal: "contrarian_long" },
  { pair: "EUR/GBP", longPercent: 52, shortPercent: 48, signal: "neutral" },
  { pair: "EUR/AUD", longPercent: 65, shortPercent: 35, signal: "neutral" },
  { pair: "GBP/AUD", longPercent: 58, shortPercent: 42, signal: "neutral" },
  { pair: "EUR/CAD", longPercent: 40, shortPercent: 60, signal: "neutral" },
  { pair: "GBP/CAD", longPercent: 44, shortPercent: 56, signal: "neutral" },
  { pair: "AUD/CAD", longPercent: 48, shortPercent: 52, signal: "neutral" },
]

// Get contrarian alerts (75%+ bias)
const contrarianAlerts = sentimentData.filter(
  d => d.longPercent >= 75 || d.shortPercent >= 75
)

export function RetailSentiment() {
  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "contrarian_long": return "text-buy"
      case "contrarian_short": return "text-sell"
      default: return "text-muted-foreground"
    }
  }

  const getSignalLabel = (signal: string) => {
    switch (signal) {
      case "contrarian_long": return "Buscar Largo"
      case "contrarian_short": return "Buscar Corto"
      default: return "Neutral"
    }
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; payload: { pair: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{data.pair}</p>
          <p className="text-xs text-buy">Long: {payload.find(p => p.dataKey === "longPercent")?.value}%</p>
          <p className="text-xs text-sell">Short: {payload.find(p => p.dataKey === "shortPercent")?.value}%</p>
        </div>
      )
    }
    return null
  }

  // Aggregate data for pie chart
  const aggregateLongs = sentimentData.reduce((acc, d) => acc + d.longPercent, 0) / sentimentData.length
  const aggregateShorts = 100 - aggregateLongs

  const pieData = [
    { name: "Retail Long", value: Math.round(aggregateLongs), fill: "var(--buy)" },
    { name: "Retail Short", value: Math.round(aggregateShorts), fill: "var(--sell)" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pilar III: Retail Contrarian</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Señales contrarias basadas en posicionamiento retail - Liquidez institucional
        </p>
      </div>

      {/* Contrarian Alerts */}
      {contrarianAlerts.length > 0 && (
        <Card className="bg-sell/5 border-sell/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-sell">
              <AlertTriangle className="w-5 h-5" />
              Contrarian Alerts - High Conviction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contrarianAlerts.map((alert) => {
                const isRetailLong = alert.longPercent >= 75
                const extremePercent = isRetailLong ? alert.longPercent : alert.shortPercent
                
                return (
                  <div 
                    key={alert.pair}
                    className="p-4 bg-card border border-border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono font-bold text-foreground">{alert.pair}</span>
                      <span className={`text-2xl font-bold font-mono ${isRetailLong ? "text-sell" : "text-buy"}`}>
                        {extremePercent}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-buy"
                          style={{ width: `${alert.longPercent}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {isRetailLong ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-sell" />
                          <span className="text-sell font-medium">
                            Look for Institutional Short Liquidity
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 text-buy" />
                          <span className="text-buy font-medium">
                            Look for Institutional Long Liquidity
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Retail {isRetailLong ? "long" : "short"} bias extreme. Contrarian signal active.
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" />
              Contrarian Long Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-buy">
              {sentimentData.filter(d => d.signal === "contrarian_long").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pairs with retail short bias {">"}65%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" />
              Contrarian Short Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sell">
              {sentimentData.filter(d => d.signal === "contrarian_short").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pairs with retail long bias {">"}65%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4" />
              High Conviction Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-macro">
              {contrarianAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pairs with 75%+ extreme bias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Heatmap */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Retail Positioning Heatmap</CardTitle>
            <CardDescription>Long vs Short percentage by pair</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={sentimentData} 
                  layout="vertical"
                  margin={{ left: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis type="category" dataKey="pair" stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="longPercent" stackId="a" fill="var(--buy)" radius={[0, 0, 0, 0]}>
                    {sentimentData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.longPercent >= 65 ? "var(--buy)" : "var(--buy)"} 
                        fillOpacity={entry.longPercent >= 65 ? 1 : 0.6}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="shortPercent" stackId="a" fill="var(--sell)" radius={[0, 4, 4, 0]}>
                    {sentimentData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.shortPercent >= 65 ? "var(--sell)" : "var(--sell)"} 
                        fillOpacity={entry.shortPercent >= 65 ? 1 : 0.6}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Aggregate Pie */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Aggregate Retail Sentiment</CardTitle>
            <CardDescription>Overall retail positioning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-buy" />
                <span className="text-sm text-muted-foreground">Long</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sell" />
                <span className="text-sm text-muted-foreground">Short</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Detailed Sentiment Analysis</CardTitle>
          <CardDescription>Contrarian signals based on retail positioning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Pair</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Retail Long</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Retail Short</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Position Bar</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Contrarian Signal</th>
                </tr>
              </thead>
              <tbody>
                {sentimentData.map((item, index) => (
                  <tr 
                    key={item.pair}
                    className={`
                      border-b border-border/50 hover:bg-muted/20 transition-colors
                      ${index % 2 === 0 ? "bg-transparent" : "bg-muted/10"}
                    `}
                  >
                    <td className="py-3 px-4 font-mono font-medium text-foreground">{item.pair}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono ${item.longPercent >= 65 ? "text-buy font-bold" : "text-muted-foreground"}`}>
                        {item.longPercent}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono ${item.shortPercent >= 65 ? "text-sell font-bold" : "text-muted-foreground"}`}>
                        {item.shortPercent}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-buy"
                          style={{ width: `${item.longPercent}%` }}
                        />
                        <div 
                          className="h-full bg-sell"
                          style={{ width: `${item.shortPercent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getSignalColor(item.signal)}`}>
                        {item.signal === "contrarian_long" && <TrendingUp className="w-3 h-3" />}
                        {item.signal === "contrarian_short" && <TrendingDown className="w-3 h-3" />}
                        {getSignalLabel(item.signal)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
