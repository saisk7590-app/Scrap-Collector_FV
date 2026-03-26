import { Outlet, NavLink, useNavigate, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Truck,
  Recycle,
  Wallet,
  Bell,
  FileText,
  Settings,
  LogOut,
  UserCheck,
} from "lucide-react";

import "./DashboardLayout.css";
import { clearAuth, getAuthToken, getAuthUser } from "../lib/auth";

const menuItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/pickups", icon: Truck, label: "Pickup Management" },
  { path: "/customers", icon: Users, label: "Customers" },
  { path: "/collectors", icon: UserCheck, label: "Collectors" },
  { path: "/scrap-management", icon: Recycle, label: "Scrap Management" },
  { path: "/payments", icon: Wallet, label: "Payments" },
  { path: "/reports", icon: FileText, label: "Reports" },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const token = getAuthToken();
  const user = getAuthUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="layout">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-top">
          <div className="logo-row">
            <Recycle size={22} />
            <h2 className="logo">WINFOCUS</h2>
          </div>
          <p className="subtitle">Admin Dashboard</p>
        </div>

        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="logout-wrapper">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* Main Area */}
      <div className="main-area">

        <header className="topbar">
          {/* RIGHT SIDE ONLY */}
          <div className="topbar-right">

            <div
              className="topbar-icon"
              onClick={() => navigate("/settings")}
            >
              <Settings size={18} />
            </div>

            <div className="notification">
              <Bell size={18} />
              <span className="notification-badge">3</span>
            </div>

            <div className="admin-info">
              <div className="avatar">AD</div>

              <div className="admin-details">
                <p className="admin-name">{user?.name || "Admin"}</p>
                <p className="admin-email">{user?.email || ""}</p>
              </div>
            </div>

          </div>

        </header>

        <main className="content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}