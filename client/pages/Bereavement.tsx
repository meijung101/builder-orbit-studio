import { useMemo, useState } from "react";
import { Heart, User, CheckCircle, FileText, Phone, Mail, Search, Calendar, Clock } from "lucide-react";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  manager: string;
  title: string;
}

export default function BereavementRequestForm() {
  const currentUser = {
    name: "Jennifer Davis",
    firstName: "Jennifer",
    lastName: "Davis",
    department: "Marketing",
    email: "jennifer.davis@company.com",
    phone: "",
  };

  const mockEmployees: Employee[] = [
    { id: "EMP005", firstName: "Robert", lastName: "Brown", department: "Marketing", manager: "Jennifer Davis", title: "Marketing Coordinator" },
    { id: "EMP006", firstName: "Emily", lastName: "Wilson", department: "Marketing", manager: "Jennifer Davis", title: "Digital Marketing Specialist" },
    { id: "EMP020", firstName: "Jennifer", lastName: "Davis", department: "Marketing", manager: "Patricia Lee", title: "Marketing Manager" },
    { id: "EMP021", firstName: "Carlos", lastName: "Martinez", department: "Marketing", manager: "Jennifer Davis", title: "Content Writer" },
    { id: "EMP022", firstName: "Sophie", lastName: "Turner", department: "Marketing", manager: "Jennifer Davis", title: "Graphic Designer" },
    { id: "EMP023", firstName: "Alex", lastName: "Thompson", department: "Marketing", manager: "Jennifer Davis", title: "Social Media Manager" },
    { id: "EMP024", firstName: "Rachel", lastName: "Green", department: "Marketing", manager: "Jennifer Davis", title: "Campaign Manager" },
    { id: "EMP001", firstName: "John", lastName: "Smith", department: "Human Resources", manager: "Sarah Johnson", title: "HR Specialist" },
    { id: "EMP002", firstName: "Maria", lastName: "Garcia", department: "Human Resources", manager: "Sarah Johnson", title: "Recruiter" },
    { id: "EMP003", firstName: "David", lastName: "Chen", department: "Engineering", manager: "Mike Wilson", title: "Senior Developer" },
    { id: "EMP004", firstName: "Lisa", lastName: "Johnson", department: "Engineering", manager: "Mike Wilson", title: "Software Engineer" },
  ];

  const [userRole, setUserRole] = useState("requestor");
  const [formData, setFormData] = useState({
    requestorName: currentUser.name,
    department: currentUser.department,
    contactEmail: currentUser.email,
    contactPhone: "",
    employeeFirstName: currentUser.firstName,
    employeeLastName: currentUser.lastName,
    employeeId: "EMP020",
    employeeSearchQuery: currentUser.name,
    employeeDepartment: currentUser.department,
    managerName: "Patricia Lee",
    deceasedPersonName: "",
    relationshipToEmployee: "",
    funeralDate: "",
    funeralTime: "",
    additionalNotes: "",
    invoiceNumber: "",
    invoiceAmount: "",
    confirmAccuracy: false,
  });

  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [departmentError, setDepartmentError] = useState("");

  const filteredEmployees = useMemo(() => {
    if (!formData.employeeSearchQuery || formData.employeeSearchQuery.length < 2) return [] as Employee[];
    const query = formData.employeeSearchQuery.toLowerCase();
    return mockEmployees.filter(
      (emp) =>
        ((emp.firstName + " " + emp.lastName).toLowerCase().includes(query) ||
          emp.id.toLowerCase().includes(query) ||
          emp.title.toLowerCase().includes(query)) && emp.department === formData.department,
    );
  }, [formData.employeeSearchQuery, formData.department]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "department") setDepartmentError("");
  };

  const handleEmployeeSearch = (query: string) => {
    handleInputChange("employeeSearchQuery", query);
    if (query.length >= 2) setShowEmployeeDropdown(true);
    else setShowEmployeeDropdown(false);
  };

  const selectEmployee = (employee: Employee) => {
    if (employee.department !== formData.department) {
      setDepartmentError("You can only request gifts for employees in your same department.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      employeeFirstName: employee.firstName,
      employeeLastName: employee.lastName,
      employeeId: employee.id,
      employeeSearchQuery: `${employee.firstName} ${employee.lastName}`,
      employeeDepartment: employee.department,
      managerName: employee.manager,
    }));
    setShowEmployeeDropdown(false);
    setDepartmentError("");
  };

  const handleNext = () => {
    if (currentSection < (userRole === "ga_staff" ? 5 : 4)) setCurrentSection(currentSection + 1);
  };
  const handlePrevious = () => {
    if (currentSection > 1) setCurrentSection(currentSection - 1);
  };
  const handleSubmit = () => {
    if (!formData.confirmAccuracy) {
      alert("Please confirm the accuracy of the information before submitting.");
      return;
    }
    setIsSubmitted(true);
  };

  const handleNewRequest = () => {
    setFormData({
      requestorName: currentUser.name,
      department: currentUser.department,
      contactEmail: currentUser.email,
      contactPhone: "",
      employeeFirstName: currentUser.firstName,
      employeeLastName: currentUser.lastName,
      employeeId: "EMP020",
      employeeSearchQuery: currentUser.name,
      employeeDepartment: currentUser.department,
      managerName: "Patricia Lee",
      deceasedPersonName: "",
      relationshipToEmployee: "",
      funeralDate: "",
      funeralTime: "",
      additionalNotes: "",
      invoiceNumber: "",
      invoiceAmount: "",
      confirmAccuracy: false,
    });
    setCurrentSection(1);
    setIsSubmitted(false);
    setShowEmployeeDropdown(false);
    setDepartmentError("");
  };

  const isCurrentSectionValid = () => {
    switch (currentSection) {
      case 1:
        return formData.requestorName && formData.department && formData.contactEmail && formData.contactPhone;
      case 2:
        return formData.employeeFirstName && formData.employeeLastName && formData.employeeId && !departmentError;
      case 3:
        return formData.deceasedPersonName && formData.relationshipToEmployee && formData.funeralDate && formData.funeralTime;
      case 4:
        if (userRole === "requestor") return formData.confirmAccuracy;
        else return formData.invoiceNumber && formData.invoiceAmount;
      case 5:
        return formData.confirmAccuracy;
      default:
        return true;
    }
  };

  const maxSections = userRole === "ga_staff" ? 5 : 4;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Submitted</h2>
          <p className="text-gray-600 mb-6">
            Your bereavement gift request has been submitted successfully. HR will review and process your request within 24-48 hours.
          </p>
          <div className="bg-gray-50 rounded p-4 text-left">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Request ID:</strong> BR-{Date.now().toString().slice(-6)}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Employee:</strong> {formData.employeeFirstName} {formData.employeeLastName} ({formData.employeeId})
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Deceased:</strong> {formData.deceasedPersonName} ({formData.relationshipToEmployee})
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Funeral:</strong> {formData.funeralDate} at {formData.funeralTime}
            </p>
            {formData.additionalNotes && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Notes:</strong> {formData.additionalNotes}
              </p>
            )}
          </div>
          <button onClick={handleNewRequest} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Employee Bereavement Gift Request</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setUserRole("requestor")}
                  className={`px-3 py-1 rounded text-sm ${userRole === "requestor" ? "bg-white text-blue-600" : "bg-blue-500 text-white hover:bg-blue-400"} transition-colors`}
                >
                  Requestor
                </button>
                <button
                  onClick={() => setUserRole("ga_staff")}
                  className={`px-3 py-1 rounded text-sm ${userRole === "ga_staff" ? "bg-white text-blue-600" : "bg-blue-500 text-white hover:bg-blue-400"} transition-colors`}
                >
                  GA Staff
                </button>
              </div>
            </div>
            <p className="text-blue-100">Express sympathy and support during difficult times{userRole === "ga_staff" && " - Processing Mode"}</p>
          </div>

          <div className="bg-gray-100 px-6 py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Section {currentSection} of {maxSections}</span>
              <span className="text-sm text-gray-500">{Math.round((currentSection / maxSections) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentSection / maxSections) * 100}%` }} />
            </div>
          </div>

          <div className="p-6">
            {currentSection === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Requestor Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                    <input type="text" value={formData.requestorName} onChange={(e) => handleInputChange("requestorName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" readOnly />
                    <p className="text-xs text-gray-500 mt-1">Prepopulated from your profile</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Department *</label>
                    <input type="text" value={formData.department} onChange={(e) => handleInputChange("department", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" readOnly />
                    <p className="text-xs text-gray-500 mt-1">You can only request gifts for employees in your same department</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Mail className="w-4 h-4 inline mr-1" />Contact Email</label>
                    <input type="email" value={formData.contactEmail} onChange={(e) => handleInputChange("contactEmail", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" readOnly />
                    <p className="text-xs text-gray-500 mt-1">Prepopulated from your profile</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Phone className="w-4 h-4 inline mr-1" />Contact Phone *</label>
                    <input type="tel" value={formData.contactPhone} onChange={(e) => handleInputChange("contactPhone", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your phone number" />
                    <p className="text-xs text-gray-500 mt-1">Please provide your current phone number</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="font-medium text-blue-800 mb-2">ℹ️ Prepopulated Information</h3>
                  <p className="text-sm text-blue-700">Your name, department, and email have been automatically filled from your user profile. Only your contact phone number needs to be entered.</p>
                </div>
              </div>
            )}

            {currentSection === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Search className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Employee Information</h2>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                  <p className="text-yellow-800 text-sm"><strong>Note:</strong> Employee information defaults to requestor. You can search to select a different employee from your department.</p>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Employee by Name or ID</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={formData.employeeSearchQuery} onChange={(e) => handleEmployeeSearch(e.target.value)} onFocus={() => formData.employeeSearchQuery.length >= 2 && setShowEmployeeDropdown(true)} onBlur={() => setTimeout(() => setShowEmployeeDropdown(false), 200)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type at least 2 characters to search..." />
                  </div>

                  {showEmployeeDropdown && filteredEmployees.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredEmployees.map((employee) => (
                        <button key={employee.id} type="button" onClick={() => selectEmployee(employee)} className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                              <div className="text-sm text-gray-500">{employee.id} • {employee.title}</div>
                              <div className="text-xs text-gray-400">Manager: {employee.manager} • {employee.department}</div>
                            </div>
                            <div className="text-xs text-blue-600">Select</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="font-medium text-green-800 mb-3">Selected Employee:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>First Name:</strong> {formData.employeeFirstName}</div>
                    <div><strong>Last Name:</strong> {formData.employeeLastName}</div>
                    <div><strong>Employee ID:</strong> {formData.employeeId}</div>
                    <div><strong>Department:</strong> {formData.employeeDepartment}</div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="font-medium text-blue-800 mb-2">💡 Search Tips:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Try searching: "Robert", "Emily", "EMP005", "Coordinator"</li>
                    <li>• Only employees in your department ({formData.department}) will appear</li>
                    <li>• Search works with names, employee IDs, or job titles</li>
                  </ul>
                </div>
              </div>
            )}

            {currentSection === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Bereavement Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deceased Person Name *</label>
                    <input type="text" value={formData.deceasedPersonName} onChange={(e) => handleInputChange("deceasedPersonName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full name of the deceased" />
                  </div>

                  <div>
                    <label className="block text sm font-medium text-gray-700 mb-2">Relationship to Employee *</label>
                    <select value={formData.relationshipToEmployee} onChange={(e) => handleInputChange("relationshipToEmployee", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Father-in-law">Father-in-law</option>
                      <option value="Mother-in-law">Mother-in-law</option>
                      <option value="Grandfather">Grandfather</option>
                      <option value="Grandmother">Grandmother</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Calendar className="w-4 h-4 inline mr-1" />Funeral Date *</label>
                    <input type="date" value={formData.funeralDate} onChange={(e) => handleInputChange("funeralDate", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Clock className="w-4 h-4 inline mr-1" />Funeral Time *</label>
                    <input type="time" value={formData.funeralTime} onChange={(e) => handleInputChange("funeralTime", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h3 className="font-medium text-gray-800 mb-2">📝 Additional Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea value={formData.additionalNotes} onChange={(e) => handleInputChange("additionalNotes", e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Any special considerations, additional information, or specific requests..." />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">This information helps us coordinate appropriate sympathy gestures and timing for gift delivery.</p>
                </div>
              </div>
            )}

            {currentSection === 4 && (
              <div className="space-y-6">
                {userRole === "ga_staff" ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-800">Invoice Information</h2>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">GA Staff Only</span>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                      <p className="text-blue-800 text-sm"><strong>New Fields per Business Requirements:</strong> Invoice information to be entered by GA staff for processing and record keeping.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number * <span className="text-blue-600 text-xs">(New Field)</span></label>
                        <input type="text" value={formData.invoiceNumber} onChange={(e) => handleInputChange("invoiceNumber", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter invoice number" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Amount * <span className="text-blue-600 text-xs">(New Field)</span></label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input type="number" step="0.01" value={formData.invoiceAmount} onChange={(e) => handleInputChange("invoiceAmount", e.target.value)} className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-800">Summary of Details</h2>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-gray-800">Request Summary:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>Requestor:</strong> {formData.requestorName}</div>
                        <div><strong>Department:</strong> {formData.department}</div>
                        <div><strong>Contact Phone:</strong> {formData.contactPhone}</div>
                        <div><strong>Contact Email:</strong> {formData.contactEmail}</div>
                        <div><strong>Employee:</strong> {formData.employeeFirstName} {formData.employeeLastName}</div>
                        <div><strong>Employee ID:</strong> {formData.employeeId}</div>
                        <div><strong>Deceased Person:</strong> {formData.deceasedPersonName}</div>
                        <div><strong>Relationship:</strong> {formData.relationshipToEmployee}</div>
                        <div><strong>Funeral Date:</strong> {formData.funeralDate}</div>
                        <div><strong>Funeral Time:</strong> {formData.funeralTime}</div>
                        {formData.additionalNotes && (
                          <div className="md:col-span-2"><strong>Additional Notes:</strong> {formData.additionalNotes}</div>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <h3 className="font-medium text-blue-800 mb-2">📋 Ready for Submission</h3>
                      <p className="text-sm text-blue-700">Please review all information above carefully before submitting your bereavement gift request.</p>
                    </div>

                    <div className="flex items-start">
                      <input type="checkbox" checked={formData.confirmAccuracy} onChange={(e) => handleInputChange("confirmAccuracy", e.target.checked)} className="mt-1 mr-3" id="confirm-accuracy" />
                      <label htmlFor="confirm-accuracy" className="text-sm text-gray-700">I confirm the above information is accurate and acknowledge this request will be processed according to HR guidelines. I understand that this request requires manager and HR approval before processing.</label>
                    </div>
                  </>
                )}
              </div>
            )}

            {currentSection === 5 && userRole === "ga_staff" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Final Review & Processing</h2>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-gray-800">Complete Request Summary:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Requestor:</strong> {formData.requestorName}</div>
                    <div><strong>Department:</strong> {formData.department}</div>
                    <div><strong>Employee:</strong> {formData.employeeFirstName} {formData.employeeLastName}</div>
                    <div><strong>Employee ID:</strong> {formData.employeeId}</div>
                    <div><strong>Deceased:</strong> {formData.deceasedPersonName}</div>
                    <div><strong>Relationship:</strong> {formData.relationshipToEmployee}</div>
                    <div><strong>Funeral:</strong> {formData.funeralDate} at {formData.funeralTime}</div>
                    {formData.additionalNotes && (<div className="md:col-span-2"><strong>Additional Notes:</strong> {formData.additionalNotes}</div>)}
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Invoice Information:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><strong>Invoice Number:</strong> {formData.invoiceNumber}</div>
                      <div><strong>Amount:</strong> ${formData.invoiceAmount}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <input type="checkbox" checked={formData.confirmAccuracy} onChange={(e) => handleInputChange("confirmAccuracy", e.target.checked)} className="mt-1 mr-3" id="confirm-ga-accuracy" />
                  <label htmlFor="confirm-ga-accuracy" className="text-sm text-gray-700">I confirm that all information has been reviewed and is accurate. This request is ready for final processing and fulfillment.</label>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-6 border-t">
              <button type="button" onClick={handlePrevious} disabled={currentSection === 1} className={`px-6 py-2 rounded-md ${currentSection === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-600 text-white hover:bg-gray-700"} transition-colors`}>
                Previous
              </button>
              <div className="text-sm text-gray-500">Step {currentSection} of {maxSections}</div>
              {currentSection < maxSections ? (
                <button type="button" onClick={handleNext} disabled={!isCurrentSectionValid()} className={`px-6 py-2 rounded-md ${!isCurrentSectionValid() ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"} transition-colors`}>
                  Next
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={!isCurrentSectionValid()} className={`px-8 py-3 text-lg font-semibold rounded-md ${!isCurrentSectionValid() ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700 shadow-lg"} transition-all duration-200`}>
                  🚀 Submit Request
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
