import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedJobs from "@/components/FeaturedJobs";
import TopCompanies from "@/components/TopCompanies";
import Stats from "@/components/Stats";
import TrustSection from "@/components/TrustSection";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function HomePage() {
  // Default empty state
  let jobs = [];
  let companies = [];
  let totalJobs = 0;
  let totalCompanies = 0;
  let totalUsers = 0;
  let error = null;

  try {
    const [jobsRes, companiesRes, statsRes] = await Promise.all([
      fetch(`${baseUrl}/api/jobs?limit=6`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/companies?limit=6`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/stats`, { next: { revalidate: 60 } }),
    ]);

    if (jobsRes.ok) {
      const data = await jobsRes.json();
      jobs = data.data || [];
    } else {
      console.warn("Jobs API responded with status", jobsRes.status);
    }

    if (companiesRes.ok) {
      const data = await companiesRes.json();
      companies = data.data || [];
    } else {
      console.warn("Companies API responded with status", companiesRes.status);
    }

    if (statsRes.ok) {
      const data = await statsRes.json();
      const stats = data.data || {};
      totalJobs = stats.totalJobs || 0;
      totalCompanies = stats.totalCompanies || 0;
      totalUsers = stats.totalUsers || 0;
    } else {
      console.warn("Stats API responded with status", statsRes.status);
    }
  } catch (err) {
    console.error("Homepage fetch error:", err);
    error = err;
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {error && (
          <div className="container mx-auto px-4 py-2 text-center text-sm text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950/30 rounded-md">
            ⚠️ Could not fetch live data. Showing fallback content.
          </div>
        )}
        <Stats
          totalJobs={totalJobs}
          totalCompanies={totalCompanies}
          totalUsers={totalUsers}
        />
        <TrustSection />
        <FeaturedJobs jobs={jobs} />
        <TopCompanies companies={companies} />
      </main>
      <Footer />
    </>
  );
}