import { Play, BookOpen, Award, Clock, ChevronRight } from "lucide-react";

const courses = [
  { title: "Trading Fundamentals", lessons: 12, duration: "4h 30m", level: "Beginner", progress: 100, desc: "Learn the basics of trading, market structure, and order types." },
  { title: "Technical Analysis Mastery", lessons: 24, duration: "8h 15m", level: "Intermediate", progress: 65, desc: "Master chart patterns, indicators, and price action analysis." },
  { title: "Risk Management Pro", lessons: 8, duration: "2h 45m", level: "Beginner", progress: 30, desc: "Position sizing, stop losses, and portfolio risk management." },
  { title: "Algorithmic Trading", lessons: 18, duration: "6h 20m", level: "Advanced", progress: 0, desc: "Build automated strategies with backtesting and deployment." },
  { title: "Crypto DeFi Trading", lessons: 15, duration: "5h 10m", level: "Intermediate", progress: 0, desc: "Navigate DEXs, yield farming, and on-chain analysis." },
  { title: "Forex Masterclass", lessons: 20, duration: "7h 30m", level: "Advanced", progress: 0, desc: "Central bank analysis, carry trades, and macro trading strategies." },
];

export default function AcademyPage() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: BookOpen, label: "Courses Available", value: "24" },
          { icon: Clock, label: "Hours of Content", value: "86+" },
          { icon: Award, label: "Certifications", value: "6" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold font-mono-num text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Courses */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c, i) => (
          <div key={i} className="glass rounded-xl p-5 hover:border-primary/20 transition-colors group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                c.level === "Beginner" ? "bg-profit/10 text-profit" : c.level === "Intermediate" ? "bg-primary/10 text-primary" : "bg-loss/10 text-loss"
              }`}>{c.level}</span>
              {c.progress > 0 && <span className="text-xs font-mono-num text-primary">{c.progress}%</span>}
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{c.title}</h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{c.desc}</p>
            {c.progress > 0 && c.progress < 100 && (
              <div className="h-1 rounded-full bg-muted mb-3">
                <div className="h-full rounded-full gradient-primary" style={{ width: `${c.progress}%` }} />
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{c.lessons} lessons · {c.duration}</span>
              <button className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                {c.progress > 0 && c.progress < 100 ? "Continue" : c.progress === 100 ? "Review" : "Start"}
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
