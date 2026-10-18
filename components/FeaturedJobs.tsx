import { Job, Company } from "@prisma/client";
import Link from "next/link";
import JobCard from "@/components/jobs/JobCard";

type JobWithCompany = Job & { company: Company };

export default function FeaturedJobs({ jobs }: { jobs: JobWithCompany[] }) {
  if (!jobs.length) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">No jobs available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Featured Job Offers</h2>
            <p className="text-muted-foreground mt-1 text-sm">Handpicked opportunities for you</p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
