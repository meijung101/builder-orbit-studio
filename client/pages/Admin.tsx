export default function Admin() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Master Data Management</h1>
        <p className="text-gray-600">Manage trip types, locations, and system settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Trip Types</h3>
          <p className="text-gray-500">Manage trip types and categories</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Locations</h3>
          <p className="text-gray-500">Manage destinations and per diem rates</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Users & Roles</h3>
          <p className="text-gray-500">Manage user access and approval hierarchy</p>
        </div>
      </div>
    </div>
  );
}
