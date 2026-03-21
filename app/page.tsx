"use client"

import { useState, useEffect } from "react"
import Papa from "papaparse"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardMatrix } from "@/components/dashboard-matrix"
import { COTAnalysis } from "@/components/cot-analysis"
import { MacroDivergence } from "@/components/macro-divergence"
import { RetailSentiment } from "@/components/retail-sentiment"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [spreadsheetData, setSpreadsheetData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const MY_PASSWORD = "Wualdin2026"

  useEffect(() => {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQSbKX6EcCdYa3kiQg2kyGKZgoQEXek0g00FiUBQi6Ju85anqKBohvXS7-0Y-iiExfieJT7OTR-OXuL/pub?gid=0&single=true&output=csv')
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setSpreadsheetData(results.data)
            setLoading(false)
          },
        })
      })
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-foreground p-4">
        <Card className="w-full max-w-[380px] space-y-6 border border-border/40 bg-[#111] p-8 rounded-2xl shadow-2xl">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tighter">ALPHA MACRO TERMINAL</h2>
            <p className="text-xs text-muted-foreground italic">Institutional Access Only</p>
          </div>
          <div className="space-y-4">
            <input 
              type="password" 
              placeholder="Contraseña"
              className="w-full p-3 bg-black border border-border/60 rounded-xl text-center text-sm outline-none focus:ring-2 focus:ring-green-500 text-white"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && password === MY_PASSWORD) setIsAuthenticated(true) }}
            />
            <button 
              className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-3 rounded-xl transition-all"
              onClick={() => {
                if (password === MY_PASSWORD) setIsAuthenticated(true)
                else alert("Contraseña Incorrecta")
              }}
            >
              ENTRAR
            </button>
          </div>
        </Card>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardMatrix data={spreadsheetData} isLoading={loading} />
      case "cot":
        return <COTAnalysis />
      case "macro":
        return <MacroDivergence />
      case "sentiment":
        return <RetailSentiment />
      default:
        return <DashboardMatrix data={spreadsheetData} isLoading={loading} />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
            <span className="text-muted-foreground">AMT /</span>
            <span className="text-foreground">{activeTab}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
            <span className="text-[10px] font-bold text-muted-foreground uppercase">{loading ? 'Syncing...' : 'Live Data'}</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}