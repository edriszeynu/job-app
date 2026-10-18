import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// ✅ SVG Icons
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const BriefcaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const GraduationCapIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c0 1.5 2 3 6 3s6-1.5 6-3v-5"/>
  </svg>
);

const AwardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/profile");
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      companies: { take: 1 },
    },
  });

  if (!user) {
    redirect("/");
  }

  const profile = user.profile;
  const isEmployer = user.role === "EMPLOYER";
  const isAdmin = user.role === "ADMIN";

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const editLink = isEmployer
    ? "/dashboard/employer/profile"
    : "/dashboard/seeker/profile";

  const socialLinks = profile?.socialLinks as Record<string, string> | null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/[0.03] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="relative overflow-hidden border-border/50 shadow-xl bg-gradient-to-br from-background to-primary/[0.02]">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-primary/20" />

            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-primary/10">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {user.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {user.role}
                        </Badge>
                        {isAdmin && (
                          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                            Admin
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          Joined {joinedDate}
                        </span>
                      </div>
                    </div>
                    <Link href={editLink}>
                      <Button variant="outline" className="gap-2">
                        <EditIcon className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>

                  <p className="text-muted-foreground">
                    {profile?.bio || "No bio provided yet."}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {user.email && (
                      <div className="flex items-center gap-1.5">
                        <MailIcon className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    {profile?.phone && (
                      <div className="flex items-center gap-1.5">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile?.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>

                  {socialLinks && (
                    <div className="flex flex-wrap gap-3 pt-1">
                      {socialLinks.linkedin && (
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <LinkedInIcon className="h-5 w-5" />
                        </a>
                      )}
                      {socialLinks.github && (
                        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <GithubIcon className="h-5 w-5" />
                        </a>
                      )}
                      {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <TwitterIcon className="h-5 w-5" />
                        </a>
                      )}
                      {socialLinks.website && (
                        <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <GlobeIcon className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AwardIcon className="h-5 w-5 text-primary" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience */}
            {profile?.experience && Array.isArray(profile.experience) && profile.experience.length > 0 && (
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BriefcaseIcon className="h-5 w-5 text-primary" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(profile.experience as any[]).map((exp, i) => (
                    <div key={i} className="space-y-1">
                      <p className="font-medium">{exp.role}</p>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">
                        {exp.startDate} — {exp.endDate || "Present"}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-muted-foreground">{exp.description}</p>
                      )}
                      {i < (profile.experience as any[]).length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {profile?.education && Array.isArray(profile.education) && profile.education.length > 0 && (
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GraduationCapIcon className="h-5 w-5 text-primary" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(profile.education as any[]).map((edu, i) => (
                    <div key={i} className="space-y-1">
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground">{edu.school}</p>
                      <p className="text-xs text-muted-foreground">
                        {edu.startYear} — {edu.endYear}
                      </p>
                      {edu.field && (
                        <p className="text-sm text-muted-foreground">{edu.field}</p>
                      )}
                      {i < (profile.education as any[]).length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            {profile?.certifications && profile.certifications.length > 0 && (
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AwardIcon className="h-5 w-5 text-primary" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {profile.certifications.map((cert, i) => (
                      <li key={i} className="text-muted-foreground">{cert}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Languages */}
            {profile?.languages && profile.languages.length > 0 && (
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GlobeIcon className="h-5 w-5 text-primary" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang, i) => (
                      <Badge key={i} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Empty State */}
          {!profile && (
            <Card className="border-dashed border-2 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="text-center py-12">
                <UserIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold">Profile Incomplete</h3>
                <p className="text-muted-foreground">
                  Add your bio, skills, experience, and more to stand out.
                </p>
                <Link href={editLink}>
                  <Button className="mt-4 gap-2">
                    Complete Profile
                    <EditIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}