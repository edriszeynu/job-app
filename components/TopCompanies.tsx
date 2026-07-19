import { Company } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function TopCompanies({ companies }: { companies: Company[] }) {
  if (!companies.length) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Top Companies</h2>
          <p className="text-muted-foreground mt-1">Join the best companies in the industry</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {companies.map((company) => (
            <Link href={`/companies/${company.id}`} key={company.id}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center p-4 h-28">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold text-primary">
                    {company.name?.charAt(0)}
                  </div>
                  <p className="text-sm font-medium mt-2 text-center line-clamp-1">{company.name}</p>
                  <p className="text-xs text-muted-foreground">{company.industry || "Company"}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}