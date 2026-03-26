import React from "react";
import "./ComingSoonPage.css";

export default function ComingSoonPage({ title = "Coming Soon" }) {
  return (
    <div className="coming-container">

      <div className="coming-card">
        <h1 className="coming-title">{title}</h1>

        <p className="coming-subtitle">
          This feature is under development 🚧
        </p>

        <p className="coming-note">
          We are working hard to bring this to you soon.
        </p>
      </div>

    </div>
  );
}