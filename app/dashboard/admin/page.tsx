import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users, Building2, Briefcase, FileText, TrendingUp,
  UserPlus, ArrowRight, Clock, ChevronRight, ShieldCheck, Zap,
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  const [
    totalUsers, totalEmployers, totalJobSeekers,
    totalJobs, totalCompanies, totalApplications,
    pendingJobs, pendingCompanies,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "EMPLOYER" } }),
    prisma.user.count({ where: { role: "JOB_SEEKER" } }),
    prisma.job.count(),
    prisma.company.count(),
    prisma.application.count(),
    prisma.job.count({ where: { isApproved: false } }),
    prisma.company.count({ where: { isApproved: false } }),
  ]);

  const [recentUsers, recentJobs, recentApplications] = await Promise.all([
    prisma.user.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
    prisma.job.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { company: true } }),
    prisma.application.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { user: true, job: true } }),
  ]);

  const stats = [
    { label: "Total Users", value: totalUsers, sub: `${totalEmployers} employers`, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", ring: "ring-blue-400/20", glow: "shadow-blue-500/10" },
    { label: "Employers", value: totalEmployers, sub: "registered", icon: Building2, color: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-400/20", glow: "shadow-emerald-500/10" },
    { label: "Job Seekers", value: totalJobSeekers, sub: "registered", icon: UserPlus, color: "text-violet-400", bg: "bg-violet-400/10", ring: "ring-violet-400/20", glow: "shadow-violet-500/10" },
    { label: "Total Jobs", value: totalJobs, sub: `${pendingJobs} pending`, icon: Briefcase, color: "text-amber-400", bg: "bg-amber-400/10", ring: "ring-amber-400/20", glow: "shadow-amber-500/10" },
    { label: "Companies", value: totalCompanies, sub: `${pendingCompanies} pending`, icon: Building2, color: "text-cyan-400", bg: "bg-cyan-400/10", ring: "ring-cyan-400/20", glow: "shadow-cyan-500/10" },
    { label: "Applications", value: totalApplications, sub: "all time", icon: FileText, color: "text-rose-400", bg: "bg-rose-400/10", ring: "ring-rose-400/20", glow: "shadow-rose-500/10" },
  ];

  const appStatusColor: Record<string, string> = {
    PENDING: "bg-yellow-400/10 text-yellow-400",
    REVIEWING: "bg-blue-400/10 text-blue-400",
    SHORTLISTED: "bg-purple-400/10 text-purple-400",
    INTERVIEW: "bg-orange-400/10 text-orange-400",
    OFFERED: "bg-emerald-400/10 text-emerald-400",
    HIRED: "bg-green-400/10 text-green-400",
    REJECTED: "bg-red-400/10 text-red-400",
  };

  return (
    <div className="space-y-6">

      {/* ── Header Banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-linear-to-r from-red-500/10 via-primary/5 to-transparent p-6 md:p-8 shadow-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-red-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-red-500/10 shadow-lg ring-2 ring-red-500/20">
              <ShieldCheck className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Welcome, {session?.user?.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">Platform overview and moderation</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-red-500/20 bg-red-500/10 text-red-400">Admin Panel</Badge>
            {pendingJobs > 0 && (
              <Link href="/dashboard/admin/jobs?status=pending">
                <Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-400 cursor-pointer hover:bg-yellow-500/20">
                  {pendingJobs} pending jobs
                </Badge>
              </Link>
            )}
            {pendingCompanies > 0 && (
              <Link href="/dashboard/admin/employers?status=pending">
                <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-400 cursor-pointer hover:bg-blue-500/20">
                  {pendingCompanies} pending companies
                </Badge>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className={`group relative overflow-hidden rounded-xl border border-white/5 bg-card p-5 shadow-lg ${s.glow} hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200`}>
            <div className={`pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full ${s.bg} blur-xl`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-3xl font-bold tabular-nums">{s.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
              </div>
              <div className={`rounded-xl ${s.bg} p-2.5 ring-1 ${s.ring}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Activity Grid ── */}
      <div className="grid gap-4 xl:grid-cols-5">

        {/* Recent Users — 2/5 */}
        <Card className="xl:col-span-2 border-white/5 bg-card shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-blue-500/10 p-2"><Users className="h-4 w-4 text-blue-400" /></div>
                <div>
                  <CardTitle className="text-sm font-semibold">Recent Users</CardTitle>
                  <CardDescription className="text-xs">Latest registrations</CardDescription>
                </div>
              </div>
              <Link href="/dashboard/admin/users">
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
            {recentUsers.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">No users yet</p> : recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/2 px-3.5 py-2.5 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{user.name?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs shrink-0 ml-2">{user.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Jobs — 2/5 */}
        <Card className="xl:col-span-2 border-white/5 bg-card shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-amber-500/10 p-2"><Briefcase className="h-4 w-4 text-amber-400" /></div>
                <div>
                  <CardTitle className="text-sm font-semibold">Recent Jobs</CardTitle>
                  <CardDescription className="text-xs">Latest postings</CardDescription>
                </div>
              </div>
              <Link href="/dashboard/admin/jobs">
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
            {recentJobs.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">No jobs yet</p> : recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/2 px-3.5 py-2.5 hover:bg-white/5 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.company?.name}</p>
                </div>
                <Badge className={job.isApproved ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs shrink-0 ml-2" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs shrink-0 ml-2"}>
                  {job.isApproved ? "Approved" : "Pending"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Applications — 1/5 */}
        <Card className="xl:col-span-1 border-white/5 bg-card shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-rose-500/10 p-2"><FileText className="h-4 w-4 text-rose-400" /></div>
              <CardTitle className="text-sm font-semibold">Recent Apps</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
            {recentApplications.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">No applications</p> : recentApplications.map((app) => (
              <div key={app.id} className="rounded-xl border border-white/5 bg-white/2 px-3 py-2.5 hover:bg-white/5 transition-colors">
                <p className="text-sm font-medium truncate">{app.user?.name}</p>
                <p className="text-xs text-muted-foreground truncate mb-1.5">{app.job?.title}</p>
                <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${appStatusColor[app.status] || "bg-muted text-muted-foreground"}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { href: "/dashboard/admin/jobs?status=pending", icon: Clock, label: "Pending Jobs", sub: `${pendingJobs} to review`, color: "text-yellow-400", bg: "bg-yellow-400/10", ring: "ring-yellow-400/20" },
          { href: "/dashboard/admin/employers?status=pending", icon: Building2, label: "Pending Companies", sub: `${pendingCompanies} to verify`, color: "text-blue-400", bg: "bg-blue-400/10", ring: "ring-blue-400/20" },
          { href: "/dashboard/admin/users", icon: Users, label: "User Management", sub: `${totalUsers} users`, color: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-400/20" },
          { href: "/dashboard/admin/analytics", icon: TrendingUp, label: "Analytics", sub: "Platform insights", color: "text-violet-400", bg: "bg-violet-400/10", ring: "ring-violet-400/20" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-card p-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
              <div className={`rounded-xl ${item.bg} p-2.5 ring-1 ${item.ring} shrink-0`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 ml-auto shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
