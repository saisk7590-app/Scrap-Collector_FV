import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScrapFormModal } from "../../features/scrap/ScrapFormModal";
import { api } from "../../lib/api";

export function ScrapItemsPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({
        categoryId: String(categoryId),
        page: "0",
        size: "200",
        sortBy: "createdAt",
        sortDir: "desc",
      });
      const page = await api.get(`/admin/scrap-items?${qs.toString()}`);
      setItems(page?.content || []);
    } catch (err) {
      setError(err?.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!categoryId) return;
    loadItems();
  }, [categoryId]);

  const categoryItems = useMemo(() => items, [items]);

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api.del(`/admin/scrap-items/${id}`);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      alert(err?.message || "Failed to delete item");
    }
  };

  const saveItem = async (data) => {
    setSaving(true);
    try {
      if (editingItem) {
        const updated = await api.put(`/admin/scrap-items/${editingItem.id}`, {
          categoryId: editingItem.categoryId,
          name: data.name,
          basePrice: data.basePrice,
          measurementType: data.measurementType,
        });
        setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        const created = await api.post(`/admin/scrap-items`, {
          categoryId: Number(categoryId),
          name: data.name,
          basePrice: data.basePrice,
          measurementType: data.measurementType,
        });
        setItems((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      alert(err?.message || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/scrap-management")}
            className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="text-lg">←</span>
            Back
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">Scrap Items (Category {categoryId})</h1>
            <p className="text-sm text-gray-500 mt-1">Manage items and pricing</p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition"
        >
          + Add Item
        </button>
      </div>

      {loading ? <p>Loading items...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Base Price</th>
              <th className="px-6 py-4">Measurement</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {categoryItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                <td className="px-6 py-4 text-gray-600">₹{item.basePrice}</td>
                <td className="px-6 py-4 text-gray-600">{item.measurementType}</td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button
                    disabled={saving}
                    onClick={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-40"
                  >
                    Edit
                  </button>

                  <button
                    disabled={saving}
                    onClick={() => deleteItem(item.id)}
                    className="text-sm font-semibold text-red-500 hover:text-red-700 disabled:opacity-40"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!loading && categoryItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  No items found in this category
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <ScrapFormModal
          key={editingItem?.id || "new"}
          saving={saving}
          initialData={
            editingItem
              ? {
                  name: editingItem.name,
                  basePrice: editingItem.basePrice,
                  measurementType: editingItem.measurementType,
                }
              : null
          }
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSubmit={saveItem}
        />
      ) : null}
    </div>
  );
}

