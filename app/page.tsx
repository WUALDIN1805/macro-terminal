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
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white">
            <span className="text-muted-foreground">AMT</span>
            <span className="text-foreground">/ {activeTab}</span>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-black">
          {/* Paneles de Insider */}
          <MarketDynamics />
          
          <div className="mt-10 mb-20">
             <h3 className="text-white font-bold uppercase tracking-tighter text-sm mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Weekly Directional Matrix
            </h3>
            {/* TU TABLA DE EXCEL RECUPERADA */}
            <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0a0a0a]">
               <DashboardMatrix />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}