import React from "react";
import Modal from "@/Components/Modal";
import {
    X,
    Edit,
    Plus,
    CheckCircle,
    AlertCircle,
    Upload,
    Eye,
    EyeOff,
    Search,
} from "lucide-react";

export default function ScenarioFormModal({
    show,
    onClose,
    editMode,
    data,
    setData,
    errors,
    processing,
    handleSubmit,
    categories,
    thumbnailPreview,
    handleThumbnailChange,
    setThumbnailPreview,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="3xl" closeable={!processing}>
            <div className="bg-white rounded-lg overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                            {editMode ? (
                                <Edit size={20} className="text-teal-400" />
                            ) : (
                                <Plus size={20} className="text-teal-400" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">
                                {editMode ? "Ubah Skenario" : "Tambah Skenario Baru"}
                            </h3>
                            <p className="text-slate-400 text-xs mt-0.5">
                                {editMode
                                    ? "Edit informasi skenario"
                                    : "Isi form untuk menambah skenario"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-5 max-h-[70vh] overflow-y-auto"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                Kategori Menu <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData("category_id", e.target.value)}
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                disabled={processing}
                            >
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {errors.category_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                Sifat Jenis Acara
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {["resmi", "kenegaraan", "incognito"].map((jenis) => (
                                    <label
                                        key={jenis}
                                        className={`cursor-pointer p-2 rounded-lg border-2 transition-all duration-200 text-center ${
                                            data.jenis_acara === jenis
                                                ? "border-teal-500 bg-teal-50"
                                                : "border-slate-200 hover:border-teal-300"
                                        } ${processing ? "opacity-60 cursor-not-allowed" : ""}`}
                                    >
                                        <input
                                            type="radio"
                                            value={jenis}
                                            checked={data.jenis_acara === jenis}
                                            onChange={(e) => setData("jenis_acara", e.target.value)}
                                            className="hidden"
                                            disabled={processing}
                                        />
                                        <span className="text-lg block">
                                            {jenis === "resmi"
                                                ? "📋"
                                                : jenis === "kenegaraan"
                                                ? "🏛️"
                                                : "📌"}
                                        </span>
                                        <span className="text-[10px] font-medium capitalize">
                                            {jenis === "kenegaraan" ? "Kenegaraan" : jenis}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                            Judul Skenario <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            placeholder="Contoh: Tata Tempat Di Kendaraan Dinas (Mobil)"
                            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                            autoFocus
                            disabled={processing}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                Model Layout
                            </label>
                            <input
                                type="text"
                                value={data.layout_type}
                                onChange={(e) => setData("layout_type", e.target.value)}
                                placeholder="Meja Oval, Lapangan Terbuka"
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                disabled={processing}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                Urutan Tampil
                            </label>
                            <input
                                type="number"
                                value={data.order}
                                onChange={(e) => setData("order", e.target.value)}
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                min="0"
                                disabled={processing}
                            />
                            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                                <span>↕️</span> Semakin kecil di atas
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                            Tags Pencarian
                        </label>
                        <input
                            type="text"
                            value={data.tags}
                            onChange={(e) => setData("tags", e.target.value)}
                            placeholder="Contoh: mobil, bupati, wabup, urutan kursi"
                            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                            disabled={processing}
                        />
                        <div className="flex items-start gap-2 mt-2">
                            <Search size={12} className="text-slate-400 mt-0.5" />
                            <span className="text-[11px] text-slate-500">
                                Tag ini yang dicari oleh user lewat Quick Search di aplikasi mobile
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                            Deskripsi Singkat
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            rows="3"
                            placeholder="Penjelasan singkat mengenai skenario ini..."
                            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                            disabled={processing}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                Thumbnail
                            </label>
                            <div className="mt-1 flex items-center gap-3">
                                <label className="flex-1 cursor-pointer">
                                    <div className="w-full border-2 border-dashed border-slate-300 rounded-xl p-3 hover:border-teal-400 transition-colors text-center">
                                        <Upload size={20} className="mx-auto text-slate-400 mb-1" />
                                        <span className="text-xs text-slate-500">Pilih file</span>
                                        <input
                                            type="file"
                                            onChange={handleThumbnailChange}
                                            className="hidden"
                                            accept="image/*"
                                            disabled={processing}
                                        />
                                    </div>
                                </label>
                                {thumbnailPreview && (
                                    <div className="relative">
                                        <img
                                            src={thumbnailPreview.startsWith('data:') ? thumbnailPreview : `/storage/${thumbnailPreview}`}
                                            alt="Preview"
                                            className="w-16 h-16 rounded-lg object-cover border-2 border-teal-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setThumbnailPreview(null);
                                                setData("thumbnail", null);
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                                            disabled={processing}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            {errors.thumbnail && (
                                <p className="text-red-500 text-xs mt-2">{errors.thumbnail}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                Status Publikasi
                            </label>
                            <div className="flex gap-3">
                                <label className="flex-1 cursor-pointer">
                                    <div
                                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                                            data.is_active === 1
                                                ? "border-teal-500 bg-teal-50"
                                                : "border-slate-200 hover:border-teal-300"
                                        } ${processing ? "opacity-60 cursor-not-allowed" : ""}`}
                                    >
                                        <input
                                            type="radio"
                                            value={1}
                                            checked={data.is_active === 1}
                                            onChange={(e) => setData("is_active", parseInt(e.target.value))}
                                            className="hidden"
                                            disabled={processing}
                                        />
                                        <Eye size={16} className="mx-auto mb-1 text-green-600" />
                                        <span className="text-xs font-medium">Aktif</span>
                                    </div>
                                </label>
                                <label className="flex-1 cursor-pointer">
                                    <div
                                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                                            data.is_active === 0
                                                ? "border-teal-500 bg-teal-50"
                                                : "border-slate-200 hover:border-teal-300"
                                        } ${processing ? "opacity-60 cursor-not-allowed" : ""}`}
                                    >
                                        <input
                                            type="radio"
                                            value={0}
                                            checked={data.is_active === 0}
                                            onChange={(e) => setData("is_active", parseInt(e.target.value))}
                                            className="hidden"
                                            disabled={processing}
                                        />
                                        <EyeOff size={16} className="mx-auto mb-1 text-red-600" />
                                        <span className="text-xs font-medium">Nonaktif</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={16} />
                                    Simpan Skenario
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}