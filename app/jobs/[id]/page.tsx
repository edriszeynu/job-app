import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Clock,
  Building2,
  Globe,
  Users,
  Calendar,
  Share2,
  Bookmark,
  ArrowLeft,
  Briefcase,
  DollarSign,
  CheckCircle2,
} from "lucide-react";

// Helper to format salary
function formatSalary(min: number | null, max: number | null, currency: string) {
  if (!min && !max) return "Salary not specified";
  if (!min) return `Up to ${currency}${max?.toLocaleString()}`;
  if (!max) return `From ${currency}${min?.toLocaleString()}`;
  return `${currency}${min.toLocaleString()} – ${currency}${max.toLocaleString()}`;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!job) {
    notFound();
  }

  // Similar jobs (same category or company)
  const similarJobs = await prisma.job.findMany({
    where: {
      AND: [
        { id: { not: job.id } },
        {
          OR: [
            { category: job.category },
            { companyId: job.companyId },
          ],
        },
        { isActive: true, isApproved: true },
      ],
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { company: true },
  });

  const postedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10 border-b">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <Link
                  href="/jobs"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to jobs
                </Link>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium text-foreground">{job.company?.name}</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location || "Remote"}</span>
                    {job.isRemote && (
                      <Badge variant="outline" className="ml-1 text-xs">
                        🌐 Remote
                      </Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Posted {postedDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  Save
                </Button>
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all">
                  Apply Now
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                {job.jobType}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                {job.experienceLevel}
              </Badge>
              {job.isFeatured && (
                <Badge className="bg-amber-500/15 text-amber-600 border-amber-200 px-3 py-1">
                  ✨ Featured
                </Badge>
              )}
              {job.salaryMin && job.salaryMax && (
                <Badge variant="secondary" className="px-3 py-1 gap-1">
                  <DollarSign className="h-3 w-3" />
                  {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                </Badge>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {job.description}
                  </p>
                </CardContent>
              </Card>

              {/* Responsibilities */}
              {job.responsibilities && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Key Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                        {job.responsibilities}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Requirements */}
              {job.requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                        {job.requirements}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Company Card */}
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">About the Company</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 bg-gradient-to-br from-primary/20 to-primary/5">
                      <AvatarFallback className="text-2xl font-bold text-primary">
                        {job.company?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{job.company?.name}</h3>
                      <p className="text-sm text-muted-foreground">{job.company?.industry}</p>
                    </div>
                  </div>
                  {job.company?.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {job.company.description}
                    </p>
                  )}
                  <Separator />
                  <div className="space-y-2 text-sm">
                    {job.company?.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={job.company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          {job.company.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                    {job.company?.headquarters && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{job.company.headquarters}</span>
                      </div>
                    )}
                    {job.company?.size && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{job.company.size} employees</span>
                      </div>
                    )}
                    {job.company?.foundedYear && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Founded {job.company.foundedYear}</span>
                      </div>
                    )}
                  </div>
                  <Link href={`/companies/${job.companyId}`}>
                    <Button variant="outline" className="w-full">
                      View Company Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Apply Card - Sticky */}
              <Card className="sticky top-20 bg-gradient-to-br from-primary/5 to-background border-primary/20">
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-primary mb-3" />
                  <h3 className="font-semibold text-lg">Ready to apply?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Join {job.company?.name} and take the next step in your career.
                  </p>
                  <Button className="w-full mt-4 bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all">
                    Apply Now
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    You need to be logged in to apply
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Similar Jobs */}
          {similarJobs.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Similar Jobs</h2>
                <Link href="/jobs" className="text-sm text-primary hover:underline">
                  View all jobs →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarJobs.map((similarJob) => (
                  <Link key={similarJob.id} href={`/jobs/${similarJob.id}`}>
                    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 h-full">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-8 w-8 bg-primary/10">
                            <AvatarFallback className="text-xs font-bold text-primary">
                              {similarJob.company?.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium truncate">
                            {similarJob.company?.name}
                          </span>
                        </div>
                        <h3 className="font-semibold line-clamp-2">{similarJob.title}</h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{similarJob.location || "Remote"}</span>
                        </div>
                        {similarJob.salaryMin && similarJob.salaryMax && (
                          <p className="text-sm font-medium text-primary mt-2">
                            {formatSalary(
                              similarJob.salaryMin,
                              similarJob.salaryMax,
                              similarJob.currency
                            )}
                          </p>
                        )}
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {similarJob.jobType}
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}