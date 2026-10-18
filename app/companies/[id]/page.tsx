import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2, MapPin, Users, Globe, Calendar,
  Briefcase, ArrowRight, ExternalLink, ShieldCheck,
} from "lucide-react";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      jobs: {
        where: { isActive: true, isApproved: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { jobs: true, reviews: true } },
    },
  });

  if (!company) notFound();

  const socialLinks = (company.socialLinks ?? {}) as { linkedin?: string; twitter?: string; facebook?: string };

  return (
    <>
      <Navbar />
      <main>
        {/* Cover + Header */}
        <div className="relative">
          {/* Cover image or gradient */}
          <div className="h-48 md:h-64 w-full overflow-hidden bg-linear-to-br from-primary/20 via-primary/10 to-secondary/10">
            {company.coverImage && (
              <img src={company.coverImage} alt="Cover" className="h-full w-full object-cover" />
            )}
          </div>

          {/* Company info card */}
          <div className="container mx-auto px-4">
            <div className="relative -mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6 border-b border-border/40">
              {/* Logo */}
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-background bg-card shadow-xl">
                  {company.logo
                    ? <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
                    : <Building2 className="h-10 w-10 text-muted-foreground" />
                  }
                </div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold md:text-3xl">{company.name}</h1>
                    {company.isApproved && (
                      <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                        <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                      </Badge>
                    )}
                  </div>
                  {company.industry && (
                    <p className="text-muted-foreground mt-0.5">{company.industry}</p>
                  )}
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {company.headquarters && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />{company.headquarters}
                  </span>
                )}
                {company.size && (
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />{company.size} employees
                  </span>
                )}
                {company.foundedYear && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />Founded {company.foundedYear}
                  </span>
                )}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                    <Globe className="h-4 w-4" />Website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Left — About + Jobs */}
            <div className="lg:col-span-2 space-y-8">
              {company.description && (
                <section>
                  <h2 className="text-lg font-semibold mb-3">About {company.name}</h2>
                  <p className="text-muted-foreground leading-relaxed">{company.description}</p>
                </section>
              )}

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Open Positions
                    <Badge variant="outline">{company._count.jobs}</Badge>
                  </h2>
                </div>

                {company.jobs.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
                    No open positions at the moment
                  </div>
                ) : (
                  <div className="space-y-3">
                    {company.jobs.map((job) => (
                      <Link key={job.id} href={`/jobs/${job.id}`}>
                        <div className="group flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all">
                          <div>
                            <p className="font-medium group-hover:text-primary transition-colors">{job.title}</p>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              <Badge variant="outline" className="text-xs">{job.jobType}</Badge>
                              <Badge variant="outline" className="text-xs">{job.experienceLevel}</Badge>
                              {job.isRemote && <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200">Remote</Badge>}
                              {job.location && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />{job.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-3">
                            {job.salaryMin && job.salaryMax && (
                              <span className="text-sm font-medium text-primary">
                                ${job.salaryMin.toLocaleString()}–${job.salaryMax.toLocaleString()}
                              </span>
                            )}
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Right — Sidebar info */}
            <div className="space-y-5">
              <Card className="border-border/50">
                <CardContent className="p-5 space-y-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Company Details</h3>
                  <div className="space-y-3 text-sm">
                    {company.industry && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Industry</span>
                        <span className="font-medium">{company.industry}</span>
                      </div>
                    )}
                    {company.size && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Company size</span>
                        <span className="font-medium">{company.size}</span>
                      </div>
                    )}
                    {company.foundedYear && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Founded</span>
                        <span className="font-medium">{company.foundedYear}</span>
                      </div>
                    )}
                    {company.headquarters && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{company.headquarters}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Open jobs</span>
                      <span className="font-medium text-primary">{company._count.jobs}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social links */}
              {socialLinks && (socialLinks.linkedin || socialLinks.twitter || socialLinks.facebook) && (
                <Card className="border-border/50">
                  <CardContent className="p-5 space-y-3">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Social</h3>
                    {socialLinks.linkedin && (
                      <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <ExternalLink className="h-3.5 w-3.5" /> LinkedIn
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <ExternalLink className="h-3.5 w-3.5" /> Twitter / X
                      </a>
                    )}
                    {socialLinks.facebook && (
                      <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <ExternalLink className="h-3.5 w-3.5" /> Facebook
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}

              <Link href="/jobs">
                <Button className="w-full gap-2 shadow-lg shadow-primary/20">
                  <Briefcase className="h-4 w-4" />
                  Browse All Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
