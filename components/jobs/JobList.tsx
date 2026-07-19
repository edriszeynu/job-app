// components/jobs/JobList.tsx
import JobCard from "./JobCard";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobListProps {
  jobs: any[];
  isLoading: boolean;
  error: Error | null;
  onReset: () => void;
}

export default function JobList({ jobs, isLoading, error, onReset }: JobListProps) {
  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading jobs. Please try again.</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-xl font-semibold">No jobs found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
        <Button variant="outline" className="mt-4" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}