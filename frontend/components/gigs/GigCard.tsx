import { Gig } from "@/types/gig.types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Eye } from "lucide-react";

export default function GigCard({ gig }: { gig: Gig }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant={gig.status === "open" ? "default" : "secondary"}>
            {gig.status === "open" ? "Open" : "Assigned"}
          </Badge>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Budget</div>
            <div className="text-lg font-bold text-primary">
              ₹{Number(gig.budget).toLocaleString()}
            </div>
          </div>
        </div>
        <CardTitle className="line-clamp-2">{gig.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {gig.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <div className="space-y-3">
          {/* Bid Count */}
          {gig.bidCount !== undefined && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MessageSquare className="mr-2 h-4 w-4" />
              {gig.bidCount} {gig.bidCount === 1 ? "bid" : "bids"}
            </div>
          )}

          {/* View Details Button */}
          <Link href={`/gigs/${gig._id}`} className="block">
            <Button className="w-full" variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}