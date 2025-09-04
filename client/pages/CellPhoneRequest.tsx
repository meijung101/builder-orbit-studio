import { useState } from "react";
import { ChevronRight, ChevronLeft, Check, AlertCircle, Phone as PhoneIcon, User, FileText, Users, CheckCircle2 } from "lucide-react";

interface Employee {
  metaProId: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phoneNumber: string;
}

interface FormData {
  metaProId: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phoneNumber: string;
  requestDate: string;
  reasonForRequest: string;
  reasonDetails: string;
  phoneType: string;
  eligibilityConfirmed: boolean;
  costsUnderstood: boolean;
  disclaimerAccepted: boolean;
  signature: string;
  signatureDate: string;
}

const CellPhoneRequest = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const sampleEmployees: Employee[] = [
    { metaProId: 'MP2024001', name: 'John Smith', title: 'Senior Manager', department: 'Operations', email: 'john.smith@hmgma.com', phoneNumber: '555-444-1234' },
    { metaProId: 'MP2024002', name: 'Sarah Johnson', title: 'Manager', department: 'Quality', email: 'sarah.johnson@hmgma.com', phoneNumber: '555-444-2345' },
    { metaProId: 'MP2024003', name: 'Mike Chen', title: 'Assistant Manager', department: 'Production', email: 'mike.chen@hmgma.com', phoneNumber: '555-444-3456' },
    { metaProId: 'MP2024004', name: 'Lisa Rodriguez', title: 'Safety Officer', department: 'Safety', email: 'lisa.rodriguez@hmgma.com', phoneNumber: '555-444-4567' },
    { metaProId: 'MP2024005', name: 'David Park', title: 'Team Lead', department: 'Maintenance', email: 'david.park@hmgma.com', phoneNumber: '555-444-5678' },
    { metaProId: 'MP2024006', name: 'Jennifer Lee', title: 'Security Officer', department: 'Security', email: 'jennifer.lee@hmgma.com', phoneNumber: '555-444-6789' },
    { metaProId: 'MP2024007', name: 'Robert Taylor', title: 'Supervisor', department: 'Engineering', email: 'robert.taylor@hmgma.com', phoneNumber: '555-444-7890' },
    { metaProId: 'MP2024008', name: 'Amy Wilson', title: 'Team Member', department: 'General Affairs', email: 'amy.wilson@hmgma.com', phoneNumber: '555-444-8901' },
    { metaProId: 'MP2024009', name: 'Carlos Martinez', title: 'Sr. Manager', department: 'IT', email: 'carlos.martinez@hmgma.com', phoneNumber: '555-444-9012' },
    { metaProId: 'MP2024010', name: 'Emily Davis', title: 'Assistant Manager', department: 'Operations', email: 'emily.davis@hmgma.com', phoneNumber: '555-444-0123' },
  ];

  const [formData, setFormData] = useState<FormData>({
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

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Request Details', icon: PhoneIcon },
    { id: 3, title: 'Eligibility & Costs', icon: AlertCircle },
    { id: 4, title: 'Terms & Disclaimer', icon: FileText },
    { id: 5, title: 'Submit & Approval', icon: Users },
  ];

  const getReplacementCost = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('senior manager') || t.includes('sr. manager')) return 350;
    if (t.includes('manager') && !t.includes('assistant')) return 250;
    return 150;
  };

  const needsPreApproval = (title: string) => {
    const t = title.toLowerCase();
    return t.includes('assistant manager') || (!t.includes('manager') && !t.includes('supervisor'));
  };

  const updateFormData = (field: keyof FormData, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));
  const [idQuery, setIdQuery] = useState("");
  const [showIdDropdown, setShowIdDropdown] = useState(false);
  const filteredEmployees = sampleEmployees.filter(
    (e) => e.metaProId.toLowerCase().includes(idQuery.toLowerCase()) || e.name.toLowerCase().includes(idQuery.toLowerCase())
  );

  const handleEmployeeSelect = (metaProId: string) => {
    const emp = sampleEmployees.find((e) => e.metaProId === metaProId);
    if (emp) {
      setFormData((prev) => ({
        ...prev,
        metaProId: emp.metaProId,
        name: emp.name,
        title: emp.title,
        department: emp.department,
        email: emp.email,
        phoneNumber: emp.phoneNumber,
      }));
    } else {
      setFormData((prev) => ({ ...prev, metaProId: '', name: '', title: '', department: '', email: '', phoneNumber: '' }));
    }
  };

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return !!formData.metaProId;
      case 2:
        return !!(formData.reasonForRequest && formData.phoneType);
      case 3:
        return !!(formData.eligibilityConfirmed && formData.costsUnderstood);
      case 4:
        return !!(formData.disclaimerAccepted && formData.signature);
      default:
        return true;
    }
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step) => {
          const Icon = step.icon as any;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                isCompleted ? 'bg-green-600 text-white' : isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {isCompleted ? <Check size={20} /> : <Icon size={20} />}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>{step.title}</span>
            </div>
          );
        })}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / steps.length) * 100}%` }} />
      </div>
    </div>
  );

  const PersonalInfoStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Requestor Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Pro ID *<span className="text-xs text-gray-500 ml-2">(Type to search or enter new)</span></label>
          <input
            type="text"
            value={idQuery}
            onChange={(e) => {
              const v = e.currentTarget.value;
              setIdQuery(v);
              updateFormData('metaProId', v);
              setShowIdDropdown(true);
            }}
            onFocus={() => setShowIdDropdown(true)}
            onBlur={() => setTimeout(() => setShowIdDropdown(false), 150)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search Meta Pro ID or type a new one"
          />
          {showIdDropdown && (
            <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-48 overflow-auto">
              {filteredEmployees.length === 0 && (
                <li className="p-2 text-sm text-gray-500">No matches. Press Enter to keep "{idQuery}"</li>
              )}
              {filteredEmployees.map((emp) => (
                <li
                  key={emp.metaProId}
                  className="p-2 hover:bg-primary/10 cursor-pointer text-sm"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setIdQuery(emp.metaProId);
                    handleEmployeeSelect(emp.metaProId);
                    setShowIdDropdown(false);
                  }}
                >
                  {emp.metaProId} — {emp.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input type="text" value={formData.name} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600" placeholder="Auto-filled from Meta Pro ID" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
          <input type="text" value={formData.title} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600" placeholder="Auto-filled from Meta Pro ID" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
          <input type="text" value={formData.department} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600" placeholder="Auto-filled from Meta Pro ID" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input type="email" value={formData.email} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600" placeholder="Auto-filled from Meta Pro ID" />
        </div>
      </div>
      {formData.metaProId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <div className="flex items-center">
            <CheckCircle2 className="text-green-600 mr-2" size={20} />
            <span className="text-green-700 font-medium">Employee information loaded for {formData.name}</span>
          </div>
        </div>
      )}
    </div>
  );

  const RequestDetailsStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Details</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Request Date</label>
          <input type="date" value={formData.requestDate} onChange={(e) => updateFormData('requestDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Request *</label>
          <select value={formData.reasonForRequest} onChange={(e) => updateFormData('reasonForRequest', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Explanation <span className="text-sm text-gray-500">(who, how often, why needed)</span></label>
          <textarea value={formData.reasonDetails} onChange={(e) => updateFormData('reasonDetails', e.currentTarget.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Please provide detailed explanation of why you need a company cell phone, including who you need to contact, how often, and business justification..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Phone Type *</label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="phoneType" value="iOS" checked={formData.phoneType === 'iOS'} onChange={(e) => updateFormData('phoneType', e.target.value)} className="mr-3" />
              <span className="font-medium">iPhone (iOS)</span>
            </label>
            <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="phoneType" value="Android" checked={formData.phoneType === 'Android'} onChange={(e) => updateFormData('phoneType', e.target.value)} className="mr-3" />
              <span className="font-medium">Android</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const EligibilityStep = () => {
    const replacementCost = getReplacementCost(formData.title);
    const requiresPreApproval = needsPreApproval(formData.title);
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Eligibility & Cost Information</h2>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Eligibility Requirements</h3>
          <div className="space-y-3 text-sm text-gray-800">
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
            <p className="text-sm text-red-700">Based on your position, you will need additional pre-approval before receiving a company cell phone. Your request will go through the standard approval process.</p>
          </div>
        )}
        <div className="space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input type="checkbox" checked={formData.eligibilityConfirmed} onChange={(e) => updateFormData('eligibilityConfirmed', e.target.checked)} className="mt-1" />
            <span className="text-sm">I confirm that I meet the eligibility requirements for a company-issued cell phone as outlined above.</span>
          </label>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input type="checkbox" checked={formData.costsUnderstood} onChange={(e) => updateFormData('costsUnderstood', e.target.checked)} className="mt-1" />
            <span className="text-sm">I understand the replacement costs and my financial responsibility if the device is damaged, lost, or stolen due to my negligence.</span>
          </label>
        </div>
      </div>
    );
  };

  const DisclaimerStep = () => (
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
          <input type="checkbox" checked={formData.disclaimerAccepted} onChange={(e) => updateFormData('disclaimerAccepted', e.target.checked)} className="mt-1" />
          <span className="text-sm"><strong>I have read, understood, and agree to comply with all terms and conditions outlined above regarding the use of an HMGMA-issued cell phone.</strong></span>
        </label>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Electronic Signature *</label>
          <input type="text" value={formData.signature} onChange={(e) => updateFormData('signature', e.currentTarget.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Type your full name to sign electronically" />
          <p className="text-xs text-gray-500 mt-1">By typing your name above, you agree that this constitutes your electronic signature.</p>
        </div>
      </div>
    </div>
  );

  const SubmissionStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Request</h2>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CheckCircle2 className="text-green-600 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-green-800">Request Ready for Submission</h3>
        </div>
        <p className="text-green-700 text-sm mb-4">Your cell phone request has been completed and is ready for the approval process.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Request Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Name:</strong> {formData.name}</div>
          <div><strong>Title:</strong> {formData.title}</div>
          <div><strong>Department:</strong> {formData.department}</div>
          <div><strong>Phone Type:</strong> {formData.phoneType}</div>
          <div><strong>Reason:</strong> {formData.reasonForRequest}</div>
          <div><strong>Replacement Cost:</strong> ${getReplacementCost(formData.title)}</div>
        </div>
      </div>
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
        <h3 className="font-semibold text-primary mb-4">Next Steps - Approval Process</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center"><div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div><span>Your department HOD review</span></div>
          <div className="flex items-center"><div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div><span>General Affair HOD approval</span></div>
          <div className="flex items-center"><div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div><span>General Affairs Process</span></div>
          <div className="flex items-center"><div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div><span>Device provisioning and setup</span></div>
          <div className="flex items-center"><div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">5</div><span>Ready to pick and signoff</span></div>
        </div>
        <p className="text-gray-700 text-sm mt-4">You will receive email notifications at each approval stage. Typical processing time is 3-5 business days.</p>
      </div>
      <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">Submit Cell Phone Request</button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <PersonalInfoStep />;
      case 2: return <RequestDetailsStep />;
      case 3: return <EligibilityStep />;
      case 4: return <DisclaimerStep />;
      case 5: return <SubmissionStep />;
      default: return <PersonalInfoStep />;
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
          <StepIndicator />
          <div className="mb-8">{renderCurrentStep()}</div>
          <div className="flex justify-between pt-6 border-t">
            <button onClick={prevStep} disabled={currentStep === 1} className={`flex items-center px-6 py-2 rounded-lg transition-colors ${currentStep === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}>
              <ChevronLeft size={20} className="mr-2" />
              Previous
            </button>
            <button onClick={nextStep} disabled={currentStep === 5 || !isStepValid(currentStep)} className={`flex items-center px-6 py-2 rounded-lg transition-colors ${currentStep === 5 || !isStepValid(currentStep) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:opacity-90'}`}>
              Next
              <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CellPhoneRequest;
