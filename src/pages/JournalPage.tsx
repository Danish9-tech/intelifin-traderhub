import { useState } from "react";
import { Plus, Calendar, TrendingUp, TrendingDown, Tag, Trash2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCreateJournalEntry, useDeleteJournalEntry, useJournalEntries } from "@/hooks/use-trading-data";

const emotions = ["Confident", "Calm", "Anxious", "FOMO", "Greedy", "Fearful", "Neutral"];
const tagOptions = ["Breakout", "Trend", "Pullback", "Support", "Resistance", "Counter-trend", "Momentum", "News", "Earnings", "Volume", "Breakdown", "Scalp"];

export default function JournalPage() {
  const { data: entries = [], isLoading } = useJournalEntries();
  const createEntry = useCreateJournalEntry();
  const deleteEntryMutation = useDeleteJournalEntry();

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

  const submitEntry = async () => {
    if (!newPair || !newEntry || !newExit) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    try {
      await createEntry.mutateAsync({
        pair: newPair,
        type: newType,
        entry: newEntry,
        exit: newExit,
        pnl: 0,
        emotion: newEmotion,
        tags: newTags,
        notes: newNotes || "No notes added.",
      });
      toast({ title: "Trade logged" });
      setShowNew(false);
      setNewPair("");
      setNewEntry("");
      setNewExit("");
      setNewNotes("");
      setNewTags([]);
    } catch (error) {
      toast({ title: "Create failed", description: error instanceof Error ? error.message : "Unexpected error", variant: "destructive" });
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      await deleteEntryMutation.mutateAsync(id);
      toast({ title: "Trade entry deleted", variant: "destructive" });
    } catch (error) {
      toast({ title: "Delete failed", description: error instanceof Error ? error.message : "Unexpected error", variant: "destructive" });
    }
  };

  const bestTrade = entries.length ? Math.max(...entries.map((e) => e.pnl)) : 0;

  return (
    <div className="space-y-6">
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
          <p className="text-lg font-bold font-mono-num text-profit">+${bestTrade.toLocaleString()}</p>
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

      <div className="space-y-3">
        {isLoading && <div className="glass rounded-xl p-8 text-center text-sm text-muted-foreground">Loading entries...</div>}
        {!isLoading && filtered.length === 0 && (
          <div className="glass rounded-xl p-8 text-center text-sm text-muted-foreground">No trades found for this filter.</div>
        )}
        {!isLoading && filtered.map((entry) => (
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
