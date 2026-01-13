"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getMyGigs, deleteGig } from "@/store/slices/gigs.slice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase, Eye, MessageSquare, MoreVertical, Plus, Trash2} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { Gig } from "@/types/gig.types";

export default function MyGigsPage() {
  const dispatch = useAppDispatch();
  const { myGigs, loading } = useAppSelector((state) => state.gigs);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gigToDelete, setGigToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(getMyGigs());
  }, [dispatch]);

  const handleDeleteClick = (gigId: string) => {
    setGigToDelete(gigId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!gigToDelete) return;

    setDeleting(true);
    try {
      await dispatch(deleteGig(gigToDelete)).unwrap();
      toast.success("Gig deleted successfully!");
      setDeleteDialogOpen(false);
      setGigToDelete(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete gig";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const openGigs = myGigs.filter((g) => g.status === "open");
  const assignedGigs = myGigs.filter((g) => g.status === "assigned");

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your gigs...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Gigs</h1>
            <p className="text-muted-foreground">
              Manage projects you&apos;ve posted and review bids
            </p>
          </div>
          <Link href="/gigs/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Post New Gig
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Gigs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myGigs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Open Gigs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{openGigs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Assigned Gigs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{assignedGigs.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Gigs List */}
        {myGigs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No gigs yet</h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              You haven&apos;t posted any gigs. Create your first project to get started!
            </p>
            <Link href="/gigs/create">
              <Button className="mt-6">
                <Plus className="mr-2 h-4 w-4" />
                Post Your First Gig
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myGigs.map((gig) => (
              <GigCard
                key={gig._id}
                gig={gig}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Gig</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this gig? This action cannot be undone and will also delete all associated bids.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  );
}

function GigCard({ gig, onDeleteClick }: { gig: Gig; onDeleteClick: (id: string) => void }) {
  const router = useRouter();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={gig.status === "open" ? "default" : "secondary"}>
                {gig.status === "open" ? "Open" : "Assigned"}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {gig.bidCount || 0} {gig.bidCount === 1 ? "bid" : "bids"}
              </Badge>
            </div>
            <CardTitle className="text-xl mb-2">{gig.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {gig.description}
            </CardDescription>
          </div>
          <div className="flex items-start gap-2">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Budget</div>
              <div className="text-xl font-bold text-primary">
                ₹{Number(gig.budget).toLocaleString()}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/gigs/${gig._id}`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/bids/${gig._id}`)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Bids ({gig.bidCount || 0})
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDeleteClick(gig._id)}
                  className="text-destructive"
                  disabled={gig.status === "assigned"}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Posted {new Date(gig.createdAt).toLocaleDateString()}</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/bids/${gig._id}`)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              View Bids
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push(`/gigs/${gig._id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}