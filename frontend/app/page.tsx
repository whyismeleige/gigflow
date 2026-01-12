// frontend/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/gigs");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">GigFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth?view=login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/auth?view=signup">
                <Button>Get Started</Button>
              </Link>
              <ModeToggle/>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            The Freelance Marketplace{" "}
            <span className="text-primary">Built for You</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with talented freelancers or find your next project. 
            GigFlow makes hiring and getting hired simple, fast, and secure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?view=signup">
              <Button size="lg" className="text-lg px-8">
                Post a Gig
              </Button>
            </Link>
            <Link href="/auth?view=login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Find Work
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose GigFlow?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in the freelance economy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Job Posting</h3>
            <p className="text-muted-foreground">
              Post your project in minutes and start receiving quality bids from freelancers
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Talented Freelancers</h3>
            <p className="text-muted-foreground">
              Access a global pool of skilled professionals ready to bring your ideas to life
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-muted-foreground">
              Get instant notifications when you receive bids or get hired for projects
            </p>
          </div>

          {/* Feature 4 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
            <p className="text-muted-foreground">
              Built with security in mind to protect both clients and freelancers
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of clients and freelancers already using GigFlow
            </p>
            <Link href="/auth?view=signup">
              <Button size="lg" className="text-lg px-8">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">GigFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 GigFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}