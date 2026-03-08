import { useState } from "react";
import { Users, Trophy, MessageSquare, TrendingUp, Star, UserPlus, UserCheck, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const topTraders = [
  { name: "CryptoWhale92", winRate: "78%", roi: "+245%", followers: "12.4K", trades: 892, avatar: "CW" },
  { name: "ForexMaster_", winRate: "71%", roi: "+189%", followers: "8.7K", trades: 1240, avatar: "FM" },
  { name: "AlgoTraderX", winRate: "69%", roi: "+156%", followers: "6.2K", trades: 2100, avatar: "AT" },
  { name: "GoldBug2026", winRate: "65%", roi: "+132%", followers: "4.8K", trades: 560, avatar: "GB" },
  { name: "SwingKing", winRate: "73%", roi: "+201%", followers: "9.1K", trades: 445, avatar: "SK" },
];

interface TradeIdea {
  id: number;
  author: string;
  pair: string;
  direction: "Long" | "Short";
  desc: string;
  likes: number;
  time: string;
  liked: boolean;
}

const initialIdeas: TradeIdea[] = [
  { id: 1, author: "CryptoWhale92", pair: "BTC/USD", direction: "Long", desc: "Clear ascending triangle forming. Expecting breakout to 70K. Volume profile supports the move.", likes: 342, time: "2h ago", liked: false },
  { id: 2, author: "ForexMaster_", pair: "GBP/USD", direction: "Short", desc: "Double top at 1.2800. Bearish divergence on RSI. Targeting 1.2650.", likes: 218, time: "4h ago", liked: false },
  { id: 3, author: "AlgoTraderX", pair: "NVDA", direction: "Long", desc: "AI sector rotation continues. NVDA leading with strong momentum. Cup and handle pattern on daily.", likes: 567, time: "6h ago", liked: false },
  { id: 4, author: "SwingKing", pair: "ETH/USD", direction: "Long", desc: "ETH/BTC ratio recovering. Institutional inflows increasing. Key support at $3,800 holding.", likes: 189, time: "8h ago", liked: false },
  { id: 5, author: "GoldBug2026", pair: "XAU/USD", direction: "Long", desc: "Gold approaching all-time highs. Central bank buying continues. Strong support at $2,300.", likes: 423, time: "10h ago", liked: false },
];

export default function CommunityPage() {
  const [ideas, setIdeas] = useState(initialIdeas);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [newIdea, setNewIdea] = useState("");
  const [newPair, setNewPair] = useState("BTC/USD");
  const [newDir, setNewDir] = useState<"Long" | "Short">("Long");
  const [showForm, setShowForm] = useState(false);

  const toggleLike = (id: number) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id
          ? { ...idea, liked: !idea.liked, likes: idea.liked ? idea.likes - 1 : idea.likes + 1 }
          : idea
      )
    );
  };

  const toggleFollow = (name: string) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
        toast({ title: `Unfollowed ${name}` });
      } else {
        next.add(name);
        toast({ title: `Now following ${name}` });
      }
      return next;
    });
  };

  const postIdea = () => {
    if (!newIdea.trim()) {
      toast({ title: "Write your trade idea", variant: "destructive" });
      return;
    }
    const idea: TradeIdea = {
      id: Date.now(),
      author: "You",
      pair: newPair,
      direction: newDir,
      desc: newIdea,
      likes: 0,
      time: "Just now",
      liked: false,
    };
    setIdeas((prev) => [idea, ...prev]);
    toast({ title: "Trade idea posted!" });
    setNewIdea("");
    setShowForm(false);
  };

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
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono-num text-profit font-semibold">{t.roi}</span>
                  <button
                    onClick={() => toggleFollow(t.name)}
                    className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                      following.has(t.name) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {following.has(t.name) ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Following: {following.size} traders</p>
          </div>
        </div>

        {/* Trade Ideas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Trade Ideas
            </h3>
            <button onClick={() => setShowForm(!showForm)} className="px-4 py-1.5 text-xs rounded-lg gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              Post Idea
            </button>
          </div>

          {showForm && (
            <div className="glass rounded-xl p-4 space-y-3">
              <div className="flex gap-3">
                <select value={newPair} onChange={(e) => setNewPair(e.target.value)} className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none">
                  {["BTC/USD", "ETH/USD", "EUR/USD", "GBP/USD", "NVDA", "AAPL", "XAU/USD", "SOL/USD"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <select value={newDir} onChange={(e) => setNewDir(e.target.value as "Long" | "Short")} className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none">
                  <option>Long</option>
                  <option>Short</option>
                </select>
              </div>
              <textarea value={newIdea} onChange={(e) => setNewIdea(e.target.value)} placeholder="Share your trade idea..." rows={2} className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary resize-none" />
              <button onClick={postIdea} className="px-4 py-2 text-xs rounded-lg gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">Post</button>
            </div>
          )}

          {ideas.map((idea) => (
            <div key={idea.id} className="glass rounded-xl p-5 hover:border-primary/20 transition-colors">
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
                <button onClick={() => toggleLike(idea.id)} className={`flex items-center gap-1 text-xs transition-colors ${idea.liked ? "text-loss" : "text-muted-foreground hover:text-loss"}`}>
                  <Heart className="w-3.5 h-3.5" fill={idea.liked ? "currentColor" : "none"} /> {idea.likes}
                </button>
                <button
                  onClick={() => toggleFollow(idea.author)}
                  className={`flex items-center gap-1 text-xs transition-colors ${following.has(idea.author) ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                >
                  {following.has(idea.author) ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  {following.has(idea.author) ? "Following" : "Follow"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
