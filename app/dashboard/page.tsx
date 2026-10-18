import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const u = session.user as any;
  if (u.isAdmin || u.isSuperAdmin || u.email === "admin@jobhub.com") {
    redirect("/dashboard/admin");
  }

  if (session.user.role === "EMPLOYER") {
    redirect("/dashboard/employer");
  }

  redirect("/dashboard/seeker");
}
