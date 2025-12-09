import { apiClient, handleAPIError } from "./client";
import type { FlowBase, FlowRead, FlowUpdate } from "@/shared/types/flow";

class FlowsAPI {
  private endpoint = "/flows";

  async getFlows(): Promise<FlowRead[]> {
    try {
      const { data } = await apiClient.get<FlowRead[]>(this.endpoint);
      return data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }

  async getFlowById(id: string): Promise<FlowRead> {
    try {
      const { data } = await apiClient.get<FlowRead>(`${this.endpoint}/${id}`);
      return data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }

  async createFlow(flowData: FlowBase): Promise<FlowRead> {
    try {
      const { data } = await apiClient.post<FlowRead>(
        `${this.endpoint}/create-flow`,
        flowData
      );
      return data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }

  async updateFlow(id: string, flowData: FlowUpdate): Promise<FlowRead> {
    try {
      const { data } = await apiClient.put<FlowRead>(
        `${this.endpoint}/${id}/edit`,
        flowData
      );
      return data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }

  async deleteFlow(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      throw handleAPIError(error);
    }
  }

  async executeFlow(id: string): Promise<{
    success: boolean;
    output: string;
    error: string | null;
    data_flow: string;
  }> {
    try {
      const { data } = await apiClient.get(`${this.endpoint}/${id}/execute`);
      return data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
}

export const flowsAPI = new FlowsAPI();
