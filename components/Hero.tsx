"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Hero() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/jobs?q=${encodeURIComponent(search)}`);
    else router.push("/jobs");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-20 md:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-transparent" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center rounded-full border border-border/50 px-3 py-1 text-sm mb-6 bg-background/50 backdrop-blur-sm">
          <span className="font-medium text-primary">🔥 10,000+</span>
          <span className="ml-1 text-muted-foreground">new jobs this week</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          Find Your <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Dream Job</span> Today
        </h1>

        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover thousands of opportunities from top companies worldwide. Apply now and take the next step in your career.
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Job title, company, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-12 bg-background/80 backdrop-blur-sm border-border/50"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-8 bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all">
            Search Jobs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Popular:</span>
          {["Frontend", "Backend", "DevOps", "Design", "Data Science"].map((tag) => (
            <span key={tag} className="cursor-pointer hover:text-primary transition-colors">#{tag}</span>
          ))}
        </div>
      </div>
    </section>
  );
}