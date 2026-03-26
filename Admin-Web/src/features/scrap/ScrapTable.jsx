export function ScrapTable({ data, onEdit, onToggleStatus }) {
  if (data.length === 0) {
    return <p>No categories found.</p>;
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr style={{ textAlign: "left", color: "#666", fontSize: 14 }}>
          <th style={{ paddingBottom: 12 }}>ITEM Name</th>
          <th>Price per KG (₹)</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            style={{
              borderTop: "1px solid #eee",
            }}
          >
            <td style={{ padding: "14px 0" }}>{item.name}</td>

            <td>₹{item.pricePerKg}</td>

            <td>
              <span
                style={{
                  background:
                    item.status === "active" ? "#dcfce7" : "#f3f4f6",
                  color:
                    item.status === "active" ? "#166534" : "#6b7280",
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {item.status === "active" ? "Active" : "Inactive"}
              </span>
            </td>

            <td>
              <button
                onClick={() => onEdit(item)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#16a34a",
                  cursor: "pointer",
                  marginRight: 15,
                  fontWeight: 500,
                }}
              >
                Edit Price
              </button>

              <button
                onClick={() => onToggleStatus(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#dc2626",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {item.status === "active" ? "Disable" : "Enable"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}