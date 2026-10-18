import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Users, Globe, Briefcase, Search, ChevronRight } from "lucide-react";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; industry?: string }>;
}) {
  const { q, industry } = await searchParams;

  const where: any = { isApproved: true };
  if (q) where.name = { contains: q, mode: "insensitive" };
  if (industry && industry !== "All") where.industry = industry;

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      include: { _count: { select: { jobs: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.company.count({ where: { isApproved: true } }),
  ]);

  const industries = await prisma.company.findMany({
    where: { isApproved: true, industry: { not: null } },
    select: { industry: true },
    distinct: ["industry"],
  });
  const industryList = ["All", ...industries.map((i) => i.industry!).filter(Boolean).sort()];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40 bg-linear-to-br from-primary/8 via-background to-secondary/5 py-20">
          <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
          <div className="container relative mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
              {total} Companies Hiring
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Find Your Next<br />
              <span className="bg-linear-to-r from-primary to-blue-500 bg-clip-text text-transparent">Great Employer</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
              Explore top companies actively hiring. Find the right culture, mission, and team for your next role.
            </p>

            {/* Search */}
            <form className="mx-auto mt-8 flex max-w-lg gap-2" method="GET">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search companies…"
                  className="h-12 w-full rounded-xl border border-border/50 bg-background/80 pl-10 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button type="submit" className="h-12 px-6 shadow-lg shadow-primary/20">Search</Button>
            </form>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          {/* Industry filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            {industryList.map((ind) => (
              <Link key={ind} href={`/companies?${q ? `q=${q}&` : ""}industry=${ind}`}>
                <Badge
                  variant={(!industry && ind === "All") || industry === ind ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1 text-sm transition-all hover:border-primary/50"
                >
                  {ind}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Results count */}
          <p className="mb-6 text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{companies.length}</span> companies
            {q && <> matching <span className="font-semibold text-foreground">"{q}"</span></>}
          </p>

          {companies.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
              <Building2 className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="font-medium">No companies found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search or filter</p>
              <Link href="/companies" className="mt-4">
                <Button variant="outline" size="sm">Clear filters</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <Link key={company.id} href={`/companies/${company.id}`}>
                  <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    {/* Cover strip */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-primary/40 via-primary/20 to-transparent" />

                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-muted shadow-sm">
                        {company.logo
                          ? <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
                          : <Building2 className="h-6 w-6 text-muted-foreground" />
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {company.name}
                        </h3>
                        {company.industry && (
                          <p className="text-xs text-muted-foreground mt-0.5">{company.industry}</p>
                        )}
                      </div>

                      {company.isApproved && (
                        <Badge className="shrink-0 border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>

                    {company.description && (
                      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                        {company.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {company.headquarters && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />{company.headquarters}
                        </span>
                      )}
                      {company.size && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />{company.size} employees
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
                        <Briefcase className="h-3.5 w-3.5" />
                        {company._count.jobs} open job{company._count.jobs !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        View <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
