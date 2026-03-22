// @ts-nocheck
"use client"

import React, { useState, useEffect } from 'react';

export function MarketDynamics() {
  const [indicesData, setIndicesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDynamics() {
      try {
        const sheetId = '1zBuC8HsuIw9IjK4PgU32b-rsOM4AMQIS6j4nnA74D8Y';
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0&t=${new Date().getTime()}`;
        
        const response = await fetch(url);
        const csvText = await response.text();
        const rows = csvText.split('\n').filter(row => row.trim() !== '');
        
        // Buscamos las filas de índices (NAS100, SPX500, etc.) que suelen estar al final
        const assets = rows.slice(1).map(row => {
          const v = row.split(',').map(val => val.trim().replace(/"/g, ''));
          return {
            asset: v[0], // Columna Par (NAS100, SPX500...)
            price: v[4], // Columna Diferencial Tasas (o la que uses para el precio)
            change: v[7], // Columna Score Macro o similar para el %
            status: parseFloat(v[7]) >= 0 ? 'up' : 'down'
          };
        }).filter(a => ["NAS100", "SPX500", "US30", "DAX", "WTI (Petróleo)", "XAU/USD"].includes(a.asset));

        setIndicesData(assets);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchDynamics();
  }, []);

  // Datos de fuerza (estos los podemos conectar luego si tienes una tabla de fuerza)
  const strengthData = [
    { coin: 'USD', strength: 85, color: 'bg-blue-500' },
    { coin: 'GBP', strength: 72, color: 'bg-indigo-500' },
    { coin: 'EUR', strength: 45, color: 'bg-slate-500' },
    { coin: 'JPY', strength: 15, color: 'bg-red-500' },
  ];

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* FUERZA DE DIVISAS */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold uppercase tracking-tighter text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Currency Strength Index
            </h3>
            <span className="text-[10px] text-white/40 font-mono italic">REAL-TIME FEED</span>
          </div>
          <div className="space-y-5">
            {strengthData.map((item) => (
              <div key={item.coin} className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/80">{item.coin}</span>
                  <span className="text-white font-bold">{item.strength}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`${item.color} h-full transition-all duration-1000`} 
                    style={{ width: `${item.strength}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ÍNDICES Y COMMODITIES CONECTADOS */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-2xl">
          <h3 className="text-white font-bold uppercase tracking-tighter text-sm mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            Global Assets & Commodities
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {indicesData.length > 0 ? indicesData.map((item) => (
              <div key={item.asset} className="bg-white/5 border border-white/5 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-white/40 font-bold uppercase">{item.asset}</p>
                  <p className="text-sm font-mono text-white">{item.price || "---"}</p>
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded ${item.status === 'up' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                  {item.change}%
                </div>
              </div>
            )) : <div className="col-span-2 text-zinc-600 text-[10px] text-center py-10 uppercase font-bold tracking-widest">Sincronizando activos...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}