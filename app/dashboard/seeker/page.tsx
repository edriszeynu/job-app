import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, FileText, Bookmark, CheckCircle, ArrowRight } from "lucide-react";

export default async function SeekerDashboard() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [totalApplications, savedJobsCount, recentApplications, profile] = await Promise.all([
    prisma.application.count({ where: { userId } }),
    prisma.savedJob.count({ where: { userId } }),
    prisma.application.findMany({
      where: { userId },
      include: {
        job: { include: { company: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.userProfile.findUnique({
      where: { userId },
    }),
  ]);

  const interviewCount = await prisma.application.count({
    where: {
      userId,
      status: { in: ["INTERVIEW", "OFFERED"] },
    },
  });

  const stats = [
    { label: "Total Applications", value: totalApplications, icon: FileText, color: "blue" },
    { label: "Saved Jobs", value: savedJobsCount, icon: Bookmark, color: "purple" },
    { label: "Interviews", value: interviewCount, icon: CheckCircle, color: "green" },
    { label: "Application Rate", value: `${Math.min(totalApplications * 5, 100)}%`, icon: Briefcase, color: "orange" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {session?.user?.name}!</h2>
        <p className="text-muted-foreground">
          {profile?.bio || "Here's what's happening with your applications."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>You haven't applied to any jobs yet.</p>
                <Link href="/jobs">
                  <Button className="mt-4">Browse Jobs</Button>
                </Link>
              </div>
            ) : (
              recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between border-b last:border-0 pb-3">
                  <div>
                    <Link href={`/jobs/${app.jobId}`} className="font-medium hover:underline">
                      {app.job?.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">{app.job?.company?.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        app.status === "PENDING" ? "outline" :
                        app.status === "REJECTED" ? "destructive" :
                        "default"
                      }
                    >
                      {app.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/jobs" className="w-full">
              <Button className="w-full justify-between">
                Find Jobs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/seeker/profile" className="w-full">
              <Button variant="outline" className="w-full justify-between">
                Update Profile
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/seeker/applications" className="w-full">
              <Button variant="outline" className="w-full justify-between">
                View All Applications
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}