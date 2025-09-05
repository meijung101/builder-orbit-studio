import React, { useState } from "react";

interface Props {
  finalApprover: string;
  coDepartments: string[];
  onChange: (next: { finalApprover: string; coDepartments: string[] }) => void;
}

const approvers = [
  "Alice Johnson (VP)",
  "Bob Smith (HOD)",
  "Carol Lee (Manager/HOS)",
  "Daniel Kim (Director)",
  "Eva Brown (CFO)",
];

const departments = [
  "Finance",
  "HR",
  "Operations",
  "IT",
  "Legal",
  "Marketing",
  "General Affairs",
  "Engineering",
];

const ApprovalWorkflow: React.FC<Props> = ({ finalApprover, coDepartments, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const reset = () => onChange({ finalApprover: "", coDepartments: [] });

  const getStatusBadge = (status: string) => {
    const color = status === "Approved" ? "bg-green-200 text-green-800" : status === "Rejected" ? "bg-red-200 text-red-800" : "bg-gray-200 text-gray-800";
    return <span className={`px-2 py-1 rounded text-xs ${color}`}>{status}</span>;
  };

  return (
    <div className="p-4 bg-white border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Approval Workflow</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Final Approver</label>
        <select
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          value={finalApprover}
          onChange={(e) => onChange({ finalApprover: e.target.value, coDepartments })}
        >
          <option value="">-- Select Final Approver --</option>
          {approvers.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Add Co-op Departments</label>
        <input
          type="text"
          placeholder="Search Department"
          className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 mb-2">
          {departments
            .filter((d) => d.toLowerCase().includes(searchTerm.toLowerCase()) && !coDepartments.includes(d))
            .map((d) => (
              <button
                key={d}
                className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary/20"
                onClick={() => onChange({ finalApprover, coDepartments: [...coDepartments, d] })}
              >
                {d} +
              </button>
            ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {coDepartments.map((dept) => (
            <span key={dept} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              {dept}
              <button
                className="text-red-600 ml-1"
                onClick={() => onChange({ finalApprover, coDepartments: coDepartments.filter((d) => d !== dept) })}
                aria-label={`Remove ${dept}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Approval Path</label>
        <div className="flex items-center space-x-4 overflow-x-auto">
          <div className="flex flex-col items-center">
            <div className="p-2 border rounded bg-gray-50">Requester</div>
            <span className="mt-1">{getStatusBadge("Submitted")}</span>
          </div>
          {coDepartments.map((dept, idx) => (
            <React.Fragment key={dept}>
              <span className="text-gray-400">→</span>
              <div className="flex flex-col items-center">
                <div className="p-2 border rounded bg-gray-50">{dept}</div>
                <div className="mt-1">{getStatusBadge("Pending")}</div>
              </div>
            </React.Fragment>
          ))}
          {finalApprover && (
            <>
              <span className="text-gray-400">→</span>
              <div className="flex flex-col items-center">
                <div className="p-2 border rounded bg-gray-50">{finalApprover}</div>
                <div className="mt-1">{getStatusBadge("Pending")}</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={reset}>Reset</button>
      </div>
    </div>
  );
};

export default ApprovalWorkflow;
