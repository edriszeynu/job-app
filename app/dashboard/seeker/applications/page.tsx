import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Calendar, DollarSign, Building2 } from "lucide-react";
import { withdrawApplication } from "@/actions/seeker";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  REVIEWING: "bg-blue-500/10 text-blue-600 border-blue-200",
  SHORTLISTED: "bg-purple-500/10 text-purple-600 border-purple-200",
  INTERVIEW: "bg-orange-500/10 text-orange-600 border-orange-200",
  OFFERED: "bg-green-500/10 text-green-600 border-green-200",
  HIRED: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  REJECTED: "bg-red-500/10 text-red-600 border-red-200",
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const where = {
    userId,
    ...(status && status !== "ALL" ? { status: status as any } : {}),
  };

  const applications = await prisma.application.findMany({
    where,
    include: { job: { include: { company: true } } },
    orderBy: { createdAt: "desc" },
  });

  const statuses = ["ALL", "PENDING", "REVIEWING", "SHORTLISTED", "INTERVIEW", "OFFERED", "HIRED", "REJECTED"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Applications</h2>
        <p className="text-muted-foreground">Track your job applications and their status</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Link key={s} href={`/dashboard/seeker/applications?status=${s}`}>
            <Button
              variant={status === s || (s === "ALL" && !status) ? "default" : "outline"}
              size="sm"
            >
              {s === "ALL" ? "All" : s}
            </Button>
          </Link>
        ))}
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No applications found</p>
            <Link href="/jobs">
              <Button className="mt-4">Browse Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <Link href={`/jobs/${app.jobId}`}>
                    <CardTitle className="hover:underline">{app.job?.title}</CardTitle>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Building2 className="h-4 w-4" />
                    <span>{app.job?.company?.name}</span>
                  </div>
                </div>
                <Badge className={statusColors[app.status]}>{app.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {app.job?.location || "Remote"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                  {app.job?.salaryMin && app.job?.salaryMax && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ${app.job.salaryMin.toLocaleString()} – ${app.job.salaryMax.toLocaleString()}
                    </div>
                  )}
                </div>
                {app.status === "PENDING" && (
                  <form action={withdrawApplication.bind(null, app.id)}>
                    <Button variant="destructive" size="sm" type="submit">
                      Withdraw Application
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
