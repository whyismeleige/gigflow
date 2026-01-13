"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, User as UserIcon, Briefcase, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { getMyBids } from "@/store/slices/bids.slice";
import { getMyGigs } from "@/store/slices/gigs.slice";

export default function ProfilePage() {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { myGigs } = useAppSelector((state) => state.gigs);
  const { myBids } = useAppSelector((state) => state.bids);

  useEffect(() => {
    dispatch(getMyBids());
    dispatch(getMyGigs());
  }, [dispatch])

  if(!user) return null;

  const stats = {
    totalGigs: myGigs.length,
    openGigs: myGigs.filter((g) => g.status === "open").length,
    assignedGigs: myGigs.filter((g) => g.status === "assigned").length,
    totalBids: myBids.length,
    pendingBids: myBids.filter((b) => b.status === "pending").length,
    hiredBids: myBids.filter((b) => b.status === "hired").length,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {/* User Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{user.name}</CardTitle>
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    Member since{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {/* Gigs Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Your Gigs
            </CardTitle>
            <CardDescription>
              Gigs you&apos;ve posted as a client
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Posted</span>
              <span className="text-2xl font-bold">{stats.totalGigs}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Open</span>
              <Badge variant="default">{stats.openGigs}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Assigned</span>
              <Badge variant="secondary">{stats.assignedGigs}</Badge>
            </div>
            <Link href="/gigs/my-gigs" className="block mt-4">
              <Button variant="outline" className="w-full">
                View My Gigs
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Bids Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Bids
            </CardTitle>
            <CardDescription>
              Bids you&apos;ve submitted as a freelancer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Submitted</span>
              <span className="text-2xl font-bold">{stats.totalBids}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Pending</span>
              <Badge variant="secondary">{stats.pendingBids}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Hired</span>
              <Badge variant="default">{stats.hiredBids}</Badge>
            </div>
            <Link href="/bids/my-bids" className="block mt-4">
              <Button variant="outline" className="w-full">
                View My Bids
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>
            Your recent activity on GigFlow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Gigs Posted</div>
                  <div className="text-sm text-muted-foreground">
                    Total projects you&apos;ve created
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold">{stats.totalGigs}</div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Bids Submitted</div>
                  <div className="text-sm text-muted-foreground">
                    Total proposals you&apos;ve sent
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold">{stats.totalBids}</div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-green-800 dark:text-green-200">
                    Projects Won
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Successful hires as freelancer
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.hiredBids}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}