// frontend/app/(dashboard)/gigs/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchGigsById } from "@/store/slices/gigs.slice";
import { createBid } from "@/store/slices/bids.slice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function GigDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentGig, loading } = useAppSelector((state) => state.gigs);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [bidMessage, setBidMessage] = useState("");
  const [bidPrice, setBidPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchGigsById(params.id as string));
    }
  }, [params.id, dispatch]);

  const handleSubmitBid = async () => {
    if (!bidMessage.trim() || !bidPrice) {
      toast.error("Please fill in all fields");
      return;
    }

    if (bidMessage.trim().length < 10) {
      toast.error("Message must be at least 10 characters");
      return;
    }

    const price = parseFloat(bidPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(
        createBid({
          gigId: params.id as string,
          message: bidMessage.trim(),
          proposedPrice: price,
        })
      ).unwrap();
      toast.success("Bid submitted successfully!");
      setBidDialogOpen(false);
      setBidMessage("");
      setBidPrice("");
      // Refresh gig data to update bid count and userHasBid
      dispatch(fetchGigsById(params.id as string));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit bid";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading gig details...</p>
        </div>
      </div>
    );
  }

  if (!currentGig) {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Gig not found</h3>
        <p className="mt-2 text-muted-foreground">
          This gig may have been deleted or doesn&apos;t exist
        </p>
        <Link href="/gigs">
          <Button className="mt-6">Browse All Gigs</Button>
        </Link>
      </div>
    );
  }

  const owner =
    typeof currentGig.ownerId === "string" ? null : currentGig.ownerId;
    console.log(currentGig);
    console.log(owner);
  const isOwner = user && owner && user._id === owner._id;
  const canBid =
    isAuthenticated &&
    !isOwner &&
    currentGig.status === "open" &&
    !currentGig.userHasBid;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Gigs
      </Button>

      {/* Main Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant={
                    currentGig.status === "open" ? "default" : "secondary"
                  }
                >
                  {currentGig.status === "open" ? "Open" : "Assigned"}
                </Badge>
                {currentGig.userHasBid && (
                  <Badge variant="outline">You&apos;ve submitted a bid</Badge>
                )}
              </div>
              <CardTitle className="text-3xl mb-2">
                {currentGig.title}
              </CardTitle>
              <CardDescription className="text-base">
                Posted {new Date(currentGig.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Budget</div>
              <div className="text-3xl font-bold text-primary">
                ₹{Number(currentGig.budget).toLocaleString()}
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Description
            </h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {currentGig.description}
            </p>
          </div>

          <Separator className="my-6" />

          {/* Project Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Project Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Budget</div>
                    <div className="font-semibold">
                      ₹{Number(currentGig.budget).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Bids</div>
                    <div className="font-semibold">
                      {currentGig.bidCount || 0}{" "}
                      {currentGig.bidCount === 1 ? "bid" : "bids"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Posted</div>
                    <div className="font-semibold">
                      {new Date(currentGig.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info */}
            {owner && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Posted By</h3>
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={owner.avatar} alt={owner.name} />
                    <AvatarFallback>
                      {owner.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{owner.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {owner.email}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Actions */}
          <div className="space-y-3">
            {!isAuthenticated && (
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-3">
                  You need to be logged in to submit a bid
                </p>
                <Link href="/auth?view=login">
                  <Button className="w-full">Login to Bid</Button>
                </Link>
              </div>
            )}

            {isOwner && (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium mb-2">This is your gig</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    You can view and manage bids from freelancers
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/bids/${currentGig._id}`} className="flex-1">
                      <Button className="w-full">
                        View Bids ({currentGig.bidCount || 0})
                      </Button>
                    </Link>
                    <Link href={`/gigs/my-gigs`}>
                      <Button variant="outline">Manage Gigs</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {canBid && (
              <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <Send className="mr-2 h-5 w-5" />
                    Submit Bid
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Submit Your Bid</DialogTitle>
                    <DialogDescription>
                      Provide your proposal and proposed price for this project
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="bidPrice">
                        Proposed Price (₹){" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="bidPrice"
                        type="number"
                        placeholder="Enter your price"
                        value={bidPrice}
                        onChange={(e) => setBidPrice(e.target.value)}
                        min="1"
                        step="1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Client&apos;s budget: ₹
                        {Number(currentGig.budget).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="bidMessage">
                        Cover Letter <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="bidMessage"
                        placeholder="Explain why you're the best fit for this project..."
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        rows={6}
                        minLength={10}
                        maxLength={1000}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {bidMessage.length}/1000 characters (min 10)
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setBidDialogOpen(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitBid} disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Bid"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {isAuthenticated &&
              !isOwner &&
              currentGig.status === "open" &&
              currentGig.userHasBid && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                    ✓ You&apos;ve already submitted a bid
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                    The client will review your proposal
                  </p>
                  <Link href="/bids/my-bids">
                    <Button variant="outline" className="w-full">
                      View My Bids
                    </Button>
                  </Link>
                </div>
              )}

            {currentGig.status === "assigned" && !isOwner && (
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">
                  This gig has been assigned to a freelancer and is no longer
                  accepting bids
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
