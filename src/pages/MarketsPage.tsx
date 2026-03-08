import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Search, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const marketData = [
  { symbol: "BTC/USD", name: "Bitcoin", price: 67432.50, change: 2.34, vol: "24.3B", cap: "1.32T", cat: "Crypto", starred: false },
  { symbol: "ETH/USD", name: "Ethereum", price: 3891.20, change: 1.87, vol: "12.1B", cap: "468B", cat: "Crypto", starred: false },
  { symbol: "SOL/USD", name: "Solana", price: 172.35, change: -1.24, vol: "3.8B", cap: "76B", cat: "Crypto", starred: false },
  { symbol: "XRP/USD", name: "Ripple", price: 0.6234, change: 3.12, vol: "2.1B", cap: "34B", cat: "Crypto", starred: false },
  { symbol: "ADA/USD", name: "Cardano", price: 0.4521, change: -0.87, vol: "890M", cap: "16B", cat: "Crypto", starred: false },
  { symbol: "EUR/USD", name: "Euro", price: 1.0892, change: -0.12, vol: "8.2T", cap: "-", cat: "Forex", starred: false },
  { symbol: "GBP/USD", name: "British Pound", price: 1.2734, change: 0.08, vol: "4.1T", cap: "-", cat: "Forex", starred: false },
  { symbol: "USD/JPY", name: "Japanese Yen", price: 151.23, change: 0.34, vol: "3.9T", cap: "-", cat: "Forex", starred: false },
  { symbol: "AUD/USD", name: "Australian Dollar", price: 0.6543, change: -0.45, vol: "1.8T", cap: "-", cat: "Forex", starred: false },
  { symbol: "USD/CHF", name: "Swiss Franc", price: 0.8921, change: 0.11, vol: "1.2T", cap: "-", cat: "Forex", starred: false },
  { symbol: "AAPL", name: "Apple Inc.", price: 198.45, change: 0.65, vol: "52M", cap: "3.05T", cat: "Stocks", starred: false },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 892.30, change: 3.12, vol: "38M", cap: "2.21T", cat: "Stocks", starred: false },
  { symbol: "TSLA", name: "Tesla Inc.", price: 245.60, change: -2.18, vol: "89M", cap: "781B", cat: "Stocks", starred: false },
  { symbol: "MSFT", name: "Microsoft", price: 415.80, change: 0.92, vol: "22M", cap: "3.09T", cat: "Stocks", starred: false },
  { symbol: "AMZN", name: "Amazon", price: 178.90, change: 1.45, vol: "31M", cap: "1.86T", cat: "Stocks", starred: false },
  { symbol: "XAU/USD", name: "Gold", price: 2341.80, change: 0.43, vol: "182B", cap: "-", cat: "Commodities", starred: false },
  { symbol: "XAG/USD", name: "Silver", price: 27.45, change: 0.91, vol: "24B", cap: "-", cat: "Commodities", starred: false },
  { symbol: "WTI", name: "Crude Oil", price: 78.34, change: -1.56, vol: "45B", cap: "-", cat: "Commodities", starred: false },
  { symbol: "US500", name: "S&P 500", price: 5234.18, change: 0.28, vol: "-", cap: "-", cat: "Indices", starred: false },
  { symbol: "US100", name: "Nasdaq 100", price: 18456.90, change: 0.54, vol: "-", cap: "-", cat: "Indices", starred: false },
  { symbol: "UK100", name: "FTSE 100", price: 8234.50, change: -0.32, vol: "-", cap: "-", cat: "Indices", starred: false },
];

const categories = ["All", "Crypto", "Forex", "Stocks", "Commodities", "Indices"];

export default function MarketsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [stars, setStars] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"symbol" | "change" | "price">("symbol");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleStar = (symbol: string) => {
    setStars((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) {
        next.delete(symbol);
        toast({ title: `${symbol} removed from watchlist` });
      } else {
        next.add(symbol);
        toast({ title: `${symbol} added to watchlist` });
      }
      return next;
    });
  };

  const handleSort = (col: "symbol" | "change" | "price") => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const filtered = marketData
    .filter((m) => {
      const matchCat = activeCategory === "All" || m.cat === activeCategory;
      const matchSearch = m.symbol.toLowerCase().includes(search.toLowerCase()) || m.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "symbol") return a.symbol.localeCompare(b.symbol) * dir;
      if (sortBy === "price") return (a.price - b.price) * dir;
      return (a.change - b.change) * dir;
    });

  const formatPrice = (p: number) => p >= 1000 ? p.toLocaleString("en-US", { minimumFractionDigits: 2 }) : p.toFixed(p < 1 ? 4 : 2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search markets..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${activeCategory === c ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border text-xs font-medium text-muted-foreground">
          <button onClick={() => handleSort("symbol")} className="text-left hover:text-foreground transition-colors">
            Asset {sortBy === "symbol" && (sortDir === "asc" ? "↑" : "↓")}
          </button>
          <button onClick={() => handleSort("price")} className="text-right w-24 hover:text-foreground transition-colors">
            Price {sortBy === "price" && (sortDir === "asc" ? "↑" : "↓")}
          </button>
          <button onClick={() => handleSort("change")} className="text-right w-20 hover:text-foreground transition-colors">
            24h {sortBy === "change" && (sortDir === "asc" ? "↑" : "↓")}
          </button>
          <span className="text-right w-20 hidden md:block">Volume</span>
          <span className="text-right w-20 hidden lg:block">Mkt Cap</span>
          <span className="w-8" />
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">No markets found matching your search.</div>
        )}
        {filtered.map((m, i) => (
          <motion.div
            key={m.symbol}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.02 }}
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
            <span className="text-sm font-mono-num text-foreground text-right w-24">{formatPrice(m.price)}</span>
            <span className={`text-sm font-mono-num text-right w-20 flex items-center justify-end gap-0.5 ${m.change >= 0 ? "text-profit" : "text-loss"}`}>
              {m.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
            </span>
            <span className="text-sm font-mono-num text-muted-foreground text-right w-20 hidden md:block">{m.vol}</span>
            <span className="text-sm font-mono-num text-muted-foreground text-right w-20 hidden lg:block">{m.cap}</span>
            <button
              onClick={(e) => { e.stopPropagation(); toggleStar(m.symbol); }}
              className={`w-8 h-8 flex items-center justify-center transition-colors ${stars.has(m.symbol) ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              <Star className="w-4 h-4" fill={stars.has(m.symbol) ? "currentColor" : "none"} />
            </button>
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">Showing {filtered.length} of {marketData.length} assets</p>
    </div>
  );
}
