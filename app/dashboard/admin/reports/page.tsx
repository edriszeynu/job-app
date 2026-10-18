"use client";

import { useEffect, useState } from "react";
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
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
} from "lucide-react";

const statusColors = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  REVIEWED: "bg-blue-500/10 text-blue-600 border-blue-200",
  RESOLVED: "bg-green-500/10 text-green-600 border-green-200",
  DISMISSED: "bg-gray-500/10 text-gray-600 border-gray-200",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId: string, status: "RESOLVED" | "DISMISSED") => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Report ${status.toLowerCase()}`);
        fetchReports();
      } else {
        toast.error("Failed to update report");
      }
    } catch (error) {
      toast.error("Failed to update report");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports & Flags</h2>
        <p className="text-muted-foreground">Review and manage reported content</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={filter} onValueChange={(v) => setFilter(v ?? "ALL")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REVIEWED">Reviewed</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="DISMISSED">Dismissed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchReports}>Refresh</Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Reports
          </CardTitle>
          <CardDescription>{reports.length} total reports</CardDescription>
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
                    <TableHead>Type</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <Badge variant="outline">{report.targetType}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {report.targetId}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {report.reason}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {report.reporter?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{report.reporter?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[report.status as keyof typeof statusColors]}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {report.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500/30 text-green-600 hover:bg-green-500/10"
                              onClick={() => handleResolve(report.id, "RESOLVED")}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/30 text-red-600 hover:bg-red-500/10"
                              onClick={() => handleResolve(report.id, "DISMISSED")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {reports.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No reports found
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

