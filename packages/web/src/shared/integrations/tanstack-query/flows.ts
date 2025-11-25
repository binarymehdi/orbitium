import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { flowsAPI } from "@/shared/api/flows";
import type { FlowBase, FlowUpdate, FlowRead } from "@/shared/types/flow";

export const flowKeys = {
  all: ["flows"] as const,
  lists: () => [...flowKeys.all, "list"] as const,
  list: (filters?: any) => [...flowKeys.lists(), { filters }] as const,
  details: () => [...flowKeys.all, "detail"] as const,
  detail: (id: string) => [...flowKeys.details(), id] as const,
};

export function useFlows() {
  return useQuery<FlowRead[]>({
    queryKey: flowKeys.lists(),
    queryFn: () => flowsAPI.getFlows(),
  });
}

export function useFlow(id: string) {
  return useQuery({
    queryKey: flowKeys.detail(id),
    queryFn: () => flowsAPI.getFlowById(id),
    enabled: !!id,
  });
}

export function useCreateFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flowData: FlowBase) => flowsAPI.createFlow(flowData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flowKeys.lists() });
    },
  });
}

export function useUpdateFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FlowUpdate }) =>
      flowsAPI.updateFlow(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: flowKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: flowKeys.lists() });
    },
  });
}

export function useDeleteFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => flowsAPI.deleteFlow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flowKeys.lists() });
    },
  });
}

export function useExecuteFlow() {
  return useMutation({
    mutationFn: (id: string) => flowsAPI.executeFlow(id),
  });
}
