"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useJobs } from "@/hooks/useJobs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobFilters from "@/components/jobs/JobFilters";
import JobList from "@/components/jobs/JobList";
import Pagination from "@/components/jobs/Pagination";

function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    jobType: searchParams.get("jobType") || "",
    experienceLevel: searchParams.get("experienceLevel") || "",
    isRemote: searchParams.get("isRemote") === "true" ? true : undefined,
    page: parseInt(searchParams.get("page") || "1"),
  });

  // Sync URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.location) params.set("location", filters.location);
    if (filters.jobType) params.set("jobType", filters.jobType);
    if (filters.experienceLevel) params.set("experienceLevel", filters.experienceLevel);
    if (filters.isRemote !== undefined) params.set("isRemote", String(filters.isRemote));
    if (filters.page > 1) params.set("page", String(filters.page));
    router.push(`/jobs?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  // Fetch data
  const { data, isLoading, error } = useJobs(filters);

  // Handlers
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      jobType: "",
      experienceLevel: "",
      isRemote: undefined,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const totalJobs = data?.meta?.total || 0;
  const jobs = data?.data || [];
  const totalPages = data?.meta?.totalPages || 0;

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold">All Jobs</h1>
          <p className="text-muted-foreground">
            {totalJobs > 0 ? `${totalJobs} job${totalJobs > 1 ? "s" : ""} found` : "No jobs found"}
          </p>
        </div>

        <JobFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          onSearch={handleSearch}
        />

        <JobList jobs={jobs} isLoading={isLoading} error={error} onReset={resetFilters} />

        <Pagination
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
      <Footer />
    </>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={null}>
      <JobsContent />
    </Suspense>
  );
}