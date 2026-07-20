import React from "react";
import Modal from "@/Components/Modal";
import { X, AlertTriangle, Trash2, AlertCircle } from "lucide-react";

export default function DeleteConfirmationModal({
    show,
    onClose,
    selectedHonorific,
    processing,
    handleDelete,
}) {
    if (!selectedHonorific) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="md" closeable={!processing}>
            <div className="bg-white rounded-lg overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <AlertTriangle size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Konfirmasi Hapus</h3>
                            <p className="text-red-100 text-xs mt-0.5">
                                Tindakan ini tidak dapat dibatalkan
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} className="text-red-600" />
                        </div>
                        <p className="text-slate-700 font-medium mb-2">
                            Apakah Anda yakin ingin menghapus jabatan ini?
                        </p>
                        <p className="text-slate-500 text-sm">
                            Data yang dihapus tidak dapat dikembalikan lagi.
                        </p>
                    </div>

                    {/* Detail Jabatan yang akan dihapus */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                        <div className="flex items-start gap-3">
                            <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm
                                    ${selectedHonorific.tingkat <= 2
                                        ? "bg-gradient-to-br from-amber-500 to-amber-600"
                                        : selectedHonorific.tingkat <= 3
                                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                        : "bg-gradient-to-br from-slate-500 to-slate-600"
                                    }`}
                            >
                                {selectedHonorific.tingkat}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-800">{selectedHonorific.jabatan}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Sapaan: {selectedHonorific.sapaan_resmi}
                                    {selectedHonorific.sapaan_lisan && ` (${selectedHonorific.sapaan_lisan})`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Warning Message */}
                    <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700">
                                Menghapus jabatan akan mempengaruhi pengaturan kursi dan prioritas protokol
                                yang terkait dengan jabatan ini.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={processing}
                            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={processing}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={16} />
                                    Ya, Hapus Jabatan
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}