import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Check,
  User,
  Route as RouteIcon,
  Plane,
  FileText,
  Send,
  DollarSign,
  Download,
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Trash2,
  Save,
  Undo,
  Car,
  Bed,
} from "lucide-react";

/*************************
 * Mock reference data
 *************************/
const mockEmployees = [
  { id: "E001", name: "John Smith", department: "Engineering", title: "Senior Engineer", costCenter: "ENG-001" },
  { id: "E002", name: "Sarah Johnson", department: "Quality", title: "QC Manager", costCenter: "QLT-014" },
  { id: "E003", name: "Priya Patel", department: "Design", title: "Product Designer", costCenter: "DSN-003" },
];

const mockLocations = [
  { id: 1, name: "New York, NY (US)", perDiem: 79 },
  { id: 2, name: "Austin, TX (US)", perDiem: 64 },
  { id: 3, name: "Seoul, South Korea", perDiem: 85 },
  { id: 4, name: "Tokyo, Japan", perDiem: 92 },
];

/*************************
 * Schemas & Types
 *************************/
const ItinerarySchema = z.object({
  id: z.number(),
  locationName: z.string().min(1, "Choose a location"),
  days: z.number().int().min(1, "At least 1 day"),
  perDiemRate: z.number().min(0),
  totalPerDiem: z.number().min(0),
});

const FlightSchema = z.object({ id: z.number(), from: z.string().optional(), to: z.string().optional(), date: z.string().optional(), flightNumber: z.string().optional() });
const HotelSchema = z.object({ id: z.number(), name: z.string().optional(), checkIn: z.string().optional(), checkOut: z.string().optional() });
const CarSchema = z.object({ id: z.number(), pickup: z.string().optional(), dropoff: z.string().optional(), date: z.string().optional(), company: z.string().optional() });

const TravelerSchema = z.object({
  id: z.number(),
  metaProId: z.string().optional(),
  name: z.string().min(1, "Required"),
  department: z.string().optional().default(""),
  title: z.string().optional().default(""),
  passportName: z.string().min(1, "Required"),
  dob: z.string().min(1, "Required"),
  travelStartDate: z.string().optional().default(""),
  travelEndDate: z.string().optional().default(""),
  totalDays: z.number().optional().default(0),
  locations: z.array(ItinerarySchema).optional().default([]),
  costCenter: z.string().optional().default(""),
  wbs: z.string().optional().default(""),
  totalPerDiem: z.number().optional().default(0),
  notes: z.string().optional().default(""),
  flights: z.array(FlightSchema).optional().default([]),
  hotels: z.array(HotelSchema).optional().default([]),
  rentalCars: z.array(CarSchema).optional().default([]),
});

const TripSchema = z.object({
  type: z.string().min(1, "Trip type is required"),
  tripName: z.string().min(1, "Trip name is required"),
  purpose: z.string().min(1, "Purpose is required"),
  tripDetails: z.string().min(1, "Trip details are required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  destination: z.string().min(1, "Destination required"),
  isDomestic: z.boolean().optional(),
  isInternational: z.boolean().optional(),
  numberOfTravelers: z.number().int().min(1).optional().default(1),
  estimatedCost: z.number().min(0).optional().default(0),
  documentNumber: z.string().optional().default(""),
  status: z.string().optional().default("draft"),
  approver: z.string().min(1, "Approver required"),
  wbs: z.string().optional().default(""),
});

type TripForm = z.infer<typeof TripSchema>;
export type Traveler = z.infer<typeof TravelerSchema>;
export type Itinerary = z.infer<typeof ItinerarySchema>;

/*************************
 * Utilities
 *************************/
const money = (n: number) => `$${Number(n || 0).toLocaleString()}`;
const uid = () => Date.now() + Math.floor(Math.random() * 1000);

// Ensure any traveler-like object has required array properties
const normalizeTraveler = (t?: Partial<Traveler>): Traveler => ({
  id: t?.id ?? uid(),
  metaProId: t?.metaProId ?? "",
  name: t?.name ?? "",
  department: t?.department ?? "",
  title: t?.title ?? "",
  passportName: t?.passportName ?? "",
  dob: t?.dob ?? "",
  travelStartDate: t?.travelStartDate ?? "",
  travelEndDate: t?.travelEndDate ?? "",
  totalDays: t?.totalDays ?? 0,
  locations: (t?.locations ?? []) as Itinerary[],
  costCenter: t?.costCenter ?? "",
  wbs: t?.wbs ?? "",
  totalPerDiem: t?.totalPerDiem ?? 0,
  notes: t?.notes ?? "",
  flights: (t?.flights ?? []) as any[],
  hotels: (t?.hotels ?? []) as any[],
  rentalCars: (t?.rentalCars ?? []) as any[],
});

/*************************
 * Simple Field helper
 *************************/
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <div className="mb-1 text-sm font-medium text-gray-800">{label}</div>
    {children}
  </label>
);

/*************************
 * TripDetails Step (Trip Overview tab)
 *************************/
const TripDetails = ({ methods, flightHotelDetails, setFlightHotelDetails }: { methods: ReturnType<typeof useForm<TripForm>>; flightHotelDetails: any[]; setFlightHotelDetails: (d:any[])=>void }) => {
  const { register, formState: { errors }, watch, setValue } = methods;

  useEffect(() => {
    const type = watch("type");
    const current = methods.getValues().documentNumber;
    if (!current && type) {
      const prefix = type === 'general' ? 'BIZ' : 'PRJ';
      const number = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
      setValue('documentNumber', `${prefix}-${number}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("type")]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Trip Type">
        <select className="w-full border rounded p-2" {...register("type")}> 
          <option value="">Select trip type</option>
          <option value="general">General Business Trip</option>
          <option value="project">Project Trip</option>
        </select>
      </Field>

      <Field label="Trip Name">
        <input className="w-full border rounded p-2" {...register("tripName")} placeholder="E.g., Q4 APAC Customer Visits" />
      </Field>

      <Field label="Purpose">
        <input className="w-full border rounded p-2" {...register("purpose")} placeholder="E.g., Install & training" />
      </Field>

      <Field label="Destination">
        <input className="w-full border rounded p-2" {...register("destination")} placeholder="City, Country" />
      </Field>

      <Field label="Trip Details">
        <textarea className="w-full border rounded p-2" {...register("tripDetails")} rows={3} />
      </Field>

      <Field label="Start Date">
        <input className="w-full border rounded p-2" type="date" {...register("startDate")} />
      </Field>

      <Field label="End Date">
        <input className="w-full border rounded p-2" type="date" {...register("endDate")} />
      </Field>

      <Field label="Estimated Total Cost">
        <input className="w-full border rounded p-2" type="number" step="0.01" {...register("estimatedCost", { valueAsNumber: true })} />
      </Field>

      <div className="md:col-span-2 flex gap-4 items-center">
        <label className="flex items-center gap-2"><input type="checkbox" {...register('isDomestic')} /> Domestic</label>
        <label className="flex items-center gap-2"><input type="checkbox" {...register('isInternational')} /> International</label>
        <div className="ml-auto text-sm text-gray-600">Document #: <strong>{methods.getValues().documentNumber}</strong></div>
      </div>

      <Field label="Approver">
        <input className="w-full border rounded p-2" {...register("approver")} placeholder="Approver name" />
      </Field>

      <Field label="WBS / Project Code">
        <input className="w-full border rounded p-2" {...register("wbs")} placeholder="Optional" />
      </Field>

      <div className="md:col-span-2 border rounded p-3 bg-white">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold">Travel Bookings (optional)</div>
          <button onClick={() => setFlightHotelDetails([...flightHotelDetails, { id: uid(), type: 'flight', departureDate: '', departureTime: '', departureCity: '', arrivalDate: '', arrivalTime: '', arrivalCity: '', flightNumber: '' }])} className="px-2 py-1 bg-primary text-white rounded text-sm">Add Entry</button>
        </div>
        <div className="space-y-3">
          {flightHotelDetails.map((d, idx) => (
            <div key={d.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center border rounded p-2">
              <select value={d.type} onChange={(e) => { const next = [...flightHotelDetails]; next[idx].type = e.target.value; setFlightHotelDetails(next); }} className="border p-2 rounded md:col-span-1">
                <option value="flight">Flight</option>
                <option value="hotel">Hotel</option>
              </select>
              <input type="date" value={d.departureDate} onChange={(e) => { const next = [...flightHotelDetails]; next[idx].departureDate = e.target.value; setFlightHotelDetails(next); }} className="border p-2 rounded md:col-span-1" />
              <input type="time" value={d.departureTime} onChange={(e) => { const next = [...flightHotelDetails]; next[idx].departureTime = e.target.value; setFlightHotelDetails(next); }} className="border p-2 rounded md:col-span-1" />
              <input type="text" value={d.departureCity} onChange={(e) => { const next = [...flightHotelDetails]; next[idx].departureCity = e.target.value; setFlightHotelDetails(next); }} placeholder="From" className="border p-2 rounded md:col-span-1" />
              <input type="text" value={d.flightNumber} onChange={(e) => { const next = [...flightHotelDetails]; next[idx].flightNumber = e.target.value; setFlightHotelDetails(next); }} placeholder="Flight# / Hotel" className="border p-2 rounded md:col-span-1" />
              <button onClick={() => { setFlightHotelDetails(flightHotelDetails.filter((_, i) => i !== idx)); }} className="text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 bg-primary/10 border border-primary/20 text-primary rounded p-3 text-sm">
        <strong>Note:</strong> Individual travelers can still have different travel dates and itineraries in the Travelers step.
      </div>
    </div>
  );
};

/*************************
 * Traveler Form (per traveler)
 *************************/
const TravelerFormComponent: React.FC<{ traveler?: Traveler; onChange: (t: Traveler) => void; onRemove?: () => void }> = ({ traveler, onChange, onRemove }) => {
  if (!traveler) return <div className="p-6 bg-white border rounded">No traveler selected</div>;

  const locations = traveler.locations || [];
  const flights = traveler.flights || [];
  const hotels = traveler.hotels || [];
  const cars = traveler.rentalCars || [];

  const update = (patch: Partial<Traveler>) => onChange({ ...normalizeTraveler(traveler), ...patch });

  const [showDropdown, setShowDropdown] = useState(false);
  const filtered = traveler.name ? mockEmployees.filter(e => e.name.toLowerCase().includes(traveler.name.toLowerCase())) : [];
  const handleSelectEmployee = (emp: typeof mockEmployees[0]) => {
    update({ name: emp.name, department: emp.department, title: emp.title, costCenter: emp.costCenter });
    setShowDropdown(false);
  };

  const addLocation = () => update({ locations: [...locations, { id: uid(), locationName: "", days: 1, perDiemRate: 0, totalPerDiem: 0 }] });
  const updateLocation = (idx: number, patch: Partial<Itinerary>) => {
    const next = [...(locations || [])];
    next[idx] = { ...next[idx], ...patch } as Itinerary;
    if (!next[idx].days || next[idx].days < 0) next[idx].days = 0;
    next[idx].totalPerDiem = (next[idx].days || 0) * (next[idx].perDiemRate || 0);
    const totalPerDiem = next.reduce((s, l) => s + (l.totalPerDiem || 0), 0);
    update({ locations: next, totalPerDiem });
  };
  const removeLocation = (id: number) => {
    const next = (locations || []).filter(l => l.id !== id);
    const totalPerDiem = next.reduce((s, l) => s + (l.totalPerDiem || 0), 0);
    update({ locations: next, totalPerDiem });
  };

  const addFlight = () => update({ flights: [...flights, { id: uid(), from: "", to: "", date: "", flightNumber: "" }] });
  const updateFlight = (idx: number, patch: Partial<any>) => { const next = [...(flights || [])]; next[idx] = { ...next[idx], ...patch }; update({ flights: next }); };
  const removeFlight = (id: number) => update({ flights: (flights || []).filter(f => f.id !== id) });

  const addHotel = () => update({ hotels: [...hotels, { id: uid(), name: "", checkIn: "", checkOut: "" }] });
  const updateHotel = (idx: number, patch: Partial<any>) => { const next = [...(hotels || [])]; next[idx] = { ...next[idx], ...patch }; update({ hotels: next }); };
  const removeHotel = (id: number) => update({ hotels: (hotels || []).filter(h => h.id !== id) });

  const addCar = () => update({ rentalCars: [...cars, { id: uid(), pickup: "", dropoff: "", date: "", company: "" }] });
  const updateCar = (idx: number, patch: Partial<any>) => { const next = [...(cars || [])]; next[idx] = { ...next[idx], ...patch }; update({ rentalCars: next }); };
  const removeCar = (id: number) => update({ rentalCars: (cars || []).filter(c => c.id !== id) });

  useEffect(() => {
    if (traveler.travelStartDate && traveler.travelEndDate) {
      const start = new Date(traveler.travelStartDate);
      const end = new Date(traveler.travelEndDate);
      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
        const days = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000*60*60*24)) + 1);
        update({ totalDays: days });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traveler.travelStartDate, traveler.travelEndDate]);

  const travelerPerDiem = (locations || []).reduce((s, l) => s + (l.totalPerDiem || 0), 0);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><User className="w-5 h-5" /> Traveler Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Search</label>
            <input className="w-full border p-2 rounded" value={traveler.name || ""} onChange={(e) => { update({ name: e.target.value }); setShowDropdown(true); }} onFocus={() => setShowDropdown(true)} placeholder="Search or type name" />
            {showDropdown && filtered.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded shadow mt-1 max-h-40 overflow-y-auto w-full">
                {filtered.map(emp => (
                  <li key={emp.id} className="p-2 hover:bg-primary/10 cursor-pointer" onClick={() => handleSelectEmployee(emp)}>{emp.name} — {emp.department}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input className="w-full border p-2 rounded bg-gray-100" readOnly value={traveler.department || ""} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input className="w-full border p-2 rounded bg-gray-100" readOnly value={traveler.title || ""} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Name</label>
            <input className="w-full border p-2 rounded" value={traveler.passportName || ""} onChange={(e) => update({ passportName: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input type="date" className="w-full border p-2 rounded" value={traveler.dob || ""} onChange={(e) => update({ dob: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Individual Travel Start Date</label>
            <input type="date" className="w-full border p-2 rounded" value={traveler.travelStartDate || ""} onChange={(e) => update({ travelStartDate: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Individual Travel End Date</label>
            <input type="date" className="w-full border p-2 rounded" value={traveler.travelEndDate || ""} onChange={(e) => update({ travelEndDate: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Days</label>
            <input className="w-full border p-2 rounded bg-gray-100" readOnly value={traveler.totalDays || 0} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
            <input className="w-full border p-2 rounded bg-gray-100" readOnly value={traveler.costCenter || ""} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WBS</label>
            <input className="w-full border p-2 rounded" value={traveler.wbs || ""} onChange={(e) => update({ wbs: e.target.value })} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><RouteIcon className="w-5 h-5" /> Itinerary & Per Diem</h3>
        <div className="space-y-2">
          {(locations || []).map((loc, idx) => (
            <div key={loc.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-2 border rounded p-3 bg-white">
              <select className="md:col-span-6 border p-2 rounded" value={loc.locationName} onChange={(e) => {
                const perDiem = mockLocations.find(l => l.name === e.target.value)?.perDiem || 0;
                updateLocation(idx, { locationName: e.target.value, perDiemRate: perDiem });
              }}>
                <option value="">Select destination...</option>
                {mockLocations.map(l => <option key={l.id} value={l.name}>{l.name} ({money(l.perDiem)}/day)</option>)}
              </select>
              <input className="md:col-span-2 border p-2 rounded" type="number" min={0} value={loc.days} onChange={(e) => updateLocation(idx, { days: parseInt(e.target.value || "0", 10) })} />
              <div className="md:col-span-2 border p-2 rounded bg-gray-50">{money(loc.perDiemRate)}</div>
              <div className="md:col-span-1 text-right font-semibold">{money(loc.totalPerDiem)}</div>
              <button onClick={() => removeLocation(loc.id)} className="md:col-span-1 justify-self-end text-red-600"><Trash2 className="w-5 h-5" /></button>
            </div>
          ))}
          <button className="px-3 py-1 bg-primary text-white rounded" onClick={addLocation}>+ Add Location</button>
        </div>
        <div className="mt-3 flex items-center justify-between bg-primary/10 border border-primary/20 text-primary rounded p-3">
          <span className="font-medium">Traveler total per diem</span>
          <span className="font-bold">{money(travelerPerDiem)}</span>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Plane className="w-5 h-5" /> Flights</h3>
        {(flights || []).map((f, idx) => (
          <div key={f.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 border rounded p-2">
            <input className="border p-2 rounded" placeholder="From" value={f.from || ""} onChange={(e) => updateFlight(idx, { from: e.target.value })} />
            <input className="border p-2 rounded" placeholder="To" value={f.to || ""} onChange={(e) => updateFlight(idx, { to: e.target.value })} />
            <input type="date" className="border p-2 rounded" value={f.date || ""} onChange={(e) => updateFlight(idx, { date: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Flight #" value={f.flightNumber || ""} onChange={(e) => updateFlight(idx, { flightNumber: e.target.value })} />
            <button onClick={() => removeFlight(f.id)} className="text-red-600">Remove</button>
          </div>
        ))}
        <button onClick={addFlight} className="px-3 py-1 bg-primary text-white rounded mt-2">+ Add Flight</button>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Bed className="w-5 h-5" /> Hotels</h3>
        {(hotels || []).map((h, idx) => (
          <div key={h.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 border rounded p-2">
            <input className="border p-2 rounded" placeholder="Hotel Name" value={h.name || ""} onChange={(e) => updateHotel(idx, { name: e.target.value })} />
            <input type="date" className="border p-2 rounded" value={h.checkIn || ""} onChange={(e) => updateHotel(idx, { checkIn: e.target.value })} />
            <input type="date" className="border p-2 rounded" value={h.checkOut || ""} onChange={(e) => updateHotel(idx, { checkOut: e.target.value })} />
            <button onClick={() => removeHotel(h.id)} className="text-red-600">Remove</button>
          </div>
        ))}
        <button onClick={addHotel} className="px-3 py-1 bg-primary text-white rounded mt-2">+ Add Hotel</button>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Car className="w-5 h-5" /> Rental Cars</h3>
        {(cars || []).map((c, idx) => (
          <div key={c.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 border rounded p-2">
            <input className="border p-2 rounded" placeholder="Pickup Location" value={c.pickup || ""} onChange={(e) => updateCar(idx, { pickup: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Dropoff Location" value={c.dropoff || ""} onChange={(e) => updateCar(idx, { dropoff: e.target.value })} />
            <input type="date" className="border p-2 rounded" value={c.date || ""} onChange={(e) => updateCar(idx, { date: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Company" value={c.company || ""} onChange={(e) => updateCar(idx, { company: e.target.value })} />
            <button onClick={() => removeCar(c.id)} className="text-red-600">Remove</button>
          </div>
        ))}
        <button onClick={addCar} className="px-3 py-1 bg-primary text-white rounded mt-2">+ Add Rental Car</button>
      </section>

      <div className="flex items-center gap-2 text-sm text-gray-500"><ClipboardList className="w-4 h-4" /> Unsaved changes are saved automatically.</div>

      {onRemove && (<div className="pt-2"><button onClick={onRemove} className="text-red-600 hover:text-red-700 text-sm">Remove traveler</button></div>)}
    </div>
  );
};

/*************************
 * Review Screen (Summary tab)
 *************************/
const ReviewScreen: React.FC<{ trip: TripForm; travelers: Traveler[]; onEditTraveler: (i:number) => void; onBack: () => void; onSubmit: () => void; onExportCSV: () => void }> = ({ trip, travelers, onEditTraveler, onBack, onSubmit, onExportCSV }) => {
  const totalPerDiem = (travelers || []).reduce((sum, t) => sum + (t.locations || []).reduce((s, l) => s + (l.totalPerDiem || 0), 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="w-6 h-6" /> Review & Submit</h2>
        <button onClick={onBack} className="text-primary flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Back</button>
      </div>

      <div className="bg-white border rounded p-4">
        <h3 className="font-semibold mb-2">Trip Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1 text-sm">
          <div><span className="text-gray-500">Type:</span> {trip.type}</div>
          <div><span className="text-gray-500">Name:</span> {trip.tripName}</div>
          <div><span className="text-gray-500">Destination:</span> {trip.destination}</div>
          <div className="md:col-span-2"><span className="text-gray-500">Purpose / Details:</span> {trip.purpose} — {trip.tripDetails}</div>
          <div><span className="text-gray-500">Dates:</span> {trip.startDate} → {trip.endDate}</div>
          <div><span className="text-gray-500">Approver:</span> {trip.approver}</div>
          <div><span className="text-gray-500">Document #:</span> {trip.documentNumber}</div>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 p-4 rounded">
        <h3 className="font-semibold flex items-center gap-2 text-primary mb-2"><DollarSign className="w-5 h-5" /> Cost Summary</h3>
        <p className="text-primary">Estimated Travel Cost: <strong>{money(trip.estimatedCost || 0)}</strong></p>
        <p className="text-primary">Total Per Diem across all travelers: <strong>{money(totalPerDiem)}</strong></p>
        <p className="text-primary">Grand Total (est.): <strong>{money((trip.estimatedCost || 0) + totalPerDiem)}</strong></p>
      </div>

      {travelers.map((t, i) => {
        const travelerPerDiem = (t.locations || []).reduce((s, l) => s + (l.totalPerDiem || 0), 0);
        return (
          <div key={t.id} className="border rounded-lg overflow-hidden bg-white">
            <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{t.name || `Traveler ${i+1}`}</h3>
                <p className="text-sm text-gray-600">Passport: {t.passportName || "-"} • DOB: {t.dob || "-"}</p>
              </div>
              <button onClick={() => onEditTraveler(i)} className="text-primary text-sm print:hidden">Edit</button>
            </div>
            <div className="px-4 py-3 text-sm">
              <div className="mb-2 p-2 bg-primary/10 rounded border border-primary/20 flex justify-between items-center">
                <span className="text-primary font-medium">Traveler Cost Summary</span>
                <span className="font-bold text-primary">{money(travelerPerDiem)}</span>
              </div>
              <p><strong>Cost Center:</strong> {t.costCenter || "-"}</p>
              <p className="mt-2 font-medium">Itinerary</p>
              {(t.locations || []).length === 0 ? (
                <p className="italic text-gray-500">No locations added</p>
              ) : (
                <ul className="list-disc ml-5 space-y-1">
                  {(t.locations || []).map((loc) => (
                    <li key={loc.id}>{loc.locationName} • {loc.days} days ({money(loc.perDiemRate)}/day) — <strong>{money(loc.totalPerDiem)}</strong></li>
                  ))}
                </ul>
              )}

              {t.flights && t.flights.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium">Flights</p>
                  <ul className="ml-5 list-disc text-sm">
                    {t.flights.map(f => <li key={f.id}>{f.from} → {f.to} on {f.date} ({f.flightNumber || '-'})</li>)}
                  </ul>
                </div>
              )}

              {t.hotels && t.hotels.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium">Hotels</p>
                  <ul className="ml-5 list-disc text-sm">
                    {t.hotels.map(h => <li key={h.id}>{h.name} ({h.checkIn} → {h.checkOut})</li>)}
                  </ul>
                </div>
              )}

              {t.rentalCars && t.rentalCars.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium">Rental Cars</p>
                  <ul className="ml-5 list-disc text-sm">
                    {t.rentalCars.map(c => <li key={c.id}>{c.pickup} → {c.dropoff} on {c.date} {c.company ? `(${c.company})` : ''}</li>)}
                  </ul>
                </div>
              )}

              {t.notes && <p className="mt-2"><strong>Notes:</strong> {t.notes}</p>}
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap gap-3 print:hidden">
        <button onClick={onSubmit} className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2"><Send className="w-4 h-4" /> Submit for Approval</button>
        <button onClick={onExportCSV} className="px-4 py-2 bg-gray-800 text-white rounded flex items-center gap-2"><Download className="w-4 h-4" /> Export CSV</button>
        <button onClick={() => window.print()} className="px-4 py-2 bg-white border rounded flex items-center gap-2"><FileText className="w-4 h-4" /> Print / Save PDF</button>
      </div>
    </div>
  );
};

/*************************
 * Stepper (Tabs)
 *************************/
const Stepper: React.FC<{ step: number; setStep: (n:number)=>void; canNext: boolean }> = ({ step, setStep, canNext }) => {
  const steps = ["Trip Overview", "Travelers", "Summary"];
  return (
    <div className="flex items-center justify-between bg-white border-b px-4 py-3">
      <div className="flex items-center gap-6">
        {steps.map((label, i) => (
          <button key={label} onClick={() => (i < step || (i === 1 && canNext) || (i === 2 && canNext)) && setStep(i)} className={`text-sm font-medium px-2 py-1 rounded ${step === i ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
            {i + 1}. {label}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500 hidden md:block">Drafts autosave locally</div>
    </div>
  );
};

/*************************
 * Main Page
 *************************/
const STORAGE_KEY = "trip-request-draft-v4";

const NewRequest: React.FC = () => {
  const methods = useForm<TripForm>({
    resolver: zodResolver(TripSchema),
    defaultValues: {
      type: "",
      tripName: "",
      purpose: "",
      tripDetails: "",
      startDate: "",
      endDate: "",
      destination: "",
      isDomestic: false,
      isInternational: false,
      numberOfTravelers: 1,
      estimatedCost: 0,
      documentNumber: "",
      status: "draft",
      approver: "",
      wbs: "",
    },
    mode: "onBlur",
  });

  const [travelers, setTravelers] = useState<Traveler[]>([normalizeTraveler()]);
  const [activeTraveler, setActiveTraveler] = useState(0);
  const [step, setStep] = useState(0);
  const [flightHotelDetails, setFlightHotelDetails] = useState<any[]>([]);
  const [travelerTab, setTravelerTab] = useState<"personal"|"itinerary"|"costs">("personal");

  const historyRef = useRef<{ travelers: Traveler[] }[]>([]);
  const pushHistory = () => historyRef.current.push({ travelers: JSON.parse(JSON.stringify(travelers)) });
  const undo = () => {
    const prev = historyRef.current.pop();
    if (prev) setTravelers(prev.travelers.map(normalizeTraveler));
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.trip) methods.reset(parsed.trip);
        if (parsed.travelers) setTravelers(parsed.travelers.map(normalizeTraveler));
        if (parsed.flightHotelDetails) setFlightHotelDetails(parsed.flightHotelDetails);
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sub = methods.watch((trip) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ trip, travelers, flightHotelDetails }));
    });
    return () => sub.unsubscribe();
  }, [methods, travelers, flightHotelDetails]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ trip: methods.getValues(), travelers, flightHotelDetails }));
  }, [travelers, methods, flightHotelDetails]);

  const addTraveler = () => {
    pushHistory();
    setTravelers((prev) => {
      const next = [...prev, normalizeTraveler({ travelStartDate: methods.getValues().startDate || "", travelEndDate: methods.getValues().endDate || "" })];
      setActiveTraveler(next.length - 1);
      return next;
    });
  };

  const replaceTraveler = (index: number, nextTrav: Traveler) => {
    pushHistory();
    setTravelers((all) => all.map((t, i) => (i === index ? normalizeTraveler(nextTrav) : t)));
  };

  const removeTraveler = (index: number) => {
    pushHistory();
    setTravelers((all) => {
      const next = all.filter((_, i) => i !== index).map(normalizeTraveler);
      setActiveTraveler((curr) => Math.max(0, Math.min(curr, next.length - 1)));
      return next;
    });
  };

  const exportCSV = () => {
    const headers = ["Trip Type","Trip Name","Purpose","Trip Details","Start Date","End Date","Destination","Approver","Document #","Traveler Name","Passport Name","DOB","Employee ID","Cost Center","Location","Days","Per Diem Rate","Total Per Diem","Flights","Hotels","RentalCars","Notes"];
    const trip = methods.getValues();
    const rows = (travelers || []).flatMap((t) => {
      const base = [trip.type, trip.tripName, trip.purpose, trip.tripDetails, trip.startDate, trip.endDate, trip.destination, trip.approver, trip.documentNumber || "", t.name, t.passportName, t.dob, t.metaProId || "", t.costCenter || ""];
      if ((t.locations || []).length > 0) {
        return (t.locations || []).map((l) => [
          ...base,
          l.locationName,
          l.days,
          l.perDiemRate,
          l.totalPerDiem,
          JSON.stringify(t.flights || []),
          JSON.stringify(t.hotels || []),
          JSON.stringify(t.rentalCars || []),
          (t.notes || "").replace(/\n/g, " "),
        ]);
      }
      return [[...base, "-", 0, 0, 0, JSON.stringify(t.flights || []), JSON.stringify(t.hotels || []), JSON.stringify(t.rentalCars || []), (t.notes || "").replace(/\n/g, " ")]];
    });
    const csv = [headers, ...rows].map((r) => r.map((cell) => String(cell).replace(/,/g, "\\,")).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trip_request_summary.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const submit = () => {
    alert("Trip request submitted! (demo)");
    localStorage.removeItem(STORAGE_KEY);
  };

  const totalPerDiem = travelers.reduce((sum, t) => sum + (t.locations || []).reduce((s, l) => s + (l.totalPerDiem || 0), 0), 0);

  const active = travelers[activeTraveler] || normalizeTraveler();
  const patchActiveTraveler = (patch: Partial<Traveler>) => {
    replaceTraveler(activeTraveler, { ...active, ...patch });
  };
  const addLocationActive = () => {
    const next = [...(active.locations || []), { id: uid(), locationName: "", days: 1, perDiemRate: 0, totalPerDiem: 0 }];
    const total = next.reduce((s, l) => s + (l.totalPerDiem || 0), 0);
    patchActiveTraveler({ locations: next as any, totalPerDiem: total });
  };
  const updateLocationActive = (idx: number, patch: Partial<Itinerary>) => {
    const next = [...(active.locations || [])] as Itinerary[];
    next[idx] = { ...next[idx], ...patch } as Itinerary;
    if (!next[idx].days || next[idx].days < 0) next[idx].days = 0 as any;
    next[idx].totalPerDiem = (next[idx].days || 0) * (next[idx].perDiemRate || 0);
    const total = next.reduce((s, l) => s + (l.totalPerDiem || 0), 0);
    patchActiveTraveler({ locations: next as any, totalPerDiem: total });
  };
  const removeLocationActive = (id: number) => {
    const next = (active.locations || []).filter((l: any) => l.id !== id) as Itinerary[];
    const total = next.reduce((s, l) => s + (l.totalPerDiem || 0), 0);
    patchActiveTraveler({ locations: next as any, totalPerDiem: total });
  };

  const personalComplete = !!(active.name && active.passportName && active.dob && active.travelStartDate && active.travelEndDate);
  const itineraryComplete = (active.locations || []).length > 0;
  const costsComplete = (active.totalPerDiem || 0) > 0;
  const completedSections = [personalComplete, itineraryComplete, costsComplete].filter(Boolean).length;
  const progressPct = Math.round((completedSections / 3) * 100);

  const goToTravelers = async () => {
    const valid = await methods.trigger(["type", "tripName", "purpose", "tripDetails", "startDate", "endDate", "destination", "approver"]);
    if (valid) setStep(1);
    else {
      const errors = methods.formState.errors as any;
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null;
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Stepper step={step} setStep={(n:number)=>setStep(n)} canNext={true} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
        {step === 1 && (
          <aside className="md:col-span-3 space-y-4">
            <div className="bg-white border rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4" /> Trip Overview</div>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-500">Type</div>
                  <div className="font-medium capitalize">{methods.getValues().type || "-"}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-gray-500">Dates</div>
                    <div className="font-medium">{methods.getValues().startDate || "-"} {methods.getValues().endDate ? `- ${methods.getValues().endDate}` : ""}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Destination</div>
                    <div className="font-medium">{methods.getValues().destination || "-"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-md overflow-hidden">
              <div className="p-3 border-b flex items-center justify-between">
                <div className="font-semibold flex items-center gap-2"><Users className="w-5 h-5" /> Travelers ({travelers.length})</div>
                <div className="flex items-center gap-2">
                  <button onClick={undo} className="text-gray-600 hover:text-gray-900" title="Undo last change"><Undo className="w-4 h-4" /></button>
                  <button onClick={addTraveler} className="bg-primary text-white px-2 py-1 rounded text-xs flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
                </div>
              </div>
              <ul>
                {travelers.map((t,i)=>{
                  const personal = !!(t.name && t.passportName && t.dob && t.travelStartDate && t.travelEndDate);
                  const itin = (t.locations||[]).length>0;
                  const costs = (t.totalPerDiem||0)>0;
                  const done = [personal, itin, costs].filter(Boolean).length;
                  const pct = Math.round((done/3)*100);
                  return (
                    <li key={t.id} className={`p-3 cursor-pointer ${i===activeTraveler?"bg-primary/5":"hover:bg-gray-50"}`} onClick={()=>{setActiveTraveler(i); setTravelerTab("personal");}}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium truncate max-w-[12rem]" title={t.name || `Traveler ${i+1}`}>{t.name || `Traveler ${i+1}`}</div>
                          <div className="text-xs text-gray-500">{t.department || ""}</div>
                        </div>
                        <div className="text-xs text-gray-600">{pct}%</div>
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-600 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-2 flex gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-full ${personal?"bg-green-100 text-green-700":"bg-gray-100 text-gray-600"}`}>Personal</span>
                        <span className={`px-2 py-0.5 rounded-full ${itin?"bg-green-100 text-green-700":"bg-gray-100 text-gray-600"}`}>Dates</span>
                        <span className={`px-2 py-0.5 rounded-full ${itin?"bg-green-100 text-green-700":"bg-gray-100 text-gray-600"}`}>Locations</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bg-white border rounded-md p-4">
              <div className="font-semibold mb-3">Cost Summary</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Base Cost:</span><span className="font-medium">{money(methods.getValues().estimatedCost || 0)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Total Per Diem:</span><span className="font-medium">{money(totalPerDiem)}</span></div>
                <div className="flex justify-between border-t pt-2 font-semibold"><span>Grand Total:</span><span className="text-primary">{money((methods.getValues().estimatedCost || 0) + totalPerDiem)}</span></div>
              </div>
            </div>
          </aside>
        )}

        <main className={`${step===1?"md:col-span-9":"md:col-span-12"} space-y-4`}>
          <FormProvider {...methods}>
            <AnimatePresence mode="wait">
              {step===0 && (
                <motion.div key="trip" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y:0 }} exit={{ opacity: 0, y:-8 }} className="bg-white border rounded p-6">
                  <TripDetails methods={methods} flightHotelDetails={flightHotelDetails} setFlightHotelDetails={setFlightHotelDetails} />
                  <div className="mt-6 flex justify-end gap-2">
                    <button className={`px-4 py-2 rounded text-white bg-primary`} onClick={goToTravelers}><ArrowRight className="w-4 h-4" /> Next: Travelers</button>
                  </div>
                </motion.div>
              )}

              {step===1 && (
                <motion.div key="travelers" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y:0 }} exit={{ opacity: 0, y:-8 }} className="space-y-4">
                  <div className="bg-white border rounded p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">{active.name || `Traveler ${activeTraveler + 1}`}</h2>
                        {active.passportName && <p className="text-sm text-gray-600">Passport: {active.passportName}</p>}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${completedSections===3?"bg-green-100 text-green-700":"bg-gray-100 text-gray-700"}`}>{completedSections===3?"Complete":"In Progress"}</span>
                    </div>
                    <div className="flex gap-6 border-b mb-4">
                      <button className={`pb-2 text-sm font-medium ${travelerTab==='personal'?"text-primary border-b-2 border-primary":"text-gray-600"}`} onClick={()=>setTravelerTab('personal')}>Personal Info {personalComplete && '✓'}</button>
                      <button className={`pb-2 text-sm font-medium ${travelerTab==='itinerary'?"text-primary border-b-2 border-primary":"text-gray-600"}`} onClick={()=>setTravelerTab('itinerary')}>Itinerary {itineraryComplete && '✓'}</button>
                      <button className={`pb-2 text-sm font-medium ${travelerTab==='costs'?"text-primary border-b-2 border-primary":"text-gray-600"}`} onClick={()=>setTravelerTab('costs')}>Costs {costsComplete && '✓'}</button>
                    </div>

                    {travelerTab==='personal' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                          <input className="w-full border rounded p-2" value={active.name || ""} onChange={(e)=>patchActiveTraveler({ name: e.target.value })} placeholder="Search or type name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                          <input className="w-full border rounded p-2" value={active.department || ""} onChange={(e)=>patchActiveTraveler({ department: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input className="w-full border rounded p-2" value={active.title || ""} onChange={(e)=>patchActiveTraveler({ title: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Passport Name</label>
                          <input className="w-full border rounded p-2" value={active.passportName || ""} onChange={(e)=>patchActiveTraveler({ passportName: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <input type="date" className="w-full border rounded p-2" value={active.dob || ""} onChange={(e)=>patchActiveTraveler({ dob: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Travel Start Date</label>
                          <input type="date" className="w-full border rounded p-2" value={active.travelStartDate || ""} onChange={(e)=>patchActiveTraveler({ travelStartDate: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Travel End Date</label>
                          <input type="date" className="w-full border rounded p-2" value={active.travelEndDate || ""} onChange={(e)=>patchActiveTraveler({ travelEndDate: e.target.value })} />
                        </div>
                      </div>
                    )}

                    {travelerTab==='itinerary' && (
                      <div className="space-y-3">
                        {(active.locations || []).map((loc, idx) => (
                          <div key={loc.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-2 border rounded p-3 bg-white">
                            <select className="md:col-span-6 border p-2 rounded" value={loc.locationName} onChange={(e)=>{
                              const perDiem = mockLocations.find(l=>l.name===e.target.value)?.perDiem || 0;
                              updateLocationActive(idx, { locationName: e.target.value, perDiemRate: perDiem });
                            }}>
                              <option value="">Select destination...</option>
                              {mockLocations.map(l=> <option key={l.id} value={l.name}>{l.name} ({money(l.perDiem)}/day)</option>)}
                            </select>
                            <input className="md:col-span-2 border p-2 rounded" type="number" min={0} value={loc.days} onChange={(e)=>updateLocationActive(idx, { days: parseInt(e.target.value||'0',10) })} />
                            <div className="md:col-span-2 border p-2 rounded bg-gray-50">{money(loc.perDiemRate)}</div>
                            <div className="md:col-span-1 text-right font-semibold">{money(loc.totalPerDiem)}</div>
                            <button onClick={()=>removeLocationActive(loc.id)} className="md:col-span-1 justify-self-end text-red-600">Remove</button>
                          </div>
                        ))}
                        <button className="px-3 py-1 bg-primary text-white rounded" onClick={addLocationActive}>+ Add Location</button>
                      </div>
                    )}

                    {travelerTab==='costs' && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Per Diem Total</span><span className="font-semibold">{money(active.totalPerDiem || 0)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Trip Base Cost</span><span className="font-semibold">{money(methods.getValues().estimatedCost || 0)}</span></div>
                        <div className="flex justify-between text-sm border-t pt-2 font-semibold"><span>Traveler Est. Total</span><span className="text-primary">{money((methods.getValues().estimatedCost || 0) + (active.totalPerDiem || 0))}</span></div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button className="px-4 py-2 bg-white border rounded flex items-center gap-2" onClick={()=>setStep(0)}><ArrowLeft className="w-4 h-4" /> Back</button>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-gray-200 rounded" onClick={()=>{}}><Save className="w-4 h-4" /> Save Draft</button>
                      <button className="px-4 py-2 bg-primary text-white rounded flex items-center gap-2" onClick={()=>setStep(2)}><ArrowRight className="w-4 h-4" /> Review</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step===2 && (
                <motion.div key="review" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y:0 }} exit={{ opacity: 0, y:-8 }} className="bg-white border rounded">
                  <ReviewScreen trip={methods.getValues()} travelers={travelers} onBack={()=>setStep(1)} onEditTraveler={(i)=>{ setStep(1); setActiveTraveler(i); }} onSubmit={submit} onExportCSV={exportCSV} />
                </motion.div>
              )}
            </AnimatePresence>
          </FormProvider>
        </main>
      </div>

      <style>{`@media print { body { background: white; } .print\\:hidden { display: none !important; } }`}</style>
    </div>
  );
};

export default NewRequest;
