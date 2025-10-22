import PlaygroundExample from "@/features/playground";
import { Background } from "@/features/playground/components/bg";
import { createFileRoute } from "@tanstack/react-router";
import { ReactFlowProvider } from '@xyflow/react';

export const Route = createFileRoute("/_layout/flows/playground")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Background>
      <div className="flex h-screen items-center justify-center">
        <ReactFlowProvider>
          <PlaygroundExample/>
        </ReactFlowProvider>
      </div>
    </Background>
  );
}
