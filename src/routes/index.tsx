import { LoginPanel } from "@/components/login-panel";
import { TonightApp } from "@/components/tonight-app";
import { SignInGate } from "@/lib/auth/gates";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: function Home() {
    return (
      <SignInGate fallback={<LoginPanel />}>
        <TonightApp />
      </SignInGate>
    );
  },
});
