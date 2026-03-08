import { useState } from "react";
import { User, Bell, Shield, CreditCard, Key, Palette, Check, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const tabs = [
  { icon: User, label: "Profile" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Security" },
  { icon: CreditCard, label: "Billing" },
  { icon: Key, label: "API Keys" },
  { icon: Palette, label: "Appearance" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [name, setName] = useState("Quantum Trader");
  const [email, setEmail] = useState("trader@example.com");
  const [timezone, setTimezone] = useState("UTC+0 (London)");
  const [currency, setCurrency] = useState("USD");
  const [notifications, setNotifications] = useState({
    priceAlerts: true, aiSignals: true, strategyAlerts: true, communityMentions: false, newsletter: false,
  });
  const [twoFa, setTwoFa] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [theme, setTheme] = useState("dark");
  const apiKey = "qt_live_a8f2k9d3m1p7x4w6b5n0c2e8";

  const saveProfile = () => toast({ title: "Profile saved!", description: `Name: ${name}, Email: ${email}` });
  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast({ title: `${key.replace(/([A-Z])/g, " $1")} ${next[key] ? "enabled" : "disabled"}` });
      return next;
    });
  };
  const toggleTwoFa = () => {
    setTwoFa(!twoFa);
    toast({ title: twoFa ? "2FA disabled" : "2FA enabled!", description: twoFa ? "" : "Your account is now more secure." });
  };
  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey).catch(() => {});
    toast({ title: "API key copied to clipboard" });
  };
  const regenerateKey = () => toast({ title: "New API key generated", description: "Your old key has been revoked." });

  return (
    <div className="flex gap-6">
      <div className="w-48 space-y-1 flex-shrink-0 hidden md:block">
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setActiveTab(t.label)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
              activeTab === t.label ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden flex gap-1 overflow-x-auto pb-2 w-full">
        {tabs.map((t) => (
          <button key={t.label} onClick={() => setActiveTab(t.label)} className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors ${activeTab === t.label ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>{t.label}</button>
        ))}
      </div>

      <div className="flex-1 glass rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">{activeTab}</h2>

        {activeTab === "Profile" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">{name.slice(0, 2).toUpperCase()}</div>
              <div>
                <p className="text-sm font-semibold text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">Elite Plan · Member since Jan 2026</p>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Display Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Timezone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary">
                {["UTC+0 (London)", "UTC-5 (New York)", "UTC-8 (Los Angeles)", "UTC+1 (Paris)", "UTC+8 (Singapore)", "UTC+9 (Tokyo)"].map((tz) => (
                  <option key={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Default Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary">
                {["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={saveProfile} className="px-5 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <span className="text-sm text-foreground">{key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</span>
                <button
                  onClick={() => toggleNotif(key as keyof typeof notifications)}
                  className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${value ? "bg-primary justify-end" : "bg-muted justify-start"}`}
                >
                  <div className="w-4 h-4 rounded-full bg-foreground transition-transform" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Security" && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground mt-1">{twoFa ? "Enabled - Your account is protected." : "Add an extra layer of security."}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded ${twoFa ? "bg-profit/10 text-profit" : "bg-muted text-muted-foreground"}`}>{twoFa ? "Active" : "Off"}</span>
              </div>
              <button onClick={toggleTwoFa} className={`mt-3 px-4 py-1.5 text-xs rounded-lg font-medium transition-colors ${twoFa ? "glass text-loss hover:border-loss/30" : "gradient-primary text-primary-foreground"}`}>
                {twoFa ? "Disable 2FA" : "Enable 2FA"}
              </button>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground">Change Password</p>
              <p className="text-xs text-muted-foreground mt-1">Last changed 30 days ago.</p>
              <div className="mt-3 space-y-2">
                <input type="password" placeholder="Current password" className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
                <input type="password" placeholder="New password" className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary" />
                <button onClick={() => toast({ title: "Password updated!" })} className="px-4 py-1.5 text-xs rounded-lg glass text-foreground font-medium hover:border-primary/30">Update Password</button>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground">Active Sessions</p>
              <div className="mt-2 space-y-2">
                {["Chrome - Windows (Current)", "Safari - MacOS", "Mobile App - iOS"].map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{s}</span>
                    {i === 0 ? (
                      <span className="text-xs text-profit">Active</span>
                    ) : (
                      <button onClick={() => toast({ title: `Session revoked: ${s}` })} className="text-xs text-loss hover:underline">Revoke</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Billing" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Elite Plan</p>
                  <p className="text-xs text-muted-foreground">$149/month · Next billing: Apr 8, 2026</p>
                </div>
                <span className="px-2 py-0.5 text-xs rounded bg-profit/10 text-profit">Active</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => toast({ title: "Redirecting to plan management..." })} className="px-4 py-1.5 text-xs rounded-lg glass text-foreground font-medium hover:border-primary/30">Change Plan</button>
                <button onClick={() => toast({ title: "Are you sure?", description: "Contact support to cancel.", variant: "destructive" })} className="px-4 py-1.5 text-xs rounded-lg glass text-loss font-medium hover:border-loss/30">Cancel</button>
              </div>
            </div>
            <div className="glass rounded-xl p-5">
              <p className="text-sm font-semibold text-foreground mb-3">Payment History</p>
              {[
                { date: "Mar 8, 2026", amount: "$149.00", status: "Paid" },
                { date: "Feb 8, 2026", amount: "$149.00", status: "Paid" },
                { date: "Jan 8, 2026", amount: "$149.00", status: "Paid" },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{p.date}</span>
                  <span className="text-sm font-mono-num text-foreground">{p.amount}</span>
                  <span className="text-xs text-profit">{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "API Keys" && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground">Production Key</p>
                  <p className="text-xs font-mono-num text-muted-foreground mt-1">
                    {showApiKey ? apiKey : "qt_live_****...****8f2a"}
                  </p>
                </div>
                <span className="px-2 py-0.5 text-xs rounded bg-profit/10 text-profit">Active</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setShowApiKey(!showApiKey)} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg glass text-foreground font-medium hover:border-primary/30">
                  {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showApiKey ? "Hide" : "Show"}
                </button>
                <button onClick={copyApiKey} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg glass text-foreground font-medium hover:border-primary/30">
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground">API Usage (This Month)</p>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <div className="h-full rounded-full gradient-primary" style={{ width: "34%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">34,200 / 100,000 requests</p>
            </div>
            <button onClick={regenerateKey} className="px-4 py-2 text-xs rounded-lg glass text-foreground font-medium hover:border-primary/30">Generate New Key</button>
          </div>
        )}

        {activeTab === "Appearance" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Theme</p>
            <div className="flex gap-3">
              {["dark", "midnight", "ocean"].map((t) => (
                <button
                  key={t}
                  onClick={() => { setTheme(t); toast({ title: `Theme: ${t}` }); }}
                  className={`px-4 py-3 rounded-xl text-sm capitalize transition-colors ${theme === t ? "bg-primary/10 text-primary border border-primary/20" : "glass text-muted-foreground hover:text-foreground"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">Chart Style</p>
            <div className="flex gap-3">
              {["Candlestick", "Line", "Area", "Heikin Ashi"].map((s) => (
                <button key={s} onClick={() => toast({ title: `Chart style: ${s}` })} className="px-4 py-2 rounded-lg glass text-sm text-muted-foreground hover:text-foreground transition-colors">{s}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
