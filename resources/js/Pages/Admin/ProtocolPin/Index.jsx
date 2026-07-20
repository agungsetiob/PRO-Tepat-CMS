import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    AlertCircle,
    KeyRound,
    Hash,
    Tag,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import PinFormModal from "./Partials/PinFormModal";
import DeleteConfirmationModal from "./Partials/DeleteConfirmationModal";

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

    const openDeleteModal = (item) => {
        setSelectedPin(item);
        setIsDeleteModalOpen(true);
    };

    const toggleStatus = (item) => {
        router.put(route("admin.protocol-pins.update", item.id), {
            pin: item.pin,
            label: item.label,
            is_active: !item.is_active,
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

    const handleDelete = () => {
        if (selectedPin) {
            destroy(route("admin.protocol-pins.destroy", selectedPin.id), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedPin(null);
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
                                <tr
                                    key={item.id}
                                    className={`hover:bg-slate-50/50 transition-colors ${!item.is_active ? "opacity-60" : ""}`}
                                >
                                    <td className="py-4 px-6 text-center">
                                        <code className="px-3 py-1.5 bg-slate-900 text-teal-400 font-mono text-base font-bold rounded-xl tracking-widest shadow-inner">
                                            {item.pin}
                                        </code>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="font-semibold text-slate-800 text-base">{item.label}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            Dibuat: {new Date(item.created_at).toLocaleDateString("id-ID")}
                                        </p>
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
                                                className="p-2 text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all duration-200"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(item)}
                                                className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pins.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-slate-400 py-12 italic">
                                        Belum ada PIN yang diterbitkan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Components */}
            <PinFormModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editMode={editMode}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
            />

            <DeleteConfirmationModal
                show={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedPin(null);
                }}
                selectedPin={selectedPin}
                processing={processing}
                handleDelete={handleDelete}
            />
        </AdminLayout>
    );
}