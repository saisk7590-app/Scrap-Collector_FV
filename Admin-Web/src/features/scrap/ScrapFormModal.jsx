import { useState } from "react";

export function ScrapFormModal({ onClose, onSubmit, initialData, saving }) {
  const [name, setName] = useState(initialData?.name || "");
  const [basePrice, setBasePrice] = useState(initialData?.basePrice ?? "");
  const [measurementType, setMeasurementType] = useState(
    initialData?.measurementType || "weight"
  );

  const handleSave = () => {
    if (!name || basePrice === "" || !measurementType) {
      alert("Enter name, base price and measurement type");
      return;
    }

    onSubmit({
      name,
      basePrice: Number(basePrice),
      measurementType,
    });
  };
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginBottom: 20 }}>
          {initialData ? "Edit Item" : "Add Item"}
        </h3>
        {/* Item Name */}
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />
        {/* Price */}
        <input
          type="number"
          placeholder="Base Price"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />
        {/* Measurement Type */}
        <select
          value={measurementType}
          onChange={(e) => setMeasurementType(e.target.value)}
          style={{ width: "100%", marginBottom: 20, padding: 8 }}
        >
          <option value="weight">Weight</option>
          <option value="quantity">Quantity</option>
        </select>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: "#16a34a",
              color: "white",
              padding: "6px 14px",
              border: "none",
              borderRadius: 6,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {initialData ? "Update" : "Add"}
          </button>

          <button
            onClick={onClose}
            style={{
              background: "#e5e7eb",
              padding: "6px 14px",
              border: "none",
              borderRadius: 6,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  background: "white",
  padding: 20,
  width: 350,
  borderRadius: 10,
};
