import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { LoginPage } from "./pages/Login/LoginPage";
import { RegisterPage } from "./pages/Register/RegisterPage";
import { DashboardLayout } from "./components/DashboardLayout";

import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { PickupManagementPage } from "./pages/PickupManagement/PickupManagementPage";

import { CustomersPage } from "./pages/Customers/CustomersPage";
import { CollectorsPage } from "./pages/Collectors/CollectorsPage";

import { ScrapManagementPage } from "./pages/ScrapManagement/ScrapManagementPage";
import { ScrapItemsPage } from "./pages/ScrapManagement/ScrapItemsPage";

import{ Payments} from "./pages/Payments/PaymentsPage";

import { Reports } from "./pages/Reports/ReportsPage";

import { Notifications } from "./pages/Notifications/NotificationsPage";
import {Support }from "./pages/Support/SupportPage";
import {Settings} from "./pages/Settings/SettingsPage";
import ComingSoonPage from "./pages/ComingSoon/ComingSoonPage";

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>

        {/* Login and Register */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Layout */}
        <Route path="/" element={<DashboardLayout />}>

          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="pickups" element={<PickupManagementPage />} />
          
          <Route path="customers" element={<CustomersPage />} />
          <Route path="collectors" element={<CollectorsPage />} />
          
          <Route path="scrap-management" element={<ScrapManagementPage />} />
          <Route path="scrap-management/:categoryId" element={<ScrapItemsPage />} />
          
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          {/* <Route path="notifications" element={<Notifications />} />
          <Route path="support" element={<Support />} /> */}
          
          <Route path="settings" element={<Settings />} />

        </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}