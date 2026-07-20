import React from "react";
import Modal from "@/Components/Modal";
import { X, Edit, Plus, CheckCircle, AlertCircle } from "lucide-react";

export default function CategoryFormModal({
    show,
    onClose,
    editMode,
    data,
    setData,
    errors,
    processing,
    handleSubmit,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl" closeable={!processing}>
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
                                {editMode ? "Ubah Kategori" : "Tambah Kategori Baru"}
                            </h3>
                            <p className="text-slate-400 text-xs mt-0.5">
                                {editMode
                                    ? "Edit informasi kategori"
                                    : "Isi form untuk menambah kategori"}
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
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Nama Kategori */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                            Nama Kategori <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Contoh: Tata Tempat, Susunan Acara, Tata Cara"
                            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                            autoFocus
                            disabled={processing}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Tipe Data */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                            Tipe Data Sistem <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {["tempat", "acara", "hormat"].map((type) => (
                                <label
                                    key={type}
                                    className={`cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                                        data.type === type
                                            ? "border-teal-500 bg-teal-50"
                                            : "border-slate-200 hover:border-teal-300"
                                    } ${processing ? "opacity-60 cursor-not-allowed" : ""}`}
                                >
                                    <input
                                        type="radio"
                                        value={type}
                                        checked={data.type === type}
                                        onChange={(e) => setData("type", e.target.value)}
                                        className="hidden"
                                        disabled={processing}
                                    />
                                    <span className="text-2xl">
                                        {type === "tempat"
                                            ? "📍"
                                            : type === "acara"
                                            ? "🎉"
                                            : "🙏"}
                                    </span>
                                    <span className="text-xs font-medium capitalize">
                                        {type === "tempat"
                                            ? "Tempat"
                                            : type === "acara"
                                            ? "Acara"
                                            : "Hormat"}
                                    </span>
                                    <span className="text-[10px] text-slate-500 text-center">
                                        {type === "tempat"
                                            ? "Layout Posisi"
                                            : type === "acara"
                                            ? "Susunan Acara"
                                            : "Sapaan Tokoh"}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {errors.type && (
                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.type}
                            </p>
                        )}
                    </div>

                    {/* Icon & Order */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                Icon String
                            </label>
                            <input
                                type="text"
                                value={data.icon}
                                onChange={(e) => setData("icon", e.target.value)}
                                placeholder="chair-school, calendar"
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                disabled={processing}
                            />
                            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                                <span>💡</span> Untuk aplikasi mobile
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                Urutan Sort
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

                    {/* Preview */}
                    <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                        <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                            Preview
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-2xl">
                                {data.type === "tempat"
                                    ? "📍"
                                    : data.type === "acara"
                                    ? "🎉"
                                    : "🙏"}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">
                                    {data.name || "Nama Kategori"}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {data.type === "tempat"
                                        ? "Skenario Layout Posisi Duduk"
                                        : data.type === "acara"
                                        ? "Template Checklist Susunan Acara"
                                        : "Sapaan & Perlakuan Tokoh"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
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
                                    Simpan Kategori
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}