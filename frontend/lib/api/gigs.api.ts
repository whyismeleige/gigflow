import { CreateGigPayload, UpdateGigPayload } from "@/types/gig.types";
import { apiClient } from "./axios";

export const gigsApi = {
  getAll: (params?: { search?: string; page?: number }) =>
    apiClient.get("/api/gigs", { params }),
  getById: (id: string) => apiClient.get(`/api/gigs/${id}`),
  create: (data: CreateGigPayload) => apiClient.post("/api/gigs", data),
  update: (id: string, data: UpdateGigPayload) =>
    apiClient.patch(`/api/gigs/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/gigs/${id}`),
  getMyGigs: () => apiClient.get("api/gigs/my-gigs"),
};

