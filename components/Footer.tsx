import Link from "next/link";
import { X, Globe, GitBranch, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              JobHub
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Find your dream job and build your career with the best companies.
            </p>
            <div className="flex gap-3 mt-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <X className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <GitBranch className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Company</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Support</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">For Employers</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li><Link href="/post-job" className="hover:text-primary transition-colors">Post a Job</Link></li>
              <li><Link href="/employer/login" className="hover:text-primary transition-colors">Employer Login</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Plans</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} JobHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
