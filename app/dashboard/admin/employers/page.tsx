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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Building2,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  logo: string | null;
  industry: string | null;
  isApproved: boolean;
  owner: { name: string; email: string };
  _count: { jobs: number };
  createdAt: string;
}

export default function EmployersPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchCompanies();
  }, [search, statusFilter]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      const res = await fetch(`/api/admin/companies?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (companyId: string, approve: boolean) => {
    try {
      const res = await fetch(`/api/admin/companies/${companyId}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: approve }),
      });
      if (res.ok) {
        toast.success(`Company ${approve ? "approved" : "rejected"} successfully`);
        fetchCompanies();
      } else {
        toast.error("Failed to update company");
      }
    } catch (error) {
      toast.error("Failed to update company");
    }
  };

  const handleDelete = async (companyId: string) => {
    if (confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/admin/companies/${companyId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast.success("Company deleted successfully");
          fetchCompanies();
        } else {
          toast.error("Failed to delete company");
        }
      } catch (error) {
        toast.error("Failed to delete company");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Employer Management</h2>
        <p className="text-muted-foreground">Verify and manage companies on the platform</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company name..."
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
        <Button variant="outline" onClick={fetchCompanies}>Refresh</Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Companies</CardTitle>
          <CardDescription>Total: {companies.length} companies</CardDescription>
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
                    <TableHead>Company</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Jobs</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 bg-primary/10">
                            <AvatarFallback className="text-xs font-bold text-primary">
                              {company.name?.charAt(0) || "C"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{company.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{company.industry || "—"}</TableCell>
                      <TableCell className="text-sm">{company.owner?.name}</TableCell>
                      <TableCell>{company._count?.jobs || 0}</TableCell>
                      <TableCell>
                        {company.isApproved ? (
                          <Badge className="bg-green-500/10 text-green-600 border-green-200">
                            Approved
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!company.isApproved && (
                              <>
                                <DropdownMenuItem onClick={() => handleVerify(company.id, true)}>
                                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" /> Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleVerify(company.id, false)}>
                                  <XCircle className="h-4 w-4 mr-2 text-red-600" /> Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(company.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {companies.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No companies found
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