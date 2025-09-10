import { Link } from "react-router-dom"
import { useState } from "react"
import { Eye, Trash2, Search, Filter, Plus, MoreVertical } from 'lucide-react'

export default function ShipmentsList() {
  // بيانات تجريبية
  const [shipments] = useState([
    { id: 1, customer: "Ahmed Ali", address: "Cairo, Egypt", status: "Pending", date: "2023-10-15" },
    { id: 2, customer: "Sara Mohamed", address: "Giza, Egypt", status: "Delivered", date: "2023-10-10" },
    { id: 3, customer: "John Doe", address: "Alexandria, Egypt", status: "In Transit", date: "2023-10-12" },
    { id: 4, customer: "Mohamed Hassan", address: "Luxor, Egypt", status: "Pending", date: "2023-10-14" },
    { id: 5, customer: "Fatima Ahmed", address: "Aswan, Egypt", status: "Delivered", date: "2023-10-08" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  // تصفية البيانات حسب البحث والفلتر
  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.id.toString().includes(searchTerm)
    
    const matchesFilter = statusFilter === "All" || shipment.status === statusFilter
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Shipments Management</h1>
        <Link
          to="/dashboard/shipments/new"
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
        >
          <Plus size={18} className="mr-2" />
          New Shipment
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by ID, customer, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-gray-600 font-semibold">ID</th>
                <th className="p-4 text-left text-gray-600 font-semibold">Customer</th>
                <th className="p-4 text-left text-gray-600 font-semibold">Address</th>
                <th className="p-4 text-left text-gray-600 font-semibold">Date</th>
                <th className="p-4 text-left text-gray-600 font-semibold">Status</th>
                <th className="p-4 text-left text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShipments.length > 0 ? (
                filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-700">#{shipment.id}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{shipment.customer}</div>
                    </td>
                    <td className="p-4 text-gray-600">{shipment.address}</td>
                    <td className="p-4 text-gray-500">{shipment.date}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          shipment.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : shipment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/dashboard/shipments/${shipment.id}`}
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} className="mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Link>
                        <button 
                          className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Shipment"
                        >
                          <Trash2 size={18} className="mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No shipments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (يمكن تفعيله لاحقًا) */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredShipments.length}</span> of{' '}
                <span className="font-medium">{filteredShipments.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  Previous
                </a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                  1
                </a>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  Next
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}