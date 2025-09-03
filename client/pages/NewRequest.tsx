import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Minus, DollarSign, Send, X, RefreshCw } from "lucide-react";
import { DateRange } from "react-day-picker";

interface FlightInfo {
  id: string;
  departureDateTime: Date | null;
  arrivalDateTime: Date | null;
  from: string;
  to: string;
  flightNumber?: string;
  cost?: string;
}

interface HotelInfo {
  id: string;
  checkIn: Date | null;
  checkOut: Date | null;
  location: string;
  hotelName?: string;
  cost?: string;
}

interface RentalCarInfo {
  id: string;
  pickupDateTime: Date | null;
  dropoffDateTime: Date | null;
  pickupLocation: string;
  dropoffLocation: string;
  vendor?: string;
  carClass?: string;
  cost?: string;
}

interface PerDiemItem {
  id: string;
  location: string; // value from destinations list
  dailyRate: number;
  days: number;
  total: number;
}

interface TravelerInfo {
  id: string;
  metaProId: string;
  name: string;
  department: string;
  title: string;
  passportName: string;
  dateOfBirth: Date | null;
  travelDates: DateRange | undefined;
  flights: FlightInfo[];
  hotels: HotelInfo[];
  rentalCars: RentalCarInfo[];
  perDiem: PerDiemItem[];
}

const tripTypes: ComboboxOption[] = [
  { value: "general", label: "General Business Trip" },
  { value: "project", label: "Project Trip" },
  { value: "training", label: "Training & Development" },
  { value: "conference", label: "Conference & Events" },
];

const mockEmployees: ComboboxOption[] = [
  { value: "emp001", label: "John Doe (EMP001)", metadata: { department: "Engineering", title: "Senior Developer" } },
  { value: "emp002", label: "Jane Smith (EMP002)", metadata: { department: "Marketing", title: "Marketing Manager" } },
  { value: "emp003", label: "Mike Johnson (EMP003)", metadata: { department: "Sales", title: "Sales Director" } },
];

const destinations: MultiSelectOption[] = [
  { value: "seoul", label: "Seoul, South Korea" },
  { value: "tokyo", label: "Tokyo, Japan" },
  { value: "singapore", label: "Singapore" },
  { value: "hong-kong", label: "Hong Kong" },
  { value: "shanghai", label: "Shanghai, China" },
  { value: "bangkok", label: "Bangkok, Thailand" },
];

const PER_DIEM_MASTER: Record<string, number> = {
  seoul: 120,
  tokyo: 135,
  singapore: 110,
  "hong-kong": 140,
  shanghai: 100,
  bangkok: 90,
};

function daysFromRange(range: DateRange | undefined): number {
  if (!range?.from || !range?.to) return 0;
  const ms = range.to.getTime() - range.from.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1; // inclusive
  return Math.max(0, days);
}

function createEmptyTraveler(): TravelerInfo {
  return {
    id: Date.now().toString(),
    metaProId: "",
    name: "",
    department: "",
    title: "",
    passportName: "",
    dateOfBirth: null,
    travelDates: undefined,
    flights: [
      {
        id: `${Date.now()}-f1`,
        departureDateTime: null,
        arrivalDateTime: null,
        from: "",
        to: "",
        flightNumber: "",
        cost: "",
      },
    ],
    hotels: [
      {
        id: `${Date.now()}-h1`,
        checkIn: null,
        checkOut: null,
        location: "",
        hotelName: "",
        cost: "",
      },
    ],
    rentalCars: [],
    perDiem: [],
  };
}

export default function NewRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tripType: "",
    purpose: "",
    tripDetails: "",
    travelDates: undefined as DateRange | undefined,
    destinations: [] as string[],
    isDomestic: false,
    isInternational: false,
    numberOfTravelers: 1,
    estimatedCost: "",
    cashAdvance: "",
  });

  const [travelers, setTravelers] = useState<TravelerInfo[]>([createEmptyTraveler()]);
  const [activeTravelerId, setActiveTravelerId] = useState(travelers[0].id);

  const updateTraveler = (id: string, updates: Partial<TravelerInfo>) => {
    setTravelers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const addTraveler = () => {
    const t = createEmptyTraveler();
    setTravelers((prev) => {
      const next = [...prev, t];
      setFormData((fd) => ({ ...fd, numberOfTravelers: next.length }));
      return next;
    });
    setActiveTravelerId(t.id);
    recalcPerDiem(t.id);
  };

  const removeTraveler = (id: string) => {
    setTravelers((prev) => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex((x) => x.id === id);
      const next = prev.filter((x) => x.id !== id);
      setFormData((fd) => ({ ...fd, numberOfTravelers: next.length }));
      if (id === activeTravelerId) {
        const nextIdx = Math.max(0, idx - 1);
        setActiveTravelerId(next[nextIdx]?.id ?? next[0]?.id);
      }
      return next;
    });
  };

  // Flight handlers
  const addFlight = (travelerId: string) => {
    updateTraveler(travelerId, {
      flights: [
        ...travelers.find((t) => t.id === travelerId)!.flights,
        {
          id: `${Date.now()}-f`,
          departureDateTime: null,
          arrivalDateTime: null,
          from: "",
          to: "",
          flightNumber: "",
          cost: "",
        },
      ],
    });
  };

  const updateFlight = (travelerId: string, flightId: string, updates: Partial<FlightInfo>) => {
    const t = travelers.find((x) => x.id === travelerId)!;
    updateTraveler(travelerId, {
      flights: t.flights.map((f) => (f.id === flightId ? { ...f, ...updates } : f)),
    });
  };

  const removeFlight = (travelerId: string, flightId: string) => {
    const t = travelers.find((x) => x.id === travelerId)!;
    if (t.flights.length <= 1) return;
    updateTraveler(travelerId, {
      flights: t.flights.filter((f) => f.id !== flightId),
    });
  };

  // Hotel handlers
  const addHotel = (travelerId: string) => {
    const t = travelers.find((x) => x.id === travelerId)!;
    updateTraveler(travelerId, {
      hotels: [
        ...t.hotels,
        {
          id: `${Date.now()}-h`,
          checkIn: null,
          checkOut: null,
          location: "",
          hotelName: "",
          cost: "",
        },
      ],
    });
  };

  const updateHotel = (travelerId: string, hotelId: string, updates: Partial<HotelInfo>) => {
    const t = travelers.find((x) => x.id === travelerId)!;
    updateTraveler(travelerId, {
      hotels: t.hotels.map((h) => (h.id === hotelId ? { ...h, ...updates } : h)),
    });
  };

  const removeHotel = (travelerId: string, hotelId: string) => {
    const t = travelers.find((x) => x.id === travelerId)!;
    if (t.hotels.length <= 1) return;
    updateTraveler(travelerId, {
      hotels: t.hotels.filter((h) => h.id !== hotelId),
    });
  };

  // Rental car handlers
  const addRentalCar = (travelerId: string) => {
    const t = travelers.find((x) => x.id === travelerId)!;
    updateTraveler(travelerId, {
      rentalCars: [
        ...t.rentalCars,
        {
          id: `${Date.now()}-c`,
          pickupDateTime: null,
          dropoffDateTime: null,
          pickupLocation: "",
          dropoffLocation: "",
          vendor: "",
          carClass: "",
          cost: "",
        },
      ],
    });
  };

  const updateRentalCar = (travelerId: string, carId: string, updates: Partial<RentalCarInfo>) => {
    const t = travelers.find((x) => x.id === travelerId)!;
    updateTraveler(travelerId, {
      rentalCars: t.rentalCars.map((c) => (c.id === carId ? { ...c, ...updates } : c)),
    });
  };

  const removeRentalCar = (travelerId: string, carId: string) => {
    const t = travelers.find((x) => x.id === travelerId)!;
    updateTraveler(travelerId, {
      rentalCars: t.rentalCars.filter((c) => c.id !== carId),
    });
  };

  // Per diem
  const recalcPerDiem = (travelerId: string) => {
    const t = travelers.find((x) => x.id === travelerId)!;
    const range = t.travelDates ?? formData.travelDates;
    const days = Math.max(1, daysFromRange(range));
    const rows: PerDiemItem[] = formData.destinations.map((loc) => {
      const rate = PER_DIEM_MASTER[loc] ?? 0;
      return {
        id: `${travelerId}-${loc}`,
        location: loc,
        dailyRate: rate,
        days,
        total: rate * days,
      };
    });
    updateTraveler(travelerId, { perDiem: rows });
  };

  const updatePerDiemItem = (travelerId: string, perDiemId: string, updates: Partial<PerDiemItem>) => {
    const t = travelers.find((x) => x.id === travelerId)!;
    const next = t.perDiem.map((p) => {
      if (p.id !== perDiemId) return p;
      const merged = { ...p, ...updates } as PerDiemItem;
      merged.total = (merged.dailyRate || 0) * (merged.days || 0);
      return merged;
    });
    updateTraveler(travelerId, { perDiem: next });
  };

  const handleEmployeeSelect = (value: string, option: ComboboxOption | undefined, travelerId: string) => {
    if (option && option.metadata) {
      updateTraveler(travelerId, {
        metaProId: value,
        name: option.label,
        department: option.metadata.department,
        title: option.metadata.title,
      });
    }
  };

  const handleSaveRequest = () => {
    alert("Request saved as draft");
  };

  const handleSubmitRequest = () => {
    alert("Request submitted for approval");
    navigate("/requests");
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      navigate("/");
    }
  };

  const sendToTravelAgent = (travelerId: string) => {
    const t = travelers.find((x) => x.id === travelerId)!;
    // Placeholder. In production, POST to backend/agent system.
    console.log("Send to agent", { traveler: t });
    alert(`Itinerary for ${t.passportName || t.name || "Traveler"} sent to travel agent.`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Trip Request</h1>
          <p className="text-gray-600">Create a new business trip request</p>
        </div>
        <div className="text-sm text-gray-500">
          Document #: <span className="font-mono">BIZ-{String(Date.now()).slice(-3)}</span>
        </div>
      </div>

      {/* Trip Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Overview</CardTitle>
          <CardDescription>Basic information about your trip</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tripType">Trip Type *</Label>
              <Combobox
                options={tripTypes}
                value={formData.tripType}
                onValueChange={(value) => setFormData({ ...formData, tripType: value })}
                placeholder="Select trip type"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Total Cost *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="estimatedCost"
                  placeholder="0.00"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Input
              id="purpose"
              placeholder="Brief description of trip purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tripDetails">Trip Details</Label>
            <Textarea
              id="tripDetails"
              placeholder="Detailed description of the trip, meetings, objectives..."
              value={formData.tripDetails}
              onChange={(e) => setFormData({ ...formData, tripDetails: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Travel Dates *</Label>
              <DateRangePicker
                value={formData.travelDates}
                onValueChange={(range) => setFormData({ ...formData, travelDates: range })}
                placeholder="Select travel dates"
              />
            </div>

            <div className="space-y-2">
              <Label>Destination(s) *</Label>
              <MultiSelect
                options={destinations}
                value={formData.destinations}
                onValueChange={(destinations) => setFormData({ ...formData, destinations })}
                placeholder="Select destinations"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="domestic"
                checked={formData.isDomestic}
                onCheckedChange={(checked) => setFormData({ ...formData, isDomestic: !!checked })}
              />
              <Label htmlFor="domestic">Domestic</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="international"
                checked={formData.isInternational}
                onCheckedChange={(checked) => setFormData({ ...formData, isInternational: !!checked })}
              />
              <Label htmlFor="international">International</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Traveler Information Section (with itineraries) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Traveler Information</CardTitle>
              <CardDescription>Each traveler has their own full itinerary</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={addTraveler} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Traveler
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Tabs value={activeTravelerId} onValueChange={setActiveTravelerId} className="w-full">
              <TabsList className="min-w-max">
                {travelers.map((t, idx) => (
                  <TabsTrigger key={t.id} value={t.id} className="group">
                    <div className="flex items-center gap-2">
                      <span>{t.passportName || t.name || `Traveler ${idx + 1}`}</span>
                      {travelers.length > 1 && (
                        <span
                          role="button"
                          tabIndex={-1}
                          className="ml-1 rounded p-0.5 text-gray-400 hover:text-red-600 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeTraveler(t.id);
                          }}
                          aria-label={`Remove ${t.passportName || t.name || `Traveler ${idx + 1}`}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {travelers.map((traveler, index) => (
                <TabsContent key={traveler.id} value={traveler.id} className="mt-4 space-y-6">
                  {/* Personal section */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Traveler {index + 1} • Personal</h4>
                      <Button variant="outline" size="sm" onClick={() => sendToTravelAgent(traveler.id)}>
                        <Send className="h-4 w-4 mr-2" />
                        Send to Travel Agent
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Meta Pro ID *</Label>
                        <Combobox
                          options={mockEmployees}
                          value={traveler.metaProId}
                          onValueChange={(value, option) => handleEmployeeSelect(value, option, traveler.id)}
                          placeholder="Search employee ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input value={traveler.name} disabled placeholder="Employee name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Input value={traveler.department} disabled placeholder="Department" />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={traveler.title} disabled placeholder="Job title" />
                      </div>
                      <div className="space-y-2">
                        <Label>Passport Name *</Label>
                        <Input
                          value={traveler.passportName}
                          onChange={(e) => updateTraveler(traveler.id, { passportName: e.target.value })}
                          placeholder="Name as shown on passport"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Birth *</Label>
                        <Input
                          type="date"
                          value={traveler.dateOfBirth ? traveler.dateOfBirth.toISOString().split("T")[0] : ""}
                          onChange={(e) => updateTraveler(traveler.id, { dateOfBirth: e.target.value ? new Date(e.target.value) : null })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Individual Travel Dates</Label>
                      <DateRangePicker
                        value={traveler.travelDates}
                        onValueChange={(range) => updateTraveler(traveler.id, { travelDates: range })}
                        placeholder="Select individual travel dates"
                      />
                    </div>
                  </div>

                  {/* Flights */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Flights</h4>
                      <Button onClick={() => addFlight(traveler.id)} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" /> Add Flight
                      </Button>
                    </div>
                    {traveler.flights.map((f) => (
                      <div key={f.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Departure</Label>
                          <Input
                            type="datetime-local"
                            value={f.departureDateTime ? f.departureDateTime.toISOString().slice(0, 16) : ""}
                            onChange={(e) => updateFlight(traveler.id, f.id, { departureDateTime: e.target.value ? new Date(e.target.value) : null })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Arrival</Label>
                          <Input
                            type="datetime-local"
                            value={f.arrivalDateTime ? f.arrivalDateTime.toISOString().slice(0, 16) : ""}
                            onChange={(e) => updateFlight(traveler.id, f.id, { arrivalDateTime: e.target.value ? new Date(e.target.value) : null })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>From</Label>
                          <Input value={f.from} onChange={(e) => updateFlight(traveler.id, f.id, { from: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>To</Label>
                          <Input value={f.to} onChange={(e) => updateFlight(traveler.id, f.id, { to: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Flight Number</Label>
                          <Input value={f.flightNumber} onChange={(e) => updateFlight(traveler.id, f.id, { flightNumber: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Cost</Label>
                          <Input value={f.cost || ""} onChange={(e) => updateFlight(traveler.id, f.id, { cost: e.target.value })} />
                        </div>
                        {traveler.flights.length > 1 && (
                          <div className="flex items-end">
                            <Button variant="outline" size="sm" onClick={() => removeFlight(traveler.id, f.id)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Hotels */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Hotels</h4>
                      <Button onClick={() => addHotel(traveler.id)} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" /> Add Hotel
                      </Button>
                    </div>
                    {traveler.hotels.map((h) => (
                      <div key={h.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Check-in</Label>
                          <Input
                            type="datetime-local"
                            value={h.checkIn ? h.checkIn.toISOString().slice(0, 16) : ""}
                            onChange={(e) => updateHotel(traveler.id, h.id, { checkIn: e.target.value ? new Date(e.target.value) : null })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Check-out</Label>
                          <Input
                            type="datetime-local"
                            value={h.checkOut ? h.checkOut.toISOString().slice(0, 16) : ""}
                            onChange={(e) => updateHotel(traveler.id, h.id, { checkOut: e.target.value ? new Date(e.target.value) : null })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input value={h.location} onChange={(e) => updateHotel(traveler.id, h.id, { location: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Hotel</Label>
                          <Input value={h.hotelName || ""} onChange={(e) => updateHotel(traveler.id, h.id, { hotelName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Cost</Label>
                          <Input value={h.cost || ""} onChange={(e) => updateHotel(traveler.id, h.id, { cost: e.target.value })} />
                        </div>
                        {traveler.hotels.length > 1 && (
                          <div className="flex items-end">
                            <Button variant="outline" size="sm" onClick={() => removeHotel(traveler.id, h.id)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Rental Cars */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Rental Cars</h4>
                      <Button onClick={() => addRentalCar(traveler.id)} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" /> Add Rental Car
                      </Button>
                    </div>
                    {traveler.rentalCars.length === 0 && (
                      <p className="text-sm text-gray-500">No rental cars added.</p>
                    )}
                    {traveler.rentalCars.map((c) => (
                      <div key={c.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Pickup</Label>
                          <Input
                            type="datetime-local"
                            value={c.pickupDateTime ? c.pickupDateTime.toISOString().slice(0, 16) : ""}
                            onChange={(e) => updateRentalCar(traveler.id, c.id, { pickupDateTime: e.target.value ? new Date(e.target.value) : null })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Dropoff</Label>
                          <Input
                            type="datetime-local"
                            value={c.dropoffDateTime ? c.dropoffDateTime.toISOString().slice(0, 16) : ""}
                            onChange={(e) => updateRentalCar(traveler.id, c.id, { dropoffDateTime: e.target.value ? new Date(e.target.value) : null })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Pickup Location</Label>
                          <Input value={c.pickupLocation} onChange={(e) => updateRentalCar(traveler.id, c.id, { pickupLocation: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Dropoff Location</Label>
                          <Input value={c.dropoffLocation} onChange={(e) => updateRentalCar(traveler.id, c.id, { dropoffLocation: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Vendor</Label>
                          <Input value={c.vendor || ""} onChange={(e) => updateRentalCar(traveler.id, c.id, { vendor: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Class</Label>
                          <Input value={c.carClass || ""} onChange={(e) => updateRentalCar(traveler.id, c.id, { carClass: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Cost</Label>
                          <Input value={c.cost || ""} onChange={(e) => updateRentalCar(traveler.id, c.id, { cost: e.target.value })} />
                        </div>
                        <div className="flex items-end">
                          <Button variant="outline" size="sm" onClick={() => removeRentalCar(traveler.id, c.id)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Per Diem */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Per Diem</h4>
                      <Button variant="outline" size="sm" onClick={() => recalcPerDiem(traveler.id)}>
                        <RefreshCw className="h-4 w-4 mr-2" /> Recalculate from Master
                      </Button>
                    </div>
                    {traveler.perDiem.length === 0 && (
                      <p className="text-sm text-gray-500">No per diem rows. Click "Recalculate from Master" to generate from selected destinations.</p>
                    )}
                    {traveler.perDiem.length > 0 && (
                      <div className="grid grid-cols-12 gap-2 text-sm">
                        <div className="col-span-4 font-medium text-gray-600">Location</div>
                        <div className="col-span-2 font-medium text-gray-600">Daily Rate</div>
                        <div className="col-span-2 font-medium text-gray-600">Days</div>
                        <div className="col-span-2 font-medium text-gray-600">Total</div>
                        <div className="col-span-2" />
                        {traveler.perDiem.map((p) => (
                          <div key={p.id} className="contents">
                            <div className="col-span-4">
                              <Input value={destinations.find((d) => d.value === p.location)?.label || p.location} disabled />
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                value={p.dailyRate}
                                onChange={(e) => updatePerDiemItem(traveler.id, p.id, { dailyRate: Number(e.target.value || 0) })}
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                value={p.days}
                                onChange={(e) => updatePerDiemItem(traveler.id, p.id, { days: Number(e.target.value || 0) })}
                              />
                            </div>
                            <div className="col-span-2 flex items-center">${(p.total || 0).toLocaleString()}</div>
                            <div className="col-span-2" />
                          </div>
                        ))}
                        <div className="col-span-8 text-right font-semibold">Grand Total</div>
                        <div className="col-span-2 font-semibold">
                          ${traveler.perDiem.reduce((s, r) => s + (r.total || 0), 0).toLocaleString()}
                        </div>
                        <div className="col-span-2" />
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Cost Information (global estimate) */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Information</CardTitle>
          <CardDescription>Estimated costs and budget allocation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Cost Center *</Label>
              <Input
                placeholder="Cost center code"
                value={""}
                onChange={() => {}}
              />
            </div>
            <div className="space-y-2">
              <Label>WBS (Optional)</Label>
              <Input placeholder="Work breakdown structure" value={""} onChange={() => {}} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button variant="outline" onClick={handleSaveRequest}>
          Save Draft
        </Button>
        <Button onClick={handleSubmitRequest}>
          Submit for Approval
        </Button>
      </div>
    </div>
  );
}
