import { useState } from "react";
import { Bell, Plus, Zap, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";

const signals = [
  { type: "AI Signal", asset: "BTC/USD", action: "Long", confidence: "87%", entry: "$66,800", sl: "$65,500", tp: "$69,200", time: "12 min ago", icon: Zap },
  { type: "Price Alert", asset: "ETH/USD", action: "Triggered", confidence: "-", entry: "Above $3,900", sl: "-", tp: "-", time: "34 min ago", icon: Bell },
  { type: "Breakout", asset: "NVDA", action: "Long", confidence: "74%", entry: "$885", sl: "$870", tp: "$920", time: "1h ago", icon: TrendingUp },
  { type: "Volatility", asset: "EUR/USD", action: "Caution", confidence: "-", entry: "VIX spike +18%", sl: "-", tp: "-", time: "2h ago", icon: AlertTriangle },
  { type: "Strategy", asset: "SOL/USD", action: "Short", confidence: "68%", entry: "$175.40", sl: "$180.20", tp: "$165.00", time: "3h ago", icon: BarChart3 },
];

export default function SignalsPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {["All", "AI Signals", "Price Alerts", "Breakouts", "Strategy"].map((f, i) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${filter === f ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>{f}</button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Alert
        </button>
      </div>

      <div className="space-y-3">
        {signals.map((s, i) => (
          <div key={i} className="glass rounded-xl p-5 hover:border-primary/20 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{s.asset}</span>
                    <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                      s.action === "Long" ? "bg-profit/10 text-profit" : s.action === "Short" ? "bg-loss/10 text-loss" : "bg-muted text-muted-foreground"
                    }`}>{s.action}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.type} · {s.time}</p>
                </div>
              </div>
              {s.confidence !== "-" && (
                <span className="text-sm font-mono-num text-primary font-semibold">{s.confidence}</span>
              )}
            </div>
            {s.entry !== "-" && (
              <div className="flex gap-6 mt-3 text-xs">
                <span className="text-muted-foreground">Entry: <span className="text-foreground font-mono-num">{s.entry}</span></span>
                {s.sl !== "-" && <span className="text-muted-foreground">SL: <span className="text-loss font-mono-num">{s.sl}</span></span>}
                {s.tp !== "-" && <span className="text-muted-foreground">TP: <span className="text-profit font-mono-num">{s.tp}</span></span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
