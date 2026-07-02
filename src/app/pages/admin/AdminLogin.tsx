import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Mail, ShieldCheck, Loader2, ArrowLeft, MailCheck, KeyRound, CheckCircle2 } from "lucide-react";
import { GradientButton, GlassPanel } from "../../components/Primitives";
import { Logo } from "../../components/Logo";
import { useAdminAuth } from "../../../lib/admin-auth";

type Mode = "login" | "forgot" | "sent" | "reset" | "done";

export function AdminLogin() {
  const { signIn, isAuthenticated, requestPasswordReset, resetPassword } = useAdminAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard", { replace: true });
  }, [isAuthenticated]);

  const reset = () => {
    setError("");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setError(error);
    else navigate("/admin/dashboard", { replace: true });
  };

  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await requestPasswordReset(email);
    setLoading(false);
    if (error) setError(error);
    else setMode("sent");
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await resetPassword(newPassword);
    setLoading(false);
    if (error) setError(error);
    else setMode("done");
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin access
          </span>
        </div>

        <GlassPanel className="p-7">
          <AnimatePresence mode="wait">
            {/* ---------- LOGIN ---------- */}
            {mode === "login" && (
              <Panel key="login">
                <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Sign in to manage the SinultWall collection.
                </p>
                <form onSubmit={submitLogin} className="mt-6 space-y-4">
                  <Field icon={Mail} label="Email">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent outline-none placeholder:text-[var(--muted-foreground)]"
                    />
                  </Field>
                  <Field icon={Lock} label="Password">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent outline-none placeholder:text-[var(--muted-foreground)]"
                    />
                  </Field>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        reset();
                        setMode("forgot");
                      }}
                      className="text-sm font-medium text-[var(--primary)] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error && <ErrorMsg>{error}</ErrorMsg>}

                  <GradientButton type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </GradientButton>
                </form>
              </Panel>
            )}

            {/* ---------- FORGOT ---------- */}
            {mode === "forgot" && (
              <Panel key="forgot">
                <BackBtn onClick={() => { reset(); setMode("login"); }} />
                <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Enter your admin email and we'll send you a secure reset link.
                </p>
                <form onSubmit={submitForgot} className="mt-6 space-y-4">
                  <Field icon={Mail} label="Email">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent outline-none placeholder:text-[var(--muted-foreground)]"
                    />
                  </Field>
                  {error && <ErrorMsg>{error}</ErrorMsg>}
                  <GradientButton type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </GradientButton>
                </form>
              </Panel>
            )}

            {/* ---------- SENT ---------- */}
            {mode === "sent" && (
              <Panel key="sent">
                <div className="flex flex-col items-center gap-4 py-2 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#ff8fc7] text-white">
                    <MailCheck className="h-7 w-7" />
                  </span>
                  <h1 className="text-2xl font-bold tracking-tight">Check your inbox</h1>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    If an admin account exists for <strong>{email}</strong>, a reset link is on
                    its way. Click the link in the email to choose a new password.
                  </p>
                  <p className="rounded-xl bg-[var(--muted)] px-3 py-2.5 text-xs text-[var(--muted-foreground)]">
                    Demo mode: no email is actually sent — continue below to set a new password.
                    Connect Supabase to enable real reset emails.
                  </p>
                  <GradientButton size="lg" className="w-full" onClick={() => { reset(); setMode("reset"); }}>
                    Continue to set new password
                  </GradientButton>
                  <button
                    onClick={() => { reset(); setMode("login"); }}
                    className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    Back to sign in
                  </button>
                </div>
              </Panel>
            )}

            {/* ---------- RESET ---------- */}
            {mode === "reset" && (
              <Panel key="reset">
                <h1 className="text-2xl font-bold tracking-tight">Set a new password</h1>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Choose a strong password for your admin account.
                </p>
                <form onSubmit={submitReset} className="mt-6 space-y-4">
                  <Field icon={KeyRound} label="New password">
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent outline-none placeholder:text-[var(--muted-foreground)]"
                    />
                  </Field>
                  <Field icon={KeyRound} label="Confirm password">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent outline-none placeholder:text-[var(--muted-foreground)]"
                    />
                  </Field>
                  {error && <ErrorMsg>{error}</ErrorMsg>}
                  <GradientButton type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Updating…
                      </>
                    ) : (
                      "Update password"
                    )}
                  </GradientButton>
                </form>
              </Panel>
            )}

            {/* ---------- DONE ---------- */}
            {mode === "done" && (
              <Panel key="done">
                <div className="flex flex-col items-center gap-4 py-2 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#74b9ff] text-white">
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                  <h1 className="text-2xl font-bold tracking-tight">Password updated</h1>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Your password has been changed. You can now sign in with your new password.
                  </p>
                  <GradientButton size="lg" className="w-full" onClick={() => { reset(); setMode("login"); }}>
                    Back to sign in
                  </GradientButton>
                </div>
              </Panel>
            )}
          </AnimatePresence>

        </GlassPanel>
      </motion.div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
    >
      <ArrowLeft className="h-4 w-4" /> Back
    </button>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-[var(--accent)] px-3 py-2 text-sm text-[var(--destructive)]"
    >
      {children}
    </motion.p>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2.5 rounded-2xl border border-white/60 bg-white/60 px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--ring)]">
        <Icon className="h-4 w-4 text-[var(--muted-foreground)]" />
        {children}
      </div>
    </label>
  );
}
