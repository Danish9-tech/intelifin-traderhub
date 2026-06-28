import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Search, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMarkets } from "@/hooks/use-trading-data";

export default function MarketsPage() {
  const [search, setSearch] = useState("");
  const [stars, setStars] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"symbol" | "change" | "price">("symbol");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const { data = [], isLoading, error } = useMarkets(search);

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

  const filtered = useMemo(() => {
    return [...data].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "symbol") return a.symbol.localeCompare(b.symbol) * dir;
      if (sortBy === "price") return (a.price - b.price) * dir;
      return (a.change - b.change) * dir;
    });
  }, [data, sortBy, sortDir]);

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
        <p className="text-xs text-muted-foreground">Live crypto feed via backend integration</p>
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

        {isLoading && <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading markets...</div>}
        {error && !isLoading && <div className="px-5 py-8 text-center text-sm text-loss">{(error as Error).message}</div>}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">No markets found matching your search.</div>
        )}

        {!isLoading && !error && filtered.map((m, i) => (
          <motion.div
            key={m.symbol}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.01 }}
            className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors items-center"
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
            <span className="text-sm font-mono-num text-muted-foreground text-right w-20 hidden md:block">{Math.round(m.vol).toLocaleString()}</span>
            <span className="text-sm font-mono-num text-muted-foreground text-right w-20 hidden lg:block">{Math.round(m.cap).toLocaleString()}</span>
            <button
              onClick={() => toggleStar(m.symbol)}
              className={`w-8 h-8 flex items-center justify-center transition-colors ${stars.has(m.symbol) ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              <Star className="w-4 h-4" fill={stars.has(m.symbol) ? "currentColor" : "none"} />
            </button>
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">Showing {filtered.length} assets</p>
    </div>
  );
}
