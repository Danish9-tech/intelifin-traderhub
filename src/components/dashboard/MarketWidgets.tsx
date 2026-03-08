import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

const assets = [
  { symbol: "BTC/USD", price: "67,432.50", change: "+2.34%", up: true },
  { symbol: "ETH/USD", price: "3,891.20", change: "+1.87%", up: true },
  { symbol: "EUR/USD", price: "1.0892", change: "-0.12%", up: false },
  { symbol: "AAPL", price: "198.45", change: "+0.65%", up: true },
  { symbol: "GOLD", price: "2,341.80", change: "+0.43%", up: true },
  { symbol: "SOL/USD", price: "172.35", change: "-1.24%", up: false },
];

export function MarketTicker() {
  return (
    <div className="overflow-hidden glass-strong rounded-xl">
      <div className="flex animate-ticker">
        {[...assets, ...assets].map((a, i) => (
          <div key={i} className="flex items-center gap-3 px-6 py-3 border-r border-border whitespace-nowrap">
            <span className="text-sm font-medium text-foreground">{a.symbol}</span>
            <span className="text-sm font-mono-num text-foreground">{a.price}</span>
            <span className={`text-xs font-mono-num flex items-center gap-0.5 ${a.up ? "text-profit" : "text-loss"}`}>
              {a.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {a.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  up: boolean;
  delay?: number;
}

export function StatCard({ title, value, change, up, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -2 }}
      className="glass rounded-2xl p-5"
    >
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold font-mono-num text-foreground">{value}</p>
      <div className={`flex items-center gap-1 mt-2 text-sm font-mono-num ${up ? "text-profit" : "text-loss"}`}>
        {up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {change}
      </div>
    </motion.div>
  );
}

// Mock mini chart using SVG
export function MiniChart({ up = true }: { up?: boolean }) {
  const points = up
    ? "0,40 15,35 30,38 45,25 60,28 75,15 90,18 105,10 120,12"
    : "0,10 15,15 30,12 45,25 60,22 75,35 90,32 105,40 120,38";

  return (
    <svg viewBox="0 0 120 50" className="w-full h-12">
      <polyline
        points={points}
        fill="none"
        stroke={up ? "hsl(var(--profit))" : "hsl(var(--loss))"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const watchlistItems = [
  { symbol: "BTC/USD", price: "67,432.50", change: "+2.34%", up: true },
  { symbol: "ETH/USD", price: "3,891.20", change: "+1.87%", up: true },
  { symbol: "EUR/USD", price: "1.0892", change: "-0.12%", up: false },
  { symbol: "AAPL", price: "198.45", change: "+0.65%", up: true },
  { symbol: "XAU/USD", price: "2,341.80", change: "+0.43%", up: true },
];

export function WatchlistWidget() {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Watchlist</h3>
      <div className="space-y-3">
        {watchlistItems.map((item) => (
          <div key={item.symbol} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{item.symbol}</p>
            </div>
            <div className="w-20">
              <MiniChart up={item.up} />
            </div>
            <div className="text-right">
              <p className="text-sm font-mono-num text-foreground">{item.price}</p>
              <p className={`text-xs font-mono-num ${item.up ? "text-profit" : "text-loss"}`}>{item.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mock candlestick chart
export function CandlestickChart() {
  const candles = [
    { o: 35, c: 25, h: 20, l: 40 },
    { o: 25, c: 30, h: 22, l: 35 },
    { o: 30, c: 20, h: 15, l: 35 },
    { o: 20, c: 28, h: 12, l: 32 },
    { o: 28, c: 22, h: 18, l: 35 },
    { o: 22, c: 15, h: 10, l: 28 },
    { o: 15, c: 25, h: 8, l: 28 },
    { o: 25, c: 18, h: 12, l: 30 },
    { o: 18, c: 12, h: 8, l: 22 },
    { o: 12, c: 20, h: 6, l: 25 },
    { o: 20, c: 15, h: 10, l: 28 },
    { o: 15, c: 10, h: 5, l: 20 },
    { o: 10, c: 18, h: 4, l: 22 },
    { o: 18, c: 22, h: 12, l: 25 },
    { o: 22, c: 14, h: 10, l: 28 },
    { o: 14, c: 8, h: 4, l: 18 },
  ];

  return (
    <svg viewBox="0 0 320 80" className="w-full h-48">
      {candles.map((c, i) => {
        const x = i * 20 + 5;
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

// Recent trades
const trades = [
  { pair: "BTC/USD", type: "Long", entry: "66,890", pnl: "+$1,240", up: true, time: "2h ago" },
  { pair: "EUR/USD", type: "Short", entry: "1.0912", pnl: "-$180", up: false, time: "5h ago" },
  { pair: "ETH/USD", type: "Long", entry: "3,750", pnl: "+$680", up: true, time: "8h ago" },
  { pair: "AAPL", type: "Long", entry: "195.20", pnl: "+$340", up: true, time: "1d ago" },
];

export function RecentTrades() {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Recent Trades</h3>
      <div className="space-y-3">
        {trades.map((t, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-medium text-foreground">{t.pair}</p>
              <p className="text-xs text-muted-foreground">{t.type} · {t.time}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-mono-num">{t.entry}</p>
              <p className={`text-sm font-semibold font-mono-num ${t.up ? "text-profit" : "text-loss"}`}>{t.pnl}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
