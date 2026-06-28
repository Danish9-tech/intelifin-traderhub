import { useState } from "react";
import { Briefcase, TrendingUp, PieChart, Shield, Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAddHolding, useDeleteHolding, useHoldings, usePortfolioSummary } from "@/hooks/use-trading-data";

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
  const { data: holdings = [], isLoading } = useHoldings();
  const { data: summary } = usePortfolioSummary();
  const addHolding = useAddHolding();
  const deleteHolding = useDeleteHolding();

  const [showAdd, setShowAdd] = useState(false);
  const [newAsset, setNewAsset] = useState("");
  const [newSymbol, setNewSymbol] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newValue, setNewValue] = useState("");

  const totalValue = summary?.totalValue ?? 0;
  const totalPnl = summary?.totalPnl ?? 0;

  const removeHolding = async (id: number, asset: string) => {
    try {
      await deleteHolding.mutateAsync(id);
      toast({ title: `${asset} removed from portfolio`, variant: "destructive" });
    } catch (error) {
      toast({ title: "Delete failed", description: error instanceof Error ? error.message : "Unexpected error", variant: "destructive" });
    }
  };

  const submitHolding = async () => {
    if (!newAsset || !newSymbol || !newValue || !newAmount) {
      toast({ title: "Fill in all fields", variant: "destructive" });
      return;
    }

    try {
      await addHolding.mutateAsync({
        asset: newAsset,
        symbol: newSymbol,
        amount: Number(newAmount),
        value: Number(newValue),
        pnl: 0,
      });
      toast({ title: `${newAsset} added to portfolio` });
      setShowAdd(false);
      setNewAsset("");
      setNewSymbol("");
      setNewAmount("");
      setNewValue("");
    } catch (error) {
      toast({ title: "Create failed", description: error instanceof Error ? error.message : "Unexpected error", variant: "destructive" });
    }
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
          <p className="text-xl font-bold font-mono-num text-foreground">{summary?.count ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Shield className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Risk Score</span></div>
          <p className="text-xl font-bold text-foreground">{(summary?.count ?? 0) > 4 ? "Medium" : "High"}</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Asset Allocation</h3>
        <div className="flex gap-0.5 h-4 rounded-full overflow-hidden">
          {holdings.map((h, i) => {
            const pct = totalValue > 0 ? (h.value / totalValue) * 100 : 0;
            const colors = ["bg-primary", "bg-secondary", "bg-profit", "bg-loss", "bg-muted-foreground", "bg-accent-foreground/50", "bg-primary/60", "bg-secondary/60"];
            return <div key={h.id} className={`${colors[i % colors.length]} transition-all`} style={{ width: `${pct}%` }} title={`${h.symbol}: ${pct.toFixed(1)}%`} />;
          })}
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {holdings.map((h) => (
            <span key={h.id} className="text-xs text-muted-foreground">{h.symbol}: {totalValue > 0 ? ((h.value / totalValue) * 100).toFixed(1) : "0.0"}%</span>
          ))}
        </div>
      </div>

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
            <input value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="Amount" type="number" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
            <input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Value ($)" type="number" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <button onClick={submitHolding} className="px-5 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Add to Portfolio</button>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border text-xs font-medium text-muted-foreground">
          <span>Asset</span>
          <span className="text-right w-24">Holdings</span>
          <span className="text-right w-24">Value</span>
          <span className="text-right w-16">Chart</span>
          <span className="text-right w-24">P&L</span>
          <span className="w-8" />
        </div>
        {isLoading && <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading holdings...</div>}
        {!isLoading && holdings.map((h) => (
          <div key={h.id} className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border/50 items-center hover:bg-muted/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-foreground">{h.asset}</p>
              <p className="text-xs text-muted-foreground">{h.symbol}</p>
            </div>
            <span className="text-sm font-mono-num text-foreground text-right w-24">{h.amount}</span>
            <span className="text-sm font-mono-num text-foreground text-right w-24">${h.value.toLocaleString()}</span>
            <div className="w-16"><MiniChart up={h.pnl >= 0} /></div>
            <span className={`text-sm font-mono-num font-semibold text-right w-24 ${h.pnl >= 0 ? "text-profit" : "text-loss"}`}>{h.pnl >= 0 ? "+" : ""}${h.pnl.toLocaleString()}</span>
            <button onClick={() => removeHolding(h.id, h.asset)} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-loss transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
