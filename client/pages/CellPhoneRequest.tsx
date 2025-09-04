import { useState, useEffect, useCallback, memo } from 'react';
import { ChevronRight, ChevronLeft, Check, AlertCircle, Phone, User, FileText, Users, CheckCircle2 } from 'lucide-react';

// Sample employee data
const sampleEmployees = [
  { metaProId: 'MP2024001', name: 'John Smith', title: 'Senior Manager', department: 'Operations', email: 'john.smith@hmgma.com', phoneNumber: '555-444-1234' },
  { metaProId: 'MP2024002', name: 'Sarah Johnson', title: 'Manager', department: 'Quality', email: 'sarah.johnson@hmgma.com', phoneNumber: '555-444-2345' },
  { metaProId: 'MP2024003', name: 'Mike Chen', title: 'Assistant Manager', department: 'Production', email: 'mike.chen@hmgma.com', phoneNumber: '555-444-3456' },
  { metaProId: 'MP2024004', name: 'Lisa Rodriguez', title: 'Safety Officer', department: 'Safety', email: 'lisa.rodriguez@hmgma.com', phoneNumber: '555-444-4567' },
  { metaProId: 'MP2024005', name: 'David Park', title: 'Team Lead', department: 'Maintenance', email: 'david.park@hmgma.com', phoneNumber: '555-444-5678' },
  { metaProId: 'MP2024006', name: 'Jennifer Lee', title: 'Security Officer', department: 'Security', email: 'jennifer.lee@hmgma.com', phoneNumber: '555-444-6789' },
  { metaProId: 'MP2024007', name: 'Robert Taylor', title: 'Supervisor', department: 'Engineering', email: 'robert.taylor@hmgma.com', phoneNumber: '555-444-7890' },
  { metaProId: 'MP2024008', name: 'Amy Wilson', title: 'Team Member', department: 'General Affairs', email: 'amy.wilson@hmgma.com', phoneNumber: '555-444-8901' },
  { metaProId: 'MP2024009', name: 'Carlos Martinez', title: 'Sr. Manager', department: 'IT', email: 'carlos.martinez@hmgma.com', phoneNumber: '555-444-9012' },
  { metaProId: 'MP2024010', name: 'Emily Davis', title: 'Assistant Manager', department: 'Operations', email: 'emily.davis@hmgma.com', phoneNumber: '555-444-0123' }
];

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Request Details', icon: Phone },
  { id: 3, title: 'Eligibility & Costs', icon: AlertCircle },
  { id: 4, title: 'Terms & Disclaimer', icon: FileText },
  { id: 5, title: 'Submit & Approval', icon: Users }
];

// Utility functions
const getReplacementCost = (title: string) => {
  if (!title) return 150;
  const titleLower = title.toLowerCase();
  if (titleLower.includes('senior manager') || titleLower.includes('sr. manager')) return 350;
  if (titleLower.includes('manager') && !titleLower.includes('assistant')) return 250;
  return 150;
};

const needsPreApproval = (title: string) => {
  if (!title) return true;
  const titleLower = title.toLowerCase();
  return titleLower.includes('assistant manager') || (!titleLower.includes('manager') && !titleLower.includes('supervisor'));
};

const filterEmployees = (term: string) => {
  if (!term) return sampleEmployees;
  return sampleEmployees.filter(employee => 
    employee.metaProId.toLowerCase().includes(term.toLowerCase()) ||
    employee.name.toLowerCase().includes(term.toLowerCase())
  );
};

// Step Indicator Component
const StepIndicator = memo(({ currentStep }: { currentStep: number }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      {steps.map((step) => {
        const Icon = step.icon as any;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        return (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
              isCompleted ? 'bg-green-600 text-white' : 
              isActive ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'
            }`}>
              {isCompleted ? <Check size={20} /> : <Icon size={20} />}
            </div>
            <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-primary h-2 rounded-full transition-all duration-300" 
           style={{ width: `${(currentStep / steps.length) * 100}%` }} />
    </div>
  </div>
));

// Personal Info Step Component
const PersonalInfoStep = memo(({ 
  formData, 
  searchTerm, 
  isDropdownOpen, 
  highlightedIndex, 
  filteredEmployees,
  onSearchChange,
  onEmployeeSelect,
  onKeyDown,
  onInputFocus,
  onInputBlur,
  onHighlightChange
}: any) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Requestor Information</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Pro ID *
          <span className="text-xs text-gray-500 ml-2">(Type to search or enter custom ID)</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            onKeyDown={onKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Type Meta Pro ID or employee name..."
            autoComplete="off"
          />
          
          {isDropdownOpen && filteredEmployees.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredEmployees.map((employee: any, index: number) => (
                <div
                  key={employee.metaProId}
                  className={`px-3 py-2 cursor-pointer ${
                    index === highlightedIndex
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-gray-100'
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onEmployeeSelect(employee.metaProId)}
                  onMouseEnter={() => onHighlightChange(index)}
                >
                  <div className="font-medium">{employee.metaProId} - {employee.name}</div>
                  <div className="text-sm text-gray-600">{employee.title}, {employee.department}</div>
                </div>
              ))}
            </div>
          )}
          
          {isDropdownOpen && filteredEmployees.length === 0 && searchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="px-3 py-2 text-gray-500 text-sm">
                No employees found. Press Enter to use "{searchTerm}" as custom ID.
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <input
          type="text"
          value={formData.name}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          placeholder="Auto-filled when valid employee selected"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
        <input
          type="text"
          value={formData.title}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          placeholder="Auto-filled when valid employee selected"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
        <input
          type="text"
          value={formData.department}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          placeholder="Auto-filled when valid employee selected"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          value={formData.email}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          placeholder="Auto-filled when valid employee selected"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <input
          type="tel"
          value={formData.phoneNumber}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          placeholder="Auto-filled when valid employee selected"
        />
      </div>
    </div>

    {formData.name && (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <div className="flex items-center">
          <CheckCircle2 className="text-green-600 mr-2" size={20} />
          <span className="text-green-700 font-medium">Employee information loaded for {formData.name}</span>
        </div>
      </div>
    )}

    {formData.metaProId && !formData.name && (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <div className="flex items-center">
          <AlertCircle className="text-yellow-500 mr-2" size={20} />
          <span className="text-yellow-700 font-medium">Using custom Meta Pro ID: {formData.metaProId}</span>
        </div>
        <p className="text-yellow-700 text-sm mt-1">
          This ID is not in our employee database. Please ensure it's correct before proceeding.
        </p>
      </div>
    )}
  </div>
));

// Request Details Step Component
const RequestDetailsStep = memo(({ formData, onUpdateFormData }: any) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Details</h2>
    
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Request Date</label>
        <input
          type="date"
          value={formData.requestDate}
          onChange={(e) => onUpdateFormData('requestDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Request *</label>
        <select
          value={formData.reasonForRequest}
          onChange={(e) => onUpdateFormData('reasonForRequest', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select Reason</option>
          <option value="new-hire">New Employee</option>
          <option value="replacement-damaged">Replacement - Damaged</option>
          <option value="replacement-lost">Replacement - Lost/Stolen</option>
          <option value="emergency-personnel">Emergency Response Personnel</option>
          <option value="constant-contact">Requires Constant Contact</option>
          <option value="upgrade">Device Upgrade</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Explanation 
          <span className="text-sm text-gray-500">(who, how often, why needed)</span>
        </label>
        <textarea
          value={formData.reasonDetails}
          onChange={(e) => onUpdateFormData('reasonDetails', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Please provide detailed explanation of why you need a company cell phone, including who you need to contact, how often, and business justification..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Phone Type *</label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="phoneType"
              value="iOS"
              checked={formData.phoneType === 'iOS'}
              onChange={(e) => onUpdateFormData('phoneType', e.target.value)}
              className="mr-3"
            />
            <span className="font-medium">iPhone (iOS)</span>
          </label>
          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="phoneType"
              value="Android"
              checked={formData.phoneType === 'Android'}
              onChange={(e) => onUpdateFormData('phoneType', e.target.value)}
              className="mr-3"
            />
            <span className="font-medium">Android</span>
          </label>
        </div>
      </div>
    </div>
  </div>
));

// Eligibility Step Component
const EligibilityStep = memo(({ formData, onUpdateFormData }: any) => {
  const replacementCost = getReplacementCost(formData.title);
  const requiresPreApproval = needsPreApproval(formData.title);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Eligibility & Cost Information</h2>
      
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Eligibility Requirements</h3>
        <div className="space-y-3 text-sm">
          <p>• Non-production Assistant Managers and below must maintain constant contact with team members, vendors, or suppliers during and after working hours</p>
          <p>• Emergency response personnel (Safety, General Affairs, Security departments)</p>
          <p>• Contractors in emergency response roles</p>
        </div>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-amber-800 mb-4">Important Cost Information</h3>
        <div className="space-y-3">
          <p className="text-sm"><strong>Your Replacement Cost (if damaged/lost due to negligence):</strong></p>
          <p className="text-2xl font-bold text-amber-800">${replacementCost}</p>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• This applies only to phones in service for 6+ months</p>
            <p>• Phones under 6 months may be replaced with basic/used devices</p>
            <p>• Manufacturer defects covered under warranty</p>
          </div>
        </div>
      </div>

      {requiresPreApproval && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Pre-Approval Required</h3>
          <p className="text-sm text-red-700">
            Based on your position, you will need additional pre-approval before receiving a company cell phone. 
            Your request will go through the standard approval process.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.eligibilityConfirmed}
            onChange={(e) => onUpdateFormData('eligibilityConfirmed', e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm">
            I confirm that I meet the eligibility requirements for a company-issued cell phone as outlined above.
          </span>
        </label>
        
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.costsUnderstood}
            onChange={(e) => onUpdateFormData('costsUnderstood', e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm">
            I understand the replacement costs and my financial responsibility if the device is damaged, lost, or stolen due to my negligence.
          </span>
        </label>
      </div>
    </div>
  );
});

// Disclaimer Step Component
const DisclaimerStep = memo(({ formData, onUpdateFormData }: any) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Terms & Disclaimer</h2>
    
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
      <h3 className="font-bold text-lg mb-4">HMGMA Cell Phone Usage Disclaimer & Acknowledgment</h3>
      
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">1. Prohibited Downloads</h4>
          <p>I may not download applications, games, or other services that could result in charges to the HMGMA account. If such costs are incurred, I may be required to reimburse HMGMA.</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">2. International Roaming</h4>
          <p>International data or voice roaming is not permitted without prior written approval.</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">3. Business Use Only (Assistant Managers and below)</h4>
          <p>I agree to use the cell phone strictly for necessary business purposes. I will not use, nor permit others to use, the phone for personal calls unrelated to HMGMA business.</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">4. Return Obligation</h4>
          <p>I agree to return the company-issued cell phone and accessories on or before any designated return date.</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">5. Company Ownership & Monitoring</h4>
          <p className="text-red-700 font-medium">The cell phone is HMGMA property. I have NO expectation of privacy. HMGMA reserves the right to access, monitor, record, or review all information/data on the phone.</p>
        </div>
      </div>
    </div>
    
    <div className="space-y-4">
      <label className="flex items-start space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.disclaimerAccepted}
          onChange={(e) => onUpdateFormData('disclaimerAccepted', e.target.checked)}
          className="mt-1"
        />
        <span className="text-sm">
          <strong>I have read, understood, and agree to comply with all terms and conditions outlined above regarding the use of an HMGMA-issued cell phone.</strong>
        </span>
      </label>
      
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Electronic Signature *</label>
        <input
          type="text"
          value={formData.signature}
          onChange={(e) => onUpdateFormData('signature', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type your full name to sign electronically"
        />
        <p className="text-xs text-gray-500 mt-1">By typing your name above, you agree that this constitutes your electronic signature.</p>
      </div>
    </div>
  </div>
));

// Submission Step Component
const SubmissionStep = memo(({ formData }: any) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Request</h2>
    
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <CheckCircle2 className="text-green-600 mr-3" size={24} />
        <h3 className="text-lg font-semibold text-green-800">Request Ready for Submission</h3>
      </div>
      <p className="text-green-700 text-sm mb-4">
        Your cell phone request has been completed and is ready for the approval process.
      </p>
    </div>

    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Request Summary</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><strong>Meta Pro ID:</strong> {formData.metaProId}</div>
        <div><strong>Name:</strong> {formData.name || 'Custom Entry'}</div>
        <div><strong>Title:</strong> {formData.title || 'Not specified'}</div>
        <div><strong>Department:</strong> {formData.department || 'Not specified'}</div>
        <div><strong>Phone Type:</strong> {formData.phoneType}</div>
        <div><strong>Reason:</strong> {formData.reasonForRequest}</div>
        <div><strong>Replacement Cost:</strong> ${getReplacementCost(formData.title)}</div>
      </div>
    </div>

    <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
      <h3 className="font-semibold text-primary mb-4">Next Steps - Approval Process</h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
          <span>Your HOD approval</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
          <span>GA HOD Approval</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
          <span>General Affairs process</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
          <span>Device provisioning and setup</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">5</div>
          <span>Ready for pickup and signoff</span>
        </div>
      </div>
      <p className="text-gray-700 text-sm mt-4">
        You will receive email notifications at each approval stage. Typical processing time is 3-5 business days.
      </p>
    </div>

    <button className="w-full bg-success hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
      Submit Cell Phone Request
    </button>
  </div>
));

// Main Component
const HMGMACellPhoneRequest = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    metaProId: '',
    name: '',
    title: '',
    department: '',
    email: '',
    phoneNumber: '',
    requestDate: new Date().toISOString().split('T')[0],
    reasonForRequest: '',
    reasonDetails: '',
    phoneType: '',
    eligibilityConfirmed: false,
    costsUnderstood: false,
    disclaimerAccepted: false,
    signature: '',
    signatureDate: ''
  });

  // Searchable combo box state
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);

  // Initialize filtered employees
  useEffect(() => {
    setFilteredEmployees(sampleEmployees);
  }, []);

  // Memoized handlers
  const updateFormData = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    const filtered = filterEmployees(value);
    setFilteredEmployees(filtered);
    setIsDropdownOpen(true);
    setHighlightedIndex(-1);
    
    setFormData(prev => ({ ...prev, metaProId: value }));
    
    const matchedEmployee = sampleEmployees.find(emp => emp.metaProId === value);
    if (!matchedEmployee) {
      setFormData(prev => ({
        ...prev,
        metaProId: value,
        name: '',
        title: '',
        department: '',
        email: '',
        phoneNumber: ''
      }));
    }
  }, []);

  const handleEmployeeSelect = useCallback((metaProId: string) => {
    const selectedEmployee = sampleEmployees.find(emp => emp.metaProId === metaProId);
    if (selectedEmployee) {
      setFormData(prev => ({
        ...prev,
        metaProId: selectedEmployee.metaProId,
        name: selectedEmployee.name,
        title: selectedEmployee.title,
        department: selectedEmployee.department,
        email: selectedEmployee.email,
        phoneNumber: selectedEmployee.phoneNumber
      }));
      setSearchTerm(`${selectedEmployee.metaProId} - ${selectedEmployee.name}`);
    } else {
      setFormData(prev => ({
        ...prev,
        metaProId: metaProId,
        name: '',
        title: '',
        department: '',
        email: '',
        phoneNumber: ''
      }));
      setSearchTerm(metaProId);
    }
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const handleKeyDown = useCallback((e: any) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' && filteredEmployees.length > 0) {
        setIsDropdownOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredEmployees.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredEmployees[highlightedIndex]) {
          handleEmployeeSelect(filteredEmployees[highlightedIndex].metaProId);
        } else {
          handleEmployeeSelect(searchTerm);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [isDropdownOpen, filteredEmployees, highlightedIndex, searchTerm, handleEmployeeSelect]);

  const handleInputFocus = useCallback(() => {
    setIsDropdownOpen(true);
    if (filteredEmployees.length === 0) {
      setFilteredEmployees(sampleEmployees);
    }
  }, [filteredEmployees]);

  const handleInputBlur = useCallback(() => {
    setTimeout(() => {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }, 150);
  }, []);

  const handleHighlightChange = useCallback((index: number) => {
    setHighlightedIndex(index);
  }, []);

  // Navigation functions
  const nextStep = useCallback(() => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  }, [currentStep]);

  const isStepValid = useCallback((step: number) => {
    switch(step) {
      case 1:
        return formData.metaProId && formData.metaProId.length > 0;
      case 2:
        return formData.reasonForRequest && formData.phoneType;
      case 3:
        return formData.eligibilityConfirmed && formData.costsUnderstood;
      case 4:
        return formData.disclaimerAccepted && formData.signature;
      default:
        return true;
    }
  }, [formData]);

  const renderCurrentStep = () => {
    switch(currentStep) {
      case 1: 
        return (
          <PersonalInfoStep 
            formData={formData}
            searchTerm={searchTerm}
            isDropdownOpen={isDropdownOpen}
            highlightedIndex={highlightedIndex}
            filteredEmployees={filteredEmployees}
            onSearchChange={handleSearchChange}
            onEmployeeSelect={handleEmployeeSelect}
            onKeyDown={handleKeyDown}
            onInputFocus={handleInputFocus}
            onInputBlur={handleInputBlur}
            onHighlightChange={handleHighlightChange}
          />
        );
      case 2: 
        return <RequestDetailsStep formData={formData} onUpdateFormData={updateFormData} />;
      case 3: 
        return <EligibilityStep formData={formData} onUpdateFormData={updateFormData} />;
      case 4: 
        return <DisclaimerStep formData={formData} onUpdateFormData={updateFormData} />;
      case 5: 
        return <SubmissionStep formData={formData} />;
      default: 
        return (
          <PersonalInfoStep 
            formData={formData}
            searchTerm={searchTerm}
            isDropdownOpen={isDropdownOpen}
            highlightedIndex={highlightedIndex}
            filteredEmployees={filteredEmployees}
            onSearchChange={handleSearchChange}
            onEmployeeSelect={handleEmployeeSelect}
            onKeyDown={handleKeyDown}
            onInputFocus={handleInputFocus}
            onInputBlur={handleInputBlur}
            onHighlightChange={handleHighlightChange}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">HMGMA Cell Phone Request</h1>
            <p className="text-gray-600 mt-2">Complete all steps to request a company-issued cell phone</p>
          </div>

          <StepIndicator currentStep={currentStep} />
          
          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          <div className="flex justify-between pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                currentStep === 1 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              <ChevronLeft size={20} className="mr-2" />
              Previous
            </button>

            <button
              onClick={nextStep}
              disabled={currentStep === 5 || !isStepValid(currentStep)}
              className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                currentStep === 5 || !isStepValid(currentStep)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
            >
              Next
              <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HMGMACellPhoneRequest;
