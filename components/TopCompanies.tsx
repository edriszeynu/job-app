import { Company } from "@prisma/client";
import Link from "next/link";

const circlePalette = [
  "bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700",
  "bg-violet-100 text-violet-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

export default function TopCompanies({ companies }: { companies: Company[] }) {
  if (!companies.length) return null;

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Top Companies</h2>
          <p className="text-gray-400 mt-1 text-sm">Join the best companies in the industry</p>
        </div>

        {/* Company cards strip */}
        <div className="flex flex-wrap justify-center gap-4">
          {companies.map((company, idx) => {
            const circleStyle = circlePalette[idx % circlePalette.length];
            return (
              <Link
                key={company.id}
                href={`/companies/${company.id}`}
                className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 px-5 py-4 min-w-40"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${circleStyle}`}
                >
                  {company.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-gray-800 truncate">{company.name}</p>
                  <p className="text-xs text-gray-400 truncate">{company.industry || "Company"}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
