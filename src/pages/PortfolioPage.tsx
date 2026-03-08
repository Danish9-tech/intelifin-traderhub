import { useState } from "react";
import { Briefcase, TrendingUp, PieChart, Shield, Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Holding {
  id: number;
  asset: string;
  symbol: string;
  amount: string;
  value: number;
  pnl: number;
  up: boolean;
}

const initialHoldings: Holding[] = [
  { id: 1, asset: "Bitcoin", symbol: "BTC", amount: "1.42", value: 95754, pnl: 12340, up: true },
  { id: 2, asset: "Ethereum", symbol: "ETH", amount: "12.5", value: 48640, pnl: 5890, up: true },
  { id: 3, asset: "Apple", symbol: "AAPL", amount: "150", value: 29768, pnl: 2140, up: true },
  { id: 4, asset: "Gold", symbol: "XAU", amount: "5 oz", value: 11709, pnl: 430, up: true },
  { id: 5, asset: "Euro (Forex)", symbol: "EUR/USD", amount: "50k", value: 18200, pnl: -320, up: false },
  { id: 6, asset: "Solana", symbol: "SOL", amount: "145", value: 24991, pnl: -1240, up: false },
];

// Mini chart SVG
function MiniChart({ up = true }: { up?: boolean }) {
  const points = up
    ? "0,40 15,35 30,38 45,25 60,28 75,15 90,18 105,10 120,12"
    : "0,10 15,15 30,12 45,25 60,22 75,35 90,32 105,40 120,38";
  return (
    <svg viewBox="0 0 120 50" className="w-full h-12">
      <polyline points={points} fill="none" stroke={up ? "hsl(var(--profit))" : "hsl(var(--loss))"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState(initialHoldings);
  const [showAdd, setShowAdd] = useState(false);
  const [newAsset, setNewAsset] = useState("");
  const [newSymbol, setNewSymbol] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newValue, setNewValue] = useState("");

  const totalValue = holdings.reduce((a, h) => a + h.value, 0);
  const totalPnl = holdings.reduce((a, h) => a + h.pnl, 0);

  const removeHolding = (id: number) => {
    const h = holdings.find((x) => x.id === id);
    setHoldings((prev) => prev.filter((x) => x.id !== id));
    toast({ title: `${h?.asset} removed from portfolio`, variant: "destructive" });
  };

  const addHolding = () => {
    if (!newAsset || !newSymbol || !newValue) {
      toast({ title: "Fill in all fields", variant: "destructive" });
      return;
    }
    const h: Holding = {
      id: Date.now(),
      asset: newAsset,
      symbol: newSymbol.toUpperCase(),
      amount: newAmount || "1",
      value: parseFloat(newValue),
      pnl: Math.round((Math.random() - 0.3) * 3000),
      up: Math.random() > 0.3,
    };
    setHoldings((prev) => [...prev, h]);
    toast({ title: `${newAsset} added to portfolio` });
    setShowAdd(false);
    setNewAsset(""); setNewSymbol(""); setNewAmount(""); setNewValue("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Briefcase className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Total Value</span></div>
          <p className="text-xl font-bold font-mono-num text-foreground">${totalValue.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Total P&L</span></div>
          <p className={`text-xl font-bold font-mono-num ${totalPnl >= 0 ? "text-profit" : "text-loss"}`}>{totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><PieChart className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Assets</span></div>
          <p className="text-xl font-bold font-mono-num text-foreground">{holdings.length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Shield className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Risk Score</span></div>
          <p className="text-xl font-bold text-foreground">{holdings.length > 4 ? "Medium" : "High"}</p>
        </div>
      </div>

      {/* Allocation bar */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Asset Allocation</h3>
        <div className="flex gap-0.5 h-4 rounded-full overflow-hidden">
          {holdings.map((h, i) => {
            const pct = (h.value / totalValue) * 100;
            const colors = ["bg-primary", "bg-secondary", "bg-profit", "bg-loss", "bg-muted-foreground", "bg-accent-foreground/50", "bg-primary/60", "bg-secondary/60"];
            return <div key={h.id} className={`${colors[i % colors.length]} transition-all`} style={{ width: `${pct}%` }} title={`${h.symbol}: ${pct.toFixed(1)}%`} />;
          })}
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {holdings.map((h) => (
            <span key={h.id} className="text-xs text-muted-foreground">{h.symbol}: {((h.value / totalValue) * 100).toFixed(1)}%</span>
          ))}
        </div>
      </div>

      {/* Add holding */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Holdings</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Asset
        </button>
      </div>

      {showAdd && (
        <div className="glass rounded-xl p-5 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input value={newAsset} onChange={(e) => setNewAsset(e.target.value)} placeholder="Asset name" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
            <input value={newSymbol} onChange={(e) => setNewSymbol(e.target.value)} placeholder="Symbol" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
            <input value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="Amount" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
            <input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Value ($)" type="number" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <button onClick={addHolding} className="px-5 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Add to Portfolio</button>
        </div>
      )}

      {/* Holdings table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border text-xs font-medium text-muted-foreground">
          <span>Asset</span>
          <span className="text-right w-24">Holdings</span>
          <span className="text-right w-24">Value</span>
          <span className="text-right w-16">Chart</span>
          <span className="text-right w-24">P&L</span>
          <span className="w-8" />
        </div>
        {holdings.map((h) => (
          <div key={h.id} className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border/50 items-center hover:bg-muted/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-foreground">{h.asset}</p>
              <p className="text-xs text-muted-foreground">{h.symbol}</p>
            </div>
            <span className="text-sm font-mono-num text-foreground text-right w-24">{h.amount}</span>
            <span className="text-sm font-mono-num text-foreground text-right w-24">${h.value.toLocaleString()}</span>
            <div className="w-16"><MiniChart up={h.up} /></div>
            <span className={`text-sm font-mono-num font-semibold text-right w-24 ${h.pnl >= 0 ? "text-profit" : "text-loss"}`}>{h.pnl >= 0 ? "+" : ""}${h.pnl.toLocaleString()}</span>
            <button onClick={() => removeHolding(h.id)} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-loss transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
