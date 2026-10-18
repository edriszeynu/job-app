import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EmployerDashboardLayout from "@/components/dashboard/EmployerDashboardLayout";

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "EMPLOYER") {
    redirect("/");
  }

  // Auto-create a company profile if none exists
  const existing = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
  });

  if (!existing) {
    try {
      await prisma.company.create({
        data: {
          name: `${session.user.name || "My Company"} - ${session.user.id.slice(-6)}`,
          ownerId: session.user.id,
          isApproved: false,
        },
      });
    } catch {
      // Company may have been created by a concurrent request, ignore
    }
  }

  return <EmployerDashboardLayout>{children}</EmployerDashboardLayout>;
}
