import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
// import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
// import { TanStackDevtools } from "@tanstack/react-devtools";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      {/* <TanStackDevtools
        config={{
          position: "bottom-left",
        }}
        plugins={[
          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          {
            name: "React Query",
            render: <ReactQueryDevtoolsPanel />,
          },
        ]}
      /> */}
    </>
  ),
});
