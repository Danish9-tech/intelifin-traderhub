import { motion } from "framer-motion";
import { MarketTicker, StatCard, WatchlistWidget, CandlestickChart, RecentTrades } from "../components/dashboard/MarketWidgets";
import { AIChatWidget } from "../components/dashboard/AIChatWidget";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <MarketTicker />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Portfolio Value" value="$127,432.50" change="+$2,341.20 (1.87%)" up delay={0} />
        <StatCard title="Today's P&L" value="+$1,892.30" change="+1.52% today" up delay={0.05} />
        <StatCard title="Win Rate" value="68.4%" change="+2.1% this week" up delay={0.1} />
        <StatCard title="Open Positions" value="7" change="3 in profit" up delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2 glass rounded-2xl p-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">BTC/USD</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-bold font-mono-num text-foreground">67,432.50</span>
                <span className="text-sm font-mono-num text-profit">+2.34%</span>
              </div>
            </div>
            <div className="flex gap-1">
              {["1H", "4H", "1D", "1W"].map((tf, i) => (
                <button key={tf} className={`px-3 py-1 text-xs rounded-md transition-colors ${i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <CandlestickChart />
        </motion.div>
        <WatchlistWidget />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIChatWidget />
        </div>
        <RecentTrades />
      </div>
    </div>
  );
}
