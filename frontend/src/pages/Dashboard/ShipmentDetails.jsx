import { useParams } from "react-router-dom"

export default function ShipmentDetails() {
  const { id } = useParams()

  // بيانات تجريبية مؤقتة
  const shipments = [
    { id: 1, shipperName: "Ali", cargoType: "Electronics", status: "Pending", pickupLocation: "Cairo", deliveryLocation: "Alexandria" },
    { id: 2, shipperName: "Mona", cargoType: "Furniture", status: "In Transit", pickupLocation: "Giza", deliveryLocation: "Luxor" },
    { id: 3, shipperName: "Omar", cargoType: "Clothes", status: "Delivered", pickupLocation: "Aswan", deliveryLocation: "Hurghada" },
  ]

  // نجيب الشحنة اللي id بتاعها بيساوي اللي في الـ URL
  const shipment = shipments.find((s) => s.id === parseInt(id))

  if (!shipment) {
    return <p className="text-red-600 font-bold">Shipment not found</p>
  }

  return (
    <div className="bg-white shadow rounded p-6">
      <h1 className="text-2xl font-bold mb-4">Shipment Details</h1>
      <p><span className="font-medium">ID:</span> {shipment.id}</p>
      <p><span className="font-medium">Shipper:</span> {shipment.shipperName}</p>
      <p><span className="font-medium">Cargo:</span> {shipment.cargoType}</p>
      <p><span className="font-medium">Status:</span> {shipment.status}</p>
      <p><span className="font-medium">Pickup:</span> {shipment.pickupLocation}</p>
      <p><span className="font-medium">Delivery:</span> {shipment.deliveryLocation}</p>
    </div>
  )
}
