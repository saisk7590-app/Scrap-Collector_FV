import React, { useEffect, useMemo, useState } from "react";
import "./CustomersPage.css";
import { api } from "../../lib/api";

export function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const page = await api.get("/admin/users?role=customer&page=0&size=100&sortBy=createdAt&sortDir=desc");
        if (cancelled) return;
        const list =
          page?.content ||
          page?.data?.content ||
          (Array.isArray(page) ? page : []) ||
          [];
        // Safeguard: filter by role in case backend ignores the query param
        const onlyCustomers = list.filter(
          (u) => (u.role || "").toLowerCase() === "customer"
        );
        setCustomers(onlyCustomers);
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Failed to load customers");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const phone = (c.phone || "").toLowerCase();
      const email = (c.email || "").toLowerCase();
      return name.includes(q) || phone.includes(q) || email.includes(q);
    });
  }, [customers, search]);

  const exportCSV = () => {
    const headers = "Name,Email,Phone,Wallet Balance,Created At\n";
    const rows = filtered.map((c) =>
      [c.name || "", c.email || "", c.phone || "", c.walletBalance ?? "", c.createdAt || ""].join(",")
    );
    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "customers.csv";
    link.click();
  };

  const openCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setAddresses([]);
    setAddressesLoading(true);
    try {
      const data = await api.get(`/admin/addresses/user/${customer.id}`);
      setAddresses(data || []);
    } catch {
      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  };

  return (
    <div className="customers-page">
      <div className="top-bar">
        <h2>Customers</h2>
        <div className="actions">
          <input
            placeholder="Search by name, phone, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      {loading ? <p>Loading customers...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Wallet</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.name || "-"}</td>
                <td>{c.email || "-"}</td>
                <td>{c.phone || "-"}</td>
                <td>{c.walletBalance ?? 0}</td>
                <td>{c.createdAt ? String(c.createdAt).slice(0, 10) : "-"}</td>
                <td>
                  <button onClick={() => openCustomer(c)}>View</button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                  No customers found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {selectedCustomer ? (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedCustomer.name || "Customer"} - Addresses</h3>
            {addressesLoading ? <p>Loading addresses...</p> : null}
            {!addressesLoading && addresses.length === 0 ? <p>No addresses found.</p> : null}

            {!addressesLoading && addresses.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Area</th>
                    <th>Pincode</th>
                    <th>Address</th>
                    <th>Default</th>
                  </tr>
                </thead>
                <tbody>
                  {addresses.map((a) => (
                    <tr key={a.id}>
                      <td>{a.type || "-"}</td>
                      <td>{a.area || "-"}</td>
                      <td>{a.pincode || "-"}</td>
                      <td>{a.address || "-"}</td>
                      <td>{a.isDefault ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}

            <button onClick={() => setSelectedCustomer(null)}>Close</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
