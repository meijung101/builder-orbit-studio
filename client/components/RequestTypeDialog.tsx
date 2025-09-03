import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileWarning2, CarFront, PlaneTakeoff, Receipt, HeartPulse, Mail, Phone } from "lucide-react";

export type RequestTypeKey =
  | "accident"
  | "business-car"
  | "trip-request"
  | "expense"
  | "bereavement"
  | "mail"
  | "cellphone";

interface RequestTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RequestTypeDialog({ open, onOpenChange }: RequestTypeDialogProps) {
  const navigate = useNavigate();

  const items = useMemo(
    () => [
      { key: "accident", label: "Accident Incident Report", icon: FileWarning2, to: "/request/accident" },
      { key: "business-car", label: "Business Car", icon: CarFront, to: "/request/business-car" },
      { key: "trip-request", label: "Trip Request", icon: PlaneTakeoff, to: "/request/new" },
      { key: "expense", label: "Expense Reimbursement", icon: Receipt, to: "/request/expense" },
      { key: "bereavement", label: "Bereavement", icon: HeartPulse, to: "/request/bereavement" },
      { key: "mail", label: "Mail", icon: Mail, to: "/request/mail" },
      { key: "cellphone", label: "Cellphone", icon: Phone, to: "/request/cellphone" },
    ],
    []
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Request Type</DialogTitle>
          <DialogDescription>Choose what you want to create</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map(({ key, label, icon: Icon, to }) => (
            <button
              key={key}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 text-left transition hover:border-primary hover:bg-primary/5"
              )}
              onClick={() => {
                onOpenChange(false);
                navigate(to);
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-500">Start a new {label.toLowerCase()}</div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
