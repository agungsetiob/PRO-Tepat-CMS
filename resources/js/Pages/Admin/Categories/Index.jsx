import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    AlertCircle,
    FolderTree,
    Grid3x3,
    Hash,
    Tag,
    Type,
} from "lucide-react";
import CategoryFormModal from "./Partials/CategoryFormModal";
import DeleteConfirmationModal from "./Partials/DeleteConfirmationModal";

export default function Index({ categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
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
        name: "",
        icon: "",
        type: "tempat",
        order: 0,
    });

    const openCreateModal = () => {
        reset();
        setEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setData({
            id: item.id,
            name: item.name,
            icon: item.icon || "",
            type: item.type,
            order: item.order,
        });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const openDeleteModal = (item) => {
        setSelectedCategory(item);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            put(route("admin.categories.update", data.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route("admin.categories.store"), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedCategory) {
            destroy(route("admin.categories.destroy", selectedCategory.id), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedCategory(null);
                },
            });
        }
    };

    const getTypeBadge = (type) => {
        const types = {
            tempat: { label: "Tempat", color: "blue", icon: "📍" },
            acara: { label: "Acara", color: "purple", icon: "🎉" },
            hormat: { label: "Hormat", color: "amber", icon: "🙏" },
        };
        const t = types[type] || { label: type, color: "gray", icon: "📦" };

        return (
            <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-${t.color}-50 text-${t.color}-700 border border-${t.color}-200`}
            >
                <span>{t.icon}</span>
                <span>{t.label}</span>
            </div>
        );
    };

    return (
        <AdminLayout header="Manajemen Master Kategori">
            <Head title="Master Kategori" />

            {/* Flash Messages */}
            {flash?.error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-green-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={20} />
                        <p className="text-sm font-medium">{flash.error}</p>
                    </div>
                </div>
            )}
            {flash?.success && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-red-100 border-l-4 border-green-500 text-green-700 rounded-lg shadow-sm animate-fade-in">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={20} className="flex-shrink-0" />
                        <p className="text-sm font-medium">{flash.success}</p>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">
                                Total Kategori
                            </p>
                            <p className="text-3xl font-bold">
                                {categories.length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <FolderTree size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-blue-100 text-xs">
                        Kategori aktif dalam sistem
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium mb-1">
                                Tipe Tempat
                            </p>
                            <p className="text-3xl font-bold">
                                {
                                    categories.filter(
                                        (c) => c.type === "tempat",
                                    ).length
                                }
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <span className="text-2xl">📍</span>
                        </div>
                    </div>
                    <div className="mt-3 text-purple-100 text-xs">
                        Skenario layout posisi duduk
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-100 text-sm font-medium mb-1">
                                Tipe Lainnya
                            </p>
                            <p className="text-3xl font-bold">
                                {
                                    categories.filter(
                                        (c) => c.type !== "tempat",
                                    ).length
                                }
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <span className="text-2xl">🎉</span>
                        </div>
                    </div>
                    <div className="mt-3 text-amber-100 text-xs">
                        Acara & Hormat dalam sistem
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                            <FolderTree className="text-teal-600" size={24} />
                            Daftar Kategori
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            3 kategori utama sebagai pemisah menu pada aplikasi
                            mobile
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Tambah Kategori
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                                <th className="py-4 px-6 text-center w-24">
                                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <Hash size={14} />
                                        Order
                                    </div>
                                </th>
                                <th className="py-4 px-6">
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <Tag size={14} />
                                        Nama Kategori
                                    </div>
                                </th>
                                <th className="py-4 px-6">
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <Type size={14} />
                                        Tipe Data
                                    </div>
                                </th>
                                <th className="py-4 px-6">
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <Grid3x3 size={14} />
                                        Icon Identifier
                                    </div>
                                </th>
                                <th className="py-4 px-6 text-center w-36">
                                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Aksi
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="group hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-200"
                                >
                                    <td className="py-4 px-6 text-center">
                                        <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700 font-bold rounded-lg">
                                            {item.order}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-semibold text-slate-800 text-base">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5 font-mono">
                                                slug: {item.slug}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {getTypeBadge(item.type)}
                                    </td>
                                    <td className="py-4 px-6">
                                        {item.icon ? (
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                                                <span className="text-lg">
                                                    {item.icon ===
                                                    "chair-school"
                                                        ? "🪑"
                                                        : item.icon ===
                                                            "calendar"
                                                          ? "📅"
                                                          : "🔖"}
                                                </span>
                                                <code className="text-xs text-slate-600 font-mono">
                                                    {item.icon}
                                                </code>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-sm">
                                                -
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() =>
                                                    openEditModal(item)
                                                }
                                                className="p-2 text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all duration-200 group-hover:scale-110"
                                                title="Ubah Kategori"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    openDeleteModal(item)
                                                }
                                                className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 group-hover:scale-110"
                                                title="Hapus Kategori"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {categories.length === 0 && (
                    <div className="p-12 text-center">
                        <FolderTree
                            size={48}
                            className="mx-auto text-slate-300 mb-3"
                        />
                        <p className="text-slate-500">Belum ada kategori</p>
                        <button
                            onClick={openCreateModal}
                            className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium"
                        >
                            + Tambah kategori pertama
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Components */}
            <CategoryFormModal
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
                onClose={() => setIsDeleteModalOpen(false)}
                selectedCategory={selectedCategory}
                processing={processing}
                handleDelete={handleDelete}
            />
        </AdminLayout>
    );
}
