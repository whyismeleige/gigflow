import { gigsApi } from "@/lib/api/gigs.api";
import { CreateGigPayload, UpdateGigPayload } from "@/types/gig.types";
import { GigsState } from "@/types/redux.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchGigs = createAsyncThunk(
  "gigs/fetchAll",
  async ({ search = "", page = 1 }: { search?: string; page?: number }) => {
    const response = await gigsApi.getAll({ search, page });
    return response.data;
  }
);

export const fetchGigsById = createAsyncThunk(
  "gigs/fetchById",
  async (id: string) => {
    const response = await gigsApi.getById(id);
    return response.data.gig;
  }
);

export const createGig = createAsyncThunk(
  "gigs/create",
  async (data: CreateGigPayload) => {
    const response = await gigsApi.create(data);
    return response.data.gig;
  }
);

export const updateGig = createAsyncThunk(
  "gigs/update",
  async ({ id, data }: { id: string; data: UpdateGigPayload }) => {
    const response = await gigsApi.update(id, data);
    return response.data.gig;
  }
);

export const deleteGig = createAsyncThunk("gigs/delete", async (id: string) => {
  await gigsApi.delete(id);
  return id;
});

export const getMyGigs = createAsyncThunk("gigs/my-gigs", async () => {
  const response = await gigsApi.getMyGigs();
  return response.data.gigs;
});

const initialState: GigsState = {
  items: [],
  currentGig: null,
  myGigs: [],
  filters: { search: "", status: "all" },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
    totalGigs: 0,
  },
  loading: false,
  error: null,
};

const gigsSlice = createSlice({
  name: "gigs",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    clearGigsError: (state) => {
      state.error = null;
    },
    // Real-time update from socket: increment bid count
    incrementBidCountFromSocket: (state, action) => {
      const { gigId } = action.payload;
      
      // Update in myGigs array
      const myGigIndex = state.myGigs.findIndex((gig) => gig._id === gigId);
      if (myGigIndex !== -1) {
        const currentCount = state.myGigs[myGigIndex].bidCount || 0;
        state.myGigs[myGigIndex].bidCount = currentCount + 1;
      }

      // Update in items array (browse gigs)
      const itemIndex = state.items.findIndex((gig) => gig._id === gigId);
      if (itemIndex !== -1) {
        const currentCount = state.items[itemIndex].bidCount || 0;
        state.items[itemIndex].bidCount = currentCount + 1;
      }

      // Update currentGig if it matches
      if (state.currentGig && state.currentGig._id === gigId) {
        const currentCount = state.currentGig.bidCount || 0;
        state.currentGig.bidCount = currentCount + 1;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch All Gigs
    builder
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.items = action.payload.gigs;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch gigs";
      });

    // Fetch Gig by ID
    builder
      .addCase(fetchGigsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGigsById.fulfilled, (state, action) => {
        state.currentGig = action.payload;
        state.loading = false;
      })
      .addCase(fetchGigsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch gig";
      });

    // Create Gig
    builder
      .addCase(createGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.loading = false;
        state.myGigs.unshift(action.payload);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create gig";
      });

    // Update Gig
    builder
      .addCase(updateGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGig.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.myGigs.findIndex(
          (gig) => gig._id === action.payload._id
        );
        if (index !== -1) {
          state.myGigs[index] = action.payload;
        }
        if (state.currentGig?._id === action.payload._id) {
          state.currentGig = action.payload;
        }
      })
      .addCase(updateGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update gig";
      });

    // Delete Gig
    builder
      .addCase(deleteGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGig.fulfilled, (state, action) => {
        state.loading = false;
        state.myGigs = state.myGigs.filter((gig) => gig._id !== action.payload);
      })
      .addCase(deleteGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete gig";
      });

    // Get My Gigs
    builder
      .addCase(getMyGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.myGigs = action.payload;
      })
      .addCase(getMyGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch your gigs";
      });
  },
});

export const { setSearch, clearGigsError, incrementBidCountFromSocket } = gigsSlice.actions;
export default gigsSlice.reducer;