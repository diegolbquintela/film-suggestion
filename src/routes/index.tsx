import { LoginPanel } from "@/components/login-panel";
import { TonightApp } from "@/components/tonight-app";
import { SignInGate } from "@/lib/auth/gates";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useSyncExternalStore } from "react";

const GUEST_KEY = "tonight-guest";

function guestNow() {
  return localStorage.getItem(GUEST_KEY) === "1";
}

export const Route = createFileRoute("/")({
  component: function Home() {
    const stored = useSyncExternalStore(
      () => () => undefined,
      guestNow,
      () => false,
    );
    const [override, setOverride] = useState<boolean | null>(null);
    const guest = override ?? stored;
    if (guest) {
      return (
        <TonightApp
          guest
          onSignIn={() => {
            localStorage.removeItem(GUEST_KEY);
            setOverride(false);
          }}
        />
      );
    }
    return (
      <SignInGate
        fallback={
          <LoginPanel
            onGuest={() => {
              localStorage.setItem(GUEST_KEY, "1");
              setOverride(true);
            }}
          />
        }
      >
        <TonightApp />
      </SignInGate>
    );
  },
});
