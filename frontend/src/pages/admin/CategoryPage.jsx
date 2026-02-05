import { useEffect, useState } from "react";
import api from "../../services/api";
import { Plus, X, Pencil, Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function CategoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    nama: "",
    satuan: "",
    aktif: true,
  });

  const fetchData = async () => {
    try {
      const res = await api.get("/product-categories");
      setData(res.data);
    } catch (err) {
      Swal.fire("Error", "Gagal memuat data kategori", "error");
    }
  };

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ nama: "", satuan: "", aktif: true });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({
      nama: c.nama,
      satuan: c.satuan,
      aktif: c.aktif,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Category?",
      text: "Data yang dihapus tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Hapus",
    });

    if (!confirm.isConfirmed) return;

    Swal.fire({
      title: "Menghapus...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await api.delete(`/product-categories/${id}`);
      await fetchData();

      Swal.fire("Berhasil", "Category berhasil dihapus", "success");
    } catch (err) {
      Swal.fire("Error", "Gagal menghapus category", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await api.put(`/product-categories/${editingId}`, form);
        Swal.fire("Berhasil", "Category berhasil diperbarui", "success");
      } else {
        await api.post("/product-categories", form);
        Swal.fire("Berhasil", "Category berhasil ditambahkan", "success");
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        <Loader2 className="animate-spin mr-2" /> Memuat...
      </div>
    );

  return (
    <div className="min-h-screen text-slate-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((c) => (
            <div
              key={c.id}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4"
            >
              <div>
                <h3 className="text-lg font-bold text-emerald-400">
                  {c.nama}
                </h3>
                <p className="text-sm text-slate-400">
                  Satuan: {c.satuan}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(c)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40"
                >
                  <Pencil size={16} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="flex items-center justify-center px-4 rounded-xl bg-red-600/20 hover:bg-red-600/40"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={openCreate}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 shadow-xl"
      >
        <Plus size={20} /> Tambah Category
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Category" : "Tambah Category"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="input"
                placeholder="Nama"
                value={form.nama}
                onChange={(e) =>
                  setForm({ ...form, nama: e.target.value })
                }
                required
              />

              <input
                className="input"
                placeholder="Satuan (m3, ton, dll)"
                value={form.satuan}
                onChange={(e) =>
                  setForm({ ...form, satuan: e.target.value })
                }
                required
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.aktif}
                  onChange={(e) =>
                    setForm({ ...form, aktif: e.target.checked })
                  }
                />
                Aktif
              </label>

              <button
                disabled={submitting}
                className="w-full py-4 text-lg font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting && <Loader2 className="animate-spin" size={20} />}
                {submitting
                  ? editingId
                    ? "Menyimpan..."
                    : "Menambahkan..."
                  : "Simpan"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          background: rgb(15 23 42 / 0.7);
          border: 2px solid rgb(51 65 85);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
        }
      `}</style>
    </div>
  );
}
