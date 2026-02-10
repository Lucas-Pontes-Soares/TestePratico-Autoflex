import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Products from "./pages/Products";
import RawMaterials from "./pages/RawMaterials";
import ProductionDashboard from "./pages/ProductionDashboard";
import Profile from "./pages/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Products />} />
      <Route path="/products" element={<Products />} />
      <Route path="/raw-materials" element={<RawMaterials />} />
      <Route path="/production-dashboard" element={<ProductionDashboard />} />
      <Route path="/profile" element={<Profile />} />

      {/* Catch-all route for 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
