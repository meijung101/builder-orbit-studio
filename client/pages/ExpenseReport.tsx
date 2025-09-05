import React, { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, Plus, Trash2, Upload, Download, Search, Check, AlertCircle } from "lucide-react";

const reimbursementTypes = ["Travel", "General", "General with WBS/FUND"] as const;
const expenseTypes = [
  "Cell/Wireless",
  "Transportation",
  "Car Rental",
  "Fuel",
  "Toll",
  "Parking",
  "Lodging",
  "Air",
  "Baggage",
  "Passport/Visa",
  "Misc."
] as const;
const carTypes = ["Manager Lease Car", "Personal Car"] as const;
const costCenters = ["CC-001", "CC-002", "CC-003", "CC-004", "CC-005"] as const;

const locationPerDiemRates: Record<string, number> = {
  "New York, NY": 79,
  "San Francisco, CA": 72,
  "Los Angeles, CA": 68,
  "Chicago, IL": 65,
  "Boston, MA": 70,
  "Washington, DC": 76,
  "Seattle, WA": 67,
  "Austin, TX": 58,
  "Denver, CO": 61,
  "Miami, FL": 64,
  "Atlanta, GA": 59,
  "Phoenix, AZ": 55,
  "Portland, OR": 63,
  "International - London": 98,
  "International - Paris": 95,
  "International - Tokyo": 105,
  "International - Sydney": 92,
  "Other Domestic": 50,
  "Other International": 74,
};

const mealTypes = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Business Meeting Meal",
  "Client Entertainment",
  "Team Building Meal",
  "Working Lunch",
  "Conference Meal",
] as const;

const ExpenseReport: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    reimbursementType: "",
    subject: "",
    wbsNumber: "",
    supportDocument: "",
    metaProId: "EMP-12345",
    name: "John Doe",
    title: "Senior Manager",
    department: "Engineering",
    costCenter: "",
    travelApprovalDate: "",
    purpose: "",
    travelDoc: "",
    location: "",
    sapBudget: "",
    wbsFund: "",
    perDiemRows: [] as any[],
    expenseDetailRows: [] as any[],
    mileageRows: [] as any[],
    businessMealRows: [] as any[],
    uploadedDocuments: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [total, setTotal] = useState(0);

  const steps = [
    { id: 1, name: "Request Details", icon: "📋" },
    { id: 2, name: "Payee Information", icon: "👤" },
    { id: 3, name: "Expense Details", icon: "💰" },
    { id: 4, name: "Review & Submit", icon: "✅" },
  ];

  useEffect(() => {
    let sum = 0;
    (formData.perDiemRows || []).forEach((row: any) => { sum += parseFloat(row.subTotal || 0); });
    (formData.expenseDetailRows || []).forEach((row: any) => { sum += parseFloat(row.amount || 0); });
    (formData.mileageRows || []).forEach((row: any) => { sum += parseFloat(row.amount || 0); });
    (formData.businessMealRows || []).forEach((row: any) => { sum += parseFloat(row.amount || 0); });
    setTotal(sum);
  }, [formData.perDiemRows, formData.expenseDetailRows, formData.mileageRows, formData.businessMealRows]);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.reimbursementType) newErrors.reimbursementType = "Reimbursement type is required";
      if (!formData.subject) newErrors.subject = "Subject is required";
      if ((formData.reimbursementType || "").includes("WBS") && !formData.wbsNumber) newErrors.wbsNumber = "WBS# is required for this reimbursement type";
    }
    if (step === 2) {
      if (!formData.costCenter) newErrors.costCenter = "Cost center is required";
      if (formData.reimbursementType === "Travel") {
        if (!formData.purpose) newErrors.purpose = "Purpose is required for travel";
        if (!formData.location) newErrors.location = "Location is required for travel";
      }
      if (formData.reimbursementType === "General with WBS/FUND" && !formData.wbsFund) newErrors.wbsFund = "WBS/FUND is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep(currentStep)) setCurrentStep((p) => Math.min(p + 1, steps.length)); };
  const handlePrevious = () => setCurrentStep((p) => Math.max(p - 1, 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev: any) => ({ ...prev, [name]: type === "checkbox" ? (e.target as any).checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addPerDiemRow = () => setFormData((prev: any) => ({ ...prev, perDiemRows: [...prev.perDiemRows, { lineNumber: prev.perDiemRows.length + 1, startDate: "", endDate: "", location: "", perDiem: 0, subTotal: 0 }] }));
  const addExpenseDetailRow = () => setFormData((prev: any) => ({ ...prev, expenseDetailRows: [...prev.expenseDetailRows, { lineNumber: prev.expenseDetailRows.length + 1, date: "", expenseType: "", item: "", amount: 0, description: "" }] }));
  const addMileageRow = () => setFormData((prev: any) => ({ ...prev, mileageRows: [...prev.mileageRows, { lineNumber: prev.mileageRows.length + 1, date: "", carType: "", distance: 0, amount: 0, description: "" }] }));
  const addBusinessMealRow = () => setFormData((prev: any) => ({ ...prev, businessMealRows: [...prev.businessMealRows, { lineNumber: prev.businessMealRows.length + 1, date: "", mealType: "", location: "", participants: 0, amount: 0, description: "" }] }));

  const updateRow = (rowType: "perDiemRows" | "expenseDetailRows" | "mileageRows" | "businessMealRows", index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const next = { ...prev };
      next[rowType][index][field] = value;
      if (rowType === "perDiemRows") {
        const row = next[rowType][index];
        if (field === "location" && value) row.perDiem = locationPerDiemRates[value] || 50;
        if (row.startDate && row.endDate && row.perDiem) {
          const start = new Date(row.startDate) as any;
          const end = new Date(row.endDate) as any;
          const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          row.subTotal = days * parseFloat(row.perDiem || 0);
        }
      } else if (rowType === "mileageRows" && field === "distance") {
        const row = next[rowType][index];
        const distance = parseFloat(value) || 0;
        if (row.carType === "Manager Lease Car") row.amount = (distance / 22 * 3.32).toFixed(2);
        else if (row.carType === "Personal Car") row.amount = (distance * 0.655).toFixed(2);
      }
      return next;
    });
  };

  const deleteRow = (rowType: "perDiemRows" | "expenseDetailRows" | "mileageRows" | "businessMealRows", index: number) => {
    setFormData((prev: any) => {
      const next = { ...prev };
      next[rowType] = next[rowType].filter((_: any, i: number) => i !== index);
      next[rowType].forEach((row: any, i: number) => { row.lineNumber = i + 1; });
      return next;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev: any) => ({ ...prev, uploadedDocuments: [...prev.uploadedDocuments, ...files.map((f: any) => f.name)] }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Request Details</h3>
      <div>
        <label className="block text-sm font-medium mb-2">Reimbursement Type <span className="text-red-500">*</span></label>
        <select name="reimbursementType" value={formData.reimbursementType} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.reimbursementType ? 'border-red-500' : 'border-gray-300'}`}>
          <option value="">Select type...</option>
          {reimbursementTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
        </select>
        {errors.reimbursementType && (<p className="text-red-500 text-sm mt-1">{errors.reimbursementType}</p>)}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Subject <span className="text-red-500">*</span></label>
        <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.subject ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter subject..." />
        {errors.subject && (<p className="text-red-500 text-sm mt-1">{errors.subject}</p>)}
      </div>
      {String(formData.reimbursementType || "").includes("WBS") && (
        <div>
          <label className="block text-sm font-medium mb-2">WBS# <span className="text-red-500">*</span></label>
          <input type="text" name="wbsNumber" value={formData.wbsNumber} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.wbsNumber ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter WBS number..." />
          {errors.wbsNumber && (<p className="text-red-500 text-sm mt-1">{errors.wbsNumber}</p>)}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-2">Support Document</label>
        <div className="flex gap-2">
          <select name="supportDocument" value={formData.supportDocument} onChange={handleInputChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select document...</option>
            <option value="travel-request-001">Travel Request #001</option>
            <option value="pool-car-request-002">Pool Car Request #002</option>
          </select>
          <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors" title="Search"><Search className="w-4 h-4" /></button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Upload Additional Documents</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer text-primary hover:text-primary/80">Click to upload or drag and drop</label>
          <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
        </div>
        {formData.uploadedDocuments.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium">Uploaded files:</p>
            <ul className="text-sm text-gray-600 list-disc ml-5">
              {(formData.uploadedDocuments || []).map((doc: string, idx: number) => (<li key={idx}>{doc}</li>))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Payee Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Meta Pro ID</label>
          <input type="text" value={formData.metaProId} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input type="text" value={formData.name} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input type="text" value={formData.title} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Department</label>
          <input type="text" value={formData.department} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">Cost Center <span className="text-red-500">*</span></label>
          <select name="costCenter" value={formData.costCenter} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.costCenter ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Select cost center...</option>
            {costCenters.map((cc) => (<option key={cc} value={cc}>{cc}</option>))}
          </select>
          {errors.costCenter && (<p className="text-red-500 text-sm mt-1">{errors.costCenter}</p>)}
        </div>
      </div>

      {formData.reimbursementType === "Travel" && (
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Travel Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Travel Approval Date</label>
              <input type="date" name="travelApprovalDate" value={formData.travelApprovalDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Purpose <span className="text-red-500">*</span></label>
              <input type="text" name="purpose" value={formData.purpose} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.purpose ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter purpose..." />
              {errors.purpose && (<p className="text-red-500 text-sm mt-1">{errors.purpose}</p>)}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Travel Doc</label>
              <input type="text" name="travelDoc" value={formData.travelDoc} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter travel doc..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location <span className="text-red-500">*</span></label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.location ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter location..." />
              {errors.location && (<p className="text-red-500 text-sm mt-1">{errors.location}</p>)}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SAP Budget</label>
              <input type="number" name="sapBudget" value={formData.sapBudget} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="0.00" step="0.01" />
            </div>
          </div>
        </div>
      )}

      {formData.reimbursementType === "General with WBS/FUND" && (
        <div>
          <label className="block text-sm font-medium mb-2">WBS/FUND <span className="text-red-500">*</span></label>
          <input type="text" name="wbsFund" value={formData.wbsFund} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.wbsFund ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter WBS/FUND..." />
          {errors.wbsFund && (<p className="text-red-500 text-sm mt-1">{errors.wbsFund}</p>)}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold mb-4">Expense Details</h3>

      {formData.reimbursementType === "Travel" && (
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Per Diem</h4>
            <button onClick={addPerDiemRow} className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>
          {(formData.perDiemRows || []).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Line#</th>
                    <th className="text-left py-2">Start Date</th>
                    <th className="text-left py-2">End Date</th>
                    <th className="text-left py-2">Location</th>
                    <th className="text-left py-2">Per Diem Rate</th>
                    <th className="text-left py-2">Sub Total</th>
                    <th className="text-left py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {(formData.perDiemRows || []).map((row: any, idx: number) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2">{row.lineNumber}</td>
                      <td><input type="date" value={row.startDate} onChange={(e) => updateRow("perDiemRows", idx, "startDate", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                      <td><input type="date" value={row.endDate} onChange={(e) => updateRow("perDiemRows", idx, "endDate", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                      <td>
                        <select value={row.location} onChange={(e) => updateRow("perDiemRows", idx, "location", e.target.value)} className="w-full px-2 py-1 border rounded">
                          <option value="">Select location...</option>
                          {Object.keys(locationPerDiemRates).map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
                        </select>
                      </td>
                      <td>${row.perDiem?.toFixed ? row.perDiem.toFixed(2) : "0.00"}</td>
                      <td>${row.subTotal?.toFixed ? row.subTotal.toFixed(2) : "0.00"}</td>
                      <td>
                        <button onClick={() => deleteRow("perDiemRows", idx)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No per diem entries. Click "Add Row" to start.</p>
          )}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Expense Details</h4>
          <button onClick={addExpenseDetailRow} className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Row
          </button>
        </div>
        {(formData.expenseDetailRows || []).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Line#</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Expense Type</th>
                  {formData.reimbursementType === "Travel" && <th className="text-left py-2">Item</th>}
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2"></th>
                </tr>
              </thead>
              <tbody>
                {(formData.expenseDetailRows || []).map((row: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{row.lineNumber}</td>
                    <td><input type="date" value={row.date} onChange={(e) => updateRow("expenseDetailRows", idx, "date", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                    <td>
                      <select value={row.expenseType} onChange={(e) => updateRow("expenseDetailRows", idx, "expenseType", e.target.value)} className="w-full px-2 py-1 border rounded">
                        <option value="">Select...</option>
                        {expenseTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                      </select>
                    </td>
                    {formData.reimbursementType === "Travel" && (
                      <td><input type="text" value={row.item} onChange={(e) => updateRow("expenseDetailRows", idx, "item", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                    )}
                    <td><input type="number" value={row.amount} onChange={(e) => updateRow("expenseDetailRows", idx, "amount", e.target.value)} className="w-24 px-2 py-1 border rounded" placeholder="0.00" step="0.01" /></td>
                    <td><input type="text" value={row.description} onChange={(e) => updateRow("expenseDetailRows", idx, "description", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                    <td><button onClick={() => deleteRow("expenseDetailRows", idx)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No expense entries. Click "Add Row" to start.</p>
        )}
      </div>

      {formData.reimbursementType === "Travel" && (
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Mileage</h4>
            <button onClick={addMileageRow} className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>
          {(formData.mileageRows || []).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Line#</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Car Type</th>
                    <th className="text-left py-2">Distance (mi)</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-left py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {(formData.mileageRows || []).map((row: any, idx: number) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2">{row.lineNumber}</td>
                      <td><input type="date" value={row.date} onChange={(e) => updateRow("mileageRows", idx, "date", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                      <td>
                        <select value={row.carType} onChange={(e) => updateRow("mileageRows", idx, "carType", e.target.value)} className="w-full px-2 py-1 border rounded">
                          <option value="">Select...</option>
                          {carTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                        </select>
                      </td>
                      <td><input type="number" value={row.distance} onChange={(e) => updateRow("mileageRows", idx, "distance", e.target.value)} className="w-24 px-2 py-1 border rounded" placeholder="0.00" step="0.01" /></td>
                      <td>${row.amount}</td>
                      <td><input type="text" value={row.description} onChange={(e) => updateRow("mileageRows", idx, "description", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                      <td><button onClick={() => deleteRow("mileageRows", idx)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No mileage entries. Click "Add Row" to start.</p>
          )}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Business Meals</h4>
          <button onClick={addBusinessMealRow} className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Row
          </button>
        </div>
        {(formData.businessMealRows || []).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Line#</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Meal Type</th>
                  <th className="text-left py-2">Location</th>
                  <th className="text-left py-2">Participants</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2"></th>
                </tr>
              </thead>
              <tbody>
                {(formData.businessMealRows || []).map((row: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{row.lineNumber}</td>
                    <td><input type="date" value={row.date} onChange={(e) => updateRow("businessMealRows", idx, "date", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                    <td>
                      <select value={row.mealType} onChange={(e) => updateRow("businessMealRows", idx, "mealType", e.target.value)} className="w-full px-2 py-1 border rounded">
                        <option value="">Select...</option>
                        {mealTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                      </select>
                    </td>
                    <td><input type="text" value={row.location} onChange={(e) => updateRow("businessMealRows", idx, "location", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                    <td><input type="number" value={row.participants} onChange={(e) => updateRow("businessMealRows", idx, "participants", e.target.value)} className="w-20 px-2 py-1 border rounded" /></td>
                    <td><input type="number" value={row.amount} onChange={(e) => updateRow("businessMealRows", idx, "amount", e.target.value)} className="w-24 px-2 py-1 border rounded" placeholder="0.00" step="0.01" /></td>
                    <td><input type="text" value={row.description} onChange={(e) => updateRow("businessMealRows", idx, "description", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                    <td><button onClick={() => deleteRow("businessMealRows", idx)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No business meal entries. Click "Add Row" to start.</p>
        )}
      </div>

      <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
        <div className="flex justify-between items-center">
          <span className="font-medium text-primary">Total Amount:</span>
          <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-medium mb-4">Request Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-600">Reimbursement Type:</span><span className="ml-2 font-medium">{formData.reimbursementType}</span></div>
          <div><span className="text-gray-600">Subject:</span><span className="ml-2 font-medium">{formData.subject}</span></div>
          <div><span className="text-gray-600">Employee:</span><span className="ml-2 font-medium">{formData.name}</span></div>
          <div><span className="text-gray-600">Department:</span><span className="ml-2 font-medium">{formData.department}</span></div>
          <div><span className="text-gray-600">Cost Center:</span><span className="ml-2 font-medium">{formData.costCenter}</span></div>
          {formData.reimbursementType === "Travel" && (<><div><span className="text-gray-600">Purpose:</span><span className="ml-2 font-medium">{formData.purpose}</span></div><div><span className="text-gray-600">Location:</span><span className="ml-2 font-medium">{formData.location}</span></div></>)}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-medium mb-4">Expense Summary</h4>
        <div className="space-y-2 text-sm">
          {(formData.perDiemRows || []).length > 0 && (<div className="flex justify-between"><span className="text-gray-600">Per Diem ({formData.perDiemRows.length} entries):</span><span className="font-medium">${(formData.perDiemRows || []).reduce((s: number, r: any) => s + parseFloat(r.subTotal || 0), 0).toFixed(2)}</span></div>)}
          {(formData.expenseDetailRows || []).length > 0 && (<div className="flex justify-between"><span className="text-gray-600">Expense Details ({formData.expenseDetailRows.length} entries):</span><span className="font-medium">${(formData.expenseDetailRows || []).reduce((s: number, r: any) => s + parseFloat(r.amount || 0), 0).toFixed(2)}</span></div>)}
          {(formData.mileageRows || []).length > 0 && (<div className="flex justify-between"><span className="text-gray-600">Mileage ({formData.mileageRows.length} entries):</span><span className="font-medium">${(formData.mileageRows || []).reduce((s: number, r: any) => s + parseFloat(r.amount || 0), 0).toFixed(2)}</span></div>)}
          {(formData.businessMealRows || []).length > 0 && (<div className="flex justify-between"><span className="text-gray-600">Business Meals ({formData.businessMealRows.length} entries):</span><span className="font-medium">${(formData.businessMealRows || []).reduce((s: number, r: any) => s + parseFloat(r.amount || 0), 0).toFixed(2)}</span></div>)}
          <div className="pt-4 mt-4 border-t">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-primary mb-1">Please review all information carefully</p>
            <p className="text-gray-700">Once submitted, this expense report will be sent for approval. You can download a PDF copy after submission.</p>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => alert('Form submitted successfully!')} className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">Submit Expense Report</button>
        <button onClick={() => alert('PDF download would be triggered here')} className="px-6 py-3 bg-white border text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"><Download className="w-4 h-4" /> Download PDF</button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    if (currentStep === 1) return renderStep1();
    if (currentStep === 2) return renderStep2();
    if (currentStep === 3) return renderStep3();
    if (currentStep === 4) return renderStep4();
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="border-b px-6 py-5 bg-white">
          <h1 className="text-2xl font-bold text-gray-900">Expense Report</h1>
          <p className="text-gray-600 mt-1">Submit your expense reimbursement request</p>
        </div>
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center ${idx !== steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-600'}`}>
                    {currentStep > step.id ? (<Check className="w-5 h-5" />) : (<span>{step.icon}</span>)}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${currentStep >= step.id ? 'text-primary font-medium' : 'text-gray-500'}`}>Step {step.id}</p>
                    <p className={`text-xs ${currentStep >= step.id ? 'text-gray-700' : 'text-gray-400'}`}>{step.name}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && (<ChevronRight className={`w-5 h-5 mx-4 ${currentStep > step.id ? 'text-primary' : 'text-gray-300'}`} />)}
              </div>
            ))}
          </div>
        </div>
        <div className="p-6">{renderCurrentStep()}</div>
        <div className="px-6 pb-6">
          <div className="flex justify-between">
            <button onClick={handlePrevious} disabled={currentStep === 1} className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {currentStep < steps.length && (
              <button onClick={handleNext} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseReport;
