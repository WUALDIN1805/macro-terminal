"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DashboardMatrix } from "@/components/dashboard-matrix";
import { MarketDynamics } from "@/components/market-dynamics"; // Importamos los gráficos nuevos

export default function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
            <span className="text-muted-foreground">AMT</span>
            <span className="text-foreground">/ {activeTab}</span>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6 bg-black">
          {/* Mostramos los gráficos de Fuerza e Índices arriba de la tabla */}
          <MarketDynamics />
          
          <div className="mt-8">
            <h3 className="text-white font-bold uppercase tracking-tighter text-sm mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Main Asset Matrix
            </h3>
            <DashboardMatrix />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}