import { useEffect, useState } from "react";
import api from "../../services/api";
import { Plus, X, Pencil, Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function TypePage() {
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subtypes, setSubtypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    category_id: "",
    subtype_id: "",
    nama: "",
  });

  /* ================= FETCH ================= */

  const fetchTypes = async () => {
    const res = await api.get("/product-types");
    setTypes(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get("/product-categories");
    setCategories(res.data);
  };

  const fetchSubtypes = async () => {
    const res = await api.get("/product-subtypes");
    setSubtypes(res.data);
  };

  useEffect(() => {
    Promise.all([fetchTypes(), fetchCategories(), fetchSubtypes()])
      .catch(() => Swal.fire("Error", "Gagal memuat data", "error"))
      .finally(() => setLoading(false));
  }, []);

  /* ================= ACTION ================= */

  const openCreate = () => {
    setEditingId(null);
    setForm({
      category_id: "",
      subtype_id: "",
      nama: "",
    });
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditingId(t.id);
    setForm({
      category_id: t.category_id,
      subtype_id: t.subtype_id,
      nama: t.nama,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Type?",
      text: "Data tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Hapus",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/product-types/${id}`);
      Swal.fire("Berhasil", "Type dihapus", "success");
      fetchTypes();
    } catch {
      Swal.fire("Gagal", "Type sedang dipakai produk", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await api.put(`/product-types/${editingId}`, form);
        Swal.fire("Berhasil", "Type diperbarui", "success");
      } else {
        await api.post("/product-types", form);
        Swal.fire("Berhasil", "Type ditambahkan", "success");
      }

      setShowModal(false);
      fetchTypes();
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= FILTER SUBTYPE ================= */

  const filteredSubtypes = subtypes.filter(
    (s) => s.category_id == form.category_id
  );

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        <Loader2 className="animate-spin mr-2" />
        Memuat data...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4"
            >
              <div>
                <h3 className="text-lg font-bold text-emerald-400">
                  {t.nama}
                </h3>
                <p className="text-sm text-slate-400">
                  {t.category?.nama} – {t.subtype?.nama}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(t)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40"
                >
                  <Pencil size={16} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="flex items-center justify-center px-4 rounded-xl bg-red-600/20 hover:bg-red-600/40"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOAT BUTTON */}
      <button
        onClick={openCreate}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 shadow-xl"
      >
        <Plus size={20} /> Tambah Type
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">
                {editingId ? "Edit Type" : "Tambah Type"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CATEGORY */}
              <div>
                <label className="text-sm text-slate-400">Category</label>
                <select
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category_id: e.target.value,
                      subtype_id: "",
                    })
                  }
                  className="input"
                  required
                >
                  <option value="">Pilih Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUBTYPE */}
              <div>
                <label className="text-sm text-slate-400">Subtype</label>
                <select
                  value={form.subtype_id}
                  onChange={(e) =>
                    setForm({ ...form, subtype_id: e.target.value })
                  }
                  className="input"
                  required
                  disabled={!form.category_id}
                >
                  <option value="">Pilih Subtype</option>
                  {filteredSubtypes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* NAMA TYPE */}
              <div>
                <label className="text-sm text-slate-400">Nama Type</label>
                <input
                  value={form.nama}
                  onChange={(e) =>
                    setForm({ ...form, nama: e.target.value.toUpperCase() })
                  }
                  className="input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 flex justify-center gap-2 disabled:opacity-60"
              >
                {submitting && <Loader2 className="animate-spin" size={18} />}
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
