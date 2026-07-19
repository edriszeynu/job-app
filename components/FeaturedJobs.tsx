import { Job, Company } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";

type JobWithCompany = Job & { company: Company };

export default function FeaturedJobs({ jobs }: { jobs: JobWithCompany[] }) {
  if (!jobs.length) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">No jobs available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Jobs</h2>
            <p className="text-muted-foreground mt-1">Handpicked opportunities for you</p>
          </div>
          <Link href="/jobs">
            <Button variant="ghost" className="group">
              View All
              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-background/60 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold text-primary">
                  {job.company?.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{job.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{job.company?.name}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {job.jobType}
                  </Badge>
                  <Badge variant="outline">{job.experienceLevel}</Badge>
                  {job.isFeatured && <Badge className="bg-amber-500/15 text-amber-600 border-amber-200">✨ Featured</Badge>}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{job.location || "Remote"}</span>
                  {job.isRemote && <span className="ml-1">🌐 Remote</span>}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>

                {job.salaryMin && job.salaryMax && (
                  <div className="text-sm font-medium text-primary">
                    ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Link href={`/jobs/${job.id}`} className="w-full">
                  <Button variant="outline" className="w-full group border-border/50 hover:border-primary/50">
                    View Details
                    <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}