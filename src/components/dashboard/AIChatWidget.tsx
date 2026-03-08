import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const mockResponses: Record<string, string> = {
  btc: "BTC is showing a bullish divergence on the 4H RSI with strong support at $66,500. Consider a long setup with SL at $65,800 and TP at $69,200. Risk/reward: 1:2.3.",
  eth: "ETH/USD is consolidating around $3,890. The ETH/BTC ratio is recovering. Institutional flows are positive. Watch for a break above $3,950 for continuation to $4,200.",
  eur: "EUR/USD is approaching key resistance at 1.0920. DXY is weakening and ECB rhetoric is hawkish. Watch for a breakout above 1.0925 for continuation.",
  portfolio: "Your portfolio is 68% correlated to BTC. Consider adding Gold (XAU/USD) or EUR/JPY for better diversification. Current Sharpe ratio: 1.42.",
  risk: "Based on your account size, I recommend risking no more than 1-2% per trade ($1,274 - $2,548). Your current average risk per trade is 1.8% which is within acceptable limits.",
  strategy: "For your EMA Crossover strategy, I suggest adding a volume filter (>1.5x average) and limiting entries to London/NY sessions. This should improve win rate by ~8%.",
  market: "Today's key levels: BTC support $66,500, resistance $68,900. S&P 500 futures slightly positive. Dollar index weakening. Gold at $2,340. Volatility index (VIX) at 14.2 - low vol environment favoring trend strategies.",
  default: "I can analyze charts, suggest trade setups, assess risk, review your portfolio, and provide market summaries. Try asking about specific assets, your portfolio risk, or market conditions!",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("btc") || lower.includes("bitcoin")) return mockResponses.btc;
  if (lower.includes("eth") || lower.includes("ethereum")) return mockResponses.eth;
  if (lower.includes("eur") || lower.includes("forex") || lower.includes("dollar")) return mockResponses.eur;
  if (lower.includes("portfolio") || lower.includes("diversif")) return mockResponses.portfolio;
  if (lower.includes("risk") || lower.includes("position") || lower.includes("size")) return mockResponses.risk;
  if (lower.includes("strategy") || lower.includes("ema") || lower.includes("backtest")) return mockResponses.strategy;
  if (lower.includes("market") || lower.includes("today") || lower.includes("summary")) return mockResponses.market;
  return mockResponses.default;
}

const quickActions = ["Market summary", "Analyze BTC", "Portfolio risk", "Best strategy"];

export function AIChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to QuantumTrade AI. I can analyze markets, suggest trade setups, and help with your strategy. What would you like to explore?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const userMsg: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const aiMsg: Message = { role: "assistant", content: getResponse(msg) };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 800 + Math.random() * 1200);
  };

  return (
    <div className="glass rounded-2xl flex flex-col h-[400px]">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
          <p className="text-xs text-muted-foreground">{typing ? "Analyzing..." : "Powered by QuantumTrade AI"}</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-muted rounded-xl px-3 py-2 text-sm text-muted-foreground">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      {messages.length <= 2 && (
        <div className="px-3 pb-1 flex gap-2 overflow-x-auto">
          {quickActions.map((q) => (
            <button key={q} onClick={() => handleSend(q)} className="px-3 py-1 text-xs rounded-md bg-muted text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors">{q}</button>
          ))}
        </div>
      )}

      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !typing && handleSend()}
            placeholder="Ask about markets, strategies..."
            disabled={typing}
            className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
          <button onClick={() => handleSend()} disabled={typing || !input.trim()} className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50">
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
