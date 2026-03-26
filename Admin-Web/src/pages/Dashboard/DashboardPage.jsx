import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { api } from "../../lib/api";
import "./DashboardPage.css";

function formatINR(value) {
  if (value === null || value === undefined) return "-";
  const numberValue = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(numberValue)) return String(value);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numberValue);
}

function weekdayLabelFromISO(isoDate) {
  if (!isoDate) return "";
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("en-IN", { weekday: "short" });
}

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentPickups, setRecentPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [statsData, pickupsPage] = await Promise.all([
          api.get("/admin/dashboard/stats"),
          api.get("/pickups?page=0&size=5&sortBy=createdAt&sortDir=desc"),
        ]);

        if (cancelled) return;
        setStats(statsData);
        setRecentPickups(pickupsPage?.content || []);
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const pickupTrend = useMemo(() => {
    const items = stats?.pickupTrend || [];
    return items.map((x) => ({
      day: weekdayLabelFromISO(x.date),
      pickups: x.count,
    }));
  }, [stats]);

  if (loading) {
    return <div className="dashboard">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="card-grid">
        <div className="stat-card">
          <h4>Today&apos;s Pickups</h4>
          <h2>{stats?.todayPickups ?? 0}</h2>
          <p>
            {stats?.completedToday ?? 0} Completed • {stats?.pendingPickups ?? 0} Pending
          </p>
        </div>

        <div className="stat-card">
          <h4>Total Revenue</h4>
          <h2>{formatINR(stats?.totalRevenue)}</h2>
          <p>{formatINR(stats?.todayRevenue)} Today</p>
        </div>

        <div className="stat-card">
          <h4>Collectors</h4>
          <h2>{stats?.activeCollectors ?? 0}</h2>
          <p>{stats?.totalCollectors ?? 0} Total</p>
        </div>

        <div className="stat-card">
          <h4>Pending Requests</h4>
          <h2>{stats?.pendingRequests ?? 0}</h2>
          <p>Awaiting approval</p>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Pickups - Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={pickupTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="pickups" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Pickup Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pickupTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="pickups" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="activity-grid">
        <div className="activity-card">
          <h3>Latest Pickups</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Weight</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPickups.map((p) => (
                <tr key={p.id}>
                  <td>{p.customerName || "-"}</td>
                  <td>{p.city || "-"}</td>
                  <td>{p.totalWeight ?? "-"}</td>
                  <td>{p.status || "-"}</td>
                </tr>
              ))}
              {recentPickups.length === 0 ? (
                <tr>
                  <td colSpan={4}>No pickups found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

