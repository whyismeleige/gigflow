import { User } from "./user.types";

export type GigStatus = "open" | "assigned";

export interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: string;
  ownerId: User | string;
  status: GigStatus;
  bidCount?: number;
  userHasBid?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGigPayload {
  title: string;
  description: string;
  budget: number;
}

export interface UpdateGigPayload {
  title?: string;
  description?: string;
  budget?: number;
}

export interface GigFilters {
  search: string;
  status: "open" | "assigned" | "all";
}

export interface GigPagination {
  currentPage: number;
  totalPages: number;
  totalGigs: number;
  hasMore: boolean;
}
