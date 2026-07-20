import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Clock, DollarSign, Heart, Building2, Trash2 } from "lucide-react";
import { unsaveJob } from "@/actions/seeker";

export default async function SavedJobsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const savedJobs = await prisma.savedJob.findMany({
    where: { userId },
    include: { job: { include: { company: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Saved Jobs</h2>
        <p className="text-muted-foreground">Jobs you've bookmarked for later</p>
      </div>

      {savedJobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">You haven't saved any jobs yet</p>
            <Link href="/jobs">
              <Button className="mt-4">Browse Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {savedJobs.map(({ id: savedJobId, job }) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/jobs/${job.id}`}>
                      <CardTitle className="hover:underline">{job.title}</CardTitle>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Building2 className="h-4 w-4" />
                      <span>{job.company?.name}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{job.jobType}</Badge>
                  <Badge variant="outline">{job.experienceLevel}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location || "Remote"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  {job.salaryMin && job.salaryMax && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Link href={`/jobs/${job.id}/apply`} className="flex-1">
                    <Button className="w-full">Apply Now</Button>
                  </Link>
                  <form action={unsaveJob.bind(null, savedJobId)}>
                    <Button variant="destructive" size="icon" type="submit" title="Remove">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
