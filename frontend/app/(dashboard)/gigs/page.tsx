"use client";
import { useEffect, useState, useMemo } from "react";
import GigCard from "@/components/gigs/GigCard";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchGigs, setSearch } from "@/store/slices/gigs.slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Briefcase, Filter, X, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import PublicRoute from "@/components/routes/PublicRoute";

type SortOption = "newest" | "oldest" | "budget-high" | "budget-low" | "most-bids";
type StatusOption = "all" | "open" | "assigned";

export default function GigsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, filters } = useAppSelector((state) => state.gigs);
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [statusFilter, setStatusFilter] = useState<StatusOption>("all");

  useEffect(() => {
    dispatch(fetchGigs({ search: filters.search }));
  }, [filters.search, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearch(searchInput));
  };

  const handleClearSearch = () => {
    setSearchInput("");
    dispatch(setSearch(""));
  };

  const handleClearFilters = () => {
    setMinBudget("");
    setMaxBudget("");
    setSortBy("newest");
    setStatusFilter("all");
  };

  const hasActiveFilters = minBudget !== "" || maxBudget !== "" || sortBy !== "newest" || statusFilter !== "all";

  // Apply filters and sorting to the items
  const filteredAndSortedGigs = useMemo(() => {
    let filtered = [...items];

    // Budget range filter
    if (minBudget) {
      const min = parseFloat(minBudget);
      filtered = filtered.filter((gig) => parseFloat(gig.budget) >= min);
    }
    if (maxBudget) {
      const max = parseFloat(maxBudget);
      filtered = filtered.filter((gig) => parseFloat(gig.budget) <= max);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((gig) => gig.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "budget-high":
          return parseFloat(b.budget) - parseFloat(a.budget);
        case "budget-low":
          return parseFloat(a.budget) - parseFloat(b.budget);
        case "most-bids":
          return (b.bidCount || 0) - (a.bidCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, minBudget, maxBudget, sortBy, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading gigs...</p>
        </div>
      </div>
    );
  }

  return (
    <PublicRoute>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Browse Gigs</h1>
          <p className="text-muted-foreground">
            Find exciting freelance opportunities and submit your bids
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search gigs by title or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            {filters.search && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearSearch}
              >
                Clear
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {[minBudget, maxBudget, sortBy !== "newest", statusFilter !== "all"].filter(Boolean).length}
                </span>
              )}
            </Button>
          </div>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filter & Sort
                  </CardTitle>
                  <CardDescription>
                    Refine your search to find the perfect gig
                  </CardDescription>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Budget Range */}
                <div className="space-y-2">
                  <Label>Budget Range (₹)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                      min="0"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as StatusOption)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                      <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                      <SelectItem value="most-bids">Most Bids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Budget Filters */}
                <div className="space-y-2">
                  <Label>Quick Budget</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMinBudget("");
                        setMaxBudget("10000");
                      }}
                    >
                      Under ₹10K
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMinBudget("10000");
                        setMaxBudget("50000");
                      }}
                    >
                      ₹10K-₹50K
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMinBudget("50000");
                        setMaxBudget("");
                      }}
                    >
                      Above ₹50K
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            {filters.search && (
              <>
                {filteredAndSortedGigs.length}{" "}
                {filteredAndSortedGigs.length === 1 ? "result" : "results"} for &quot;
                {filters.search}&quot;
              </>
            )}
            {!filters.search && (
              <>
                Showing {filteredAndSortedGigs.length} of {items.length} gigs
              </>
            )}
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {[
                  minBudget && "Min Budget",
                  maxBudget && "Max Budget",
                  statusFilter !== "all" && "Status",
                  sortBy !== "newest" && "Sorted",
                ]
                  .filter(Boolean)
                  .join(", ")}{" "}
                applied
              </span>
            </div>
          )}
        </div>

        {/* Gigs Grid */}
        {filteredAndSortedGigs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              {filters.search || hasActiveFilters ? "No gigs found" : "No gigs available"}
            </h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              {filters.search || hasActiveFilters
                ? "Try adjusting your search criteria or filters"
                : "Be the first to post a gig!"}
            </p>
            {(filters.search || hasActiveFilters) && (
              <Button
                className="mt-6"
                variant="outline"
                onClick={() => {
                  handleClearSearch();
                  handleClearFilters();
                }}
              >
                Clear All Filters
              </Button>
            )}
            {!filters.search && !hasActiveFilters && (
              <Link href="/gigs/create">
                <Button className="mt-6">Post a Gig</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedGigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </PublicRoute>
  );
}