import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import ShipmentsList from "./pages/Dashboard/ShipmentsList";
import CreateShipment from "./pages/Dashboard/CreateShipment";
import ShipmentDetails from "./pages/Dashboard/ShipmentDetails";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Layout (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ShipmentsList />} />
        <Route path="shipments" element={<ShipmentsList />} />
        <Route path="create" element={<CreateShipment />} />
        <Route path="shipments/:id" element={<ShipmentDetails />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
