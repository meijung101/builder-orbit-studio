import { useLocation } from "react-router-dom";

function statusLabel(path: string): string | null {
  if (path.includes("/requests/pending")) return "Pending Approval";
  if (path.includes("/requests/approved")) return "Approved/Confirmed";
  if (path.includes("/requests/returned")) return "Returned";
  if (path.includes("/requests/draft")) return "Draft";
  return null;
}

export default function MyRequests() {
  const location = useLocation();
  const label = statusLabel(location.pathname);
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Requests{label ? ` — ${label}` : ""}</h1>
        <p className="text-gray-600">View and manage your trip requests</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Trip requests list will be implemented here...</p>
      </div>
    </div>
  );
}
