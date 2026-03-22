// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator"; 
import { DashboardMatrix } from "@/components/dashboard-matrix";
import { MarketDynamics } from "@/components/market-dynamics";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoogleSheet() {
      try {
        const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQSbKX6EcCdYa3kiQg2kyGKZgoQEXekOg00FiUBQi6Ju85anqKBohvXS7-OXuL/pub?output=csv&t=${new Date().getTime()}`;
        
        const response = await fetch(url);
        const csvText = await response.text();
        
        const rows = csvText.split('\n').filter(row => row.trim() !== '');
        const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const jsonData = rows.slice(1).map(row => {
          const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
          const rawObj = {};
          headers.forEach((header, i) => {
            rawObj[header] = values[i] ? values[i].trim().replace(/"/g, '') : "";
          });

          // 🛡️ MAPEO DE SEGURIDAD: Aseguramos que los nombres coincidan con tu Matrix
          return {
            "Par": rawObj["Par"] || rawObj["Par "] || "",
            "BIAS (Sesgo)": rawObj["BIAS (Sesgo)"] || rawObj["BIAS"] || "Neutral",
            "Diferencial Tasas": rawObj["Diferencial Tasas"] || "0",
            "Diferencial Bonos": rawObj["Diferencial Bonos"] || "0",
            "COT Score": rawObj["COT Score"] || "0",
            "Retail Score": rawObj["Retail Score"] || "0",
            "Score MACRO (Suma)": rawObj["Score MACRO (Suma)"] || "0",
            "SCORE TOTAL": rawObj["SCORE TOTAL"] || "0"
          };
        }).filter(item => item.Par !== "");

        setExcelData(jsonData);
      } catch (error) {
        console.error("Error Matrix:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGoogleSheet();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-black border-white/10">
          <SidebarTrigger className="-ml-1 text-white" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white">
            <span className="text-muted-foreground">AMT</span>
            <span className="text-white">/ {activeTab}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-black">
          {/* Mantenemos tu MarketDynamics intacto arriba */}
          <MarketDynamics />
          
          <div className="mt-10 mb-20">
            <h3 className="text-white font-bold uppercase text-sm mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Weekly Directional Matrix
            </h3>
            <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0a0a0a]">
               {/* Pasamos los datos mapeados */}
               <DashboardMatrix data={excelData} isLoading={loading} />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}