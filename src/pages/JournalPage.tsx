import { useState } from "react";
import { Plus, Calendar, TrendingUp, TrendingDown, Tag, Trash2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface JournalEntry {
  id: number;
  date: string;
  pair: string;
  type: "Long" | "Short";
  entry: string;
  exit: string;
  pnl: number;
  emotion: string;
  tags: string[];
  notes: string;
}

const initialEntries: JournalEntry[] = [
  { id: 1, date: "Mar 7, 2026", pair: "BTC/USD", type: "Long", entry: "66,890", exit: "67,850", pnl: 1240, emotion: "Confident", tags: ["Breakout", "Trend"], notes: "Clean break above resistance with volume confirmation." },
  { id: 2, date: "Mar 6, 2026", pair: "EUR/USD", type: "Short", entry: "1.0912", exit: "1.0935", pnl: -180, emotion: "FOMO", tags: ["Counter-trend"], notes: "Entered too early, should have waited for confirmation." },
  { id: 3, date: "Mar 5, 2026", pair: "ETH/USD", type: "Long", entry: "3,750", exit: "3,920", pnl: 680, emotion: "Calm", tags: ["Pullback", "Support"], notes: "Nice pullback to EMA 20 support. Textbook entry." },
  { id: 4, date: "Mar 4, 2026", pair: "NVDA", type: "Long", entry: "845.20", exit: "868.50", pnl: 340, emotion: "Confident", tags: ["Earnings", "Momentum"], notes: "Post-earnings momentum play. Hit TP1." },
  { id: 5, date: "Mar 3, 2026", pair: "SOL/USD", type: "Short", entry: "178.40", exit: "172.10", pnl: 520, emotion: "Calm", tags: ["Breakdown", "Volume"], notes: "Breakdown below support with high volume." },
  { id: 6, date: "Mar 2, 2026", pair: "GBP/USD", type: "Long", entry: "1.2680", exit: "1.2650", pnl: -240, emotion: "Anxious", tags: ["News"], notes: "BoE speech caught me off guard. Tight stop hit." },
];

const emotions = ["Confident", "Calm", "Anxious", "FOMO", "Greedy", "Fearful", "Neutral"];
const tagOptions = ["Breakout", "Trend", "Pullback", "Support", "Resistance", "Counter-trend", "Momentum", "News", "Earnings", "Volume", "Breakdown", "Scalp"];

export default function JournalPage() {
  const [entries, setEntries] = useState(initialEntries);
  const [showNew, setShowNew] = useState(false);
  const [filter, setFilter] = useState<"All" | "Winners" | "Losers">("All");
  const [newPair, setNewPair] = useState("");
  const [newType, setNewType] = useState<"Long" | "Short">("Long");
  const [newEntry, setNewEntry] = useState("");
  const [newExit, setNewExit] = useState("");
  const [newEmotion, setNewEmotion] = useState("Calm");
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newNotes, setNewNotes] = useState("");

  const filtered = entries.filter((e) => {
    if (filter === "Winners") return e.pnl > 0;
    if (filter === "Losers") return e.pnl < 0;
    return true;
  });

  const totalPnl = entries.reduce((a, b) => a + b.pnl, 0);
  const winRate = entries.length > 0 ? ((entries.filter((e) => e.pnl > 0).length / entries.length) * 100).toFixed(1) : "0";

  const toggleTag = (tag: string) => {
    setNewTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const submitEntry = () => {
    if (!newPair || !newEntry || !newExit) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    const pnl = (Math.random() - 0.3) * 2000;
    const entry: JournalEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      pair: newPair,
      type: newType,
      entry: newEntry,
      exit: newExit,
      pnl: Math.round(pnl),
      emotion: newEmotion,
      tags: newTags,
      notes: newNotes || "No notes added.",
    };
    setEntries((prev) => [entry, ...prev]);
    toast({ title: "Trade logged!", description: `${newPair} ${newType} · P&L: ${pnl >= 0 ? "+" : ""}$${Math.round(pnl)}` });
    setShowNew(false);
    setNewPair(""); setNewEntry(""); setNewExit(""); setNewNotes(""); setNewTags([]);
  };

  const deleteEntry = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Trade entry deleted", variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Trades</p>
          <p className="text-lg font-bold font-mono-num text-foreground">{entries.length}</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">Win Rate</p>
          <p className="text-lg font-bold font-mono-num text-profit">{winRate}%</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">Total P&L</p>
          <p className={`text-lg font-bold font-mono-num ${totalPnl >= 0 ? "text-profit" : "text-loss"}`}>{totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">Best Trade</p>
          <p className="text-lg font-bold font-mono-num text-profit">+${Math.max(...entries.map((e) => e.pnl)).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {(["All", "Winners", "Losers"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${filter === f ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>{f}</button>
          ))}
        </div>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          {showNew ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showNew ? "Cancel" : "Log Trade"}
        </button>
      </div>

      {showNew && (
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">New Trade Entry</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input value={newPair} onChange={(e) => setNewPair(e.target.value)} placeholder="Pair (e.g. BTC/USD)" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
            <select value={newType} onChange={(e) => setNewType(e.target.value as "Long" | "Short")} className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary">
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </select>
            <input value={newEntry} onChange={(e) => setNewEntry(e.target.value)} placeholder="Entry price" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
            <input value={newExit} onChange={(e) => setNewExit(e.target.value)} placeholder="Exit price" className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Emotion:</p>
            <div className="flex flex-wrap gap-2">
              {emotions.map((e) => (
                <button key={e} onClick={() => setNewEmotion(e)} className={`px-3 py-1 text-xs rounded-md transition-colors ${newEmotion === e ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{e}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((t) => (
                <button key={t} onClick={() => toggleTag(t)} className={`px-3 py-1 text-xs rounded-md transition-colors ${newTags.includes(t) ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{t}</button>
              ))}
            </div>
          </div>
          <textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Trade notes..." rows={2} className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary resize-none" />
          <button onClick={submitEntry} className="px-5 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Save Entry</button>
        </div>
      )}

      {/* Entries */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass rounded-xl p-8 text-center text-sm text-muted-foreground">No trades found for this filter.</div>
        )}
        {filtered.map((entry) => (
          <div key={entry.id} className="glass rounded-xl p-5 hover:border-primary/20 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${entry.pnl >= 0 ? "bg-profit/10" : "bg-loss/10"}`}>
                  {entry.pnl >= 0 ? <TrendingUp className="w-5 h-5 text-profit" /> : <TrendingDown className="w-5 h-5 text-loss" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{entry.pair} · {entry.type}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {entry.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`text-sm font-bold font-mono-num ${entry.pnl >= 0 ? "text-profit" : "text-loss"}`}>{entry.pnl >= 0 ? "+" : ""}${entry.pnl.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground font-mono-num">{entry.entry} → {entry.exit}</p>
                </div>
                <button onClick={() => deleteEntry(entry.id)} className="text-muted-foreground hover:text-loss transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{entry.notes}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
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
