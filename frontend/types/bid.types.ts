import { Gig } from "./gig.types";
import { User } from "./user.types";

export type BidStatus = "pending" | "hired" | "rejected";

export interface Bid {
  _id: string;
  gigId: Gig | string;
  freelancerId: User | string;
  message: string;
  proposedPrice: string;
  status: BidStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBidPayload {
  gigId: string;
  message: string;
  proposedPrice: number;
}

export interface UpdateBidPayload {
  message?: string;
  proposedPrice?: number;
}


