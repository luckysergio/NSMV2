import { useEffect, useState } from "react";
import api from "../../services/api";
import { Plus, X, Pencil, Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    type_id: "",
    harga_jual: "",
  });

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const fetchTypes = async () => {
    const res = await api.get("/product-types");
    setTypes(
      res.data.sort((a, b) =>
        `${a.category?.nama} ${a.subtype?.nama} ${a.nama}`.localeCompare(
          `${b.category?.nama} ${b.subtype?.nama} ${b.nama}`
        )
      )
    );
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchTypes()])
      .catch(() => Swal.fire("Error", "Gagal memuat data", "error"))
      .finally(() => setLoading(false));
  }, []);

  /* ================= FILTER TYPE BELUM DIPAKAI ================= */
  const availableTypes = types.filter(
    (t) => !products.some((p) => p.type_id === t.id)
  );

  const selectedType = types.find((t) => t.id == form.type_id);

  /* ================= ACTION ================= */
  const openCreate = () => {
    setEditingId(null);
    setForm({ type_id: "", harga_jual: "" });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      type_id: p.type_id,
      harga_jual: String(Math.floor(Number(p.harga_jual))),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Produk?",
      text: "Data tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Hapus",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/products/${id}`);
      Swal.fire("Berhasil", "Produk dihapus", "success");
      fetchProducts();
    } catch {
      Swal.fire("Gagal", "Tidak bisa menghapus produk", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, {
          harga_jual: Number(form.harga_jual),
        });
        Swal.fire("Berhasil", "Harga diperbarui", "success");
      } else {
        await api.post("/products", {
          type_id: form.type_id,
          harga_jual: Number(form.harga_jual),
        });
        Swal.fire("Berhasil", "Produk ditambahkan", "success");
      }

      setShowModal(false);
      fetchProducts();
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
        {/* GRID 4 PER BARIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4"
            >
              <div>
                <h3 className="text-lg font-bold text-emerald-400">
                  {p.kode_produk}
                </h3>
                <p className="text-sm text-slate-400">
                  {p.category?.nama} {p.subtype?.nama} {p.type?.nama}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Harga Jual</p>
                <p className="text-xl font-bold">
                  Rp{" "}
                  {Number(p.harga_jual).toLocaleString("id-ID", {
                    maximumFractionDigits: 0,
                  })}
                  <span className="text-sm font-normal text-slate-400">
                    {" "}
                    / {p.category?.satuan}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40"
                >
                  <Pencil size={16} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex items-center justify-center px-4 rounded-xl bg-red-600/20 hover:bg-red-600/40"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING BUTTON */}
      <button
        onClick={openCreate}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 shadow-xl"
      >
        <Plus size={20} /> Tambah Produk
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">
                {editingId ? "Edit Harga" : "Tambah Produk"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TYPE */}
              <div>
                <label className="text-sm text-slate-400">Type</label>

                {editingId ? (
                  <input
                    disabled
                    value={
                      selectedType
                        ? `${selectedType.category?.nama} – ${selectedType.subtype?.nama} – ${selectedType.nama}`
                        : ""
                    }
                    className="input bg-slate-800 cursor-not-allowed"
                  />
                ) : (
                  <select
                    value={form.type_id}
                    onChange={(e) =>
                      setForm({ ...form, type_id: e.target.value })
                    }
                    className="input"
                    required
                  >
                    <option value="">Pilih Type</option>
                    {availableTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.category?.nama} – {t.subtype?.nama} – {t.nama}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* HARGA */}
              <div>
                <label className="text-sm text-slate-400">Harga Jual</label>
                <input
                  value={formatRupiah(form.harga_jual)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      harga_jual: e.target.value.replace(/\D/g, ""),
                    })
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

/* ================= HELPERS ================= */
function formatRupiah(val) {
  if (!val) return "";
  return val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
