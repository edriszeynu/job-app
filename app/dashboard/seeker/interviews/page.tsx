import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import InterviewCard from "@/components/dashboard/InterviewCard";
import { Calendar } from "lucide-react";

export default async function InterviewsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const applications = await prisma.application.findMany({
    where: {
      userId,
      status: { in: ["INTERVIEW", "OFFERED", "HIRED"] },
    },
    include: {
      job: { include: { company: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Interviews</h2>
        <p className="text-muted-foreground">Track your interview invitations and offers</p>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No interviews yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Keep applying — interviews will appear here once you're shortlisted
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <InterviewCard
              key={app.id}
              id={app.id}
              jobTitle={app.job?.title ?? "Unknown Role"}
              company={app.job?.company?.name ?? "Unknown Company"}
              companyInitial={(app.job?.company?.name?.[0] ?? "?").toUpperCase()}
              type="In Person"
              date={app.interviewDate
                ? new Date(app.interviewDate).toLocaleDateString()
                : "TBD"}
              time={app.interviewDate
                ? new Date(app.interviewDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "TBD"}
              status={
                app.status === "INTERVIEW" ? "CONFIRMED" :
                app.status === "OFFERED" ? "CONFIRMED" :
                "COMPLETED"
              }
              action="View Job"
              actionLink={`/jobs/${app.jobId}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
