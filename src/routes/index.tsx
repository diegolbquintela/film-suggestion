import { TonightApp } from "@/components/tonight-app";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: TonightApp });
