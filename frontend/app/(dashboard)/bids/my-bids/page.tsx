"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getMyBids, deleteBid, updateBid } from "@/store/slices/bids.slice";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Eye,
  MoreVertical,
  Trash2,
  Edit,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { Bid } from "@/types/bid.types";

export default function MyBidsPage() {
  const dispatch = useAppDispatch();
  const { myBids, loading } = useAppSelector((state) => state.bids);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bidToDelete, setBidToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bidToEdit, setBidToEdit] = useState<Bid | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(getMyBids());
  }, [dispatch]);

  const handleDeleteClick = (bidId: string) => {
    setBidToDelete(bidId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bidToDelete) return;

    setDeleting(true);
    try {
      await dispatch(deleteBid(bidToDelete)).unwrap();
      toast.success("Bid withdrawn successfully!");
      setDeleteDialogOpen(false);
      setBidToDelete(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to withdraw bid";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = (bid: Bid) => {
    setBidToEdit(bid);
    setEditMessage(bid.message);
    setEditPrice(bid.proposedPrice);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!bidToEdit) return;

    if (!editMessage.trim() || editMessage.trim().length < 10) {
      toast.error("Message must be at least 10 characters");
      return;
    }

    const price = parseFloat(editPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setUpdating(true);
    try {
      await dispatch(
        updateBid({
          id: bidToEdit._id,
          data: {
            message: editMessage.trim(),
            proposedPrice: price,
          },
        })
      ).unwrap();
      toast.success("Bid updated successfully!");
      setEditDialogOpen(false);
      setBidToEdit(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update bid";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const pendingBids = myBids.filter((b) => b.status === "pending");
  const hiredBids = myBids.filter((b) => b.status === "hired");
  const rejectedBids = myBids.filter((b) => b.status === "rejected");

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your bids...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Bids</h1>
          <p className="text-muted-foreground">
            Track all your bid submissions and their status
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Bids
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myBids.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingBids.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hired
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {hiredBids.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {rejectedBids.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bids List */}
        {myBids.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No bids yet</h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              You haven&apos;t submitted any bids. Browse available gigs to get
              started!
            </p>
            <Link href="/gigs">
              <Button className="mt-6">Browse Gigs</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myBids.map((bid) => (
              <BidCard
                key={bid._id}
                bid={bid}
                onDeleteClick={handleDeleteClick}
                onEditClick={handleEditClick}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Withdraw Bid</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to withdraw this bid? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Withdrawing..." : "Withdraw"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Your Bid</DialogTitle>
              <DialogDescription>
                Update your proposal and proposed price
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="editPrice">
                  Proposed Price (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="editPrice"
                  type="number"
                  placeholder="Enter your price"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  min="1"
                  step="1"
                />
              </div>
              <div>
                <Label htmlFor="editMessage">
                  Cover Letter <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="editMessage"
                  placeholder="Explain why you're the best fit for this project..."
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  rows={6}
                  minLength={10}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {editMessage.length}/1000 characters (min 10)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button onClick={handleEditSubmit} disabled={updating}>
                {updating ? "Updating..." : "Update Bid"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}

function BidCard({
  bid,
  onDeleteClick,
  onEditClick,
}: {
  bid: Bid;
  onDeleteClick: (id: string) => void;
  onEditClick: (bid: Bid) => void;
}) {
  const router = useRouter();

  const gig = typeof bid.gigId === "string" ? null : bid.gigId;
  const owner = gig && typeof gig.ownerId === "string" ? null : gig?.ownerId;
  if (!gig) return null;

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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getBadgeVariant(bid.status)}>
                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
              </Badge>
              <Badge variant="outline">
                {gig.status === "open" ? "Open" : "Assigned"}
              </Badge>
            </div>
            <CardTitle className="text-xl mb-2">{gig.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {gig.description}
            </CardDescription>
          </div>
          <div className="flex items-start gap-2">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Your Bid</div>
              <div className="text-xl font-bold text-primary">
                ₹{Number(bid.proposedPrice).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Budget: ₹{Number(gig.budget).toLocaleString()}
              </div>
            </div>
            {bid.status === "pending" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(`/gigs/${gig._id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Gig
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditClick(bid)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Bid
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDeleteClick(bid._id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Withdraw
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cover Letter Preview */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Your Proposal</h4>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {bid.message}
          </p>
        </div>

        {/* Client Info */}
        {owner && typeof owner !== "string" && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Avatar className="h-10 w-10">
              <AvatarImage src={owner.avatar} alt={owner.name} />
              <AvatarFallback>
                {owner.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">Client: {owner.name}</div>
              <div className="text-xs text-muted-foreground">{owner.email}</div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {bid.status === "hired" && (
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Congratulations! You were hired for this project
              </p>
            </div>
          </div>
        )}

        {bid.status === "rejected" && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              This bid was not accepted. Keep applying to other gigs!
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
          <div>Submitted {new Date(bid.createdAt).toLocaleDateString()}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/gigs/${gig._id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Gig Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
