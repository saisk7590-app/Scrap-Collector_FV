import React, { useEffect, useMemo, useState } from "react";
import "./PickupManagementPage.css";
import { api } from "../../lib/api";
import toast from "react-hot-toast";

const tabs = [
  { label: "Scheduled", status: "scheduled" },
  { label: "Completed", status: "completed" },
  { label: "Cancelled", status: "cancelled" },
];

function shortId(id) {
  if (!id) return "-";
  return String(id).slice(0, 8);
}

export function PickupManagementPage() {
  const [activeStatus, setActiveStatus] = useState("scheduled");
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [collectors, setCollectors] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedCollectorId, setSelectedCollectorId] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // For create pickup
  const [newPickup, setNewPickup] = useState({
    userId: "",
    city: "",
    timeSlot: "",
    items: "[]",
    totalQty: 0,
    totalWeight: 0,
    amount: 0
  });

  async function loadPickups(status) {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({
        page: "0",
        size: "50",
        sortBy: "createdAt",
        sortDir: "desc",
      });
      if (status) qs.set("status", status);
      const page = await api.get(`/pickups?${qs.toString()}`);
      setPickups(page?.content || []);
    } catch (err) {
      setError(err?.message || "Failed to load pickups");
      toast.error(err?.message || "Failed to load pickups");
    } finally {
      setLoading(false);
    }
  }

  async function loadCollectors() {
    try {
      const page = await api.get("/admin/users?role=collector&page=0&size=200&sortBy=createdAt&sortDir=desc");
      setCollectors(page?.content || []);
    } catch {
      setCollectors([]);
    }
  }

  useEffect(() => {
    loadCollectors();
  }, []);

  useEffect(() => {
    loadPickups(activeStatus);
  }, [activeStatus]);

  const collectorOptions = useMemo(
    () =>
      collectors.map((c) => ({
        id: c.id,
        name: c.name || c.email || c.id,
      })),
    [collectors]
  );

  const assignCollector = async () => {
    if (!selectedPickup || !selectedCollectorId) return;
    setSaving(true);
    try {
      const updated = await api.put(`/pickups/${selectedPickup.id}/assign`, {
        collectorId: Number(selectedCollectorId),
      });
      setPickups((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSelectedPickup(null);
      setSelectedCollectorId("");
      toast.success("Collector assigned");
    } catch (err) {
      toast.error(err?.message || "Failed to assign collector");
      alert(err?.message || "Failed to assign collector");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (pickupId, status) => {
    setSaving(true);
    try {
      const updated = await api.put(`/pickups/${pickupId}/status`, { status });
      setPickups((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success("Status updated to " + status);
    } catch (err) {
      toast.error(err?.message || "Failed to update status");
      alert(err?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const deletePickup = async (pickupId) => {
    if (!confirm("Are you sure you want to delete this pickup?")) return;
    setSaving(true);
    try {
      await api.del(`/pickups/${pickupId}`);
      setPickups((prev) => prev.filter((p) => p.id !== pickupId));
      toast.success("Pickup deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to delete pickup");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await api.post("/pickups", {
        ...newPickup,
        userId: Number(newPickup.userId),
        totalQty: Number(newPickup.totalQty),
        totalWeight: Number(newPickup.totalWeight),
        amount: Number(newPickup.amount)
      });
      setPickups((prev) => [created, ...prev]);
      setShowCreate(false);
      setNewPickup({userId: "", city: "", timeSlot: "", items: "[]", totalQty: 0, totalWeight: 0, amount: 0});
      toast.success("Pickup created successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to create pickup");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pickup-page">
      <div className="flex justify-between items-center mb-4">
        <div className="tabs m-0">
          {tabs.map((t) => (
            <button
              key={t.status}
              className={activeStatus === t.status ? "active-tab" : ""}
              onClick={() => setActiveStatus(t.status)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Create Pickup
        </button>
      </div>

      {loading ? <p>Loading pickups...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>City</th>
              <th>Time Slot</th>
              <th>Weight</th>
              <th>Collector</th>
              <th>Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pickups.map((p) => (
              <tr key={p.id}>
                <td>{shortId(p.id)}</td>
                <td>{p.customerName || "-"}</td>
                <td>{p.city || "-"}</td>
                <td>{p.timeSlotLabel || "-"}</td>
                <td>{p.totalWeight ?? "-"}</td>
                <td>{p.collectorName || "-"}</td>
                <td>{p.createdAt ? String(p.createdAt).slice(0, 10) : "-"}</td>
                <td>{p.status || "-"}</td>
                <td className="flex gap-2">
                  {p.status === "scheduled" ? (
                    <>
                      <button onClick={() => setSelectedPickup(p)}>Assign</button>
                      <button disabled={saving} onClick={() => updateStatus(p.id, "cancelled")}>
                        Cancel
                      </button>
                    </>
                  ) : null}

                  {p.status === "completed" ? <span>? Done</span> : null}
                  {p.status === "cancelled" ? <span>? Cancelled</span> : null}

                  <button 
                    disabled={saving} 
                    onClick={() => deletePickup(p.id)}
                    className="ml-2 text-red-500 font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && pickups.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 20 }}>
                  No pickups found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {showCreate ? (
        <div className="modal flex justify-center items-center">
          <div className="modal-content w-96 max-h-screen overflow-auto">
            <h3>Create Pickup</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input type="number" required placeholder="User ID" value={newPickup.userId} onChange={(e) => setNewPickup({...newPickup, userId: e.target.value})} className="border p-2"/>
              <input type="text" required placeholder="City" value={newPickup.city} onChange={(e) => setNewPickup({...newPickup, city: e.target.value})} className="border p-2"/>
              <input type="text" required placeholder="Time Slot" value={newPickup.timeSlot} onChange={(e) => setNewPickup({...newPickup, timeSlot: e.target.value})} className="border p-2"/>
              <input type="text" required placeholder="Items JSON []" value={newPickup.items} onChange={(e) => setNewPickup({...newPickup, items: e.target.value})} className="border p-2"/>
              <input type="number" placeholder="Total Qty" value={newPickup.totalQty} onChange={(e) => setNewPickup({...newPickup, totalQty: e.target.value})} className="border p-2"/>
              <input type="number" step="0.01" placeholder="Total Weight" value={newPickup.totalWeight} onChange={(e) => setNewPickup({...newPickup, totalWeight: e.target.value})} className="border p-2"/>
              <input type="number" step="0.01" placeholder="Amount" value={newPickup.amount} onChange={(e) => setNewPickup({...newPickup, amount: e.target.value})} className="border p-2"/>
              <div className="modal-actions mt-4">
                <button type="submit" disabled={saving}>Save</button>
                <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {selectedPickup ? (
        <div className="modal">
          <div className="modal-content">
            <h3>Assign Collector</h3>
            <select value={selectedCollectorId} onChange={(e) => setSelectedCollectorId(e.target.value)}>
              <option value="">Select Collector</option>
              {collectorOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button disabled={saving || !selectedCollectorId} onClick={assignCollector}>
                {saving ? "Saving..." : "Confirm"}
              </button>
              <button
                onClick={() => {
                  setSelectedPickup(null);
                  setSelectedCollectorId("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

