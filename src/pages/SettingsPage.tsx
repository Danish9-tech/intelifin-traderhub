import { useState } from "react";
import { User, Bell, Shield, Palette, CreditCard, Key } from "lucide-react";

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

  return (
    <div className="flex gap-6">
      {/* Settings nav */}
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

      {/* Content */}
      <div className="flex-1 glass rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">{activeTab}</h2>

        {activeTab === "Profile" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">QT</div>
              <div>
                <p className="text-sm font-semibold text-foreground">Quantum Trader</p>
                <p className="text-xs text-muted-foreground">Elite Plan · Member since Jan 2026</p>
              </div>
            </div>
            {[
              { label: "Display Name", value: "Quantum Trader" },
              { label: "Email", value: "trader@example.com" },
              { label: "Timezone", value: "UTC+0 (London)" },
              { label: "Default Currency", value: "USD" },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
                <input
                  defaultValue={field.value}
                  className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            ))}
            <button className="px-5 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="space-y-4">
            {["Price Alerts", "AI Signals", "Strategy Alerts", "Community Mentions", "Newsletter"].map((n) => (
              <div key={n} className="flex items-center justify-between py-2">
                <span className="text-sm text-foreground">{n}</span>
                <div className="w-10 h-6 rounded-full bg-primary/20 flex items-center px-1 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Security" && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your account.</p>
              <button className="mt-3 px-4 py-1.5 text-xs rounded-lg gradient-primary text-primary-foreground font-medium">Enable 2FA</button>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground">Change Password</p>
              <p className="text-xs text-muted-foreground mt-1">Last changed 30 days ago.</p>
              <button className="mt-3 px-4 py-1.5 text-xs rounded-lg glass text-foreground font-medium hover:border-primary/30">Update Password</button>
            </div>
          </div>
        )}

        {activeTab === "API Keys" && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Production Key</p>
                  <p className="text-xs text-muted-foreground font-mono-num mt-1">qt_live_****...****8f2a</p>
                </div>
                <span className="px-2 py-0.5 text-xs rounded bg-profit/10 text-profit">Active</span>
              </div>
            </div>
            <button className="px-4 py-2 text-xs rounded-lg glass text-foreground font-medium hover:border-primary/30">Generate New Key</button>
          </div>
        )}

        {(activeTab === "Billing" || activeTab === "Appearance") && (
          <p className="text-sm text-muted-foreground">Settings for {activeTab.toLowerCase()} coming soon.</p>
        )}
      </div>
    </div>
  );
}
