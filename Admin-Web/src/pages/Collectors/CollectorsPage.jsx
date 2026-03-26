import React, { useEffect, useMemo, useState } from "react";
import { UserPlus } from "lucide-react";
import "./CollectorsPage.css";
import { api } from "../../lib/api";

export function CollectorsPage() {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadCollectors() {
    setLoading(true);
    setError("");
    try {
      const page = await api.get("/admin/users?role=collector&page=0&size=100&sortBy=createdAt&sortDir=desc");
      const list =
        page?.content ||
        page?.data?.content ||
        (Array.isArray(page) ? page : []) ||
        [];
      const onlyCollectors = list.filter(
        (u) => (u.role || "").toLowerCase() === "collector"
      );
      setCollectors(onlyCollectors);
    } catch (err) {
      setError(err?.message || "Failed to load collectors");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCollectors();
  }, []);

  const totalCollectors = collectors.length;

  const totalWallet = useMemo(
    () => collectors.reduce((sum, c) => sum + Number(c.walletBalance || 0), 0),
    [collectors]
  );

  const createCollector = async () => {
    setSaving(true);
    try {
      await api.post("/auth/register", {
        name: fullName,
        email,
        password,
        phone,
        role: "collector",
      });
      setShowModal(false);
      setFullName("");
      setEmail("");
      setPassword("");
      setPhone("");
      await loadCollectors();
    } catch (err) {
      alert(err?.message || "Failed to create collector");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Collectors</h2>
        <button className="primary-btn" onClick={() => setShowModal(true)}>
          <UserPlus size={16} /> Add Collector
        </button>
      </div>

      <div className="stats-grid">
        <div className="card">
          <h4>Total Collectors</h4>
          <p>{totalCollectors}</p>
        </div>
        <div className="card">
          <h4>Total Wallet Balance</h4>
          <p>Rs. {totalWallet}</p>
        </div>
      </div>

      {loading ? <p>Loading collectors...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Wallet</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {collectors.map((c) => (
              <tr key={c.id}>
                <td>{c.name || "-"}</td>
                <td>{c.email || "-"}</td>
                <td>{c.phone || "-"}</td>
                <td>Rs. {c.walletBalance ?? 0}</td>
                <td>{c.createdAt ? String(c.createdAt).slice(0, 10) : "-"}</td>
              </tr>
            ))}
            {!loading && collectors.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                  No collectors found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {showModal ? (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Collector</h3>
            <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <div style={{ display: "flex", gap: 8 }}>
              <button className="primary-btn" disabled={saving} onClick={createCollector}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button className="primary-btn" style={{ background: "#e5e7eb", color: "#111827" }} onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
