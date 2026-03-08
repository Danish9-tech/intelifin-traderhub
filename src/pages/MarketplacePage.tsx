import { Star, Download, Zap, TrendingUp, BarChart3, Bot } from "lucide-react";

const products = [
  { name: "Smart Money Detector", author: "AlgoTraderX", price: "$29/mo", rating: "4.9", downloads: "2.3K", category: "Indicator", icon: TrendingUp, desc: "Detect institutional order flow and smart money movements in real-time." },
  { name: "Scalping Bot Pro", author: "BotFactory", price: "$49/mo", rating: "4.7", downloads: "1.8K", category: "Bot", icon: Bot, desc: "Automated scalping bot for crypto markets with 15s-5m timeframes." },
  { name: "Volume Profile Suite", author: "ChartMaster", price: "$19/mo", rating: "4.8", downloads: "3.1K", category: "Indicator", icon: BarChart3, desc: "Advanced volume profile, VPOC, and value area indicators." },
  { name: "Breakout Scanner", author: "CryptoWhale92", price: "Free", rating: "4.6", downloads: "5.4K", category: "Strategy", icon: Zap, desc: "Scans multiple pairs for breakout patterns with alert integration." },
  { name: "Risk Manager Pro", author: "ForexMaster_", price: "$39/mo", rating: "4.9", downloads: "1.2K", category: "Tool", icon: Zap, desc: "Position sizing calculator with dynamic risk management rules." },
  { name: "AI Signal Pack", author: "QuantumLabs", price: "$99/mo", rating: "4.8", downloads: "890", category: "Signals", icon: TrendingUp, desc: "AI-generated trade signals for Forex, Crypto, and Indices." },
];

const categories = ["All", "Indicators", "Bots", "Strategies", "Signals", "Tools"];

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {categories.map((c, i) => (
          <button key={c} className={`px-4 py-2 text-xs rounded-lg whitespace-nowrap transition-colors ${i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>{c}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p, i) => (
          <div key={i} className="glass rounded-xl p-5 hover:border-primary/20 transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">{p.category}</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{p.name}</h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{p.desc}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-primary" /> {p.rating}</span>
              <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {p.downloads}</span>
              <span>by {p.author}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold font-mono-num text-foreground">{p.price}</span>
              <button className="px-4 py-1.5 text-xs rounded-lg gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                {p.price === "Free" ? "Install" : "Subscribe"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
