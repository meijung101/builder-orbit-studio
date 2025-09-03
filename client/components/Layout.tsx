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
  ClipboardList
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: FileText },
  { name: "New Request", href: "/request/new", icon: PlaneTakeoff },
  { name: "My Requests", href: "/requests", icon: FileText },
  { name: "Approvals", href: "/approvals", icon: CheckSquare },
  { name: "Inbox", href: "/ga/requests", icon: ClipboardList },
  { name: "Master Data", href: "/admin", icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/request/select") {
      setRequestDialogOpen(true);
    }
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
                const isActive = location.pathname === item.href;
                const isNewRequest = item.name === "New Request";
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
                        to={item.href}
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center border-b">
            <h1 className="text-2xl font-bold text-primary">HMGMA BPMS</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                const isNewRequest = item.name === "New Request";
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
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* User section */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                JD
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-gray-500">Manager</p>
              </div>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
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
