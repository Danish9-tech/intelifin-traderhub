import { useState } from "react";
import { Play, BookOpen, Award, Clock, ChevronRight, Check, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Course {
  id: number;
  title: string;
  lessons: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  desc: string;
  currentLesson: number;
}

const initialCourses: Course[] = [
  { id: 1, title: "Trading Fundamentals", lessons: 12, duration: "4h 30m", level: "Beginner", progress: 100, desc: "Learn the basics of trading, market structure, and order types.", currentLesson: 12 },
  { id: 2, title: "Technical Analysis Mastery", lessons: 24, duration: "8h 15m", level: "Intermediate", progress: 65, desc: "Master chart patterns, indicators, and price action analysis.", currentLesson: 16 },
  { id: 3, title: "Risk Management Pro", lessons: 8, duration: "2h 45m", level: "Beginner", progress: 30, desc: "Position sizing, stop losses, and portfolio risk management.", currentLesson: 3 },
  { id: 4, title: "Algorithmic Trading", lessons: 18, duration: "6h 20m", level: "Advanced", progress: 0, desc: "Build automated strategies with backtesting and deployment.", currentLesson: 0 },
  { id: 5, title: "Crypto DeFi Trading", lessons: 15, duration: "5h 10m", level: "Intermediate", progress: 0, desc: "Navigate DEXs, yield farming, and on-chain analysis.", currentLesson: 0 },
  { id: 6, title: "Forex Masterclass", lessons: 20, duration: "7h 30m", level: "Advanced", progress: 0, desc: "Central bank analysis, carry trades, and macro trading strategies.", currentLesson: 0 },
  { id: 7, title: "Options Trading Basics", lessons: 10, duration: "3h 45m", level: "Beginner", progress: 0, desc: "Learn calls, puts, spreads, and basic options strategies.", currentLesson: 0 },
  { id: 8, title: "Price Action Trading", lessons: 16, duration: "5h 50m", level: "Intermediate", progress: 0, desc: "Trade purely based on candlestick patterns and market structure.", currentLesson: 0 },
];

export default function AcademyPage() {
  const [courses, setCourses] = useState(initialCourses);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>("All");

  const startOrContinue = (id: number) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (c.progress === 0) {
          toast({ title: `Started: ${c.title}`, description: "Lesson 1 unlocked." });
          return { ...c, progress: Math.round((1 / c.lessons) * 100), currentLesson: 1 };
        }
        if (c.progress === 100) {
          setActiveCourse(c);
          return c;
        }
        const nextLesson = c.currentLesson + 1;
        const newProgress = Math.min(100, Math.round((nextLesson / c.lessons) * 100));
        toast({
          title: newProgress === 100 ? `🎉 ${c.title} completed!` : `Lesson ${nextLesson} of ${c.lessons} completed`,
          description: newProgress === 100 ? "Congratulations! Certificate earned." : `Progress: ${newProgress}%`,
        });
        const updated = { ...c, progress: newProgress, currentLesson: nextLesson };
        setActiveCourse(updated);
        return updated;
      })
    );
  };

  const filtered = courses.filter((c) => filterLevel === "All" || c.level === filterLevel);
  const completedCount = courses.filter((c) => c.progress === 100).length;
  const totalProgress = courses.reduce((a, c) => a + c.progress, 0) / courses.length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Courses", value: `${courses.length}` },
          { icon: Clock, label: "Hours", value: "86+" },
          { icon: Award, label: "Completed", value: `${completedCount}` },
          { icon: Check, label: "Overall Progress", value: `${Math.round(totalProgress)}%` },
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

      {/* Filters */}
      <div className="flex gap-1">
        {["All", "Beginner", "Intermediate", "Advanced"].map((l) => (
          <button key={l} onClick={() => setFilterLevel(l)} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${filterLevel === l ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>{l}</button>
        ))}
      </div>

      {/* Active course detail */}
      {activeCourse && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{activeCourse.title}</h2>
              <p className="text-xs text-muted-foreground">Lesson {activeCourse.currentLesson} of {activeCourse.lessons}</p>
            </div>
            <button onClick={() => setActiveCourse(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Close</button>
          </div>
          <div className="h-1.5 rounded-full bg-muted mb-4">
            <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${activeCourse.progress}%` }} />
          </div>
          <div className="space-y-2">
            {Array.from({ length: activeCourse.lessons }, (_, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  i + 1 <= activeCourse.currentLesson ? "bg-profit/5" : i + 1 === activeCourse.currentLesson + 1 ? "bg-primary/5" : "bg-muted/30"
                }`}
              >
                {i + 1 <= activeCourse.currentLesson ? (
                  <Check className="w-4 h-4 text-profit" />
                ) : i + 1 === activeCourse.currentLesson + 1 ? (
                  <Play className="w-4 h-4 text-primary" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={`text-sm ${i + 1 <= activeCourse.currentLesson ? "text-foreground" : "text-muted-foreground"}`}>
                  Lesson {i + 1}: {["Introduction", "Core Concepts", "Key Patterns", "Analysis Techniques", "Strategy Development", "Risk Assessment", "Advanced Topics", "Market Application", "Live Practice", "Case Studies", "Portfolio Integration", "Final Review", "Expert Strategies", "Optimization", "Automation", "Backtesting", "Live Trading", "Performance Review", "Advanced Analysis", "Masterclass", "Graduation", "Certification", "Bonus Material", "Community Project"][i % 24]}
                </span>
              </div>
            ))}
          </div>
          {activeCourse.progress < 100 && (
            <button onClick={() => startOrContinue(activeCourse.id)} className="mt-4 px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Complete Lesson {activeCourse.currentLesson + 1}
            </button>
          )}
          {activeCourse.progress === 100 && (
            <div className="mt-4 glass rounded-xl p-4 text-center">
              <Award className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">Certificate Earned!</p>
              <p className="text-xs text-muted-foreground">{activeCourse.title} - Completed</p>
            </div>
          )}
        </div>
      )}

      {/* Courses grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className={`glass rounded-xl p-5 transition-colors group cursor-pointer ${c.progress === 100 ? "border-profit/20" : "hover:border-primary/20"}`}>
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
                <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${c.progress}%` }} />
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{c.lessons} lessons · {c.duration}</span>
              <button
                onClick={() => startOrContinue(c.id)}
                className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all font-medium"
              >
                {c.progress === 100 ? "Review" : c.progress > 0 ? "Continue" : "Start"}
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
