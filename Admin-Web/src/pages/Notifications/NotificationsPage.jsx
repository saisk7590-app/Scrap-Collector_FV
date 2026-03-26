import React, { useState } from "react";
import "./NotificationsPage.css";

export function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Pickup delay due to heavy rain.",
      target: "All Collectors",
      date: "2026-03-01",
      status: "Sent",
    },
  ]);

  const [message, setMessage] = useState("");
  const [broadcast, setBroadcast] = useState("All Customers");
  const [area, setArea] = useState("");

  const areas = ["Downtown", "Uptown", "West Zone", "East Zone"];

  const handleSend = () => {
    if (!message) return alert("Please enter a message.");

    let finalTarget = broadcast;

    if (broadcast === "Specific Area") {
      if (!area) return alert("Please select an area.");
      finalTarget = `Area: ${area}`;
    }

    const newNotification = {
      id: notifications.length + 1,
      message,
      target: finalTarget,
      date: new Date().toISOString().split("T")[0],
      status: "Sent",
    };

    setNotifications([newNotification, ...notifications]);
    setMessage("");
    setArea("");
    alert("Notification sent successfully!");
  };

  return (
    <div className="notifications-page">

      {/* Header */}
      <div className="page-header">
        <h2>Notifications</h2>
      </div>

      {/* Send Notification Card */}
      <div className="send-card">
        <h3>Send Push Notification</h3>

        <textarea
          placeholder="Enter announcement message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <select
          value={broadcast}
          onChange={(e) => {
            setBroadcast(e.target.value);
            setArea("");
          }}
        >
          <option>All Customers</option>
          <option>All Collectors</option>
          <option>Specific Area</option>
        </select>

        {broadcast === "Specific Area" && (
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            <option value="">Select Area</option>
            {areas.map((zone, index) => (
              <option key={index}>{zone}</option>
            ))}
          </select>
        )}

        <button onClick={handleSend} className="primary-btn">
          Send Notification
        </button>
      </div>

      {/* Notification History Table */}
      <div className="table-card">
        <h3>Notification History</h3>
        <table>
          <thead>
            <tr>
              <th>Message</th>
              <th>Target Group</th>
              <th>Date Sent</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((note) => (
              <tr key={note.id}>
                <td>{note.message}</td>
                <td>{note.target}</td>
                <td>{note.date}</td>
                <td>
                  <span className="badge sent">
                    {note.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}