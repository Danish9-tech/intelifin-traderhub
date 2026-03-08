import { useState } from "react";
import { Plus, Calendar, TrendingUp, TrendingDown, Tag } from "lucide-react";

const journalEntries = [
  { date: "Mar 7, 2026", pair: "BTC/USD", type: "Long", entry: "66,890", exit: "67,850", pnl: "+$1,240", emotion: "Confident", tags: ["Breakout", "Trend"], notes: "Clean break above resistance with volume confirmation." },
  { date: "Mar 6, 2026", pair: "EUR/USD", type: "Short", entry: "1.0912", exit: "1.0935", pnl: "-$180", emotion: "FOMO", tags: ["Counter-trend"], notes: "Entered too early, should have waited for confirmation." },
  { date: "Mar 5, 2026", pair: "ETH/USD", type: "Long", entry: "3,750", exit: "3,920", pnl: "+$680", emotion: "Calm", tags: ["Pullback", "Support"], notes: "Nice pullback to EMA 20 support. Textbook entry." },
  { date: "Mar 4, 2026", pair: "NVDA", type: "Long", entry: "845.20", exit: "868.50", pnl: "+$340", emotion: "Confident", tags: ["Earnings", "Momentum"], notes: "Post-earnings momentum play. Hit TP1." },
];

const emotions = ["Confident", "Calm", "Anxious", "FOMO", "Greedy", "Fearful"];

export default function JournalPage() {
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {["All", "Winners", "Losers"].map((f, i) => (
              <button key={f} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>{f}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Log Trade
        </button>
      </div>

      {showNew && (
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">New Trade Entry</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input placeholder="Pair (e.g. BTC/USD)" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
            <select className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary">
              <option>Long</option><option>Short</option>
            </select>
            <input placeholder="Entry price" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
            <input placeholder="Exit price" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="flex flex-wrap gap-2">
            <p className="text-xs text-muted-foreground mr-2 self-center">Emotion:</p>
            {emotions.map((e) => (
              <button key={e} className="px-3 py-1 text-xs rounded-md bg-muted text-muted-foreground hover:text-foreground transition-colors">{e}</button>
            ))}
          </div>
          <textarea placeholder="Trade notes..." rows={2} className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary resize-none" />
          <button className="px-5 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Save Entry</button>
        </div>
      )}

      {/* Entries */}
      <div className="space-y-3">
        {journalEntries.map((entry, i) => (
          <div key={i} className="glass rounded-xl p-5 hover:border-primary/20 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${entry.pnl.startsWith("+") ? "bg-profit/10" : "bg-loss/10"}`}>
                  {entry.pnl.startsWith("+") ? <TrendingUp className="w-5 h-5 text-profit" /> : <TrendingDown className="w-5 h-5 text-loss" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{entry.pair} · {entry.type}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {entry.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold font-mono-num ${entry.pnl.startsWith("+") ? "text-profit" : "text-loss"}`}>{entry.pnl}</p>
                <p className="text-xs text-muted-foreground font-mono-num">{entry.entry} → {entry.exit}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{entry.notes}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">{entry.emotion}</span>
              {entry.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary flex items-center gap-1"><Tag className="w-3 h-3" />{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
