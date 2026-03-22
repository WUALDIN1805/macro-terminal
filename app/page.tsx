// @ts-nocheck
"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator"; 
import { DashboardMatrix } from "@/components/dashboard-matrix";
import { MarketDynamics } from "@/components/market-dynamics";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");

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
          {/* Gráficos de arriba (Tus nuevos diseños) */}
          <div className="mb-10">
            <MarketDynamics />
          </div>
          
          {/* Tu Tabla (Recuperando tu conexión original) */}
          <div className="mt-10 mb-20">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <h3 className="text-white font-bold uppercase tracking-tighter text-sm">
                Weekly Directional Matrix
              </h3>
            </div>
            <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0a0a0a]">
               <DashboardMatrix />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}