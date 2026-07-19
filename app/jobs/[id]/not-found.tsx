import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JobNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold">Job Not Found</h1>
      <p className="text-muted-foreground mt-2">
        The job you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/jobs">
        <Button className="mt-6">Browse All Jobs</Button>
      </Link>
    </div>
  );
}