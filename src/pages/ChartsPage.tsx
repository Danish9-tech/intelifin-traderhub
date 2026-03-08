import { useState, useMemo } from "react";
import { Maximize2, Minimize2, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const allPairs = ["BTC/USD", "ETH/USD", "EUR/USD", "AAPL", "XAU/USD", "SOL/USD", "NVDA", "GBP/USD", "USD/JPY"];
const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D", "1W"];
const indicators = ["RSI", "MACD", "EMA 20", "EMA 50", "Bollinger", "VWAP", "Volume", "ADX", "ATR", "Supertrend", "Stochastic", "Ichimoku"];

const priceData: Record<string, { price: string; change: string; up: boolean }> = {
  "BTC/USD": { price: "67,432.50", change: "+2.34%", up: true },
  "ETH/USD": { price: "3,891.20", change: "+1.87%", up: true },
  "EUR/USD": { price: "1.0892", change: "-0.12%", up: false },
  "AAPL": { price: "198.45", change: "+0.65%", up: true },
  "XAU/USD": { price: "2,341.80", change: "+0.43%", up: true },
  "SOL/USD": { price: "172.35", change: "-1.24%", up: false },
  "NVDA": { price: "892.30", change: "+3.12%", up: true },
  "GBP/USD": { price: "1.2734", change: "+0.08%", up: true },
  "USD/JPY": { price: "151.23", change: "+0.34%", up: true },
};

function generateCandles(seed: number, count = 20) {
  const candles = [];
  let base = 30 + seed * 7;
  for (let i = 0; i < count; i++) {
    const open = base + (Math.sin(i * 0.8 + seed) * 10);
    const close = open + (Math.sin(i * 1.2 + seed * 2) * 8);
    const high = Math.min(open, close) - Math.abs(Math.sin(i + seed)) * 5;
    const low = Math.max(open, close) + Math.abs(Math.cos(i + seed)) * 5;
    candles.push({ o: open, c: close, h: high, l: low });
    base = close;
  }
  return candles;
}

function generateIndicatorData(seed: number) {
  const points = [];
  for (let i = 0; i < 12; i++) {
    points.push(20 + Math.sin(i * 0.7 + seed) * 15);
  }
  return points.map((y, i) => `${i * 11},${y}`).join(" ");
}

function CandlestickSVG({ seed }: { seed: number }) {
  const candles = useMemo(() => generateCandles(seed), [seed]);
  return (
    <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
      {candles.map((c, i) => {
        const x = i * 20 + 2;
        const bullish = c.c < c.o;
        const color = bullish ? "hsl(var(--profit))" : "hsl(var(--loss))";
        const bodyTop = Math.min(c.o, c.c);
        const bodyHeight = Math.abs(c.o - c.c);
        return (
          <g key={i}>
            <line x1={x + 5} y1={c.h} x2={x + 5} y2={c.l} stroke={color} strokeWidth="1" />
            <rect x={x} y={bodyTop} width="10" height={Math.max(bodyHeight, 1)} fill={color} rx="1" />
          </g>
        );
      })}
    </svg>
  );
}

export default function ChartsPage() {
  const [openPairs, setOpenPairs] = useState(["BTC/USD", "ETH/USD", "EUR/USD"]);
  const [activePair, setActivePair] = useState("BTC/USD");
  const [activeTf, setActiveTf] = useState("1H");
  const [activeIndicators, setActiveIndicators] = useState<string[]>(["RSI", "EMA 20"]);
  const [expanded, setExpanded] = useState(false);

  const addPair = () => {
    const available = allPairs.filter((p) => !openPairs.includes(p));
    if (available.length === 0) {
      toast({ title: "All pairs already open" });
      return;
    }
    const next = available[0];
    setOpenPairs((prev) => [...prev, next]);
    setActivePair(next);
    toast({ title: `${next} chart opened` });
  };

  const closePair = (pair: string) => {
    if (openPairs.length <= 1) return;
    setOpenPairs((prev) => prev.filter((p) => p !== pair));
    if (activePair === pair) setActivePair(openPairs.find((p) => p !== pair)!);
  };

  const toggleIndicator = (ind: string) => {
    setActiveIndicators((prev) => {
      const has = prev.includes(ind);
      if (has) {
        toast({ title: `${ind} removed` });
        return prev.filter((i) => i !== ind);
      }
      toast({ title: `${ind} added to chart` });
      return [...prev, ind];
    });
  };

  const data = priceData[activePair] || { price: "0.00", change: "0.00%", up: true };
  const seed = activePair.charCodeAt(0) + activePair.charCodeAt(1) + timeframes.indexOf(activeTf);

  return (
    <div className="space-y-4">
      {/* Pair tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {openPairs.map((p) => (
          <div
            key={p}
            className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activePair === p ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <span onClick={() => setActivePair(p)}>{p}</span>
            {openPairs.length > 1 && (
              <button onClick={() => closePair(p)} className="ml-1 hover:text-loss transition-colors">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        <button onClick={addPair} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Chart area */}
      <div className={`glass rounded-2xl p-5 transition-all ${expanded ? "fixed inset-4 z-50" : ""}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{activePair}</h2>
            <span className={`text-2xl font-bold font-mono-num ${data.up ? "text-foreground" : "text-foreground"}`}>{data.price}</span>
            <span className={`text-sm font-mono-num ml-2 ${data.up ? "text-profit" : "text-loss"}`}>{data.change}</span>
          </div>
          <div className="flex items-center gap-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => { setActiveTf(tf); toast({ title: `Timeframe: ${tf}` }); }}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${activeTf === tf ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
              >
                {tf}
              </button>
            ))}
            <button onClick={() => setExpanded(!expanded)} className="ml-2 p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors">
              {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className={expanded ? "h-[calc(100vh-200px)]" : "h-[350px]"}>
          <CandlestickSVG seed={seed} />
        </div>
      </div>

      {/* Indicators */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Indicators ({activeIndicators.length} active)</h3>
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeIndicators.map((ind, idx) => (
              <div key={ind} className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-foreground">{ind}</p>
                  <button onClick={() => toggleIndicator(ind)} className="text-muted-foreground hover:text-loss transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="h-16">
                  <svg viewBox="0 0 120 40" className="w-full h-full">
                    <polyline
                      points={generateIndicatorData(idx + seed)}
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
