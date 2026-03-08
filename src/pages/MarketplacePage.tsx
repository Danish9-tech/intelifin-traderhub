import { useState } from "react";
import { Star, Download, Zap, TrendingUp, BarChart3, Bot, Search, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  author: string;
  price: string;
  rating: number;
  downloads: string;
  category: string;
  icon: typeof Zap;
  desc: string;
  installed: boolean;
}

const initialProducts: Product[] = [
  { id: 1, name: "Smart Money Detector", author: "AlgoTraderX", price: "$29/mo", rating: 4.9, downloads: "2.3K", category: "Indicators", icon: TrendingUp, desc: "Detect institutional order flow and smart money movements in real-time.", installed: false },
  { id: 2, name: "Scalping Bot Pro", author: "BotFactory", price: "$49/mo", rating: 4.7, downloads: "1.8K", category: "Bots", icon: Bot, desc: "Automated scalping bot for crypto markets with 15s-5m timeframes.", installed: false },
  { id: 3, name: "Volume Profile Suite", author: "ChartMaster", price: "$19/mo", rating: 4.8, downloads: "3.1K", category: "Indicators", icon: BarChart3, desc: "Advanced volume profile, VPOC, and value area indicators.", installed: false },
  { id: 4, name: "Breakout Scanner", author: "CryptoWhale92", price: "Free", rating: 4.6, downloads: "5.4K", category: "Strategies", icon: Zap, desc: "Scans multiple pairs for breakout patterns with alert integration.", installed: false },
  { id: 5, name: "Risk Manager Pro", author: "ForexMaster_", price: "$39/mo", rating: 4.9, downloads: "1.2K", category: "Tools", icon: Zap, desc: "Position sizing calculator with dynamic risk management rules.", installed: false },
  { id: 6, name: "AI Signal Pack", author: "QuantumLabs", price: "$99/mo", rating: 4.8, downloads: "890", category: "Signals", icon: TrendingUp, desc: "AI-generated trade signals for Forex, Crypto, and Indices.", installed: false },
  { id: 7, name: "Fibonacci Auto-Draw", author: "ChartMaster", price: "$14/mo", rating: 4.5, downloads: "4.2K", category: "Indicators", icon: BarChart3, desc: "Automatically draws Fibonacci retracement and extension levels.", installed: false },
  { id: 8, name: "News Sentiment Bot", author: "QuantumLabs", price: "$59/mo", rating: 4.7, downloads: "670", category: "Bots", icon: Bot, desc: "Trades based on real-time news sentiment analysis using AI.", installed: false },
  { id: 9, name: "Grid Trading Strategy", author: "AlgoTraderX", price: "Free", rating: 4.4, downloads: "3.8K", category: "Strategies", icon: Zap, desc: "Automated grid trading strategy for ranging markets.", installed: false },
];

const categories = ["All", "Indicators", "Bots", "Strategies", "Signals", "Tools"];

export default function MarketplacePage() {
  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const toggleInstall = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (p.installed) {
          toast({ title: `${p.name} uninstalled` });
          return { ...p, installed: false };
        }
        toast({ title: `${p.name} ${p.price === "Free" ? "installed" : "subscribed"}!`, description: p.price === "Free" ? "Available in your toolkit." : `You'll be charged ${p.price}.` });
        return { ...p, installed: true };
      })
    );
  };

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search marketplace..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {categories.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2 text-xs rounded-lg whitespace-nowrap transition-colors ${activeCategory === c ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>{c}</button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} products found · {products.filter((p) => p.installed).length} installed</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className={`glass rounded-xl p-5 transition-colors group ${p.installed ? "border-primary/30" : "hover:border-primary/20"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">{p.category}</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{p.name}</h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{p.desc}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-primary" fill="currentColor" /> {p.rating}</span>
              <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {p.downloads}</span>
              <span>by {p.author}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold font-mono-num text-foreground">{p.price}</span>
              <button
                onClick={() => toggleInstall(p.id)}
                className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-all ${
                  p.installed
                    ? "bg-profit/10 text-profit flex items-center gap-1"
                    : "gradient-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {p.installed ? <><Check className="w-3 h-3" /> Installed</> : p.price === "Free" ? "Install" : "Subscribe"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
