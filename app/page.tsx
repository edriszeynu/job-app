import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedJobs from "@/components/FeaturedJobs";
import TopCompanies from "@/components/TopCompanies";
import CategorySection from "@/components/CategorySection";
import Stats from "@/components/Stats";
import TrustSection from "@/components/TrustSection";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [jobs, companies, totalJobs, totalCompanies, totalUsers] = await Promise.all([
    prisma.job.findMany({
      where: { isActive: true, isApproved: true },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { company: true },
    }),
    prisma.company.findMany({
      where: { isApproved: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.job.count({ where: { isActive: true, isApproved: true } }),
    prisma.company.count({ where: { isApproved: true } }),
    prisma.user.count(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats totalJobs={totalJobs} totalCompanies={totalCompanies} totalUsers={totalUsers} />
        <CategorySection />
        <FeaturedJobs jobs={jobs} />
        <TopCompanies companies={companies} />
        <TrustSection />
      </main>
      <Footer />
    </>
  );
}