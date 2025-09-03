import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ClipboardList, Edit3 } from "lucide-react";

interface GARequest {
  id: string;
  type: "Trip Request" | "Bereavement" | "Expense" | "Mail" | "Cellphone" | "Business Card" | "Accident";
  title: string;
  requestor: string;
  department: string;
  submittedAt: string; // ISO date string
  status: "Pending" | "In Review" | "Approved" | "Rejected";
}

const INITIAL_REQUESTS: GARequest[] = [
  { id: "REQ-100234", type: "Trip Request", title: "Sales trip to Tokyo", requestor: "John Doe", department: "Sales", submittedAt: "2025-02-04T10:24:00Z", status: "In Review" },
  { id: "REQ-100235", type: "Bereavement", title: "Bereavement gift for Emily Wilson", requestor: "Jennifer Davis", department: "Marketing", submittedAt: "2025-02-03T15:10:00Z", status: "Pending" },
  { id: "REQ-100236", type: "Expense", title: "Client dinner reimbursement", requestor: "Mike Johnson", department: "Engineering", submittedAt: "2025-02-02T09:05:00Z", status: "Approved" },
  { id: "REQ-100237", type: "Business Card", title: "New cards for team member", requestor: "Rachel Green", department: "Marketing", submittedAt: "2025-02-01T13:45:00Z", status: "Rejected" },
];

function statusBadgeVariant(status: GARequest["status"]) {
  switch (status) {
    case "Approved":
      return "default" as const;
    case "Rejected":
      return "destructive" as const;
    case "In Review":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function GARequestManagement() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<GARequest[]>(INITIAL_REQUESTS);

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      [r.id, r.type, r.title, r.requestor, r.department, r.status, formatDate(r.submittedAt)]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, query]);

  const setStatus = (id: string, next: GARequest["status"]) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
  };

  const handleEdit = (r: GARequest) => {
    const route =
      r.type === "Trip Request"
        ? "/request/new"
        : r.type === "Bereavement"
        ? "/request/bereavement"
        : r.type === "Expense"
        ? "/request/expense"
        : r.type === "Mail"
        ? "/request/mail"
        : r.type === "Cellphone"
        ? "/request/cellphone"
        : r.type === "Business Card"
        ? "/request/business-car"
        : "/request/select";
    navigate(`${route}?id=${encodeURIComponent(r.id)}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary text-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Inbox - GA</h1>
            <p className="text-primary/20">Search, update statuses, and edit requests</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>Type in the search box to filter by any field</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Requestor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono">{r.id}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell className="max-w-xs truncate" title={r.title}>{r.title}</TableCell>
                  <TableCell>{r.requestor}</TableCell>
                  <TableCell>{r.department}</TableCell>
                  <TableCell>{formatDate(r.submittedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusBadgeVariant(r.status)}>{r.status}</Badge>
                      <Select value={r.status} onValueChange={(v) => setStatus(r.id, v as GARequest["status"]) }>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Review">In Review</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(r)}>
                      <Edit3 className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-gray-500 py-8">
                    No requests match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
