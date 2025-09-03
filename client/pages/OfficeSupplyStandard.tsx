import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, CheckCircle2 } from "lucide-react";

type Vendor = "Staples" | "Amazon";

interface CatalogItem {
  id: string;
  partNumber: string;
  vendor: Vendor;
  description: string;
  unit: string;
  unitPrice: number;
  url: string;
}

const CATALOG: CatalogItem[] = [
  { id: "ST-1001", partNumber: "ST-1001", vendor: "Staples", description: "Copy Paper A4 500 sheets", unit: "Ream", unitPrice: 6.5, url: "https://www.staples.com" },
  { id: "AM-2002", partNumber: "AM-2002", vendor: "Amazon", description: "Ballpoint Pens Black 12-pack", unit: "Pack", unitPrice: 4.99, url: "https://www.amazon.com" },
  { id: "ST-3003", partNumber: "ST-3003", vendor: "Staples", description: "Desk Organizer Set", unit: "Set", unitPrice: 19.99, url: "https://www.staples.com" },
  { id: "AM-4004", partNumber: "AM-4004", vendor: "Amazon", description: "Sticky Notes 12-pack", unit: "Pack", unitPrice: 7.49, url: "https://www.amazon.com" },
];

const COST_CENTER_GA = "GA-1000";
const GL_OFFICE_SUPPLY = "6400";

interface LineItem {
  id: string;
  itemId: string;
  partNumber: string;
  description: string;
  vendor: Vendor;
  unit: string;
  unitPrice: number;
  qty: number;
  url?: string;
}

export default function OfficeSupplyStandard() {
  const [query, setQuery] = useState("");
  const [lines, setLines] = useState<LineItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");

  const options: ComboboxOption[] = useMemo(() =>
    CATALOG.map((c) => ({ value: c.id, label: `${c.partNumber} — ${c.description} (${c.vendor})` })),
  []);

  const filtered = useMemo(() => {
    if (!query) return CATALOG;
    const q = query.toLowerCase();
    return CATALOG.filter((c) => c.partNumber.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [query]);

  const addSelected = (id: string) => {
    const item = CATALOG.find((c) => c.id === id);
    if (!item) return;
    setLines((prev) => [
      ...prev,
      {
        id: `${id}-${Date.now()}`,
        itemId: id,
        partNumber: item.partNumber,
        description: item.description,
        vendor: item.vendor,
        unit: item.unit,
        unitPrice: item.unitPrice,
        qty: 1,
        url: item.url,
      },
    ]);
    setSelectedItem("");
  };

  const updateQty = (lineId: string, qty: number) => {
    setLines((prev) => prev.map((l) => (l.id === lineId ? { ...l, qty: Math.max(1, qty || 1) } : l)));
  };

  const removeLine = (lineId: string) => setLines((prev) => prev.filter((l) => l.id !== lineId));

  const orderTotal = lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);

  const handleSubmit = () => {
    alert(`Standard order submitted. Items: ${lines.length}, Total: $${orderTotal.toFixed(2)}\nCost Center: ${COST_CENTER_GA}, GL: ${GL_OFFICE_SUPPLY}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-primary text-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold">Office Supply — Standard Order</h1>
        <p className="text-primary/20">Catalog items only (cannot mix with non-standard)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Catalog</CardTitle>
          <CardDescription>Search part number or description. Includes Staples and Amazon.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-9" placeholder="Search by part number or description" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Select Part Number</Label>
              <Combobox
                options={options}
                value={selectedItem}
                onValueChange={(val) => {
                  setSelectedItem(val);
                  if (val) addSelected(val);
                }}
                placeholder="Type to search parts"
              />
            </div>
          </div>

          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm text-gray-600">Results</p>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filtered.map((c) => (
                <button key={c.id} className="text-left border rounded-md p-3 hover:bg-white" onClick={() => addSelected(c.id)}>
                  <div className="font-medium text-gray-900">{c.partNumber} <Badge variant="outline" className="ml-2">{c.vendor}</Badge></div>
                  <div className="text-sm text-gray-600 truncate" title={c.description}>{c.description}</div>
                  <div className="text-sm text-gray-500">{c.unit} • ${c.unitPrice.toFixed(2)} <a className="inline-flex items-center text-primary ml-2" href={c.url} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-1" />Link</a></div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>GA Cost Center and GL are auto-populated.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Cost Center</Label>
              <Input value={COST_CENTER_GA} disabled />
            </div>
            <div>
              <Label>GL Account</Label>
              <Input value={GL_OFFICE_SUPPLY} disabled />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part #</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-mono">{l.partNumber}</TableCell>
                  <TableCell className="max-w-xs truncate" title={l.description}>{l.description}</TableCell>
                  <TableCell>{l.vendor}</TableCell>
                  <TableCell>{l.unit}</TableCell>
                  <TableCell>${l.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Input type="number" min={1} value={l.qty} onChange={(e) => updateQty(l.id, Number(e.target.value))} className="w-24" />
                  </TableCell>
                  <TableCell>${(l.qty * l.unitPrice).toFixed(2)}</TableCell>
                  <TableCell>
                    <a className="inline-flex items-center text-primary mr-3" href={l.url} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4 mr-1" />Details</a>
                    <Button variant="outline" size="sm" onClick={() => removeLine(l.id)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
              {lines.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500">No items added.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">Lines: {lines.length}</div>
            <div className="text-lg font-semibold">Order Total: ${orderTotal.toFixed(2)}</div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setLines([])}>Clear</Button>
            <Button disabled={lines.length === 0} onClick={handleSubmit}><CheckCircle2 className="h-4 w-4 mr-2" />Submit Order</Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-yellow-800 text-sm">Reminder: Mixing standard and non-standard items is not allowed. Submit separate requests if needed.</p>
      </div>
    </div>
  );
}
