import React, { useState } from "react";
import "./SettingsPage.css";

export function Settings() {
  const [settings, setSettings] = useState({
    adminName: "Admin User",
    email: "admin@scrap.com",
    businessName: "Green Scrap Solutions",
    supportNumber: "+91 9876543210",
    commission: 10,
    areas: ["Downtown", "West Zone"],
    paymentMethods: {
      upi: true,
      cash: true,
      wallet: false,
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  });

  const togglePayment = (method) => {
    setSettings({
      ...settings,
      paymentMethods: {
        ...settings.paymentMethods,
        [method]: !settings.paymentMethods[method],
      },
    });
  };

  const toggleNotification = (type) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: !settings.notifications[type],
      },
    });
  };

  const addArea = () => {
    const newArea = prompt("Enter new service area:");
    if (newArea) {
      setSettings({
        ...settings,
        areas: [...settings.areas, newArea],
      });
    }
  };

  const saveSettings = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-page">

      <div className="page-header">
        <h2>Settings</h2>
      </div>

      {/* Admin Profile */}
      <div className="settings-card">
        <h3>Admin Profile</h3>
        <input
          type="text"
          value={settings.adminName}
          onChange={(e) =>
            setSettings({ ...settings, adminName: e.target.value })
          }
        />
        <input
          type="email"
          value={settings.email}
          onChange={(e) =>
            setSettings({ ...settings, email: e.target.value })
          }
        />
      </div>

      {/* Business Configuration */}
      <div className="settings-card">
        <h3>Business Configuration</h3>
        <input
          type="text"
          value={settings.businessName}
          onChange={(e) =>
            setSettings({ ...settings, businessName: e.target.value })
          }
        />
        <input
          type="text"
          value={settings.supportNumber}
          onChange={(e) =>
            setSettings({ ...settings, supportNumber: e.target.value })
          }
        />
        <input
          type="number"
          value={settings.commission}
          onChange={(e) =>
            setSettings({ ...settings, commission: e.target.value })
          }
          placeholder="Commission %"
        />
      </div>

      {/* Service Areas */}
      <div className="settings-card">
        <h3>Service Areas</h3>
        <div className="area-list">
          {settings.areas.map((area, index) => (
            <span key={index} className="area-badge">
              {area}
            </span>
          ))}
        </div>
        <button className="primary-btn" onClick={addArea}>
          Add Area
        </button>
      </div>

      {/* Payment Methods */}
      <div className="settings-card">
        <h3>Payment Methods</h3>
        {Object.keys(settings.paymentMethods).map((method) => (
          <div key={method} className="toggle-row">
            <span>{method.toUpperCase()}</span>
            <input
              type="checkbox"
              checked={settings.paymentMethods[method]}
              onChange={() => togglePayment(method)}
            />
          </div>
        ))}
      </div>

      {/* Notification Settings */}
      <div className="settings-card">
        <h3>Notification Settings</h3>
        {Object.keys(settings.notifications).map((type) => (
          <div key={type} className="toggle-row">
            <span>{type.toUpperCase()}</span>
            <input
              type="checkbox"
              checked={settings.notifications[type]}
              onChange={() => toggleNotification(type)}
            />
          </div>
        ))}
      </div>

      <button className="save-btn" onClick={saveSettings}>
        Save Changes
      </button>

    </div>
  );
}