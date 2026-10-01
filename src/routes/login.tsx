import { LoginPanel } from "@/components/login-panel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: function Login() {
    return <LoginPanel />;
  },
});
