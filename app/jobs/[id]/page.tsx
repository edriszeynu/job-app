import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import JobDetailClient from "./JobDetailClient";

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

  const similarJobs = await prisma.job.findMany({
    where: {
      AND: [
        { id: { not: job.id } },
        {
          OR: [{ category: job.category }, { companyId: job.companyId }],
        },
        { isActive: true, isApproved: true },
      ],
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { company: true },
  });

  // 👇 Pass data to client component
  return <JobDetailClient job={job} similarJobs={similarJobs} />;
}