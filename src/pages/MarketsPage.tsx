import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Search, Star } from "lucide-react";

const marketData = [
  { symbol: "BTC/USD", name: "Bitcoin", price: "67,432.50", change: "+2.34%", up: true, vol: "24.3B", cap: "1.32T", cat: "Crypto" },
  { symbol: "ETH/USD", name: "Ethereum", price: "3,891.20", change: "+1.87%", up: true, vol: "12.1B", cap: "468B", cat: "Crypto" },
  { symbol: "SOL/USD", name: "Solana", price: "172.35", change: "-1.24%", up: false, vol: "3.8B", cap: "76B", cat: "Crypto" },
  { symbol: "EUR/USD", name: "Euro", price: "1.0892", change: "-0.12%", up: false, vol: "8.2T", cap: "-", cat: "Forex" },
  { symbol: "GBP/USD", name: "British Pound", price: "1.2734", change: "+0.08%", up: true, vol: "4.1T", cap: "-", cat: "Forex" },
  { symbol: "USD/JPY", name: "Japanese Yen", price: "151.23", change: "+0.34%", up: true, vol: "3.9T", cap: "-", cat: "Forex" },
  { symbol: "AAPL", name: "Apple Inc.", price: "198.45", change: "+0.65%", up: true, vol: "52M", cap: "3.05T", cat: "Stocks" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: "892.30", change: "+3.12%", up: true, vol: "38M", cap: "2.21T", cat: "Stocks" },
  { symbol: "TSLA", name: "Tesla Inc.", price: "245.60", change: "-2.18%", up: false, vol: "89M", cap: "781B", cat: "Stocks" },
  { symbol: "XAU/USD", name: "Gold", price: "2,341.80", change: "+0.43%", up: true, vol: "182B", cap: "-", cat: "Commodities" },
  { symbol: "XAG/USD", name: "Silver", price: "27.45", change: "+0.91%", up: true, vol: "24B", cap: "-", cat: "Commodities" },
  { symbol: "US500", name: "S&P 500", price: "5,234.18", change: "+0.28%", up: true, vol: "-", cap: "-", cat: "Indices" },
];

const categories = ["All", "Crypto", "Forex", "Stocks", "Commodities", "Indices"];

export default function MarketsPage() {
  return (
    <div className="space-y-6">
      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input placeholder="Search markets..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex gap-1">
          {categories.map((c, i) => (
            <button key={c} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Market table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border text-xs font-medium text-muted-foreground">
          <span>Asset</span>
          <span className="text-right w-24">Price</span>
          <span className="text-right w-20">24h Change</span>
          <span className="text-right w-20 hidden md:block">Volume</span>
          <span className="text-right w-20 hidden lg:block">Mkt Cap</span>
          <span className="w-8" />
        </div>
        {marketData.map((m, i) => (
          <motion.div
            key={m.symbol}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors items-center cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-primary">
                {m.symbol.slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{m.symbol}</p>
                <p className="text-xs text-muted-foreground">{m.name}</p>
              </div>
            </div>
            <span className="text-sm font-mono-num text-foreground text-right w-24">{m.price}</span>
            <span className={`text-sm font-mono-num text-right w-20 flex items-center justify-end gap-0.5 ${m.up ? "text-profit" : "text-loss"}`}>
              {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {m.change}
            </span>
            <span className="text-sm font-mono-num text-muted-foreground text-right w-20 hidden md:block">{m.vol}</span>
            <span className="text-sm font-mono-num text-muted-foreground text-right w-20 hidden lg:block">{m.cap}</span>
            <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
              <Star className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
