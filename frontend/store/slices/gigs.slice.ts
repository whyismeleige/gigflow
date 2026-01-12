import { gigsApi } from "@/lib/api/gigs.api";
import { CreateGigPayload, UpdateGigPayload } from "@/types/gig.types";
import { GigsState } from "@/types/redux.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchGigs = createAsyncThunk(
  "gigs/fetchAll",
  async ({ search = "", page = 1 }: { search?: string; page?: number }) => {
    const response = await gigsApi.getAll({ search, page });
    console.log(response);
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
    return response.data;
  }
);

export const deleteGig = createAsyncThunk("gigs/delete", async (id: string) => {
  const response = await gigsApi.delete(id);
  return response;
});

export const getMyGigs = createAsyncThunk("gigs/my-gigs", async () => {
  const response = await gigsApi.getMyGigs();
  return response;
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
    totalGigs: 1,
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
  },
  extraReducers: (builder) => {
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
        state.error = action.payload as string;
      });
  },
});

export const { setSearch } = gigsSlice.actions;
export default gigsSlice.reducer;
