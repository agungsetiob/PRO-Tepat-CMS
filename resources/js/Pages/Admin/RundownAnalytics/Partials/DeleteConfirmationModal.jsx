import React from "react";
import Modal from "@/Components/Modal";
import { X, AlertTriangle, Trash2, AlertCircle, MapPin, Calendar, Users, Layers } from "lucide-react";

export default function DeleteConfirmationModal({
    show,
    onClose,
    selectedRundown,
    processingId,
    handleDeleteConfirmed,
}) {
    if (!selectedRundown) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="md" closeable={processingId !== selectedRundown.id}>
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <AlertTriangle size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Hapus Rekam Jejak Rundown</h3>
                            <p className="text-red-100 text-xs mt-0.5">
                                Tindakan ini tidak dapat dibatalkan
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={processingId === selectedRundown.id}
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
                            Apakah Anda yakin ingin menghapus rekam jejak ini?
                        </p>
                        <p className="text-slate-500 text-sm">
                            Data yang dihapus tidak dapat dikembalikan lagi.
                        </p>
                    </div>

                    {/* Detail Rundown yang akan dihapus */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                        <div className="space-y-2">
                            <p className="font-bold text-slate-800 text-base">
                                {selectedRundown.event_name}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-1.5 text-slate-600">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span>{selectedRundown.date}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600">
                                    <MapPin size={14} className="text-slate-400" />
                                    <span>{selectedRundown.location}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600 col-span-2">
                                    <Users size={14} className="text-slate-400" />
                                    <span>PJ: {selectedRundown.pic || "-"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600 col-span-2">
                                    <Layers size={14} className="text-slate-400" />
                                    <span>{selectedRundown.items_count} Baris Acara</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Peringatan */}
                    <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700">
                                Menghapus rekam jejak akan menghapus seluruh data analitik terkait, 
                                termasuk grafik dan statistik yang terhubung.
                            </p>
                        </div>
                    </div>

                    {/* Tombol aksi */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={processingId === selectedRundown.id}
                            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleDeleteConfirmed}
                            disabled={processingId === selectedRundown.id}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
                        >
                            {processingId === selectedRundown.id ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={16} />
                                    Ya, Hapus
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}