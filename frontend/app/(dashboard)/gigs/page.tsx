'use client';
import { useEffect, useState } from 'react';
import GigCard from '@/components/gigs/GigCard';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchGigs, setSearch } from '@/store/slices/gigs.slice';

export default function GigsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, filters } = useAppSelector((state) => state.gigs);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    dispatch(fetchGigs({ search: filters.search }));
  }, [filters.search]);

  const handleSearch = () => {
    dispatch(setSearch(searchInput));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search gigs..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  );
}