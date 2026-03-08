import { AIChatWidget } from "../components/dashboard/AIChatWidget";
import { Brain, Lightbulb, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";

const aiInsights = [
  { icon: TrendingUp, title: "Bullish Divergence on BTC", desc: "RSI showing higher lows while price makes lower lows on the 4H chart. Potential reversal setup.", type: "bullish" },
  { icon: AlertTriangle, title: "EUR/USD Resistance Zone", desc: "Approaching key resistance at 1.0920. DXY weakening but watch for rejection.", type: "neutral" },
  { icon: BarChart3, title: "NVDA Earnings Impact", desc: "Post-earnings momentum strong. Volume 180% above average. AI sector rotation in play.", type: "bullish" },
  { icon: Lightbulb, title: "Portfolio Alert", desc: "High correlation detected: 68% of portfolio moves with BTC. Consider diversification.", type: "warning" },
];

export default function AIEnginePage() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> AI Market Insights
          </h2>
          {aiInsights.map((insight, i) => (
            <div key={i} className="glass rounded-xl p-4 hover:border-primary/20 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  insight.type === "bullish" ? "bg-profit/10" : insight.type === "warning" ? "bg-loss/10" : "bg-muted"
                }`}>
                  <insight.icon className={`w-4 h-4 ${
                    insight.type === "bullish" ? "text-profit" : insight.type === "warning" ? "text-loss" : "text-muted-foreground"
                  }`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">{insight.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Chat */}
        <AIChatWidget />
      </div>
    </div>
  );
}
