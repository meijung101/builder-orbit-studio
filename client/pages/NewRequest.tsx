import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  DollarSign, 
  Plus, 
  Minus,
  Save,
  Send,
  X
} from "lucide-react";
import { DateRange } from "react-day-picker";

interface TravelerInfo {
  id: string;
  metaProId: string;
  name: string;
  department: string;
  title: string;
  passportName: string;
  dateOfBirth: Date | null;
  travelDates: DateRange | undefined;
}

interface FlightHotelInfo {
  id: string;
  type: "flight" | "hotel";
  departureCheckIn: Date | null;
  arrivalCheckOut: Date | null;
  departureLocation: string;
  arrivalLocation: string;
  flightNumber?: string;
}

const tripTypes: ComboboxOption[] = [
  { value: "general", label: "General Business Trip" },
  { value: "project", label: "Project Trip" },
  { value: "training", label: "Training & Development" },
  { value: "conference", label: "Conference & Events" },
];

const mockEmployees: ComboboxOption[] = [
  { 
    value: "emp001", 
    label: "John Doe (EMP001)", 
    metadata: { department: "Engineering", title: "Senior Developer" } 
  },
  { 
    value: "emp002", 
    label: "Jane Smith (EMP002)", 
    metadata: { department: "Marketing", title: "Marketing Manager" } 
  },
  { 
    value: "emp003", 
    label: "Mike Johnson (EMP003)", 
    metadata: { department: "Sales", title: "Sales Director" } 
  },
];

const destinations: MultiSelectOption[] = [
  { value: "seoul", label: "Seoul, South Korea" },
  { value: "tokyo", label: "Tokyo, Japan" },
  { value: "singapore", label: "Singapore" },
  { value: "hong-kong", label: "Hong Kong" },
  { value: "shanghai", label: "Shanghai, China" },
  { value: "bangkok", label: "Bangkok, Thailand" },
];

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

  const [travelers, setTravelers] = useState<TravelerInfo[]>([
    {
      id: "1",
      metaProId: "",
      name: "",
      department: "",
      title: "",
      passportName: "",
      dateOfBirth: null,
      travelDates: undefined,
    }
  ]);

  const [flightHotelInfo, setFlightHotelInfo] = useState<FlightHotelInfo[]>([
    {
      id: "1",
      type: "flight",
      departureCheckIn: null,
      arrivalCheckOut: null,
      departureLocation: "",
      arrivalLocation: "",
      flightNumber: "",
    }
  ]);

  const [costs, setCosts] = useState({
    airCost: "",
    hotelCost: "",
    carRentalCost: "",
    perDiemCost: "",
    costCenter: "",
    wbs: "",
  });

  const addTraveler = () => {
    const newTraveler: TravelerInfo = {
      id: Date.now().toString(),
      metaProId: "",
      name: "",
      department: "",
      title: "",
      passportName: "",
      dateOfBirth: null,
      travelDates: undefined,
    };
    setTravelers([...travelers, newTraveler]);
    setFormData({ ...formData, numberOfTravelers: travelers.length + 1 });
  };

  const removeTraveler = (id: string) => {
    if (travelers.length > 1) {
      setTravelers(travelers.filter(t => t.id !== id));
      setFormData({ ...formData, numberOfTravelers: travelers.length - 1 });
    }
  };

  const updateTraveler = (id: string, updates: Partial<TravelerInfo>) => {
    setTravelers(travelers.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addFlightHotel = () => {
    const newEntry: FlightHotelInfo = {
      id: Date.now().toString(),
      type: "flight",
      departureCheckIn: null,
      arrivalCheckOut: null,
      departureLocation: "",
      arrivalLocation: "",
      flightNumber: "",
    };
    setFlightHotelInfo([...flightHotelInfo, newEntry]);
  };

  const removeFlightHotel = (id: string) => {
    if (flightHotelInfo.length > 1) {
      setFlightHotelInfo(flightHotelInfo.filter(f => f.id !== id));
    }
  };

  const updateFlightHotel = (id: string, updates: Partial<FlightHotelInfo>) => {
    setFlightHotelInfo(flightHotelInfo.map(f => f.id === id ? { ...f, ...updates } : f));
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
    // Save as draft logic
    alert("Request saved as draft");
  };

  const handleSubmitRequest = () => {
    // Submit for approval logic
    alert("Request submitted for approval");
    navigate("/requests");
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      navigate("/");
    }
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

      {/* Traveler Information Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Traveler Information</CardTitle>
              <CardDescription>Details for each traveler</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  // Duplicate the currently active traveler into a new tab
                  setTravelers((prev) => {
                    const source = prev.find((t) => t.id === activeTravelerId) || prev[prev.length - 1];
                    const clone = { ...source, id: Date.now().toString() };
                    const next = [...prev, clone];
                    setFormData((fd) => ({ ...fd, numberOfTravelers: next.length }));
                    setActiveTravelerId(clone.id);
                    return next;
                  });
                }}
                variant="outline"
                size="sm"
              >
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
                        <button
                          className="ml-1 rounded p-0.5 text-gray-400 hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTravelers((prev) => {
                              if (prev.length <= 1) return prev;
                              const idxToRemove = prev.findIndex((x) => x.id === t.id);
                              const next = prev.filter((x) => x.id !== t.id);
                              setFormData((fd) => ({ ...fd, numberOfTravelers: next.length }));
                              if (t.id === activeTravelerId) {
                                const nextIdx = Math.max(0, idxToRemove - 1);
                                setActiveTravelerId(next[nextIdx]?.id ?? next[0]?.id);
                              }
                              return next;
                            });
                          }}
                          aria-label={`Remove ${t.passportName || t.name || `Traveler ${idx + 1}`}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {travelers.map((traveler, index) => (
                <TabsContent key={traveler.id} value={traveler.id} className="mt-4">
                  <div className="border rounded-lg p-4 space-y-4">
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
                        <Input
                          value={traveler.name}
                          onChange={(e) => updateTraveler(traveler.id, { name: e.target.value })}
                          placeholder="Employee name"
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Input
                          value={traveler.department}
                          onChange={(e) => updateTraveler(traveler.id, { department: e.target.value })}
                          placeholder="Department"
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={traveler.title}
                          onChange={(e) => updateTraveler(traveler.id, { title: e.target.value })}
                          placeholder="Job title"
                          disabled
                        />
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
                          value={traveler.dateOfBirth ? traveler.dateOfBirth.toISOString().split('T')[0] : ""}
                          onChange={(e) => updateTraveler(traveler.id, {
                            dateOfBirth: e.target.value ? new Date(e.target.value) : null
                          })}
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
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Flight & Hotel Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Flight & Hotel Information</CardTitle>
              <CardDescription>Itinerary details</CardDescription>
            </div>
            <Button onClick={addFlightHotel} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {flightHotelInfo.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h4 className="font-medium">Entry {index + 1}</h4>
                  <Select
                    value={entry.type}
                    onValueChange={(value: "flight" | "hotel") => updateFlightHotel(entry.id, { type: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flight">Flight</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {flightHotelInfo.length > 1 && (
                  <Button onClick={() => removeFlightHotel(entry.id)} variant="outline" size="sm">
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>{entry.type === "flight" ? "Departure Date" : "Check-in Date"}</Label>
                  <Input
                    type="datetime-local"
                    value={entry.departureCheckIn ? entry.departureCheckIn.toISOString().slice(0, 16) : ""}
                    onChange={(e) => updateFlightHotel(entry.id, { 
                      departureCheckIn: e.target.value ? new Date(e.target.value) : null 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{entry.type === "flight" ? "Arrival Date" : "Check-out Date"}</Label>
                  <Input
                    type="datetime-local"
                    value={entry.arrivalCheckOut ? entry.arrivalCheckOut.toISOString().slice(0, 16) : ""}
                    onChange={(e) => updateFlightHotel(entry.id, { 
                      arrivalCheckOut: e.target.value ? new Date(e.target.value) : null 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{entry.type === "flight" ? "Departure Location" : "Check-in Location"}</Label>
                  <Input
                    value={entry.departureLocation}
                    onChange={(e) => updateFlightHotel(entry.id, { departureLocation: e.target.value })}
                    placeholder="Location"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{entry.type === "flight" ? "Arrival Location" : "Check-out Location"}</Label>
                  <Input
                    value={entry.arrivalLocation}
                    onChange={(e) => updateFlightHotel(entry.id, { arrivalLocation: e.target.value })}
                    placeholder="Location"
                  />
                </div>
              </div>

              {entry.type === "flight" && (
                <div className="space-y-2">
                  <Label>Flight Number</Label>
                  <Input
                    value={entry.flightNumber}
                    onChange={(e) => updateFlightHotel(entry.id, { flightNumber: e.target.value })}
                    placeholder="Flight number"
                  />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cost Information */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Information</CardTitle>
          <CardDescription>Estimated costs and budget allocation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Air Cost</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="0.00"
                  value={costs.airCost}
                  onChange={(e) => setCosts({ ...costs, airCost: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hotel Cost</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="0.00"
                  value={costs.hotelCost}
                  onChange={(e) => setCosts({ ...costs, hotelCost: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Car Rental Cost</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="0.00"
                  value={costs.carRentalCost}
                  onChange={(e) => setCosts({ ...costs, carRentalCost: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Per Diem Cost</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="0.00"
                  value={costs.perDiemCost}
                  onChange={(e) => setCosts({ ...costs, perDiemCost: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cost Center *</Label>
              <Input
                placeholder="Cost center code"
                value={costs.costCenter}
                onChange={(e) => setCosts({ ...costs, costCenter: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>WBS (Optional)</Label>
              <Input
                placeholder="Work breakdown structure"
                value={costs.wbs}
                onChange={(e) => setCosts({ ...costs, wbs: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cash Advance</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="0.00"
                value={formData.cashAdvance}
                onChange={(e) => setFormData({ ...formData, cashAdvance: e.target.value })}
                className="pl-10 bg-gray-50"
                disabled
              />
            </div>
            <p className="text-xs text-gray-500">Cash advance will be available after SAP integration</p>
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
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button onClick={handleSubmitRequest}>
          <Send className="h-4 w-4 mr-2" />
          Submit for Approval
        </Button>
      </div>
    </div>
  );
}
