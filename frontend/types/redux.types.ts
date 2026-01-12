import { Bid } from "./bid.types";
import { Gig, GigFilters, GigPagination } from "./gig.types";
import { User } from "./user.types";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface GigsState {
  items: Gig[];
  currentGig: Gig | null;
  myGigs: Gig[];
  filters: GigFilters;
  pagination: GigPagination;
  loading: boolean;
  error: string | null;
}

export interface BidsState {
  items: Bid[];
  myBids: Bid[];
  gigBids: Bid[];
  loading: boolean;
  error: string | null;
}

export interface NotificationState {
  items: Notification[];
  unreadCount: number;
}

export interface RootState {
  auth: AuthState;
  gigs: GigsState;
  bids: BidsState;
  notification: NotificationState;
}
