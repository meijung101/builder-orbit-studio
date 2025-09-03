import { useState } from "react";
import { ChevronRight, ChevronLeft, Package, User, Truck, Box } from "lucide-react";

export default function ShippingRequest() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    requestorMetaProId: "MP-2024-001",
    requestorName: "John Smith",
    requestorDepartment: "Engineering",
    senderName: "",
    senderCompany: "",
    senderAddress1: "",
    senderAddress2: "",
    senderCity: "",
    senderState: "",
    senderZipCode: "",
    senderPhone: "",
    senderEmail: "",
    recipientName: "",
    recipientCompany: "",
    recipientAddress1: "",
    recipientAddress2: "",
    recipientCity: "",
    recipientState: "",
    recipientZipCode: "",
    recipientPhone: "",
    recipientEmail: "",
    isResidential: false,
    shippingMethod: "",
    requestedShipDate: "",
    requestedDeliveryDate: "",
    packageType: "package",
    length: "",
    width: "",
    height: "",
    contents: "",
    contentsValue: "",
  });

  const totalSteps = 4;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => currentStep < totalSteps && setCurrentStep((s) => s + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep((s) => s - 1);

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Shipping request submitted successfully!");
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.senderName &&
          formData.senderAddress1 &&
          formData.senderCity &&
          formData.senderState &&
          formData.senderZipCode
        );
      case 2:
        return (
          formData.recipientName &&
          formData.recipientAddress1 &&
          formData.recipientCity &&
          formData.recipientState &&
          formData.recipientZipCode
        );
      case 3:
        return formData.shippingMethod && formData.requestedShipDate;
      case 4: {
        const isInternational = formData.shippingMethod.includes("DHL International");
        if (isInternational) return formData.contents && formData.contentsValue;
        return (
          formData.packageType &&
          (formData.packageType === "envelope" || (formData.length && formData.width && formData.height))
        );
      }
      default:
        return false;
    }
  };

  const stepIcons = [
    { icon: User, label: "Sender" },
    { icon: User, label: "Recipient" },
    { icon: Truck, label: "Shipping" },
    { icon: Package, label: "Package" },
  ];

  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      {stepIcons.map((step, index) => {
        const StepIcon = step.icon;
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        return (
          <div key={stepNumber} className="flex items-center">
            <div className={`flex flex-col items-center ${stepNumber !== totalSteps ? "mr-8" : ""}`}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <StepIcon size={20} />
              </div>
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-primary" : isCompleted ? "text-green-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {stepNumber !== totalSteps && (
              <ChevronRight className={`w-6 h-6 mb-6 ${stepNumber < currentStep ? "text-green-600" : "text-gray-300"}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const Step1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sender Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
          <input
            type="text"
            value={formData.senderName}
            onChange={(e) => handleInputChange("senderName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
          <input
            type="text"
            value={formData.senderCompany}
            onChange={(e) => handleInputChange("senderCompany", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
        <input
          type="text"
          value={formData.senderAddress1}
          onChange={(e) => handleInputChange("senderAddress1", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
        <input
          type="text"
          value={formData.senderAddress2}
          onChange={(e) => handleInputChange("senderAddress2", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <input
            type="text"
            value={formData.senderCity}
            onChange={(e) => handleInputChange("senderCity", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <input
            type="text"
            value={formData.senderState}
            onChange={(e) => handleInputChange("senderState", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
          <input
            type="text"
            value={formData.senderZipCode}
            onChange={(e) => handleInputChange("senderZipCode", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.senderPhone}
            onChange={(e) => handleInputChange("senderPhone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.senderEmail}
            onChange={(e) => handleInputChange("senderEmail", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recipient Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
          <input
            type="text"
            value={formData.recipientName}
            onChange={(e) => handleInputChange("recipientName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
          <input
            type="text"
            value={formData.recipientCompany}
            onChange={(e) => handleInputChange("recipientCompany", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
        <input
          type="text"
          value={formData.recipientAddress1}
          onChange={(e) => handleInputChange("recipientAddress1", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
        <input
          type="text"
          value={formData.recipientAddress2}
          onChange={(e) => handleInputChange("recipientAddress2", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <input
            type="text"
            value={formData.recipientCity}
            onChange={(e) => handleInputChange("recipientCity", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <input
            type="text"
            value={formData.recipientState}
            onChange={(e) => handleInputChange("recipientState", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
          <input
            type="text"
            value={formData.recipientZipCode}
            onChange={(e) => handleInputChange("recipientZipCode", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.recipientPhone}
            onChange={(e) => handleInputChange("recipientPhone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.recipientEmail}
            onChange={(e) => handleInputChange("recipientEmail", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="residential"
          checked={formData.isResidential}
          onChange={(e) => handleInputChange("isResidential", e.target.checked)}
          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="residential" className="ml-2 text-sm font-medium text-gray-700">
          Residential Address
        </label>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Method & Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Requested Ship Date *</label>
          <input
            type="date"
            value={formData.requestedShipDate}
            onChange={(e) => handleInputChange("requestedShipDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Requested Delivery Date</label>
          <input
            type="date"
            value={formData.requestedDeliveryDate}
            onChange={(e) => handleInputChange("requestedDeliveryDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Shipping Service *</label>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Non-Expedited Services</h4>
            <div className="space-y-2">
              {["FedEx Ground", "UPS Ground", "DHL International"].map((service) => (
                <label key={service} className="flex items-center">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={service}
                    checked={formData.shippingMethod === service}
                    onChange={(e) => handleInputChange("shippingMethod", e.target.value)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">{service}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Express Services</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">FedEx/UPS Express</h5>
                <div className="space-y-2">
                  {[
                    "Priority Overnight (next business morning)",
                    "Standard Overnight (next business afternoon)",
                    "2 Day",
                    "3 Day Express Saver",
                    "Saturday Delivery",
                  ].map((service) => (
                    <label key={service} className="flex items-center">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={service}
                        checked={formData.shippingMethod === service}
                        onChange={(e) => handleInputChange("shippingMethod", e.target.value)}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Other Services</h5>
                <div className="space-y-2">
                  {[
                    "DHL International Next Day Air",
                    "DHL International 2 Day Air",
                    "DHL International 3 Day Select",
                    "USPS Express Mail (PO Boxes only)",
                  ].map((service) => (
                    <label key={service} className="flex items-center">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={service}
                        checked={formData.shippingMethod === service}
                        onChange={(e) => handleInputChange("shippingMethod", e.target.value)}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Step4 = () => {
    const isInternational = formData.shippingMethod.includes("DHL International");
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Package Dimensions & Contents</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Package Type *</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="packageType"
                value="package"
                checked={formData.packageType === "package"}
                onChange={(e) => handleInputChange("packageType", e.target.value)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Package</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="packageType"
                value="envelope"
                checked={formData.packageType === "envelope"}
                onChange={(e) => handleInputChange("packageType", e.target.value)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Envelope</span>
            </label>
          </div>
        </div>
        {formData.packageType === "package" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Package Dimensions *</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Length</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.length}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="inches"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Width</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.width}
                  onChange={(e) => handleInputChange("width", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="inches"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Height</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="inches"
                  required
                />
              </div>
            </div>
          </div>
        )}
        {isInternational && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-4">International Shipping Requirements</h3>
            <p className="text-sm text-yellow-700 mb-4">
              Required to have accurate list of contents description and declared value
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contents Description (include weight) *
                </label>
                <textarea
                  value={formData.contents}
                  onChange={(e) => handleInputChange("contents", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Detailed description of contents and total weight"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Declared Value *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.contentsValue}
                  onChange={(e) => handleInputChange("contentsValue", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="USD"
                  required
                />
              </div>
            </div>
          </div>
        )}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h3 className="font-medium text-primary mb-2">Requestor Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Meta Pro ID:</span>
              <p className="font-medium">{formData.requestorMetaProId}</p>
            </div>
            <div>
              <span className="text-gray-600">Name:</span>
              <p className="font-medium">{formData.requestorName}</p>
            </div>
            <div>
              <span className="text-gray-600">Department:</span>
              <p className="font-medium">{formData.requestorDepartment}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary text-white p-6 flex items-center justify-between">
            <div className="flex items-center">
              <Box className="w-8 h-8 mr-3" />
              <h1 className="text-2xl font-bold">Shipping Request</h1>
            </div>
            <div className="text-sm text-white/80">Step {currentStep} of {totalSteps}</div>
          </div>
          <div className="p-6">
            <StepIndicator />
            <div className="mb-8">{renderCurrentStep()}</div>
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-2 rounded-md ${
                  currentStep === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </button>
              {currentStep === totalSteps ? (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className={`px-8 py-3 text-lg font-semibold rounded-md ${
                    isStepValid()
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit Request
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`flex items-center px-6 py-2 rounded-md ${
                    isStepValid()
                      ? "bg-primary text-white hover:opacity-90"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
