"use client"

export function AMTLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10">
        {/* Main AM glyph with scope reticle and chart */}
        <svg viewBox="0 0 40 40" className="w-full h-full">
          {/* Outer scope ring */}
          <circle 
            cx="20" 
            cy="20" 
            r="18" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            className="text-buy"
          />
          
          {/* Reticle crosshairs */}
          <line x1="20" y1="4" x2="20" y2="10" stroke="currentColor" strokeWidth="1" className="text-buy" />
          <line x1="20" y1="30" x2="20" y2="36" stroke="currentColor" strokeWidth="1" className="text-buy" />
          <line x1="4" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="1" className="text-buy" />
          <line x1="30" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1" className="text-buy" />
          
          {/* Rising bar chart element */}
          <rect x="11" y="24" width="4" height="8" fill="currentColor" className="text-muted-foreground" opacity="0.5" />
          <rect x="17" y="20" width="4" height="12" fill="currentColor" className="text-muted-foreground" opacity="0.7" />
          <rect x="23" y="14" width="4" height="18" fill="currentColor" className="text-buy" />
          
          {/* AM stylized text */}
          <text 
            x="20" 
            y="14" 
            textAnchor="middle" 
            fontSize="8" 
            fontWeight="bold" 
            fill="currentColor"
            className="text-foreground font-mono"
          >
            AM
          </text>
        </svg>
      </div>
      
      <div className="flex flex-col">
        <span className="text-sm font-bold tracking-wider text-foreground">
          ALPHA MACRO TERMINAL
        </span>
        <span className="text-[10px] text-muted-foreground tracking-wide">
          Inteligencia Cuantitativa y Posicionamiento Institucional
        </span>
      </div>
    </div>
  )
}

export function AMTLogoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-8 h-8 ${className}`}>
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle 
          cx="20" 
          cy="20" 
          r="18" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          className="text-buy"
        />
        <line x1="20" y1="4" x2="20" y2="10" stroke="currentColor" strokeWidth="1" className="text-buy" />
        <line x1="20" y1="30" x2="20" y2="36" stroke="currentColor" strokeWidth="1" className="text-buy" />
        <line x1="4" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="1" className="text-buy" />
        <line x1="30" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1" className="text-buy" />
        <rect x="11" y="24" width="4" height="8" fill="currentColor" className="text-muted-foreground" opacity="0.5" />
        <rect x="17" y="20" width="4" height="12" fill="currentColor" className="text-muted-foreground" opacity="0.7" />
        <rect x="23" y="14" width="4" height="18" fill="currentColor" className="text-buy" />
        <text 
          x="20" 
          y="14" 
          textAnchor="middle" 
          fontSize="8" 
          fontWeight="bold" 
          fill="currentColor"
          className="text-foreground font-mono"
        >
          AM
        </text>
      </svg>
    </div>
  )
}
