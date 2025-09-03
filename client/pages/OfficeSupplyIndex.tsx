import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Package, Boxes } from "lucide-react";

export default function OfficeSupplyIndex() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-primary text-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Office Supply Request</h1>
            <p className="text-primary/20">Choose Standard or Non-Standard order</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Boxes className="h-5 w-5 text-primary" /> Standard Order</CardTitle>
            <CardDescription>Pre-approved catalog (Staples & Amazon)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Select items from maintained catalog. GA cost center and GL are auto-populated.</p>
            <Link to="/request/office-supply/standard"><Button>Start Standard Order</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Non-Standard Order</CardTitle>
            <CardDescription>Items outside the catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Provide details and vendor. Attachment is required for authorization.</p>
            <Link to="/request/office-supply/non-standard"><Button variant="outline">Start Non-Standard Order</Button></Link>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
        <p className="text-sm text-primary">Note: Standard and Non-Standard orders are separate and cannot be mixed in one request.</p>
      </div>
    </div>
  );
}
