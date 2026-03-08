import { useState } from "react";
import { Bell, Plus, Zap, TrendingUp, AlertTriangle, BarChart3, Trash2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Signal {
  id: number;
  type: string;
  asset: string;
  action: string;
  confidence: string;
  entry: string;
  sl: string;
  tp: string;
  time: string;
  icon: typeof Zap;
  dismissed: boolean;
}

const initialSignals: Signal[] = [
  { id: 1, type: "AI Signal", asset: "BTC/USD", action: "Long", confidence: "87%", entry: "$66,800", sl: "$65,500", tp: "$69,200", time: "12 min ago", icon: Zap, dismissed: false },
  { id: 2, type: "Price Alert", asset: "ETH/USD", action: "Triggered", confidence: "-", entry: "Above $3,900", sl: "-", tp: "-", time: "34 min ago", icon: Bell, dismissed: false },
  { id: 3, type: "Breakout", asset: "NVDA", action: "Long", confidence: "74%", entry: "$885", sl: "$870", tp: "$920", time: "1h ago", icon: TrendingUp, dismissed: false },
  { id: 4, type: "Volatility", asset: "EUR/USD", action: "Caution", confidence: "-", entry: "VIX spike +18%", sl: "-", tp: "-", time: "2h ago", icon: AlertTriangle, dismissed: false },
  { id: 5, type: "Strategy", asset: "SOL/USD", action: "Short", confidence: "68%", entry: "$175.40", sl: "$180.20", tp: "$165.00", time: "3h ago", icon: BarChart3, dismissed: false },
  { id: 6, type: "AI Signal", asset: "XAU/USD", action: "Long", confidence: "81%", entry: "$2,330", sl: "$2,310", tp: "$2,365", time: "4h ago", icon: Zap, dismissed: false },
  { id: 7, type: "Breakout", asset: "AAPL", action: "Long", confidence: "72%", entry: "$196.50", sl: "$193.00", tp: "$205.00", time: "5h ago", icon: TrendingUp, dismissed: false },
];

const filterOptions = ["All", "AI Signals", "Price Alerts", "Breakouts", "Strategy"];

export default function SignalsPage() {
  const [signals, setSignals] = useState(initialSignals);
  const [filter, setFilter] = useState("All");
  const [showNewAlert, setShowNewAlert] = useState(false);
  const [newAsset, setNewAsset] = useState("");
  const [newType, setNewType] = useState("Price Alert");
  const [newCondition, setNewCondition] = useState("");

  const filtered = signals.filter((s) => {
    if (s.dismissed) return false;
    if (filter === "All") return true;
    if (filter === "AI Signals") return s.type === "AI Signal";
    if (filter === "Price Alerts") return s.type === "Price Alert";
    if (filter === "Breakouts") return s.type === "Breakout";
    if (filter === "Strategy") return s.type === "Strategy";
    return true;
  });

  const dismissSignal = (id: number) => {
    setSignals((prev) => prev.map((s) => s.id === id ? { ...s, dismissed: true } : s));
    toast({ title: "Signal dismissed" });
  };

  const deleteSignal = (id: number) => {
    setSignals((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Signal deleted", variant: "destructive" });
  };

  const createAlert = () => {
    if (!newAsset || !newCondition) {
      toast({ title: "Fill in all fields", variant: "destructive" });
      return;
    }
    const alert: Signal = {
      id: Date.now(),
      type: newType,
      asset: newAsset.toUpperCase(),
      action: "Pending",
      confidence: "-",
      entry: newCondition,
      sl: "-", tp: "-",
      time: "Just now",
      icon: Bell,
      dismissed: false,
    };
    setSignals((prev) => [alert, ...prev]);
    toast({ title: `Alert created for ${newAsset.toUpperCase()}` });
    setShowNewAlert(false);
    setNewAsset(""); setNewCondition("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-1">
          {filterOptions.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${filter === f ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>{f}</button>
          ))}
        </div>
        <button onClick={() => setShowNewAlert(!showNewAlert)} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Alert
        </button>
      </div>

      {showNewAlert && (
        <div className="glass rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Create Alert</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={newAsset} onChange={(e) => setNewAsset(e.target.value)} placeholder="Asset (e.g. BTC/USD)" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
            <select value={newType} onChange={(e) => setNewType(e.target.value)} className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary">
              <option>Price Alert</option>
              <option>Breakout</option>
              <option>Volatility</option>
              <option>Strategy</option>
            </select>
            <input value={newCondition} onChange={(e) => setNewCondition(e.target.value)} placeholder="Condition (e.g. Above $70,000)" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <button onClick={createAlert} className="px-5 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Create Alert</button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">{filtered.length} active signals</p>

      <div className="space-y-3">
        {filtered.map((s) => (
          <div key={s.id} className="glass rounded-xl p-5 hover:border-primary/20 transition-colors">
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
              <div className="flex items-center gap-2">
                {s.confidence !== "-" && (
                  <span className="text-sm font-mono-num text-primary font-semibold">{s.confidence}</span>
                )}
                <button onClick={() => dismissSignal(s.id)} className="w-7 h-7 rounded bg-muted flex items-center justify-center text-muted-foreground hover:text-profit transition-colors" title="Dismiss">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteSignal(s.id)} className="w-7 h-7 rounded bg-muted flex items-center justify-center text-muted-foreground hover:text-loss transition-colors" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
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
