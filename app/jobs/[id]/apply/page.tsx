import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ApplyFormClient from "./ApplyFormClient";

export default async function ApplyPage({
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

  return <ApplyFormClient job={job} />;
}