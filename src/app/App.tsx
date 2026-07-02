// src/App.tsx
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router";
import { AnimatePresence } from "motion/react";
import { Toaster } from "sonner";

import { FloatingBackground } from "./components/FloatingBackground";
import { PublicLayout } from "./components/PublicLayout";
import { ProtectedAdminRoute } from "./components/admin/AdminLayout";
import { AdminAuthProvider } from "../lib/admin-auth";
import { ActiveDevicesProvider } from "../lib/use-active-devices";

import { AboutPage } from "./pages/AboutPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { DevicePage } from "./pages/DevicePage";
import { DetailPage } from "./pages/DetailPage";
import { SearchPage } from "./pages/SearchPage";

import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUpload } from "./pages/admin/AdminUpload";
import { AdminEdit } from "./pages/admin/AdminEdit";
// YAHAN IMPORT ADD KIYA HAI
import { AdminWallpapers } from "./pages/admin/AdminWallpapers"; 

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/wallpapers/:device" element={<DevicePage />} />
          <Route path="/wallpaper/:slug" element={<DetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/search" element={<SearchPage />} /> 
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Protected Routes */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* YAHAN ROUTE ADD KIYA HAI */}
          <Route path="wallpapers" element={<AdminWallpapers />} />
          
          <Route path="upload" element={<AdminUpload />} />
          <Route path="edit/:id" element={<AdminEdit />} />
        </Route>

        {/* Catch-all Route (Agar URL galat ho toh Home pe bhej do) */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <ActiveDevicesProvider>
        <BrowserRouter>
          <FloatingBackground />
          <AnimatedRoutes />
          <Toaster position="bottom-center" richColors />
        </BrowserRouter>
      </ActiveDevicesProvider>
    </AdminAuthProvider>
  );
}