import { PrismaClient, JobType, ExperienceLevel, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ---------- Create sample users ----------
  const hashedPassword = await bcrypt.hash('password123', 10);

  const employerUser = await prisma.user.upsert({
    where: { email: 'employer@jobhub.com' },
    update: {},
    create: {
      email: 'employer@jobhub.com',
      password: hashedPassword,
      name: 'Tech Corp HR',
      role: 'EMPLOYER',
      emailVerified: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@jobhub.com' },
    update: { isAdmin: true, isSuperAdmin: true, password: await bcrypt.hash('Admin@123456', 12) },
    create: {
      email: 'admin@jobhub.com',
      password: await bcrypt.hash('Admin@123456', 12),
      name: 'Super Admin',
      role: 'JOB_SEEKER',
      emailVerified: true,
      isAdmin: true,
      isSuperAdmin: true,
    },
  });

  console.log(`✅ Created users: ${employerUser.email}, ${adminUser.email}`);

  // ---------- Create sample companies ----------
  const companiesData = [
    {
      name: 'Google',
      description: 'Search engine and tech giant',
      website: 'https://google.com',
      industry: 'Technology',
      size: '10000+',
      headquarters: 'Mountain View, CA',
      foundedYear: 1998,
      ownerId: employerUser.id,
    },
    {
      name: 'Microsoft',
      description: 'Software and cloud computing',
      website: 'https://microsoft.com',
      industry: 'Technology',
      size: '10000+',
      headquarters: 'Redmond, WA',
      foundedYear: 1975,
      ownerId: employerUser.id,
    },
    {
      name: 'Amazon',
      description: 'E-commerce and cloud services',
      website: 'https://amazon.com',
      industry: 'Retail',
      size: '10000+',
      headquarters: 'Seattle, WA',
      foundedYear: 1994,
      ownerId: employerUser.id,
    },
    {
      name: 'Meta',
      description: 'Social media and VR',
      website: 'https://meta.com',
      industry: 'Technology',
      size: '10000+',
      headquarters: 'Menlo Park, CA',
      foundedYear: 2004,
      ownerId: employerUser.id,
    },
    {
      name: 'Apple',
      description: 'Consumer electronics',
      website: 'https://apple.com',
      industry: 'Technology',
      size: '10000+',
      headquarters: 'Cupertino, CA',
      foundedYear: 1976,
      ownerId: employerUser.id,
    },
    {
      name: 'Netflix',
      description: 'Streaming entertainment',
      website: 'https://netflix.com',
      industry: 'Entertainment',
      size: '10000+',
      headquarters: 'Los Gatos, CA',
      foundedYear: 1997,
      ownerId: employerUser.id,
    },
  ];

  const createdCompanies = [];
  for (const companyData of companiesData) {
    const company = await prisma.company.upsert({
      where: { name: companyData.name },
      update: {},
      create: {
        ...companyData,
        isApproved: true,
      },
    });
    createdCompanies.push(company);
    console.log(`✅ Company: ${company.name}`);
  }

  // ---------- Create sample jobs ----------
  const jobsData = [
    {
      title: 'Senior Frontend Engineer',
      description: 'Build beautiful and performant user interfaces for our products.',
      responsibilities: 'Lead UI development, mentor junior devs, work with designers.',
      requirements: '5+ years React, TypeScript expertise, Next.js experience.',
      salaryMin: 120000,
      salaryMax: 160000,
      currency: 'USD',
      isNegotiable: false,
      jobType: 'FULL_TIME' as JobType,
      experienceLevel: 'SENIOR' as ExperienceLevel,
      location: 'Mountain View, CA',
      isRemote: true,
      isHybrid: false,
      companyId: createdCompanies[0].id,
      category: 'Engineering',
      skills: ['React', 'TypeScript', 'Next.js'],
      isActive: true,
      isFeatured: true,
      isApproved: true,
    },
    {
      title: 'Backend Developer',
      description: 'Design and build scalable APIs and microservices.',
      responsibilities: 'Architect server solutions, optimize database queries.',
      requirements: '5+ years Node.js, experience with AWS and MongoDB.',
      salaryMin: 110000,
      salaryMax: 150000,
      currency: 'USD',
      isNegotiable: false,
      jobType: 'FULL_TIME' as JobType,
      experienceLevel: 'MID' as ExperienceLevel,
      location: 'Redmond, WA',
      isRemote: false,
      isHybrid: true,
      companyId: createdCompanies[1].id,
      category: 'Engineering',
      skills: ['Node.js', 'AWS', 'MongoDB'],
      isActive: true,
      isFeatured: true,
      isApproved: true,
    },
    {
      title: 'Product Designer',
      description: 'Design delightful product experiences.',
      responsibilities: 'Lead design thinking, create prototypes, conduct user testing.',
      requirements: '3+ years UX/UI, Figma proficiency, portfolio required.',
      salaryMin: 90000,
      salaryMax: 130000,
      currency: 'USD',
      isNegotiable: true,
      jobType: 'FULL_TIME' as JobType,
      experienceLevel: 'MID' as ExperienceLevel,
      location: 'Seattle, WA',
      isRemote: true,
      isHybrid: false,
      companyId: createdCompanies[2].id,
      category: 'Design',
      skills: ['Figma', 'UI/UX'],
      isActive: true,
      isFeatured: false,
      isApproved: true,
    },
    {
      title: 'DevOps Engineer',
      description: 'Automate infrastructure and deployment pipelines.',
      responsibilities: 'Implement CI/CD, monitor cloud resources.',
      requirements: '3+ years AWS, experience with Docker and Kubernetes.',
      salaryMin: 130000,
      salaryMax: 170000,
      currency: 'USD',
      isNegotiable: false,
      jobType: 'CONTRACT' as JobType,
      experienceLevel: 'SENIOR' as ExperienceLevel,
      location: 'Menlo Park, CA',
      isRemote: true,
      isHybrid: false,
      companyId: createdCompanies[3].id,
      category: 'Engineering',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      isActive: true,
      isFeatured: false,
      isApproved: true,
    },
    {
      title: 'iOS Developer',
      description: 'Build native iOS applications using SwiftUI.',
      responsibilities: 'Develop and maintain iOS app, collaborate with cross‑functional teams.',
      requirements: '4+ years iOS experience, SwiftUI proficiency.',
      salaryMin: 115000,
      salaryMax: 155000,
      currency: 'USD',
      isNegotiable: false,
      jobType: 'FULL_TIME' as JobType,
      experienceLevel: 'MID' as ExperienceLevel,
      location: 'Cupertino, CA',
      isRemote: false,
      isHybrid: true,
      companyId: createdCompanies[4].id,
      category: 'Engineering',
      skills: ['Swift', 'iOS'],
      isActive: true,
      isFeatured: false,
      isApproved: true,
    },
    {
      title: 'Content Strategy Manager',
      description: 'Lead our content marketing efforts.',
      responsibilities: 'Develop content strategy, manage writers and editors.',
      requirements: '3+ years content marketing, experience in tech.',
      salaryMin: 80000,
      salaryMax: 110000,
      currency: 'USD',
      isNegotiable: true,
      jobType: 'FULL_TIME' as JobType,
      experienceLevel: 'ENTRY' as ExperienceLevel,
      location: 'Los Gatos, CA',
      isRemote: true,
      isHybrid: false,
      companyId: createdCompanies[5].id,
      category: 'Marketing',
      skills: ['Content', 'SEO'],
      isActive: true,
      isFeatured: false,
      isApproved: true,
    },
  ];

  for (const jobData of jobsData) {
    await prisma.job.create({
      data: jobData,
    });
    console.log(`✅ Job: ${jobData.title}`);
  }

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });