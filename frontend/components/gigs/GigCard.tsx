import { Gig } from "@/types/gig.types";
import Link from "next/link";

export default function GigCard({ gig }: { gig: Gig }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <h3 className="font-bold text-lg">{gig.title}</h3>
      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
        {gig.description}
      </p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-green-600 font-semibold">₹{gig.budget}</span>
        <Link
          href={`/gigs/${gig._id}`}
          className="text-blue-600 hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
