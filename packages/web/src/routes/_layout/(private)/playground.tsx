import { Background } from "@/features/playground/bg";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/(private)/playground")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Background>
      <div className="flex h-screen items-center justify-center">
        This is the playground{" "}
      </div>
    </Background>
  );
}
