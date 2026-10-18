import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Briefcase, Users, UserPlus, TrendingUp, Plus,
  ArrowRight, Building2, Eye, ChevronRight,
  CheckCircle, Clock, XCircle, Star, Zap,
  BarChart3, MapPin, Calendar,
} from "lucide-react";

export default async function EmployerDashboard() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const company = await prisma.company.findFirst({ where: { ownerId: userId } });
  if (!company) return null;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [totalJobs, activeJobs, totalApplicants, newApplicants, recentApplicants, statusCounts, recentJobs] =
    await Promise.all([
      prisma.job.count({ where: { companyId: company.id } }),
      prisma.job.count({ where: { companyId: company.id, isActive: true } }),
      prisma.application.count({ where: { job: { companyId: company.id } } }),
      prisma.application.count({ where: { job: { companyId: company.id }, createdAt: { gte: weekAgo } } }),
      prisma.application.findMany({
        where: { job: { companyId: company.id } },
        include: { user: true, job: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.application.groupBy({
        by: ["status"],
        where: { job: { companyId: company.id } },
        _count: true,
      }),
      prisma.job.findMany({
        where: { companyId: company.id },
        include: { _count: { select: { applications: true } } },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);

  const stats = [
    {
      label: "Total Jobs",
      value: totalJobs,
      sub: `${activeJobs} active`,
      icon: Briefcase,
      color: "text-blue-400",
      ring: "ring-blue-500/20",
      bg: "bg-blue-500/10",
      glow: "shadow-blue-500/10",
    },
    {
      label: "Total Applicants",
      value: totalApplicants,
      sub: "all time",
      icon: Users,
      color: "text-violet-400",
      ring: "ring-violet-500/20",
      bg: "bg-violet-500/10",
      glow: "shadow-violet-500/10",
    },
    {
      label: "New This Week",
      value: newApplicants,
      sub: "fresh applications",
      icon: TrendingUp,
      color: "text-emerald-400",
      ring: "ring-emerald-500/20",
      bg: "bg-emerald-500/10",
      glow: "shadow-emerald-500/10",
    },
    {
      label: "Active Jobs",
      value: activeJobs,
      sub: `${totalJobs - activeJobs} paused`,
      icon: Zap,
      color: "text-amber-400",
      ring: "ring-amber-500/20",
      bg: "bg-amber-500/10",
      glow: "shadow-amber-500/10",
    },
  ];

  const statusConfig: Record<string, { dot: string; label: string }> = {
    PENDING: { dot: "bg-yellow-400", label: "Pending" },
    REVIEWING: { dot: "bg-blue-400", label: "Reviewing" },
    SHORTLISTED: { dot: "bg-purple-400", label: "Shortlisted" },
    INTERVIEW: { dot: "bg-orange-400", label: "Interview" },
    OFFERED: { dot: "bg-emerald-400", label: "Offered" },
    HIRED: { dot: "bg-green-400", label: "Hired" },
    REJECTED: { dot: "bg-red-400", label: "Rejected" },
  };

  const totalStatusCount = statusCounts.reduce((s, c) => s + c._count, 0);

  return (
    <div className="space-y-6">

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-linear-to-r from-primary/20 via-primary/10 to-transparent p-6 md:p-8 shadow-xl">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/2 h-32 w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* company avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg ring-2 ring-primary/20 backdrop-blur">
              {company.logo
                ? <img src={company.logo} alt={company.name} className="h-full w-full rounded-2xl object-cover" />
                : <Building2 className="h-8 w-8 text-primary" />
              }
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{company.name}</h1>
                <Badge
                  className={company.isApproved
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"}
                >
                  {company.isApproved ? "✓ Verified" : "⏳ Pending"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {[company.industry, company.headquarters].filter(Boolean).join(" · ") || "Update your company profile"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/employer/profile">
              <Button variant="outline" size="sm" className="border-white/10 bg-white/5 hover:bg-white/10">
                Edit Profile
              </Button>
            </Link>
            <Link href="/dashboard/employer/post-job">
              <Button className="gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                <Plus className="h-4 w-4" />
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`group relative overflow-hidden rounded-xl border border-white/5 bg-card p-5 shadow-lg ${s.glow} hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200`}
          >
            {/* colored glow top-right */}
            <div className={`pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full ${s.bg} blur-xl`} />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-4xl font-bold tabular-nums">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
              </div>
              <div className={`rounded-xl ${s.bg} p-2.5 ring-1 ${s.ring}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid gap-4 xl:grid-cols-5">

        {/* Recent Applications — 3/5 */}
        <Card className="xl:col-span-3 border-white/5 bg-card shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-violet-500/10 p-2">
                  <Users className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">Recent Applications</CardTitle>
                  <CardDescription className="text-xs">Latest candidates across all jobs</CardDescription>
                </div>
              </div>
              <Link href="/dashboard/employer/applicants">
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
            {recentApplicants.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-3">
                  <UserPlus className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No applicants yet</p>
                <p className="text-xs text-muted-foreground mt-1">Applications will show up here</p>
                <Link href="/dashboard/employer/post-job" className="mt-4">
                  <Button size="sm" variant="outline" className="gap-1 border-white/10">
                    <Plus className="h-3.5 w-3.5" /> Post a Job
                  </Button>
                </Link>
              </div>
            ) : (
              recentApplicants.map((app) => {
                const cfg = statusConfig[app.status];
                return (
                  <div key={app.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-3 hover:bg-white/5 transition-colors">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {app.user?.name?.charAt(0)?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">{app.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{app.job?.title}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden items-center gap-1.5 sm:flex">
                        <div className={`h-1.5 w-1.5 rounded-full ${cfg?.dot || "bg-muted"}`} />
                        <span className="text-xs text-muted-foreground">{cfg?.label || app.status}</span>
                      </div>
                      <span className="text-xs text-muted-foreground/60">
                        {new Date(app.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Right panel — 2/5 */}
        <div className="xl:col-span-2 flex flex-col gap-4">

          {/* Status Breakdown */}
          <Card className="border-white/5 bg-card shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                </div>
                <CardTitle className="text-sm font-semibold">Pipeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              {totalStatusCount === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No applications yet</p>
              ) : (
                statusCounts.map((s) => {
                  const cfg = statusConfig[s.status];
                  const pct = Math.round((s._count / totalStatusCount) * 100);
                  return (
                    <div key={s.status} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${cfg?.dot || "bg-muted"}`} />
                          <span className="font-medium">{cfg?.label || s.status}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>{s._count}</span>
                          <span className="text-muted-foreground/50">{pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-primary/70 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Active Jobs */}
          <Card className="flex-1 border-white/5 bg-card shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-amber-500/10 p-2">
                    <Briefcase className="h-4 w-4 text-amber-400" />
                  </div>
                  <CardTitle className="text-sm font-semibold">Active Jobs</CardTitle>
                </div>
                <Link href="/dashboard/employer/jobs">
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground">
                    All <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              {recentJobs.length === 0 ? (
                <div className="flex flex-col items-center rounded-xl border border-dashed border-white/10 py-8 text-center">
                  <p className="text-sm text-muted-foreground">No jobs posted yet</p>
                  <Link href="/dashboard/employer/post-job" className="mt-3">
                    <Button size="sm" className="gap-1 text-xs">
                      <Plus className="h-3.5 w-3.5" /> Post Job
                    </Button>
                  </Link>
                </div>
              ) : (
                recentJobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 hover:bg-white/5 transition-colors">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{job.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {job._count.applications} applicant{job._count.applications !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div className={`ml-3 h-2 w-2 shrink-0 rounded-full ${job.isActive ? "bg-emerald-400" : "bg-muted-foreground/30"}`} />
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
