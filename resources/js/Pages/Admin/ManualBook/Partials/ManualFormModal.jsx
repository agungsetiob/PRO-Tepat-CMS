import React from "react";
import Modal from "@/Components/Modal";
import { X, Edit, Plus, CheckCircle, AlertCircle } from "lucide-react";

export default function ManualFormModal({
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
        <Modal show={show} onClose={onClose} maxWidth="lg" closeable={!processing}>
            <div className="bg-white rounded-lg overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            {editMode ? (
                                <Edit size={20} className="text-purple-400" />
                            ) : (
                                <Plus size={20} className="text-purple-400" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">
                                {editMode ? "Edit Manual Book" : "Upload Manual Book Baru"}
                            </h3>
                            <p className="text-slate-400 text-xs mt-0.5">
                                {editMode ? "Edit informasi manual book" : "Isi form untuk mengunggah manual book baru"}
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
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                            Judul <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            placeholder="Contoh: Panduan Pengguna Aplikasi Mobile"
                            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            autoFocus
                            disabled={processing}
                            required
                        />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                            Deskripsi
                        </label>
                        <textarea
                            rows="2"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            placeholder="Deskripsi singkat tentang isi manual book"
                            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                            disabled={processing}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                            File (PDF) <span className="text-red-500">* maksimal 20MB</span>
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setData("file", e.target.files[0])}
                            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                            required={!editMode}
                            disabled={processing}
                        />
                        {errors.file && (
                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.file}
                            </p>
                        )}
                        {editMode && (
                            <p className="text-xs text-slate-400 mt-1">
                                Kosongkan jika tidak ingin mengganti file.
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData("is_active", e.target.checked)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            disabled={processing}
                        />
                        <label className="text-sm font-medium text-slate-700">
                            Aktif (dapat diunduh oleh pengguna)
                        </label>
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
                            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={16} />
                                    {editMode ? "Perbarui" : "Upload"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}