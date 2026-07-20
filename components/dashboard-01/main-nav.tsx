"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard/seeker", label: "Overview" },
    { href: "/dashboard/seeker/applications", label: "Applications" },
    { href: "/dashboard/seeker/saved-jobs", label: "Saved Jobs" },
    { href: "/dashboard/seeker/profile", label: "Profile" },
    { href: "/dashboard/seeker/settings", label: "Settings" },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href || pathname?.startsWith(item.href + "/")
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}