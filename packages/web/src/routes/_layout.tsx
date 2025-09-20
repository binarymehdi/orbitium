import { createFileRoute, Outlet } from "@tanstack/react-router";

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});
