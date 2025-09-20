import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "../../../features/landing";

function RouteComponent() {
  return <LandingPage />;
}

export const Route = createFileRoute("/_layout/(public)/")({
  component: RouteComponent,
});
