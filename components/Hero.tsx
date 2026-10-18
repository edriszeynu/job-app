"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowRight, Briefcase, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Hero() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("keyword", search);
    if (location.trim()) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  };

  const popularSearches = ["Designer", "Developer", "Marketing", "Finance", "Healthcare", "Engineering"];

  return (
    <section className="bg-background overflow-hidden border-b border-border">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-1.5 text-sm font-medium">
              🔥 10,000+ new jobs this week
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-gray-900">
              Find the <span className="text-blue-600">perfect job</span> for you
            </h1>
            <p className="text-lg text-gray-500 max-w-xl">
              Search your career opportunity through 10,000+ jobs and take the next step in your career.
            </p>
            <form onSubmit={handleSearch} className="max-w-lg">
              <div className="flex flex-col sm:flex-row gap-0 bg-background dark:bg-slate-800/60 rounded-2xl shadow-md border border-border overflow-hidden">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Job title or keyword" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-12 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 placeholder:text-gray-400" />
                </div>
                <div className="relative sm:border-l border-gray-100">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10 h-12 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 placeholder:text-gray-400" />
                </div>
                <div className="p-1.5">
                  <Button type="submit" className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 w-full sm:w-auto">
                    Search <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-400 font-medium">Popular:</span>
              {popularSearches.map((tag) => (
                <button key={tag} onClick={() => router.push(`/jobs?keyword=${tag}`)} className="text-xs px-3 py-1.5 rounded-full bg-background dark:bg-slate-800 border border-border text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors font-medium shadow-sm">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <Image src="/hero.png" alt="Job seekers celebrating new career opportunities" width={900} height={600} className="w-full h-auto drop-shadow-xl" priority />
            <div className="absolute top-8 -left-6 bg-card rounded-2xl shadow-lg p-4 border border-border flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-2.5"><Briefcase className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-xl font-bold text-foreground leading-none">10k+</p><p className="text-xs text-gray-400 mt-0.5">Active Jobs</p></div>
            </div>
            <div className="absolute bottom-8 -right-6 bg-card rounded-2xl shadow-lg p-4 border border-border flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2.5"><Users className="h-5 w-5 text-emerald-600" /></div>
              <div><p className="text-xl font-bold text-foreground leading-none">50k+</p><p className="text-xs text-gray-400 mt-0.5">Hired</p></div>
            </div>
          </div>
        </div>
        <div className="mt-10 lg:hidden">
          <Image src="/hero.png" alt="Job seekers" width={900} height={600} className="w-full h-auto" priority />
        </div>
      </div>
    </section>
  );
}
