import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import toast from "react-hot-toast";

export function ScrapManagementPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("");
  const [iconBg, setIconBg] = useState("#16a34a");
  const [cardBg, setCardBg] = useState("#f0fdf4");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  async function loadCategories() {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/categories");
      setCategories(data || []);
    } catch (err) {
      setError(err?.message || "Failed to load categories");
      toast.error(err?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const saveCategory = async () => {
    if (!name) return;
    setSaving(true);
    try {
      if (editingId) {
        // Edit: send full payload including icon fields
        const payload = { name, iconName, iconBg, cardBg };
        const updated = await api.put(`/categories/${editingId}`, payload);
        setCategories((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
        toast.success("Category updated successfully");
      } else {
        // Create: send all fields
        const payload = { name, iconName, iconBg, cardBg };
        const created = await api.post("/categories", payload);
        setCategories((prev) => [created, ...prev]);
        toast.success("Category created successfully");
      }
      resetForm();
    } catch (err) {
      toast.error(err?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name || "");
    setIconName(cat.iconName || "");
    setIconBg(cat.iconBg || "#16a34a");
    setCardBg(cat.cardBg || "#f0fdf4");
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setIconName("");
    setIconBg("#16a34a");
    setCardBg("#f0fdf4");
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.del(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err?.message || "Failed to delete category");
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scrap Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage scrap categories and items</p>
        </div>

        <div className="flex gap-3 flex-wrap justify-end">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name"
            className="border px-4 py-2 rounded-lg text-sm"
          />
          <button
            disabled={saving}
            onClick={saveCategory}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update Category" : "+ Add Category"}
          </button>
          {editingId && (
            <button onClick={resetForm} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-lg font-semibold shadow-md transition">
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {loading ? <p>Loading categories...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div className="flex flex-col gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center hover:shadow-md transition">
            <div className="flex-1">
              <Link to={`${cat.id}`} className="block cursor-pointer">
                <h2 className="text-lg font-semibold">{cat.name}</h2>
                <p className="text-xs text-gray-400">ID: {cat.id}</p>
              </Link>
            </div>

            <div className="flex gap-4 items-center">
              <button onClick={() => startEdit(cat)} className="text-xs text-blue-500 font-semibold">
                Edit
              </button>
              <button onClick={() => deleteCategory(cat.id)} className="text-xs text-red-500 font-semibold">
                Delete
              </button>
            </div>
          </div>
        ))}

        {!loading && categories.length === 0 ? <p>No categories found.</p> : null}
      </div>
    </div>
  );
}

