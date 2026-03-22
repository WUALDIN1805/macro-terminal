import React from 'react';

const strengthData = [
  { coin: 'USD', strength: 85, color: 'bg-blue-500' },
  { coin: 'GBP', strength: 72, color: 'bg-indigo-500' },
  { coin: 'EUR', strength: 45, color: 'bg-slate-500' },
  { coin: 'JPY', strength: 15, color: 'bg-red-500' },
];

const indicesData = [
  { asset: 'S&P 500', price: '5,123.4', change: '+0.12%', status: 'up' },
  { asset: 'NAS100', price: '18,245.2', change: '+0.45%', status: 'up' },
  { asset: 'GOLD', price: '2,155.8', change: '-0.20%', status: 'down' },
  { asset: 'USOIL', price: '78.45', change: '+1.10%', status: 'up' },
];

export function MarketDynamics() {
  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* SECCIÓN SUPERIOR: FUERZA Y ÍNDICES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 4. MEDIDOR DE FUERZA DE DIVISAS */}
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
                    className={`${item.color} h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.3)]`} 
                    style={{ width: `${item.strength}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NUEVA SECCIÓN: ÍNDICES Y COMMODITIES */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-2xl">
          <h3 className="text-white font-bold uppercase tracking-tighter text-sm mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            Global Assets & Commodities
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {indicesData.map((item) => (
              <div key={item.asset} className="bg-white/5 border border-white/5 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-white/40 font-bold uppercase">{item.asset}</p>
                  <p className="text-sm font-mono text-white">{item.price}</p>
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded ${item.status === 'up' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}