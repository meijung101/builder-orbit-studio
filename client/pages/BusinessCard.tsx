import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, User, Phone, FileText, Eye, CheckCircle, Clock, AlertCircle, Upload, X } from 'lucide-react';

const SAMPLE_USER = {
  metaProId: "EMP001234",
  fullName: "Sarah Johnson",
  title: "Senior Software Engineer",
  department: "Information Technology",
  address: "123 Corporate Blvd, Suite 100, Business City, BC 12345",
  email: "sarah.johnson@company.com"
};

const APPROVAL_STATUSES: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: "Draft", color: "bg-gray-200 text-gray-800", icon: FileText },
  requested: { label: "Requested", color: "bg-primary text-primary-foreground", icon: Clock },
  hod_approved: { label: "Approved by HOD", color: "bg-yellow-200 text-yellow-800", icon: CheckCircle },
  ga_approved: { label: "Approved by GA Staff", color: "bg-green-200 text-green-800", icon: CheckCircle },
  printing: { label: "Printing", color: "bg-purple-200 text-purple-800", icon: Clock },
  ready: { label: "Ready for Pick-Up", color: "bg-green-500 text-white", icon: CheckCircle }
};

const BusinessCard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    ...SAMPLE_USER,
    professionalDesignation: "",
    officePhone: "",
    cellPhone: "",
    quantity: "100",
    comment: "",
    attachment: null,
    status: "draft"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Contact", icon: Phone },
    { id: 3, title: "Details", icon: FileText },
    { id: 4, title: "Preview", icon: Eye },
    { id: 5, title: "Status", icon: CheckCircle }
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 3) {
      if (formData.professionalDesignation && !formData.attachment) {
        newErrors.attachment = "Attachment is required when Professional Designation is filled";
      }
      if (!formData.quantity) {
        newErrors.quantity = "Quantity is required";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep(currentStep)) setCurrentStep((prev) => Math.min(prev + 1, steps.length)); };
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined as any }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024;
      if (!validTypes.includes(file.type)) { setErrors((prev) => ({ ...prev, attachment: "Only PDF, DOCX, JPG, PNG files are allowed" })); return; }
      if (file.size > maxSize) { setErrors((prev) => ({ ...prev, attachment: "File size must be less than 5MB" })); return; }
      handleInputChange('attachment', file);
    }
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      setFormData((prev: any) => ({ ...prev, status: "requested" }));
      setIsSubmitted(true);
      setCurrentStep(5);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
    return value;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Pro ID</label>
                <input type="text" value={formData.metaProId} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
                <p className="text-xs text-gray-500 mt-1">Auto-populated</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" value={formData.fullName} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
                <p className="text-xs text-gray-500 mt-1">Auto-populated</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" value={formData.title} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
                <p className="text-xs text-gray-500 mt-1">Auto-populated</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input type="text" value={formData.department} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
                <p className="text-xs text-gray-500 mt-1">Auto-populated</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea value={formData.address} disabled rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
                <p className="text-xs text-gray-500 mt-1">Auto-populated</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={formData.email} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
                <p className="text-xs text-gray-500 mt-1">Auto-populated</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Designation</label>
                <input type="text" value={formData.professionalDesignation} onChange={(e) => handleInputChange('professionalDesignation', e.target.value)} placeholder="e.g., P.Eng, CPA, MBA (Optional)" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />
                <p className="text-xs text-gray-500 mt-1">Optional</p>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Office Phone</label>
                <input type="tel" value={formData.officePhone} onChange={(e) => handleInputChange('officePhone', formatPhoneNumber(e.target.value))} placeholder="(555) 123-4567" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />
                <p className="text-xs text-gray-500 mt-1">Optional - can be modified</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cell Phone</label>
                <input type="tel" value={formData.cellPhone} onChange={(e) => handleInputChange('cellPhone', formatPhoneNumber(e.target.value))} placeholder="(555) 987-6543" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />
                <p className="text-xs text-gray-500 mt-1">Optional - can be modified</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Additional Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity <span className="text-red-500">*</span></label>
                <select value={formData.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Select quantity</option>
                  <option value="100">100 cards</option>
                  <option value="250">250 cards</option>
                </select>
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <textarea value={formData.comment} onChange={(e) => handleInputChange('comment', e.target.value)} rows={4} placeholder="Any special instructions or comments..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />
                <p className="text-xs text-gray-500 mt-1">Optional</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Attachment{formData.professionalDesignation && <span className="text-red-500"> *</span>}</label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.attachment ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}>
                  {formData.attachment ? (
                    <div className="flex items-center justify-center space-x-2">
                      <FileText className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formData.attachment.name}</p>
                        <p className="text-xs text-gray-500">{(formData.attachment.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button onClick={() => handleInputChange('attachment', null)} className="ml-2 text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">Upload a file</span>
                          <span className="mt-1 block text-xs text-gray-500">PDF, DOCX, JPG, PNG up to 5MB</span>
                          <input type="file" className="hidden" accept=".pdf,.docx,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                {errors.attachment && <p className="text-red-500 text-sm mt-1">{errors.attachment}</p>}
                {formData.professionalDesignation && (
                  <p className="text-yellow-600 text-sm mt-1">
                    <AlertCircle className="inline h-4 w-4 mr-1" />
                    Attachment is required when Professional Designation is filled
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Business Card Preview</h2>
            <div className="flex justify-center">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-lg" style={{width: '350px', height: '200px'}}>
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{formData.fullName}</h3>
                    {formData.professionalDesignation && (<p className="text-sm text-gray-600">{formData.professionalDesignation}</p>)}
                    <p className="text-sm text-gray-700 mt-1">{formData.title}</p>
                    <p className="text-xs text-gray-600">{formData.department}</p>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>{formData.address}</p>
                    <div className="flex justify-between"><span>Email: {formData.email}</span></div>
                    <div className="flex justify-between">
                      {formData.officePhone && <span>Office: {formData.officePhone}</span>}
                      {formData.cellPhone && <span>Cell: {formData.cellPhone}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <h3 className="font-medium text-primary mb-2">Order Summary</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Quantity:</strong> {formData.quantity} cards</p>
                {formData.comment && <p><strong>Comments:</strong> {formData.comment}</p>}
                {formData.attachment && <p><strong>Attachment:</strong> {formData.attachment.name}</p>}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Request Submitted Successfully!</h2>
            <p className="text-gray-600">Your business card request has been submitted and is now in the approval workflow.</p>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-4">Request Status</h3>
              <div className="space-y-3">
                {Object.entries(APPROVAL_STATUSES).map(([key, status]) => {
                  const Icon = status.icon;
                  const isActive = key === formData.status;
                  const isPast = ['draft'].includes(key) && formData.status !== 'draft';
                  return (
                    <div key={key} className={`flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-primary/10 border border-primary/20' : isPast ? 'bg-gray-50' : 'bg-gray-50 opacity-50'}`}>
                      <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : isPast ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className={`font-medium ${isActive ? 'text-primary' : isPast ? 'text-green-900' : 'text-gray-500'}`}>{status.label}</span>
                      {isActive && (<span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>Current</span>)}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary">
                  <strong>Next Step:</strong> Your request will be sent to your Head of Department for approval. You will receive an email notification once approved.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Card Request System</h1>
          <p className="mt-2 text-gray-600">Submit your business card request and track approval status</p>
        </div>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isActive ? 'border-primary bg-primary text-primary-foreground' : isCompleted ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>{step.title}</span>
                  {index < steps.length - 1 && (<ChevronRight className="w-5 h-5 text-gray-400 mx-4" />)}
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {renderStep()}
          {currentStep < 5 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button onClick={handlePrev} disabled={currentStep === 1} className={`flex items-center px-4 py-2 rounded-md ${currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              {currentStep === 4 ? (
                <button onClick={handleSubmit} className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  Submit Request
                  <CheckCircle className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button onClick={handleNext} className="flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          )}
          {currentStep === 5 && (
            <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
              <button onClick={() => { setCurrentStep(1); setIsSubmitted(false); setFormData({ ...SAMPLE_USER, professionalDesignation: "", officePhone: "", cellPhone: "", quantity: "100", comment: "", attachment: null, status: "draft" }); setErrors({}); }} className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Submit New Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
