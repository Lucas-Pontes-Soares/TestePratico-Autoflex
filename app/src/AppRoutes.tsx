import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Products from "./pages/Products";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />

      {/* Catch-all route for 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
