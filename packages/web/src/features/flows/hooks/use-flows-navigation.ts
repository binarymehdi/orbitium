import { useNavigate } from "@tanstack/react-router";

export const useFlowsNavigation = () => {
  const navigate = useNavigate();

  const navigateToPlayground = (flowId: string) => {
    navigate({ to: `/flows/$id/playground`, params: { id: flowId } });
  };

  return {
    navigateToPlayground,
  };
};
