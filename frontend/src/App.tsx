/**
 * Place at: frontend/src/App.tsx (replace existing)
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PropertyGridPage } from "./pages/PropertyGridPage";

import { PropertyDetailPage } from "./components/PropertyDetailPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { PropertyFormPage } from "./pages/PropertyFormPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PropertyGridPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/properties/new" element={<PropertyFormPage />} />
          <Route path="/admin/properties/:id/edit" element={<PropertyFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}