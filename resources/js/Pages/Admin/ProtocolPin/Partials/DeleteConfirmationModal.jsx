import React from "react";
import Modal from "@/Components/Modal";
import { X, ShieldAlert, Trash2, AlertCircle } from "lucide-react";

export default function DeleteConfirmationModal({
    show,
    onClose,
    selectedPin,
    processing,
    handleDelete,
}) {
    if (!selectedPin) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="sm" closeable={!processing}>
            <div className="bg-white rounded-lg overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <ShieldAlert size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Hapus PIN Permanen</h3>
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
                <div className="p-6 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={32} className="text-red-600" />
                    </div>
                    <p className="text-slate-700 font-medium mb-2">
                        Apakah Anda yakin ingin menghapus PIN ini?
                    </p>
                    <p className="text-slate-500 text-sm mb-4">
                        PIN <span className="font-mono font-bold text-slate-800">"{selectedPin.pin}"</span>{" "}
                        ({selectedPin.label}) akan hangus dan perangkat mobile yang menggunakan PIN ini
                        otomatis akan terblokir kembali.
                    </p>

                    {/* Detail tambahan */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-6 text-left">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Kode PIN</span>
                            <code className="font-mono font-bold text-slate-800">{selectedPin.pin}</code>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-slate-500">Label</span>
                            <span className="font-medium text-slate-700">{selectedPin.label}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-slate-500">Status</span>
                            <span className={`text-xs font-bold ${selectedPin.is_active ? 'text-emerald-600' : 'text-red-600'}`}>
                                {selectedPin.is_active ? 'AKTIF' : 'NONAKTIF'}
                            </span>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-left">
                        <div className="flex items-start gap-2">
                            <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700">
                                Menghapus PIN akan memblokir akses ke menu protokol untuk semua perangkat
                                yang menggunakan PIN ini.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-3">
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
                                    Ya, Hapus PIN
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}