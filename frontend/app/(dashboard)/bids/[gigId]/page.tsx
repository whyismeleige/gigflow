// frontend/app/(dashboard)/bids/[gigId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getBidsByGig, hireFreelancer } from "@/store/slices/bids.slice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MessageSquare, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function GigBidsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { gigBids, loading } = useAppSelector((state) => state.bids);
  const [hireDialogOpen, setHireDialogOpen] = useState(false);
  const [bidToHire, setBidToHire] = useState<string | null>(null);
  const [hiring, setHiring] = useState(false);

  useEffect(() => {
    if (params.gigId) {
      dispatch(getBidsByGig(params.gigId as string));
    }
  }, [params.gigId, dispatch]);

  const handleHireClick = (bidId: string) => {
    setBidToHire(bidId);
    setHireDialogOpen(true);
  };

  const handleHireConfirm = async () => {
    if (!bidToHire) return;

    setHiring(true);
    try {
      await dispatch(hireFreelancer(bidToHire)).unwrap();
      toast.success("Freelancer hired successfully!");
      setHireDialogOpen(false);
      setBidToHire(null);
      // Refresh the bids
      if (params.gigId) {
        dispatch(getBidsByGig(params.gigId as string));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to hire freelancer");
    } finally {
      setHiring(false);
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "hired":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading bids...</p>
        </div>
      </div>
    );
  }

  if (gigBids.length === 0) {
    return (
      <div>
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No bids yet</h3>
          <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
            Your gig hasn't received any bids yet. Share it to get more visibility!
          </p>
        </div>
      </div>
    );
  }

  // Get gig info from first bid
  const gigInfo = gigBids[0]?.gigId;
  const isGigAssigned = typeof gigInfo === 'object' && gigInfo?.status === 'assigned';

  return (
    <div>
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bids for Your Gig</h1>
        {typeof gigInfo === 'object' && (
          <p className="text-muted-foreground mt-1">{gigInfo.title}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gigBids.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gigBids.filter((b) => b.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={isGigAssigned ? "secondary" : "default"}>
              {isGigAssigned ? "Assigned" : "Open"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Bids List */}
      <div className="space-y-4">
        {gigBids.map((bid) => {
          const freelancer = typeof bid.freelancerId === 'string' ? null : bid.freelancerId;
          if (!freelancer) return null;

          return (
            <Card key={bid._id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                      <AvatarFallback>
                        {freelancer.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{freelancer.name}</CardTitle>
                        <Badge variant={getBadgeVariant(bid.status)}>
                          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>{freelancer.email}</CardDescription>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Submitted {new Date(bid.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Bid Amount */}
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Bid Amount</div>
                    <div className="text-2xl font-bold text-primary">
                      ₹{Number(bid.proposedPrice).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Cover Letter */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Cover Letter</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {bid.message}
                    </p>
                  </div>

                  {/* Hire Button */}
                  {bid.status === "pending" && !isGigAssigned && (
                    <Button
                      className="w-full"
                      onClick={() => handleHireClick(bid._id)}
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Hire {freelancer.name}
                    </Button>
                  )}

                  {/* Hired Message */}
                  {bid.status === "hired" && (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        ✓ You hired {freelancer.name} for this project
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hire Confirmation Dialog */}
      <AlertDialog open={hireDialogOpen} onOpenChange={setHireDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hire Freelancer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to hire this freelancer? This will automatically
              reject all other pending bids and mark the gig as assigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={hiring}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleHireConfirm}
              disabled={hiring}
            >
              {hiring ? "Hiring..." : "Confirm Hire"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}