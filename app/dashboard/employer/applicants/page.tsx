import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Search,
  FileText,
  Download,
  Mail,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserPlus,
  TrendingUp,
} from "lucide-react";
import StatusUpdateButton from "@/components/employer/StatusUpdateButton";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  REVIEWING: "bg-blue-500/10 text-blue-600 border-blue-200",
  SHORTLISTED: "bg-purple-500/10 text-purple-600 border-purple-200",
  INTERVIEW: "bg-orange-500/10 text-orange-600 border-orange-200",
  OFFERED: "bg-green-500/10 text-green-600 border-green-200",
  HIRED: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  REJECTED: "bg-red-500/10 text-red-600 border-red-200",
};

const statusOrder = ["PENDING", "REVIEWING", "SHORTLISTED", "INTERVIEW", "OFFERED", "HIRED", "REJECTED"];

const getStatusIndex = (status: string) => statusOrder.indexOf(status) + 1;

export default async function ApplicantsPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string; status?: string; search?: string }>;
}) {
  const { job, status, search } = await searchParams;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const company = await prisma.company.findFirst({
    where: { ownerId: userId },
  });

  if (!company) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Applicants</h2>
          <p className="text-muted-foreground">Manage your job applicants</p>
        </div>
        <Card className="border-dashed border-2">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
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
    select: { id: true, title: true },
  });

  const where: any = { job: { companyId: company.id } };
  if (job && job !== "ALL") where.jobId = job;
  if (status && status !== "ALL") where.status = status;
  if (search) where.user = { name: { contains: search, mode: "insensitive" } };

  const applicants = await prisma.application.findMany({
    where,
    include: { user: true, job: true },
    orderBy: { createdAt: "desc" },
  });

  const statuses = ["ALL", ...statusOrder];

  const totalApplicants = applicants.length;
  const pendingCount = applicants.filter((a) => a.status === "PENDING").length;
  const reviewedCount = applicants.filter((a) => a.status === "REVIEWING" || a.status === "SHORTLISTED").length;
  const hiredCount = applicants.filter((a) => a.status === "HIRED" || a.status === "OFFERED").length;
  const rejectedCount = applicants.filter((a) => a.status === "REJECTED").length;

  const stats = [
    { label: "Total", value: totalApplicants, icon: Users, color: "from-blue-500 to-cyan-400", bg: "from-blue-500/10 to-cyan-400/5" },
    { label: "Pending", value: pendingCount, icon: Clock, color: "from-yellow-500 to-amber-400", bg: "from-yellow-500/10 to-amber-400/5" },
    { label: "In Review", value: reviewedCount, icon: AlertCircle, color: "from-purple-500 to-pink-400", bg: "from-purple-500/10 to-pink-400/5" },
    { label: "Hired/Offered", value: hiredCount, icon: CheckCircle2, color: "from-emerald-500 to-teal-400", bg: "from-emerald-500/10 to-teal-400/5" },
    { label: "Rejected", value: rejectedCount, icon: XCircle, color: "from-red-500 to-rose-400", bg: "from-red-500/10 to-rose-400/5" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Applicants</h2>
        <p className="text-muted-foreground">Manage your job applicants and their status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div
                className={`rounded-xl bg-gradient-to-br ${stat.bg} p-2.5 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className={`h-4 w-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-border/40">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by candidate name..."
            className="pl-9 bg-background/80 border-border/50 focus:border-primary/50"
            defaultValue={search || ""}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select defaultValue={job || "ALL"}>
            <SelectTrigger className="w-[160px] bg-background/80 border-border/50">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Jobs</SelectItem>
              {jobs.map((j) => (
                <SelectItem key={j.id} value={j.id}>
                  {j.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue={status || "ALL"}>
            <SelectTrigger className="w-[160px] bg-background/80 border-border/50">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "ALL" ? "All" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Applicants List */}
      {applicants.length === 0 ? (
        <Card className="border-dashed border-2 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="text-center py-16">
            <Users className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold">No applicants yet</h3>
            <p className="text-muted-foreground mt-2">
              Applications will appear here once candidates apply
            </p>
            <Link href="/dashboard/employer/jobs">
              <Button variant="outline" className="mt-4">
                View Your Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applicants.map((app) => {
            const currentIndex = getStatusIndex(app.status);
            const isRejected = app.status === "REJECTED";
            const isHired = app.status === "HIRED" || app.status === "OFFERED";

            return (
              <Card
                key={app.id}
                className="group hover:shadow-xl hover:border-primary/20 transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden"
              >
                {/* Status Progress Bar */}
                <div className="h-1 w-full bg-muted/30">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isRejected ? "bg-red-500" :
                      isHired ? "bg-emerald-500" :
                      "bg-primary"
                    }`}
                    style={{ width: `${(currentIndex / statusOrder.length) * 100}%` }}
                  />
                </div>

                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold">
                          {app.user?.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/dashboard/employer/applicants/${app.id}`}>
                          <p className="font-semibold text-base hover:text-primary transition-colors">
                            {app.user?.name}
                          </p>
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{app.job?.title}</span>
                          <span className="text-xs">•</span>
                          <span className="text-xs">
                            Applied {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Center: Status Steps (visible on desktop) */}
                    <div className="hidden lg:flex items-center gap-1">
                      {statusOrder.map((s, idx) => {
                        const isActive = s === app.status;
                        const isPast = statusOrder.indexOf(s) < statusOrder.indexOf(app.status);
                        const isRejectedStatus = s === "REJECTED";
                        const isHiredStatus = s === "HIRED" || s === "OFFERED";
                        
                        let dotColor = "bg-muted-foreground/20";
                        if (isActive) {
                          dotColor = isRejectedStatus ? "bg-red-500" : isHiredStatus ? "bg-emerald-500" : "bg-primary";
                        } else if (isPast && !isRejected) {
                          dotColor = "bg-primary/40";
                        }

                        return (
                          <div key={s} className="flex items-center">
                            <div className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${dotColor}`} />
                            {idx < statusOrder.length - 1 && (
                              <div className={`w-8 h-[2px] transition-all duration-300 ${
                                isPast && !isRejected ? "bg-primary/30" : "bg-muted-foreground/10"
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Right: Status & Actions */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <StatusUpdateButton
                        applicationId={app.id}
                        currentStatus={app.status}
                      />
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile: Status Steps */}
                  <div className="flex items-center gap-1 mt-4 lg:hidden">
                    {statusOrder.map((s, idx) => {
                      const isActive = s === app.status;
                      const isRejectedStatus = s === "REJECTED";
                      const isHiredStatus = s === "HIRED" || s === "OFFERED";
                      const isPast = statusOrder.indexOf(s) < statusOrder.indexOf(app.status);
                      
                      let dotColor = "bg-muted-foreground/20";
                      if (isActive) {
                        dotColor = isRejectedStatus ? "bg-red-500" : isHiredStatus ? "bg-emerald-500" : "bg-primary";
                      } else if (isPast && !isRejected) {
                        dotColor = "bg-primary/40";
                      }

                      return (
                        <div key={s} className="flex items-center">
                          <div className={`h-2 w-2 rounded-full transition-all duration-300 ${dotColor}`} />
                          {idx < statusOrder.length - 1 && (
                            <div className={`w-6 h-[2px] transition-all duration-300 ${
                              isPast && !isRejected ? "bg-primary/30" : "bg-muted-foreground/10"
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}