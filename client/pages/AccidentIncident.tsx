import { useState } from "react";
import { ChevronLeft, ChevronRight, Upload, FileText, Car, User, MessageSquare, ExternalLink, Check } from "lucide-react";

interface AccidentFormData {
  carType: string;
  acknowledgmentChecked: boolean;
  externalLinkConfirmation: boolean;
  metaProId: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phoneNumber: string;
  dateOfAccident: string;
  vin: string;
  modelYear: string | number;
  model: string;
  driver: string;
  accidentDetails: string;
  uploadedFiles: File[];
  comments: string;
  requestStatus: string;
}

const AccidentIncident = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AccidentFormData>({
    carType: "",
    acknowledgmentChecked: false,
    externalLinkConfirmation: false,
    metaProId: "MP2024001",
    name: "John Smith",
    title: "Senior Manager",
    department: "Operations",
    email: "john.smith@hmgma.com",
    phoneNumber: "",
    dateOfAccident: "",
    vin: "",
    modelYear: "",
    model: "",
    driver: "",
    accidentDetails: "",
    uploadedFiles: [],
    comments: "",
    requestStatus: "Received",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalSteps = 5;
  const modelYears: number[] = [];
  for (let year = 2015; year <= 2025; year++) modelYears.push(year);

  const statusOptions = [
    { value: "Received", label: "Received - Report acknowledged" },
    { value: "At Shop", label: "At Shop - Vehicle is at the repair shop" },
    { value: "Ready for Pickup", label: "Ready for Pickup" },
    { value: "Completed", label: "Completed - Picked up" },
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    switch (step) {
      case 1: {
        if (!formData.carType) newErrors.carType = "Car type is required";
        if (formData.carType === "Manager Lease Car" && !formData.acknowledgmentChecked) {
          newErrors.acknowledgmentChecked = "You must acknowledge the completion of the form";
        }
        if (formData.carType === "Manager Lease Car" && !formData.externalLinkConfirmation) {
          newErrors.externalLinkConfirmation = "You must confirm submission through the external link";
        }
        break;
      }
      case 2: {
        if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
        break;
      }
      case 3: {
        if (!formData.dateOfAccident) newErrors.dateOfAccident = "Date of accident is required";
        if (!formData.vin) newErrors.vin = "VIN is required";
        if (!formData.modelYear) newErrors.modelYear = "Model year is required";
        if (!formData.model) newErrors.model = "Model is required";
        if (!formData.driver) newErrors.driver = "Driver name is required";
        if (!formData.accidentDetails) newErrors.accidentDetails = "Accident details are required";
        break;
      }
      case 4:
      case 5:
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AccidentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) setErrors((prev) => ({ ...prev, [field as string]: "" }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({ ...prev, uploadedFiles: [...prev.uploadedFiles, ...files] }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({ ...prev, uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index) }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      setIsSubmitted(true);
      console.log("Form submitted:", formData);
    }
  };

  const openExternalLink = () => {
    window.open("http://accidentform.hyundai.us", "_blank");
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </div>
            {step < 5 && (
              <div className={`w-12 h-1 mx-2 ${step < currentStep ? "bg-primary" : "bg-gray-200"}`} />)
            }
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-600 text-center mt-2">Step {currentStep} of {totalSteps}</div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
        <h3 className="font-medium text-primary mb-2">Instructions</h3>
        <p className="text-primary text-sm">
          Please complete the Accident-Incident Report and attach below. Further instructions will be provided by HMGMA Vehicle Services.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Car Type *</label>
        <select
          value={formData.carType}
          onChange={(e) => handleInputChange("carType", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.carType ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select car type</option>
          <option value="Pool Car">Pool Car (accident report only)</option>
          <option value="Manager Lease Car">Manager Lease Car (link + report upload)</option>
        </select>
        {errors.carType && <p className="text-red-500 text-sm mt-1">{errors.carType}</p>}
      </div>

      {formData.carType === "Manager Lease Car" && (
        <>
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <h4 className="font-medium text-yellow-900 mb-2">External Submission Required</h4>
            <p className="text-yellow-800 text-sm mb-3">
              For Manager Lease Car incidents, you must also submit information through the external Hyundai system.
            </p>
            <button
              onClick={openExternalLink}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Submit to Hyundai Portal
            </button>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.externalLinkConfirmation}
                  onChange={(e) => handleInputChange("externalLinkConfirmation", e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">I hereby confirm that I have submitted the Accident/Incident Report through the link.</span>
              </label>
              {errors.externalLinkConfirmation && (
                <p className="text-red-500 text-sm mt-1">{errors.externalLinkConfirmation}</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={formData.acknowledgmentChecked}
                onChange={(e) => handleInputChange("acknowledgmentChecked", e.target.checked)}
                className="mt-1 mr-3"
              />
              <span className="text-sm">I hereby confirm that I have completed the Accident-Incident Form *</span>
            </label>
            {errors.acknowledgmentChecked && (
              <p className="text-red-500 text-sm mt-1">{errors.acknowledgmentChecked}</p>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <User className="w-5 h-5 mr-2" />
        Requestor Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Pro ID</label>
          <input type="text" value={formData.metaProId} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" value={formData.name} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" value={formData.title} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <input type="text" value={formData.department} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={formData.email} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="(555) 123-4567"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <Car className="w-5 h-5 mr-2" />
        Vehicle Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Accident *</label>
          <input
            type="date"
            value={formData.dateOfAccident}
            onChange={(e) => handleInputChange("dateOfAccident", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.dateOfAccident ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.dateOfAccident && <p className="text-red-500 text-sm mt-1">{errors.dateOfAccident}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">VIN *</label>
          <input
            type="text"
            value={formData.vin}
            onChange={(e) => handleInputChange("vin", e.target.value.toUpperCase())}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.vin ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="17-character VIN"
            maxLength={17}
          />
          {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model Year *</label>
          <select
            value={formData.modelYear}
            onChange={(e) => handleInputChange("modelYear", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.modelYear ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select year</option>
            {modelYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.modelYear && <p className="text-red-500 text-sm mt-1">{errors.modelYear}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => handleInputChange("model", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.model ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., Sonata, Elantra, Tucson"
          />
          {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Driver *</label>
          <input
            type="text"
            value={formData.driver}
            onChange={(e) => handleInputChange("driver", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.driver ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Full name of driver at time of accident"
          />
          {errors.driver && <p className="text-red-500 text-sm mt-1">{errors.driver}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Details of Accident *</label>
        <textarea
          value={formData.accidentDetails}
          onChange={(e) => handleInputChange("accidentDetails", e.target.value)}
          rows={6}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.accidentDetails ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Provide detailed description of the accident, including location, time, weather conditions, other parties involved, damage assessment, etc."
        />
        {errors.accidentDetails && <p className="text-red-500 text-sm mt-1">{errors.accidentDetails}</p>}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <FileText className="w-5 h-5 mr-2" />
        File Uploads & Comments
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Supporting Documents</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to select files</p>
          <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" />
          <label htmlFor="file-upload" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </label>
          <p className="text-xs text-gray-500 mt-2">Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 10MB each)</p>
        </div>
      </div>

      {formData.uploadedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
          <div className="space-y-2">
            {formData.uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
        <textarea
          value={formData.comments}
          onChange={(e) => handleInputChange("comments", e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Any additional information or comments regarding the incident..."
        />
      </div>

      <div className="bg-primary/10 p-4 rounded-lg">
        <h4 className="font-medium text-primary mb-2 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2" />
          Request Status
        </h4>
        <select
          value={formData.requestStatus}
          onChange={(e) => handleInputChange("requestStatus", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-600 mt-1">* Status will be updated by GA Admin as the request progresses</p>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <Check className="w-5 h-5 mr-2" />
        Review & Submit
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Car Type & Acknowledgment</h4>
          <p className="text-sm text-gray-600">Car Type: {formData.carType}</p>
          <p className="text-sm text-gray-600">Form Acknowledged: {formData.acknowledgmentChecked ? "Yes" : "No"}</p>
          {formData.carType === "Manager Lease Car" && (
            <p className="text-sm text-gray-600">External Link Confirmed: {formData.externalLinkConfirmation ? "Yes" : "No"}</p>
          )}
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">Requestor Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <p>Name: {formData.name}</p>
            <p>Meta Pro ID: {formData.metaProId}</p>
            <p>Department: {formData.department}</p>
            <p>Phone: {formData.phoneNumber}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">Vehicle Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <p>Date: {formData.dateOfAccident}</p>
            <p>VIN: {formData.vin}</p>
            <p>Model Year: {formData.modelYear}</p>
            <p>Model: {formData.model}</p>
            <p>Driver: {formData.driver}</p>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Details:</strong> {formData.accidentDetails.substring(0, 100)}...
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">Files & Comments</h4>
          <p className="text-sm text-gray-600">Uploaded Files: {formData.uploadedFiles.length}</p>
          {formData.comments && <p className="text-sm text-gray-600">Comments: {formData.comments.substring(0, 100)}...</p>}
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
        <p className="text-yellow-800 text-sm">
          <strong>Important:</strong> Once submitted, this report will be forwarded to GAF for processing. You will receive email updates as the status changes.
        </p>
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Submitted Successfully</h2>
          <p className="text-gray-600 mb-4">Your accident/incident report has been submitted and forwarded to GAF for processing.</p>
          <p className="text-sm text-gray-500 mb-6">Reference ID: AIC-{Date.now()}</p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
              setFormData({
                carType: "",
                acknowledgmentChecked: false,
                externalLinkConfirmation: false,
                metaProId: "MP2024001",
                name: "John Smith",
                title: "Senior Manager",
                department: "Operations",
                email: "john.smith@hmgma.com",
                phoneNumber: "",
                dateOfAccident: "",
                vin: "",
                modelYear: "",
                model: "",
                driver: "",
                accidentDetails: "",
                uploadedFiles: [],
                comments: "",
                requestStatus: "Received",
              });
            }}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="w-32"></div>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Accident/Incident Report</h1>
              <p className="text-gray-600">HMGMA Vehicle Services</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Doc ID: AIC-{Date.now().toString().slice(-8)}</div>
            </div>
          </div>

          {renderProgressBar()}

          <div className="mb-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                currentStep === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button onClick={nextStep} className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button onClick={handleSubmit} className="flex items-center px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                <Check className="w-4 h-4 mr-2" />
                Submit Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccidentIncident;
