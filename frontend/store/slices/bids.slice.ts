import { bidsApi } from "@/lib/api/bids.api";
import { CreateBidPayload, UpdateBidPayload } from "@/types/bid.types";
import { BidsState } from "@/types/redux.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getBidsByGig = createAsyncThunk(
  "bids/bids-by-gig",
  async (gigId: string) => {
    const response = await bidsApi.getByGig(gigId);
    return response.data;
  }
);

export const getMyBids = createAsyncThunk("bids/my-bids", async () => {
  const response = await bidsApi.getMyBids();
  return response.data;
});

export const createBid = createAsyncThunk(
  "bids/create",
  async (data: CreateBidPayload) => {
    const response = await bidsApi.create(data);
    return response.data;
  }
);

export const updateBid = createAsyncThunk(
  "bids/update",
  async ({ id, data }: { id: string; data: UpdateBidPayload }) => {
    const response = await bidsApi.update(id, data);
    return response.data;
  }
);

export const deleteBid = createAsyncThunk("bids/delete", async (id: string) => {
  const response = await bidsApi.delete(id);
  return response.data;
});

export const hireFreelancer = createAsyncThunk(
  "bids/hire-freelancer",
  async (bidId: string) => {
    const response = await bidsApi.hire(bidId);
    return response.data;
  }
);

const initialState: BidsState = {
  items: [],
  myBids: [],
  gigBids: [],
  loading: false,
  error: null,
};

const bidsSlice = createSlice({
  name: "bids",
  initialState,
  reducers: {},
});
