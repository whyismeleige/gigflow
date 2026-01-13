import { bidsApi } from "@/lib/api/bids.api";
import { CreateBidPayload, UpdateBidPayload } from "@/types/bid.types";
import { BidsState } from "@/types/redux.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getBidsByGig = createAsyncThunk(
  "bids/bids-by-gig",
  async (gigId: string) => {
    const response = await bidsApi.getByGig(gigId);
    return response.data.bids;
  }
);

export const getMyBids = createAsyncThunk("bids/my-bids", async () => {
  const response = await bidsApi.getMyBids();
  return response.data.bids;
});

export const createBid = createAsyncThunk(
  "bids/create",
  async (data: CreateBidPayload) => {
    const response = await bidsApi.create(data);
    return response.data.bid;
  }
);

export const updateBid = createAsyncThunk(
  "bids/update",
  async ({ id, data }: { id: string; data: UpdateBidPayload }) => {
    const response = await bidsApi.update(id, data);
    return response.data.bid;
  }
);

export const deleteBid = createAsyncThunk("bids/delete", async (id: string) => {
  await bidsApi.delete(id);
  return id;
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
  reducers: {
    clearBidsError: (state) => {
      state.error = null;
    },
    // Real-time update from socket: update bid status when hired
    updateBidStatusFromSocket: (state, action) => {
      const { bidId, status } = action.payload;
      
      // Update in myBids array
      const myBidIndex = state.myBids.findIndex((bid) => bid._id === bidId);
      if (myBidIndex !== -1) {
        state.myBids[myBidIndex].status = status;
      }

      // Update in gigBids array
      const gigBidIndex = state.gigBids.findIndex((bid) => bid._id === bidId);
      if (gigBidIndex !== -1) {
        state.gigBids[gigBidIndex].status = status;
      }

      // Update in items array
      const itemIndex = state.items.findIndex((bid) => bid._id === bidId);
      if (itemIndex !== -1) {
        state.items[itemIndex].status = status;
      }
    },
  },
  extraReducers: (builder) => {
    // Get Bids by Gig
    builder
      .addCase(getBidsByGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBidsByGig.fulfilled, (state, action) => {
        state.loading = false;
        state.gigBids = action.payload;
      })
      .addCase(getBidsByGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch bids";
      });

    // Get My Bids
    builder
      .addCase(getMyBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBids.fulfilled, (state, action) => {
        state.loading = false;
        state.myBids = action.payload;
      })
      .addCase(getMyBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch your bids";
      });

    // Create Bid
    builder
      .addCase(createBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.loading = false;
        state.myBids.unshift(action.payload);
      })
      .addCase(createBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to submit bid";
      });

    // Update Bid
    builder
      .addCase(updateBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBid.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.myBids.findIndex(
          (bid) => bid._id === action.payload._id
        );
        if (index !== -1) {
          state.myBids[index] = action.payload;
        }
      })
      .addCase(updateBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update bid";
      });

    // Delete Bid
    builder
      .addCase(deleteBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBid.fulfilled, (state, action) => {
        state.loading = false;
        state.myBids = state.myBids.filter((bid) => bid._id !== action.payload);
      })
      .addCase(deleteBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete bid";
      });

    // Hire Freelancer
    builder
      .addCase(hireFreelancer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hireFreelancer.fulfilled, (state, action) => {
        state.loading = false;
        // Update the gigBids list with new statuses
        const hiredBidId = action.payload.bid._id;
        state.gigBids = state.gigBids.map((bid) => {
          if (bid._id === hiredBidId) {
            return { ...bid, status: "hired" as const };
          } else if (bid.status === "pending") {
            return { ...bid, status: "rejected" as const };
          }
          return bid;
        });
      })
      .addCase(hireFreelancer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to hire freelancer";
      });
  },
});

export const { clearBidsError, updateBidStatusFromSocket } = bidsSlice.actions;
export default bidsSlice.reducer;