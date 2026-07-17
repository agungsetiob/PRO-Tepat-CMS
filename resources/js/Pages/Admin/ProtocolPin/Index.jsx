import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    X,
    CheckCircle,
    AlertCircle,
    KeyRound,
    Hash,
    Tag,
    ShieldAlert,
    ToggleLeft,
    ToggleRight
} from "lucide-react";

export default function Index({ pins }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedPin, setSelectedPin] = useState(null);
    const { flash } = usePage().props;

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        reset,
        errors,
        processing,
    } = useForm({
        id: "",
        pin: "",
        label: "",
        is_active: true,
    });

    const openCreateModal = () => {
        reset();
        setEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setData({
            id: item.id,
            pin: item.pin,
            label: item.label,
            is_active: !!item.is_active,
        });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const toggleStatus = (item) => {
        router.put(route("admin.protocol-pins.update", item.id), {
            pin: item.pin,
            label: item.label,
            is_active: !item.is_active
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            put(route("admin.protocol-pins.update", data.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route("admin.protocol-pins.store"), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <AdminLayout header="Keamanan Aplikasi: Manajemen PIN Otorisasi">
            <Head title="Manajemen PIN Protokol" />

            {/* Flash Info */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-sm flex items-center gap-2">
                    <CheckCircle size={20} />
                    <p className="text-sm font-medium">{flash.success}</p>
                </div>
            )}

            {/* Header Utama Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                            <KeyRound className="text-purple-600" size={24} />
                            Daftar PIN Akses Lapangan
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola PIN 6-Digit dinamis untuk memproteksi menu vital di mobile app.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Terbitkan PIN Baru
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <th className="py-4 px-6 text-center w-32">6-Digit PIN</th>
                                <th className="py-4 px-6">Label Akses</th>
                                <th className="py-4 px-6 text-center w-36">Status</th>
                                <th className="py-4 px-6 text-center w-36">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pins.map((item) => (
                                <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${!item.is_active ? 'opacity-60' : ''}`}>
                                    <td className="py-4 px-6 text-center">
                                        <code className="px-3 py-1.5 bg-slate-900 text-teal-400 font-mono text-base font-bold rounded-xl tracking-widest shadow-inner">
                                            {item.pin}
                                        </code>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="font-semibold text-slate-800 text-base">{item.label}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button 
                                            onClick={() => toggleStatus(item)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                                item.is_active 
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                                    : "bg-red-50 text-red-700 border border-red-200"
                                            }`}
                                        >
                                            {item.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                            {item.is_active ? "AKTIF" : "NONAKTIF"}
                                        </button>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="p-2 text-amber-600 hover:text-amber-700 bg-amber-50 rounded-lg"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedPin(item); setIsDeleteModalOpen(true); }}
                                                className="p-2 text-red-600 hover:text-red-700 bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pins.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-slate-400 py-12 italic">Belum ada PIN yang diterbitkan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
                            <h3 className="font-bold text-lg">{editMode ? "Ubah Konfigurasi PIN" : "Terbitkan PIN Otorisasi Baru"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-700 rounded-lg"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">6-Digit Kode PIN (Angka)</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={data.pin}
                                    onChange={(e) => setData("pin", e.target.value.replace(/[^0-9]/g, ""))}
                                    placeholder="Contoh: 759123"
                                    className="w-full text-center text-xl font-mono tracking-widest border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500"
                                    autoFocus
                                />
                                {errors.pin && <p className="text-red-500 text-xs mt-2">{errors.pin}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">Peruntukan Tim / Keterangan</label>
                                <input
                                    type="text"
                                    value={data.label}
                                    onChange={(e) => setData("label", e.target.value)}
                                    placeholder="Contoh: Protokol Setda Reguler, Tim RSUD, dll"
                                    className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500"
                                />
                                {errors.label && <p className="text-red-500 text-xs mt-2">{errors.label}</p>}
                            </div>

                            {editMode && (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Status Otorisasi</label>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Nonaktifkan untuk memblokir akses tanpa menghapus data.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData("is_active", !data.is_active)}
                                        className="text-purple-600 hover:text-purple-700 transition-colors"
                                    >
                                        {data.is_active ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                                    </button>
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl">Batal</button>
                                <button type="submit" disabled={processing} className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md">
                                    {processing ? "Memproses..." : "Simpan PIN"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Delete */}
            {isDeleteModalOpen && selectedPin && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert size={32} className="text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus PIN Permanen?</h3>
                        <p className="text-slate-500 text-sm mb-5">PIN <span className="font-mono font-bold text-slate-800">"{selectedPin.pin}"</span> ({selectedPin.label}) akan hangus dan perangkat mobile yang menggunakan PIN ini otomatis akan terblokir kembali.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium">Batal</button>
                            <button onClick={() => destroy(route("admin.protocol-pins.destroy", selectedPin.id), { onSuccess: () => setIsDeleteModalOpen(false) })} disabled={processing} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium shadow-md">
                                Ya, Hapus PIN
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}