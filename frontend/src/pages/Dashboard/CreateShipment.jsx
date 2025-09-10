import { useState } from "react"

export default function CreateShipment() {
  const [formData, setFormData] = useState({
    shipperName: "",
    pickupLocation: "",
    deliveryLocation: "",
    cargoType: "",
  })

  // handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("New Shipment:", formData)
    alert("Shipment created successfully (dummy).")
    setFormData({
      shipperName: "",
      pickupLocation: "",
      deliveryLocation: "",
      cargoType: "",
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Shipment</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-6 space-y-4 max-w-lg"
      >
        <div>
          <label className="block mb-1 font-medium">Shipper Name</label>
          <input
            type="text"
            name="shipperName"
            value={formData.shipperName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Cairo, Egypt"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Delivery Location</label>
          <input
            type="text"
            name="deliveryLocation"
            value={formData.deliveryLocation}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Alexandria, Egypt"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Cargo Type</label>
          <input
            type="text"
            name="cargoType"
            value={formData.cargoType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Electronics"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Shipment
        </button>
      </form>
    </div>
  )
}
