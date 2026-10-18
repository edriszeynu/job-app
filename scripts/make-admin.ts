import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const email = process.argv[2];

if (!email) {
  console.error("Usage: npx tsx scripts/make-admin.ts your@email.com");
  process.exit(1);
}

async function main() {
  const user = await prisma.user.update({
    where: { email },
    data: { isAdmin: true },
  });
  console.log(`✅ ${user.name} (${user.email}) is now an admin.`);
  console.log("Sign out and sign back in, then go to /dashboard");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
