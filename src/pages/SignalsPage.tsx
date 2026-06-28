import { useMemo, useState } from "react";
import { Bell, Plus, Zap, TrendingUp, AlertTriangle, BarChart3, Trash2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAlerts, useCreateAlert, useDeleteAlert, useDismissAlert } from "@/hooks/use-trading-data";

const filterOptions = ["All", "Price Alert", "Breakout", "Volatility", "Strategy"];

const iconMap: Record<string, typeof Bell> = {
  "Price Alert": Bell,
  Breakout: TrendingUp,
  Volatility: AlertTriangle,
  Strategy: BarChart3,
  "AI Signal": Zap,
};

export default function SignalsPage() {
  const [filter, setFilter] = useState("All");
  const [showNewAlert, setShowNewAlert] = useState(false);
  const [newAsset, setNewAsset] = useState("");
  const [newType, setNewType] = useState("Price Alert");
  const [newCondition, setNewCondition] = useState("");

  const { data: alerts = [], isLoading } = useAlerts();
  const createAlert = useCreateAlert();
  const dismissAlert = useDismissAlert();
  const deleteAlert = useDeleteAlert();

  const filtered = useMemo(() => {
    return alerts.filter((s) => {
      if (filter === "All") return true;
      return s.type === filter;
    });
  }, [alerts, filter]);

  const onDismiss = async (id: number) => {
    try {
      await dismissAlert.mutateAsync(id);
      toast({ title: "Signal dismissed" });
    } catch (error) {
      toast({ title: "Dismiss failed", description: error instanceof Error ? error.message : "Unexpected error", variant: "destructive" });
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteAlert.mutateAsync(id);
      toast({ title: "Signal deleted", variant: "destructive" });
    } catch (error) {
      toast({ title: "Delete failed", description: error instanceof Error ? error.message : "Unexpected error", variant: "destructive" });
    }
  };

  const create = async () => {
    if (!newAsset || !newCondition) {
      toast({ title: "Fill in all fields", variant: "destructive" });
      return;
    }

    try {
      await createAlert.mutateAsync({ type: newType, asset: newAsset, condition: newCondition });
      toast({ title: `Alert created for ${newAsset.toUpperCase()}` });
      setShowNewAlert(false);
      setNewAsset("");
      setNewCondition("");
    } catch (error) {
      toast({ title: "Create failed", description: error instanceof Error ? error.message : "Unexpected error", variant: "destructive" });
    }
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
          <button onClick={create} className="px-5 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Create Alert</button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">{filtered.length} active signals</p>

      {isLoading && <div className="glass rounded-xl p-8 text-center text-sm text-muted-foreground">Loading alerts...</div>}

      <div className="space-y-3">
        {!isLoading && filtered.map((s) => {
          const Icon = iconMap[s.type] || Bell;
          return (
            <div key={s.id} className="glass rounded-xl p-5 hover:border-primary/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{s.asset}</span>
                      <span className="px-2 py-0.5 text-xs rounded font-medium bg-muted text-muted-foreground">{s.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.type} · {s.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onDismiss(s.id)} className="w-7 h-7 rounded bg-muted flex items-center justify-center text-muted-foreground hover:text-profit transition-colors" title="Dismiss">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onDelete(s.id)} className="w-7 h-7 rounded bg-muted flex items-center justify-center text-muted-foreground hover:text-loss transition-colors" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-6 mt-3 text-xs">
                <span className="text-muted-foreground">Condition: <span className="text-foreground font-mono-num">{s.condition}</span></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
