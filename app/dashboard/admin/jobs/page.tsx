"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Loader2,
  Star,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: { name: string };
  jobType: string;
  isActive: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchJobs();
  }, [search, statusFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      const res = await fetch(`/api/admin/jobs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId: string, approve: boolean) => {
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: approve }),
      });
      if (res.ok) {
        toast.success(`Job ${approve ? "approved" : "rejected"} successfully`);
        fetchJobs();
      } else {
        toast.error("Failed to update job");
      }
    } catch (error) {
      toast.error("Failed to update job");
    }
  };

  const handleFeature = async (jobId: string, featured: boolean) => {
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/feature`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured }),
      });
      if (res.ok) {
        toast.success(`Job ${featured ? "featured" : "unfeatured"} successfully`);
        fetchJobs();
      } else {
        toast.error("Failed to update job");
      }
    } catch (error) {
      toast.error("Failed to update job");
    }
  };

  const handleDelete = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/admin/jobs/${jobId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast.success("Job deleted successfully");
          fetchJobs();
        } else {
          toast.error("Failed to delete job");
        }
      } catch (error) {
        toast.error("Failed to delete job");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Job Moderation</h2>
        <p className="text-muted-foreground">Review and manage job listings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by job title..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchJobs}>Refresh</Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
          <CardDescription>Total: {jobs.length} jobs</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company?.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.jobType}</Badge>
                      </TableCell>
                      <TableCell>
                        {job.isApproved ? (
                          <Badge className="bg-green-500/10 text-green-600 border-green-200">
                            Approved
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {job.isFeatured ? (
                          <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">
                            ⭐ Featured
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!job.isApproved && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(job.id, true)}>
                                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" /> Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleApprove(job.id, false)}>
                                  <XCircle className="h-4 w-4 mr-2 text-red-600" /> Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem onClick={() => handleFeature(job.id, !job.isFeatured)}>
                              <Star className="h-4 w-4 mr-2" /> {job.isFeatured ? "Unfeature" : "Feature"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(job.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {jobs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No jobs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}