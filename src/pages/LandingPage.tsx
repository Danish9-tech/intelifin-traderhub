import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Brain, Zap, Shield, Globe, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const features = [
  { icon: Brain, title: "AI Trading Engine", desc: "Pattern recognition, sentiment analysis, and trade suggestions powered by advanced AI models." },
  { icon: BarChart3, title: "Advanced Charting", desc: "Multi-chart layouts with 100+ indicators, drawing tools, and real-time data streaming." },
  { icon: Zap, title: "Automated Strategies", desc: "Visual drag-and-drop strategy builder with backtesting and live deployment." },
  { icon: TrendingUp, title: "Portfolio Intelligence", desc: "Multi-exchange tracking, risk analysis, and diversification insights." },
  { icon: Globe, title: "Social Trading", desc: "Follow top traders, copy trades, compete in leaderboards, share ideas." },
  { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption, 2FA, cold storage integration, SOC2 compliant." },
];

const pricingPlans = [
  { name: "Free", price: "$0", period: "/forever", features: ["5 charts", "Basic indicators", "Daily AI insights", "Community access"], cta: "Get Started" },
  { name: "Pro", price: "$49", period: "/month", features: ["Unlimited charts", "100+ indicators", "AI trade setups", "Backtesting engine", "Alerts & signals", "Trading journal"], cta: "Start Pro Trial", popular: true },
  { name: "Elite", price: "$149", period: "/month", features: ["Everything in Pro", "Automated strategies", "Copy trading", "Portfolio analytics", "Priority support", "API access"], cta: "Go Elite" },
];

const stats = [
  { value: "2M+", label: "Active Traders" },
  { value: "$12B+", label: "Volume Tracked" },
  { value: "99.99%", label: "Uptime" },
  { value: "150ms", label: "Avg Latency" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">QuantumTrade AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Pricing", "Academy", "API"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
            <Link to="/login" className="px-4 py-2 text-sm font-medium rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition-opacity glow-primary">
              Start Trading
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-8">
              <span className="w-2 h-2 rounded-full bg-profit animate-pulse-glow" />
              Live: 2,847 traders online now
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
              Trade Smarter with{" "}
              <span className="gradient-text">AI-Powered</span>{" "}
              Intelligence
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The all-in-one platform for Forex, Crypto, Stocks & Commodities. Advanced charting, automated strategies, and real-time AI analysis.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="group px-8 py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-base glow-primary hover:opacity-90 transition-all flex items-center gap-2">
                Launch Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="px-8 py-3.5 rounded-xl glass text-foreground font-semibold text-base hover:bg-accent transition-colors">
                Explore Features
              </a>
            </motion.div>
          </motion.div>

          {/* Stats ticker */}
          <motion.div
            variants={fadeUp} custom={5}
            initial="hidden" animate="visible"
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold font-mono-num gradient-text">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Dominate Markets</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg max-w-xl mx-auto">
              Professional-grade tools trusted by institutional and retail traders worldwide.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} custom={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold mb-4">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp} custom={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className={`rounded-2xl p-8 relative ${plan.popular ? "gradient-primary glow-primary" : "glass"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-background rounded-full text-xs font-semibold text-primary border border-primary/30">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-bold font-mono-num ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`text-sm flex items-center gap-2 ${plan.popular ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${plan.popular ? "bg-primary-foreground" : "bg-primary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.popular
                    ? "bg-background text-foreground hover:bg-accent"
                    : "glass hover:border-primary/30 text-foreground"
                }`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="glass rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <div className="relative z-10">
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold mb-4">
                Ready to Trade with <span className="gradient-text">AI Power</span>?
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
                Join 2 million+ traders already using QuantumTrade AI to find better setups and manage risk.
              </motion.p>
              <motion.div variants={fadeUp} custom={2}>
                <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-primary-foreground font-semibold glow-primary hover:opacity-90 transition-all group">
                  Start Trading Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">QuantumTrade AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 QuantumTrade AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
