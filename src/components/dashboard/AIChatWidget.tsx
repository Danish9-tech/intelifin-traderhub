import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useAiChat } from "@/hooks/use-trading-data";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickActions = ["Market summary", "Analyze BTC", "Portfolio risk", "Best strategy"];

export function AIChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to TraderHub AI. Ask about markets, risk, or strategy ideas." },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiChat = useAiChat();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || aiChat.isPending) return;

    const userMsg: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const reply = await aiChat.mutateAsync(msg);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      toast({
        title: "AI request failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="glass rounded-2xl flex flex-col h-[400px]">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
          <p className="text-xs text-muted-foreground">{aiChat.isPending ? "Analyzing..." : "Connected to backend AI service"}</p>
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
        {aiChat.isPending && (
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
            onKeyDown={(e) => e.key === "Enter" && !aiChat.isPending && handleSend()}
            placeholder="Ask about markets, strategies..."
            disabled={aiChat.isPending}
            className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
          <button onClick={() => handleSend()} disabled={aiChat.isPending || !input.trim()} className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50">
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
