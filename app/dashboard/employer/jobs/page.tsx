import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus, MapPin, Users, Eye, Pencil, ToggleLeft } from "lucide-react";
import { toggleJobActive } from "@/actions/employer";

const statusBadge = (job: any) => {
  if (!job.isActive) return <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>;
  if (!job.isApproved) return <Badge variant="outline" className="text-yellow-600 border-yellow-300">Pending Approval</Badge>;
  return <Badge className="bg-green-500/10 text-green-600 border-green-200">Active</Badge>;
};

export default async function EmployerJobsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const company = await prisma.company.findFirst({ where: { ownerId: userId } });

  if (!company) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">My Jobs</h2>
        <Card className="border-dashed border-2">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Create a company profile first</p>
            <Link href="/dashboard/employer/profile">
              <Button className="mt-4">Create Company Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const jobs = await prisma.job.findMany({
    where: { companyId: company.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Jobs</h2>
          <p className="text-muted-foreground">{jobs.length} job{jobs.length !== 1 ? "s" : ""} posted</p>
        </div>
        <Link href="/dashboard/employer/post-job">
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
            <Plus className="h-4 w-4" />
            Post a Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="text-center py-16">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold">No jobs yet</h3>
            <p className="text-muted-foreground mt-2">Post your first job to start receiving applications</p>
            <Link href="/dashboard/employer/post-job">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Post a Job
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:border-primary/20 transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link href={`/jobs/${job.id}`}>
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                      </Link>
                      {statusBadge(job)}
                      <Badge variant="outline">{job.jobType}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location || "Remote"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {job._count.applications} applicant{job._count.applications !== 1 ? "s" : ""}
                      </span>
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <form action={toggleJobActive.bind(null, job.id, !job.isActive)}>
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className={job.isActive ? "text-yellow-600 border-yellow-300 hover:bg-yellow-50" : "text-green-600 border-green-300 hover:bg-green-50"}
                      >
                        <ToggleLeft className="h-4 w-4 mr-1" />
                        {job.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
