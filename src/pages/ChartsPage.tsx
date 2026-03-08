import { useState } from "react";
import { CandlestickChart } from "../components/dashboard/MarketWidgets";
import { Maximize2, Minimize2, Plus } from "lucide-react";

const pairs = ["BTC/USD", "ETH/USD", "EUR/USD", "AAPL", "XAU/USD", "SOL/USD"];
const indicators = ["RSI", "MACD", "EMA 20", "EMA 50", "Bollinger", "VWAP", "Volume"];

export default function ChartsPage() {
  const [activeIndicators, setActiveIndicators] = useState<string[]>(["RSI", "EMA 20"]);
  const [activePair, setActivePair] = useState("BTC/USD");
  const [expanded, setExpanded] = useState(false);

  const toggleIndicator = (ind: string) => {
    setActiveIndicators((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
  };

  return (
    <div className="space-y-4">
      {/* Pair tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {pairs.map((p) => (
          <button
            key={p}
            onClick={() => setActivePair(p)}
            className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
              activePair === p ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {p}
          </button>
        ))}
        <button className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Chart area */}
      <div className={`glass rounded-2xl p-5 transition-all ${expanded ? "fixed inset-4 z-50" : ""}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{activePair}</h2>
            <span className="text-2xl font-bold font-mono-num text-foreground">67,432.50</span>
            <span className="text-sm font-mono-num text-profit ml-2">+2.34%</span>
          </div>
          <div className="flex items-center gap-2">
            {["1m", "5m", "15m", "1H", "4H", "1D", "1W"].map((tf, i) => (
              <button key={tf} className={`px-2.5 py-1 text-xs rounded transition-colors ${i === 3 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
                {tf}
              </button>
            ))}
            <button onClick={() => setExpanded(!expanded)} className="ml-2 p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors">
              {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="h-[400px] flex items-end">
          <CandlestickChart />
        </div>
      </div>

      {/* Indicators */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Indicators</h3>
        <div className="flex flex-wrap gap-2">
          {indicators.map((ind) => (
            <button
              key={ind}
              onClick={() => toggleIndicator(ind)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                activeIndicators.includes(ind)
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
        {activeIndicators.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeIndicators.map((ind) => (
              <div key={ind} className="bg-muted/50 rounded-xl p-4">
                <p className="text-xs font-medium text-foreground mb-2">{ind}</p>
                <div className="h-16 flex items-center justify-center">
                  <svg viewBox="0 0 120 40" className="w-full h-full">
                    <polyline
                      points={ind === "RSI" ? "0,30 20,25 40,15 60,20 80,10 100,18 120,12" : "0,20 20,22 40,18 60,15 80,20 100,12 120,16"}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
