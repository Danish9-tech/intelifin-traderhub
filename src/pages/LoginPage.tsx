import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useLogin, useRegister } from "@/hooks/use-auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/dashboard";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const loading = loginMutation.isPending || registerMutation.isPending;

  const submit = async () => {
    try {
      if (mode === "register") {
        await registerMutation.mutateAsync({ name, email, password });
        toast({ title: "Account created", description: "Please sign in." });
        setMode("login");
        return;
      }

      await loginMutation.mutateAsync({ email, password });
      toast({ title: "Welcome back" });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass rounded-2xl w-full max-w-md p-6 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">TraderHub Access</h1>
          <p className="text-sm text-muted-foreground">Sign in to access your dashboard data.</p>
        </div>

        {mode === "register" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
          />
        )}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
        />

        <button
          disabled={loading}
          onClick={submit}
          className="w-full py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </button>

        <button
          onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
          className="w-full text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "Need an account? Register" : "Already registered? Sign in"}
        </button>

        <div className="text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">Back to landing page</Link>
        </div>
      </div>
    </div>
  );
}
