import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useState } from "react";

export function LoginPanel({ onGuest }: { onGuest?: () => void }) {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submitEmail(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    const body = { email: email.trim(), password, callbackURL: "/" };
    const result =
      mode === "up"
        ? await authClient.signUp.email({ ...body, name: email.trim().split("@")[0] || "Reader" })
        : await authClient.signIn.email(body);
    setPending(false);
    if (result.error) setError(result.error.message || "That didn't sign you in.");
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-fg">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl leading-none">Tonight</h1>
        <p className="mt-3 text-sm leading-normal text-muted">
          Sign in so this phone and your computer keep the same shelf.
        </p>
        {authEnabled ? (
          <div className="mt-8 space-y-3">
            {GROK_PROVIDERS.map((provider) => (
              <button
                key={provider.providerId}
                type="button"
                className="min-h-11 w-full border border-line text-sm"
                onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
              >
                Continue with {provider.label}
              </button>
            ))}
            <form className="space-y-3 border-t border-line pt-4" onSubmit={submitEmail}>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                aria-label="Email"
                className="min-h-11 w-full border-b border-line bg-transparent text-sm outline-none placeholder:text-muted"
              />
              <input
                type="password"
                required
                minLength={8}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                aria-label="Password"
                className="min-h-11 w-full border-b border-line bg-transparent text-sm outline-none placeholder:text-muted"
              />
              {error ? <p className="text-sm">{error}</p> : null}
              <button type="submit" disabled={pending} className="min-h-11 w-full bg-fg text-sm text-bg disabled:opacity-50">
                {pending ? "One moment" : mode === "up" ? "Create account" : "Sign in with email"}
              </button>
              <button
                type="button"
                className="min-h-11 w-full text-sm text-muted"
                onClick={() => {
                  setMode(mode === "up" ? "in" : "up");
                  setError("");
                }}
              >
                {mode === "up" ? "I already have an account" : "Create an account"}
              </button>
              {onGuest ? (
                <button type="button" className="min-h-11 w-full border border-line text-sm" onClick={onGuest}>
                  Try it first
                </button>
              ) : null}
            </form>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted">Sign-in is off.</p>
        )}
      </div>
    </main>
  );
}
