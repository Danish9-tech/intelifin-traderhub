import { Users, Trophy, MessageSquare, TrendingUp, Star, UserPlus } from "lucide-react";

const topTraders = [
  { name: "CryptoWhale92", winRate: "78%", roi: "+245%", followers: "12.4K", trades: 892, avatar: "CW" },
  { name: "ForexMaster_", winRate: "71%", roi: "+189%", followers: "8.7K", trades: 1240, avatar: "FM" },
  { name: "AlgoTraderX", winRate: "69%", roi: "+156%", followers: "6.2K", trades: 2100, avatar: "AT" },
  { name: "GoldBug2026", winRate: "65%", roi: "+132%", followers: "4.8K", trades: 560, avatar: "GB" },
  { name: "SwingKing", winRate: "73%", roi: "+201%", followers: "9.1K", trades: 445, avatar: "SK" },
];

const tradeIdeas = [
  { author: "CryptoWhale92", pair: "BTC/USD", direction: "Long", desc: "Clear ascending triangle forming. Expecting breakout to 70K.", likes: 342, time: "2h ago" },
  { author: "ForexMaster_", pair: "GBP/USD", direction: "Short", desc: "Double top at 1.2800. Bearish divergence on RSI.", likes: 218, time: "4h ago" },
  { author: "AlgoTraderX", pair: "NVDA", direction: "Long", desc: "AI sector rotation continues. NVDA leading with strong momentum.", likes: 567, time: "6h ago" },
];

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-1 glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-primary" /> Top Traders
          </h3>
          <div className="space-y-3">
            {topTraders.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-4 font-mono-num">#{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">Win: {t.winRate} · {t.followers}</p>
                  </div>
                </div>
                <span className="text-sm font-mono-num text-profit font-semibold">{t.roi}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trade Ideas */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Trade Ideas
          </h3>
          {tradeIdeas.map((idea, i) => (
            <div key={i} className="glass rounded-xl p-5 hover:border-primary/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-primary">{idea.author.slice(0, 2)}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{idea.author}</p>
                    <p className="text-xs text-muted-foreground">{idea.time}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-xs rounded font-medium ${idea.direction === "Long" ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"}`}>
                  {idea.pair} · {idea.direction}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{idea.desc}</p>
              <div className="flex items-center gap-4 mt-3">
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Star className="w-3.5 h-3.5" /> {idea.likes}
                </button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <UserPlus className="w-3.5 h-3.5" /> Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
