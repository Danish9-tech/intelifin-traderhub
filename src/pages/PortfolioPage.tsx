import { Briefcase, TrendingUp, PieChart, Shield } from "lucide-react";
import { MiniChart } from "../components/dashboard/MarketWidgets";

const holdings = [
  { asset: "Bitcoin", symbol: "BTC", amount: "1.42", value: "$95,754", allocation: "42%", pnl: "+$12,340", up: true },
  { asset: "Ethereum", symbol: "ETH", amount: "12.5", value: "$48,640", allocation: "21%", pnl: "+$5,890", up: true },
  { asset: "Apple", symbol: "AAPL", amount: "150", value: "$29,768", allocation: "13%", pnl: "+$2,140", up: true },
  { asset: "Gold", symbol: "XAU", amount: "5 oz", value: "$11,709", allocation: "5%", pnl: "+$430", up: true },
  { asset: "Euro (Forex)", symbol: "EUR/USD", amount: "50k", value: "$18,200", allocation: "8%", pnl: "-$320", up: false },
  { asset: "Solana", symbol: "SOL", amount: "145", value: "$24,991", allocation: "11%", pnl: "-$1,240", up: false },
];

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Briefcase, label: "Total Value", value: "$229,062", sub: "+$19,240" },
          { icon: TrendingUp, label: "Total P&L", value: "+$19,240", sub: "+9.2% all time" },
          { icon: PieChart, label: "Assets", value: "6", sub: "Across 4 categories" },
          { icon: Shield, label: "Risk Score", value: "Medium", sub: "68% correlated" },
        ].map((c, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <c.icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{c.label}</span>
            </div>
            <p className="text-xl font-bold font-mono-num text-foreground">{c.value}</p>
            <p className="text-xs text-profit mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Allocation visualization */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Asset Allocation</h3>
        <div className="flex gap-1 h-4 rounded-full overflow-hidden">
          {[
            { pct: 42, color: "bg-primary" },
            { pct: 21, color: "bg-secondary" },
            { pct: 13, color: "bg-profit" },
            { pct: 11, color: "bg-loss" },
            { pct: 8, color: "bg-muted-foreground" },
            { pct: 5, color: "bg-accent-foreground/50" },
          ].map((s, i) => (
            <div key={i} className={`${s.color} transition-all`} style={{ width: `${s.pct}%` }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {holdings.map((h) => (
            <span key={h.symbol} className="text-xs text-muted-foreground">{h.symbol}: {h.allocation}</span>
          ))}
        </div>
      </div>

      {/* Holdings table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border text-xs font-medium text-muted-foreground">
          <span>Asset</span>
          <span className="text-right w-24">Holdings</span>
          <span className="text-right w-24">Value</span>
          <span className="text-right w-16">Chart</span>
          <span className="text-right w-24">P&L</span>
        </div>
        {holdings.map((h) => (
          <div key={h.symbol} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border/50 items-center hover:bg-muted/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-foreground">{h.asset}</p>
              <p className="text-xs text-muted-foreground">{h.symbol}</p>
            </div>
            <span className="text-sm font-mono-num text-foreground text-right w-24">{h.amount}</span>
            <span className="text-sm font-mono-num text-foreground text-right w-24">{h.value}</span>
            <div className="w-16"><MiniChart up={h.up} /></div>
            <span className={`text-sm font-mono-num font-semibold text-right w-24 ${h.up ? "text-profit" : "text-loss"}`}>{h.pnl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
