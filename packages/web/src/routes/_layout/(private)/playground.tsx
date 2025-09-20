import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/(private)/playground")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-100 text-center">
      This is the playground{" "}
    </div>
  );
}
