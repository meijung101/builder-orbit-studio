import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import RequestTypeDialog from "@/components/RequestTypeDialog";
import {
  PlaneTakeoff,
  FileText,
  CheckSquare,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  ClipboardList,
  Bell,
  ChevronDown
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

type NavItem = { name: string; href?: string; icon: any; children?: { name: string; href: string }[] };
const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: FileText },
  { name: "New Request", href: "/request/new", icon: PlaneTakeoff },
  { name: "My Requests", href: "/requests", icon: FileText, children: [
    { name: "Pending Approval", href: "/requests/pending" },
    { name: "Approved/Confirmed", href: "/requests/approved" },
    { name: "Returned", href: "/requests/returned" },
    { name: "Draft", href: "/requests/draft" },
  ] },
  { name: "Approvals", href: "/approvals", icon: CheckSquare },
  { name: "Inbox - GA", href: "/ga/requests", icon: ClipboardList, children: [
    { name: "Business Card", href: "/ga/requests/business-card" },
    { name: "Office Supply", href: "/ga/requests/office-supply" },
    { name: "Trip", href: "/ga/requests/trip" },
    { name: "Mail", href: "/ga/requests/mail" },
    { name: "Expense Reimbursement", href: "/ga/requests/expense" },
  ] },
  { name: "Master Data", href: "/admin", icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [myReqOpen, setMyReqOpen] = useState(false);
  const [gaOpen, setGaOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/request/select") {
      setRequestDialogOpen(true);
    }
    setMyReqOpen(location.pathname.startsWith("/requests"));
    setGaOpen(location.pathname.startsWith("/ga/requests"));
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <h1 className="text-xl font-bold text-primary">HMGMA BPMS</h1>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="mt-6 px-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = item.href ? location.pathname === item.href : false;
                const isNewRequest = item.name === "New Request";
                const isInbox = item.name === "Inbox - GA";
                const hasChildren = !!item.children?.length;
                if (hasChildren) {
                  const open = item.name === "My Requests" ? myReqOpen : item.name === "Inbox - GA" ? gaOpen : false;
                  const isSectionActive = item.name === "My Requests" ? location.pathname.startsWith("/requests") : location.pathname.startsWith("/ga/requests");
                  const toggle = () => {
                    if (item.name === "My Requests") setMyReqOpen((v) => !v);
                    else if (item.name === "Inbox - GA") setGaOpen((v) => !v);
                  };
                  return (
                    <li key={item.name} className="space-y-1">
                      <button
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isSectionActive
                            ? "bg-primary text-primary-foreground"
                            : "text-gray-700 hover:bg-gray-100",
                        )}
                        onClick={toggle}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                        {isInbox && <Bell className="h-4 w-4 ml-auto" />}
                        <ChevronDown className={cn("h-4 w-4 ml-2 transition-transform", open ? "rotate-180" : "rotate-0")} />
                      </button>
                      {open && (
                        <ul className="ml-8 space-y-1">
                          {item.children!.map((child) => (
                            <li key={child.name}>
                              <Link
                                to={child.href}
                                className={cn(
                                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                                  location.pathname === child.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-700 hover:bg-gray-100",
                                )}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }
                return (
                  <li key={item.name}>
                    {isNewRequest ? (
                      <button
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          "text-gray-700 hover:bg-gray-100"
                        )}
                        onClick={() => {
                          setRequestDialogOpen(true);
                          setSidebarOpen(false);
                        }}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        to={item.href!}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                        {isInbox && <Bell className="h-4 w-4 ml-auto" />}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={cn(sidebarCollapsed ? "hidden" : "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col") }>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center border-b">
            <h1 className="text-2xl font-bold text-primary">HMGMA BPMS</h1>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => setSidebarCollapsed((v) => !v)}
              title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
              aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = item.href ? location.pathname === item.href : false;
                const isNewRequest = item.name === "New Request";
                const isInbox = item.name === "Inbox - GA";
                const hasChildren = !!item.children?.length;
                if (hasChildren) {
                  const open = item.name === "My Requests" ? myReqOpen : item.name === "Inbox - GA" ? gaOpen : false;
                  const isSectionActive = item.name === "My Requests" ? location.pathname.startsWith("/requests") : location.pathname.startsWith("/ga/requests");
                  const toggle = () => {
                    if (item.name === "My Requests") setMyReqOpen((v) => !v);
                    else if (item.name === "Inbox - GA") setGaOpen((v) => !v);
                  };
                  return (
                    <li key={item.name} className="space-y-1">
                      <button
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isSectionActive
                            ? "bg-primary text-primary-foreground"
                            : "text-gray-700 hover:bg-gray-100",
                        )}
                        onClick={toggle}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                        {isInbox && <Bell className="h-4 w-4 ml-auto" />}
                        <ChevronDown className={cn("h-4 w-4 ml-2 transition-transform", open ? "rotate-180" : "rotate-0")} />
                      </button>
                      {open && (
                        <ul className="ml-8 space-y-1">
                          {item.children!.map((child) => (
                            <li key={child.name}>
                              <Link
                                to={child.href}
                                className={cn(
                                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                                  location.pathname === child.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-700 hover:bg-gray-100",
                                )}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }
                return (
                  <li key={item.name}>
                    {isNewRequest ? (
                      <button
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          "text-gray-700 hover:bg-gray-100"
                        )}
                        onClick={() => setRequestDialogOpen(true)}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        to={item.href!}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                        {isInbox && <Bell className="h-4 w-4 ml-auto" />}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          
        </div>
      </div>

      {/* Main content */}
      <div className={cn(sidebarCollapsed ? "lg:pl-0" : "lg:pl-72") }>
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white px-4 shadow-sm lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-primary">HMGMA BPMS</h1>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        <RequestTypeDialog
          open={requestDialogOpen}
          onOpenChange={(open) => {
            setRequestDialogOpen(open);
            if (!open && location.pathname === "/request/select") {
              navigate("/");
            }
          }}
        />
      </div>
    </div>
  );
}
