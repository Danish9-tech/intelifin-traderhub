import { useState } from "react";
import { Play, Pause, Plus, Zap, Trash2, ArrowRightLeft, X, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Strategy {
  id: number;
  name: string;
  status: "running" | "paused" | "stopped";
  pnl: string;
  trades: number;
  winRate: string;
  pair: string;
}

const initialStrategies: Strategy[] = [
  { id: 1, name: "EMA Crossover", status: "running", pnl: "+$2,340", trades: 142, winRate: "67%", pair: "BTC/USD" },
  { id: 2, name: "RSI Reversal", status: "paused", pnl: "+$890", trades: 87, winRate: "58%", pair: "ETH/USD" },
  { id: 3, name: "Breakout Scanner", status: "running", pnl: "+$4,120", trades: 56, winRate: "72%", pair: "Multi" },
  { id: 4, name: "Mean Reversion", status: "stopped", pnl: "-$320", trades: 34, winRate: "44%", pair: "EUR/USD" },
];

const availableConditions = [
  "Price above EMA 20", "Price below EMA 50", "RSI < 30", "RSI > 70", "Volume spike > 2x",
  "MACD crossover", "MACD bearish cross", "Support bounce", "Resistance rejection",
  "Bollinger squeeze", "ATR expansion", "Stochastic oversold",
];

export default function StrategiesPage() {
  const [activeTab, setActiveTab] = useState<"my" | "builder">("my");
  const [strategies, setStrategies] = useState(initialStrategies);
  const [entryConditions, setEntryConditions] = useState(["Price above EMA 20", "RSI < 30", "Volume spike > 2x"]);
  const [exitConditions, setExitConditions] = useState(["MACD crossover", "Support bounce"]);
  const [builderName, setBuilderName] = useState("New Strategy");
  const [builderPair, setBuilderPair] = useState("BTC/USD");

  const toggleStatus = (id: number) => {
    setStrategies((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next = s.status === "running" ? "paused" : "running";
        toast({ title: `${s.name} ${next}` });
        return { ...s, status: next as Strategy["status"] };
      })
    );
  };

  const deleteStrategy = (id: number) => {
    const s = strategies.find((x) => x.id === id);
    setStrategies((prev) => prev.filter((x) => x.id !== id));
    toast({ title: `${s?.name} deleted`, variant: "destructive" });
  };

  const duplicateStrategy = (id: number) => {
    const s = strategies.find((x) => x.id === id);
    if (!s) return;
    const copy: Strategy = { ...s, id: Date.now(), name: `${s.name} (Copy)`, status: "stopped", trades: 0, pnl: "$0" };
    setStrategies((prev) => [...prev, copy]);
    toast({ title: `${s.name} duplicated` });
  };

  const createStrategy = () => {
    const newS: Strategy = {
      id: Date.now(),
      name: builderName,
      status: "stopped",
      pnl: "$0",
      trades: 0,
      winRate: "0%",
      pair: builderPair,
    };
    setStrategies((prev) => [...prev, newS]);
    toast({ title: `Strategy "${builderName}" created!` });
    setActiveTab("my");
  };

  const addCondition = (type: "entry" | "exit") => {
    const used = [...entryConditions, ...exitConditions];
    const available = availableConditions.filter((c) => !used.includes(c));
    if (available.length === 0) {
      toast({ title: "All conditions used" });
      return;
    }
    if (type === "entry") setEntryConditions((prev) => [...prev, available[0]]);
    else setExitConditions((prev) => [...prev, available[0]]);
  };

  const removeCondition = (type: "entry" | "exit", cond: string) => {
    if (type === "entry") setEntryConditions((prev) => prev.filter((c) => c !== cond));
    else setExitConditions((prev) => prev.filter((c) => c !== cond));
  };

  const backtest = () => {
    toast({ title: "Backtesting...", description: `Running ${builderName} on ${builderPair} historical data. Results in ~5s.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setActiveTab("my")} className={`px-4 py-2 text-sm rounded-lg transition-colors ${activeTab === "my" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}>
          My Strategies ({strategies.length})
        </button>
        <button onClick={() => setActiveTab("builder")} className={`px-4 py-2 text-sm rounded-lg transition-colors ${activeTab === "builder" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}>
          Strategy Builder
        </button>
      </div>

      {activeTab === "my" ? (
        <div className="space-y-4">
          {strategies.length === 0 && (
            <div className="glass rounded-xl p-8 text-center text-sm text-muted-foreground">No strategies yet. Create one in the Strategy Builder!</div>
          )}
          {strategies.map((s) => (
            <div key={s.id} className="glass rounded-xl p-5 hover:border-primary/20 transition-colors">
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
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-mono-num font-semibold ${s.pnl.startsWith("+") || s.pnl === "$0" ? "text-profit" : "text-loss"}`}>{s.pnl}</p>
                    <p className="text-xs text-muted-foreground">Win rate: {s.winRate}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    s.status === "running" ? "bg-profit/10 text-profit" : s.status === "paused" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {s.status}
                  </div>
                  <button onClick={() => toggleStatus(s.id)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    {s.status === "running" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => duplicateStrategy(s.id)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteStrategy(s.id)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-loss transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setActiveTab("builder")} className="w-full glass rounded-xl p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/20 transition-colors">
            <Plus className="w-4 h-4" /> Create New Strategy
          </button>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Strategy Name</label>
              <input value={builderName} onChange={(e) => setBuilderName(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Trading Pair</label>
              <select value={builderPair} onChange={(e) => setBuilderPair(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary">
                {["BTC/USD", "ETH/USD", "EUR/USD", "AAPL", "XAU/USD", "Multi"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Entry Conditions (AND)</p>
            {entryConditions.map((c) => (
              <div key={c} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 mb-2">
                <ArrowRightLeft className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground flex-1">{c}</span>
                <button onClick={() => removeCondition("entry", c)} className="text-muted-foreground hover:text-loss"><X className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => addCondition("entry")} className="w-full bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Entry Condition
            </button>
          </div>

          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Exit Conditions</p>
            {exitConditions.map((c) => (
              <div key={c} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 mb-2">
                <ArrowRightLeft className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-sm text-foreground flex-1">{c}</span>
                <button onClick={() => removeCondition("exit", c)} className="text-muted-foreground hover:text-loss"><X className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => addCondition("exit")} className="w-full bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Exit Condition
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={backtest} className="px-6 py-2.5 rounded-lg glass text-foreground text-sm font-medium hover:border-primary/30 transition-colors">
              Backtest Strategy
            </button>
            <button onClick={createStrategy} className="px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Save & Deploy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
