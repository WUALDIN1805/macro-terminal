// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/separator"; // Ajusta si la ruta es diferente
import { DashboardMatrix } from "@/components/dashboard-matrix";
import { MarketDynamics } from "@/components/market-dynamics";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoogleSheet() {
      try {
        // 1. ESTE ES TU ID DE GOOGLE SHEETS
        const sheetId = '1zBuC8HsuIw9IjK4PgU32b-rsOM4AMQIS6j4nnA74D8Y';
        // 2. USAMOS LA EXPORTACIÓN CSV PARA LEER DATOS PÚBLICOS
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
        
        const response = await fetch(url);
        const csvText = await response.text();
        
        // 3. CONVERTIMOS EL CSV A JSON PARA LA TABLA
        const rows = csvText.split('\n').map(row => row.split(','));
        const headers = rows[0].map(h => h.trim());
        
        const jsonData = rows.slice(1).map(row => {
          const obj = {};
          headers.forEach((header, i) => {
            obj[header] = row[i] ? row[i].trim() : "";
          });
          return obj;
        }).filter(item => item.Par); // Solo filas que tengan un Par de divisas

        setExcelData(jsonData);
      } catch (error) {
        console.error("Error leyendo Google Sheets:", error);
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
          <div className="mb-10">
            <MarketDynamics />
          </div>
          
          <div className="mt-10 mb-20">
             <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                <h3 className="text-white font-bold uppercase tracking-tighter text-sm">
                  Weekly Directional Matrix
                </h3>
             </div>
             
            <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0a0a0a] shadow-2xl">
               <DashboardMatrix data={excelData} isLoading={loading} />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}