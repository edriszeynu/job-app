"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  MapPin, Clock, Building2, Globe, Users, Calendar,
  Share2, Bookmark, ArrowLeft, DollarSign, CheckCircle2,
} from "lucide-react";

function formatSalary(min: number | null, max: number | null, currency: string) {
  if (!min && !max) return "Salary not specified";
  if (!min) return `Up to ${currency}${max?.toLocaleString()}`;
  if (!max) return `From ${currency}${min?.toLocaleString()}`;
  return `${currency}${min.toLocaleString()} – ${currency}${max.toLocaleString()}`;
}

export default function JobDetailClient({ job, similarJobs }: { job: any; similarJobs: any[] }) {
  const { data: session } = useSession();
  const router = useRouter();

  const postedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const handleApplyClick = () => {
    if (!session) { router.push(`/auth/signin?callbackUrl=/jobs/${job.id}`); return; }
    router.push(`/jobs/${job.id}/apply`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <Link href="/jobs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
                  <ArrowLeft className="h-4 w-4 mr-1" />Back to jobs
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium text-foreground">{job.company?.name}</span>
                  </div>
                  <span className="text-border">•</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location || "Remote"}</span>
                  </div>
                  <span className="text-border">•</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Posted {postedDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />Share
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Bookmark className="h-4 w-4" />Save
                </Button>
                <Button size="lg" className="gap-2" onClick={handleApplyClick}>
                  Apply Now
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">{job.jobType.replace("_", " ")}</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">{job.experienceLevel}</span>
              {job.isFeatured && <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-medium">✨ Featured</span>}
              {job.salaryMin && job.salaryMax && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                  <DollarSign className="h-3 w-3" />{formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
                <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-sm">{job.description}</p>
              </div>
              {job.responsibilities && (
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Key Responsibilities</h2>
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-sm">{job.responsibilities}</p>
                </div>
              )}
              {job.requirements && (
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Requirements</h2>
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-sm">{job.requirements}</p>
                </div>
              )}
              {job.skills && job.skills.length > 0 && (
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill: string, index: number) => (
                      <span key={index} className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right */}
            <div className="space-y-5">
              <div className="bg-blue-600 rounded-2xl p-6 text-center text-white">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-blue-200" />
                <h3 className="font-semibold text-lg">Ready to apply?</h3>
                <p className="text-blue-100 text-sm mt-1">Join {job.company?.name} and take the next step.</p>
                <button onClick={handleApplyClick} className="w-full mt-4 bg-white text-blue-600 font-semibold py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                  Apply Now
                </button>
                {!session && <p className="text-xs text-blue-200 mt-2">Login required to apply</p>}
              </div>

              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <h3 className="font-semibold text-foreground mb-4">About the Company</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                    {job.company?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{job.company?.name}</p>
                    <p className="text-xs text-muted-foreground">{job.company?.industry}</p>
                  </div>
                </div>
                {job.company?.description && <p className="text-xs text-muted-foreground line-clamp-3 mb-4">{job.company.description}</p>}
                <div className="space-y-2 text-xs text-muted-foreground">
                  {job.company?.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5" />
                      <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{job.company.website.replace(/^https?:\/\//, "")}</a>
                    </div>
                  )}
                  {job.company?.headquarters && <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /><span>{job.company.headquarters}</span></div>}
                  {job.company?.size && <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /><span>{job.company.size} employees</span></div>}
                  {job.company?.foundedYear && <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /><span>Founded {job.company.foundedYear}</span></div>}
                </div>
                <Link href={`/companies/${job.companyId}`}>
                  <button className="w-full mt-4 border border-border text-foreground py-2 rounded-xl text-xs font-medium hover:border-primary hover:text-primary transition-colors">
                    View Company Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {similarJobs.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Similar Jobs</h2>
                <Link href="/jobs" className="text-sm text-primary hover:text-primary/80 font-medium">View all →</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {similarJobs.map((sj) => (
                  <Link key={sj.id} href={`/jobs/${sj.id}`}>
                    <div className="bg-card rounded-2xl border border-border shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">
                          {sj.company?.name?.charAt(0) || "?"}
                        </div>
                        <span className="text-xs text-muted-foreground truncate">{sj.company?.name}</span>
                      </div>
                      <h3 className="font-semibold text-foreground text-sm line-clamp-2">{sj.title}</h3>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /><span>{sj.location || "Remote"}</span>
                      </div>
                      {sj.salaryMin && sj.salaryMax && (
                        <p className="text-xs font-semibold text-primary mt-2">{formatSalary(sj.salaryMin, sj.salaryMax, sj.currency)}</p>
                      )}
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">{sj.jobType}</span>
                    </div>
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
