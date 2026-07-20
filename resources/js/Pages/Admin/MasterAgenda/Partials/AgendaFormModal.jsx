import React from "react";
import Modal from "@/Components/Modal";
import { X, Edit, Plus, CheckCircle, AlertCircle } from "lucide-react";

export default function AgendaFormModal({
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
                                {editMode ? "Ubah Master Agenda" : "Tambah Master Agenda Baru"}
                            </h3>
                            <p className="text-slate-400 text-xs mt-0.5">
                                {editMode ? "Edit informasi agenda" : "Isi form untuk menambah master agenda baru"}
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
                            Nama Uraian Kegiatan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows="3"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Contoh: Menyanyikan Lagu Kebangsaan Indonesia Raya"
                            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
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

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                            Urutan Urut / Dropdown Order
                        </label>
                        <input
                            type="number"
                            value={data.order}
                            onChange={(e) => setData("order", e.target.value)}
                            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            min="0"
                            disabled={processing}
                        />
                        <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                            <span>↕️</span> Semakin kecil angkanya, posisi di dropdown semakin atas
                        </p>
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
                                    Simpan Agenda
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}