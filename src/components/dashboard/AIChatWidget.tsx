import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  { role: "assistant", content: "Welcome to QuantumTrade AI. I can analyze markets, suggest trade setups, and help with your strategy. What would you like to explore?" },
];

export function AIChatWidget() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const mockResponses = [
    "BTC is showing a bullish divergence on the 4H RSI with strong support at $66,500. Consider a long setup with SL at $65,800 and TP at $69,200. Risk/reward: 1:2.3.",
    "EUR/USD is approaching a key resistance at 1.0920. The DXY is weakening and ECB rhetoric is hawkish. Watch for a breakout above 1.0925 for continuation.",
    "Your portfolio is 68% correlated to BTC. Consider adding Gold or EUR/JPY for better diversification. Current Sharpe ratio: 1.42.",
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    const aiMsg: Message = { role: "assistant", content: mockResponses[messages.length % mockResponses.length] };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="glass rounded-2xl flex flex-col h-[400px]">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
          <p className="text-xs text-muted-foreground">Powered by QuantumTrade AI</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
          >
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
          </motion.div>
        ))}
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about markets, strategies..."
            className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
          />
          <button onClick={handleSend} className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center hover:opacity-90 transition-opacity">
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
