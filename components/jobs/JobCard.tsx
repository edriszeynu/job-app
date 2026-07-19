// components/jobs/JobCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: { name: string };
    jobType: string;
    experienceLevel: string;
    isFeatured: boolean;
    location: string | null;
    isRemote: boolean;
    createdAt: string | Date;
    salaryMin: number | null;
    salaryMax: number | null;
  };
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-background/60 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold text-primary">
          {job.company?.name?.charAt(0) || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{job.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{job.company?.name}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {job.jobType}
          </Badge>
          <Badge variant="outline">{job.experienceLevel}</Badge>
          {job.isFeatured && (
            <Badge className="bg-amber-500/15 text-amber-600 border-amber-200">✨ Featured</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{job.location || "Remote"}</span>
          {job.isRemote && <span className="ml-1">🌐 Remote</span>}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
        {job.salaryMin && job.salaryMax && (
          <div className="text-sm font-medium text-primary">
            ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/jobs/${job.id}`} className="w-full">
          <Button variant="outline" className="w-full group border-border/50 hover:border-primary/50">
            View Details
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}