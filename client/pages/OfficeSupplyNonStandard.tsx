import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Paperclip } from "lucide-react";

const VENDORS = ["Staples", "Amazon", "Office Depot", "Local Vendor"];
const COST_CENTER_MASTER = ["GA-1000", "HR-1100", "IT-1200", "MK-1300"];
const GL_MASTER = ["6400", "6410", "6420"];

export default function OfficeSupplyNonStandard() {
  const [form, setForm] = useState({
    partNumber: "",
    description: "",
    quantity: 1,
    unitPrice: "",
    additionalFee: "",
    link: "",
    vendor: "",
    costCenter: "",
    glAccount: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const total = useMemo(() => {
    const qty = Number(form.quantity || 0);
    const price = Number(form.unitPrice || 0);
    const fee = Number(form.additionalFee || 0);
    return Math.max(0, qty * price + fee);
  }, [form.quantity, form.unitPrice, form.additionalFee]);

  const validCostCenter = !form.costCenter || COST_CENTER_MASTER.includes(form.costCenter);
  const validGL = !form.glAccount || GL_MASTER.includes(form.glAccount);
  const canSubmit = !!form.description && !!form.vendor && !!form.glAccount && !!form.costCenter && attachments.length > 0 && validCostCenter && validGL;

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    setAttachments((prev) => [...prev, ...Array.from(files)]);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    alert(`Non-standard order submitted. Total: $${total.toFixed(2)} with ${attachments.length} attachment(s).`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-primary text-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold">Office Supply — Non-Standard Order</h1>
        <p className="text-primary/20">Provide details and attachment for authorization</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
          <CardDescription>Fields marked * are required</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Part Number (optional)</Label>
              <Input value={form.partNumber} onChange={(e) => setForm({ ...form, partNumber: e.target.value })} />
            </div>
            <div>
              <Label>Vendor *</Label>
              <Select value={form.vendor} onValueChange={(v) => setForm({ ...form, vendor: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {VENDORS.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Item Description *</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the item" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Quantity *</Label>
              <Input type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value || 1) })} />
            </div>
            <div>
              <Label>Unit Price *</Label>
              <Input type="number" min={0} step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} />
            </div>
            <div>
              <Label>Additional Fee</Label>
              <Input type="number" min={0} step="0.01" value={form.additionalFee} onChange={(e) => setForm({ ...form, additionalFee: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>External Link</Label>
            <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Cost Center *</Label>
              <Input value={form.costCenter} onChange={(e) => setForm({ ...form, costCenter: e.target.value })} className={!validCostCenter ? "border-destructive" : ""} placeholder="e.g. GA-1000" />
              {!validCostCenter && <p className="text-xs text-destructive mt-1">Invalid cost center</p>}
            </div>
            <div>
              <Label>GL Account *</Label>
              <Input value={form.glAccount} onChange={(e) => setForm({ ...form, glAccount: e.target.value })} className={!validGL ? "border-destructive" : ""} placeholder="e.g. 6400" />
              {!validGL && <p className="text-xs text-destructive mt-1">Invalid GL account</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Attachments (required) *</Label>
            <Input type="file" multiple onChange={(e) => onFiles(e.target.files)} />
            <div className="text-sm text-gray-600">Attach approval documents (PDF, email, etc.)</div>
            {attachments.length > 0 && (
              <ul className="text-sm list-disc ml-5 mt-1">
                {attachments.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2"><Paperclip className="h-4 w-4" />{f.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-lg font-semibold">Order Total: ${total.toFixed(2)}</div>
            <Button disabled={!canSubmit} onClick={handleSubmit}><CheckCircle2 className="h-4 w-4 mr-2" />Submit Order</Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-yellow-800 text-sm">Reminder: Do not combine non-standard items with standard items in a single request.</p>
      </div>
    </div>
  );
}
