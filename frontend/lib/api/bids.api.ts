import { CreateBidPayload, UpdateBidPayload } from "@/types/bid.types";
import { apiClient } from "./axios";

export const bidsApi = {
  create: (data: CreateBidPayload) => apiClient.post("/api/bids", data),
  getByGig: (gigId: string) => apiClient.get(`/api/bids/${gigId}`),
  getMyBids: () => apiClient.get(`/api/bids/my-bids`),
  update: (id: string, data: UpdateBidPayload) =>
    apiClient.patch(`/api/bids/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/bids/${id}`),
  hire: (bidId: string) => apiClient.patch(`/api/bids/${bidId}/hire`),
};
