import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PlaneTakeoff, 
  FileText, 
  CheckSquare, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Plus,
  ArrowRight
} from "lucide-react";

interface TripRequest {
  id: string;
  requestNumber: string;
  destination: string;
  departureDate: string;
  status: "pending" | "approved" | "rejected" | "in_review";
  amount: number;
}

const mockRequests: TripRequest[] = [
  {
    id: "1",
    requestNumber: "BIZ-001",
    destination: "Seoul, South Korea",
    departureDate: "2024-02-15",
    status: "pending",
    amount: 3500
  },
  {
    id: "2", 
    requestNumber: "BIZ-002",
    destination: "Tokyo, Japan",
    departureDate: "2024-03-10",
    status: "approved",
    amount: 2800
  },
  {
    id: "3",
    requestNumber: "BIZ-003", 
    destination: "Singapore",
    departureDate: "2024-02-28",
    status: "in_review",
    amount: 2200
  }
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800", 
  rejected: "bg-red-100 text-red-800",
  in_review: "bg-blue-100 text-blue-800"
};

export default function Index() {
  const [recentRequests, setRecentRequests] = useState<TripRequest[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingApprovals: 0,
    approvedThisMonth: 0,
    totalBudget: 0
  });

  useEffect(() => {
    // Simulate fetching data
    setRecentRequests(mockRequests);
    setStats({
      totalRequests: 15,
      pendingApprovals: 3,
      approvedThisMonth: 8,
      totalBudget: 45000
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with all requests</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/request/select">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Travel Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              65% of annual budget used
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Your latest travel requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <PlaneTakeoff className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {request.requestNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.destination} • {new Date(request.departureDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium text-gray-900">
                      ${request.amount.toLocaleString()}
                    </div>
                    <Badge className={statusColors[request.status]}>
                      {request.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/requests">
                <Button variant="outline" className="w-full">
                  View All Requests
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/request/select">
                <Button className="w-full justify-start" variant="outline">
                  <PlaneTakeoff className="h-4 w-4 mr-2" />
                  Create New Request
                </Button>
              </Link>
              
              <Link to="/approvals">
                <Button className="w-full justify-start" variant="outline">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Review Pending Approvals
                  {stats.pendingApprovals > 0 && (
                    <Badge className="ml-auto">{stats.pendingApprovals}</Badge>
                  )}
                </Button>
              </Link>
              
              <Link to="/requests">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View My Requests
                </Button>
              </Link>
              
              <Link to="/admin">
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Travel Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
