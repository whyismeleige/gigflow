"use client";
import { useEffect, useState } from "react";
import GigCard from "@/components/gigs/GigCard";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchGigs, setSearch } from "@/store/slices/gigs.slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Briefcase } from "lucide-react";
import Link from "next/link";
import PublicRoute from "@/components/routes/PublicRoute";

export default function GigsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, filters } = useAppSelector((state) => state.gigs);
  const [searchInput, setSearchInput] = useState("");
  

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
          </div>
        </form>

        {/* Results Count */}
        {filters.search && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "result" : "results"} for "
              {filters.search}"
            </p>
          </div>
        )}

        {/* Gigs Grid */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              {filters.search ? "No gigs found" : "No gigs available"}
            </h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              {filters.search
                ? "Try adjusting your search criteria"
                : "Be the first to post a gig!"}
            </p>
            {!filters.search && (
              <Link href="/gigs/create">
                <Button className="mt-6">Post a Gig</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </PublicRoute>
  );
}
