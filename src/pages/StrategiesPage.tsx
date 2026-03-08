import { useState } from "react";
import { Play, Pause, Plus, Zap, BarChart3, ArrowRightLeft } from "lucide-react";

const strategies = [
  { name: "EMA Crossover", status: "running", pnl: "+$2,340", trades: 142, winRate: "67%", pair: "BTC/USD" },
  { name: "RSI Reversal", status: "paused", pnl: "+$890", trades: 87, winRate: "58%", pair: "ETH/USD" },
  { name: "Breakout Scanner", status: "running", pnl: "+$4,120", trades: 56, winRate: "72%", pair: "Multi" },
  { name: "Mean Reversion", status: "stopped", pnl: "-$320", trades: 34, winRate: "44%", pair: "EUR/USD" },
];

const conditions = ["Price above EMA 20", "RSI < 30", "Volume spike > 2x", "MACD crossover", "Support bounce"];

export default function StrategiesPage() {
  const [activeTab, setActiveTab] = useState<"my" | "builder">("my");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setActiveTab("my")} className={`px-4 py-2 text-sm rounded-lg transition-colors ${activeTab === "my" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}>
          My Strategies
        </button>
        <button onClick={() => setActiveTab("builder")} className={`px-4 py-2 text-sm rounded-lg transition-colors ${activeTab === "builder" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}>
          Strategy Builder
        </button>
      </div>

      {activeTab === "my" ? (
        <div className="space-y-4">
          {strategies.map((s, i) => (
            <div key={i} className="glass rounded-xl p-5 hover:border-primary/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.pair} · {s.trades} trades</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-mono-num font-semibold ${s.pnl.startsWith("+") ? "text-profit" : "text-loss"}`}>{s.pnl}</p>
                    <p className="text-xs text-muted-foreground">Win rate: {s.winRate}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    s.status === "running" ? "bg-profit/10 text-profit" : s.status === "paused" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {s.status}
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    {s.status === "running" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full glass rounded-xl p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/20 transition-colors">
            <Plus className="w-4 h-4" /> Create New Strategy
          </button>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Visual Rule Builder</h3>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Entry Conditions (AND)</p>
            {conditions.slice(0, 3).map((c, i) => (
              <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                <ArrowRightLeft className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{c}</span>
              </div>
            ))}
            <button className="w-full bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Condition
            </button>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider pt-4">Exit Conditions</p>
            {conditions.slice(3).map((c, i) => (
              <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                <ArrowRightLeft className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-sm text-foreground">{c}</span>
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <button className="px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Backtest Strategy
              </button>
              <button className="px-6 py-2.5 rounded-lg glass text-foreground text-sm font-medium hover:border-primary/30 transition-colors">
                Deploy Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
