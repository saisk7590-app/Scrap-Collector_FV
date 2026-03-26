import React, { useState } from "react";
import "./PaymentsPage.css";

export function Payments() {
  const [activeTab, setActiveTab] = useState("customers");
  const [showTopup, setShowTopup] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const customerPayments = [
    {
      id: "TXN-001",
      pickupId: "PK-101",
      customer: "Ravi Kumar",
      amount: 1200,
      mode: "UPI",
      date: "2025-03-01",
      status: "Paid",
    },
    {
      id: "TXN-002",
      pickupId: "PK-102",
      customer: "Amit Sharma",
      amount: 850,
      mode: "Cash",
      date: "2025-03-02",
      status: "Pending",
    },
  ];

  const walletTransactions = [
    {
      id: "WTX-001",
      collector: "Suresh Patel",
      type: "Credit",
      amount: 2000,
      date: "2025-03-01",
      status: "Success",
    },
    {
      id: "WTX-002",
      collector: "Ravi Kumar",
      type: "Debit",
      amount: 500,
      date: "2025-03-02",
      status: "Success",
    },
  ];

  const totalRevenue = customerPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const totalWallet = walletTransactions.reduce(
    (sum, t) => (t.type === "Credit" ? sum + t.amount : sum - t.amount),
    0
  );

  const pendingPayments = customerPayments.filter(
    (p) => p.status === "Pending"
  ).length;

  const exportCSV = () => {
    const data =
      activeTab === "customers"
        ? customerPayments
        : walletTransactions;

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row).join(",")
    );
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "payments.csv";
    link.click();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Payments</h2>

        <div className="header-actions">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <button onClick={exportCSV} className="secondary-btn">
            Export CSV
          </button>

          <button
            onClick={() => setShowTopup(true)}
            className="primary-btn"
          >
            Wallet Top-Up
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="card">
          <h4>Total Revenue</h4>
          <p>₹{totalRevenue}</p>
        </div>
        <div className="card">
          <h4>Customer Payments</h4>
          <p>{customerPayments.length}</p>
        </div>
        <div className="card">
          <h4>Total Wallet Balance</h4>
          <p>₹{totalWallet}</p>
        </div>
        <div className="card">
          <h4>Pending Payments</h4>
          <p>{pendingPayments}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "customers" ? "active" : ""}
          onClick={() => setActiveTab("customers")}
        >
          Customer Payments
        </button>
        <button
          className={activeTab === "wallet" ? "active" : ""}
          onClick={() => setActiveTab("wallet")}
        >
          Collector Wallet Transactions
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {activeTab === "customers" ? (
                <>
                  <th>Transaction ID</th>
                  <th>Pickup ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Date</th>
                  <th>Status</th>
                </>
              ) : (
                <>
                  <th>Transaction ID</th>
                  <th>Collector</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {(activeTab === "customers"
              ? customerPayments
              : walletTransactions
            ).map((row) => (
              <tr key={row.id}>
                {activeTab === "customers" ? (
                  <>
                    <td>{row.id}</td>
                    <td>{row.pickupId}</td>
                    <td>{row.customer}</td>
                    <td>₹{row.amount}</td>
                    <td>{row.mode}</td>
                    <td>{row.date}</td>
                    <td>
                      <span
                        className={
                          row.status === "Paid"
                            ? "badge success"
                            : "badge warning"
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{row.id}</td>
                    <td>{row.collector}</td>
                    <td>{row.type}</td>
                    <td>₹{row.amount}</td>
                    <td>{row.date}</td>
                    <td>
                      <span className="badge success">
                        {row.status}
                      </span>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top-Up Modal */}
      {showTopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Wallet Top-Up</h3>
            <input placeholder="Collector Name" />
            <input placeholder="Amount" type="number" />
            <button
              className="primary-btn"
              onClick={() => setShowTopup(false)}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}