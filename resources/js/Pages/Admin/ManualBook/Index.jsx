import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    AlertCircle,
    FileText,
    Download,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import ManualFormModal from "./Partials/ManualFormModal";
import DeleteConfirmationModal from "./Partials/DeleteConfirmationModal";

export default function Index({ manualBooks }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedManual, setSelectedManual] = useState(null);
    const { flash } = usePage().props;

    const {
        data,
        setData,
        post,
        delete: destroy,
        reset,
        errors,
        processing,
    } = useForm({
        id: null,
        title: "",
        description: "",
        file: null,
        is_active: true,
        _method: "POST",
    });

    const openCreateModal = () => {
        reset();
        setData({ ...data, _method: "POST", file: null });
        setEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setData({
            id: item.id,
            title: item.title,
            description: item.description || "",
            file: null,
            is_active: item.is_active,
            _method: "PUT",
        });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const openDeleteModal = (item) => {
        setSelectedManual(item);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("is_active", data.is_active ? "1" : "0");
        if (data.file) {
            formData.append("file", data.file);
        }

        if (editMode) {
            formData.append("_method", "PUT");
            post(route("admin.manual-book.update", data.id), {
                data: formData,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                onError: () => {},
            });
        } else {
            post(route("admin.manual-book.store"), {
                data: formData,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                onError: () => {},
            });
        }
    };

    const handleDelete = () => {
        if (selectedManual) {
            destroy(route("admin.manual-book.destroy", selectedManual.id), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedManual(null);
                },
            });
        }
    };

    const handleDownload = (id) => {
        window.open(route("admin.manual-book.download", id), "_blank");
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > manualBooks.last_page) return;
        router.visit(route("admin.manual-book.index", { page }));
    };

    return (
        <AdminLayout header="Manajemen Manual Book Sistem">
            <Head title="Manual Book" />

            {/* Flash Messages */}
            {flash?.error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={20} />
                        <p className="text-sm font-medium">{flash.error}</p>
                    </div>
                </div>
            )}
            {flash?.success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={20} />
                        <p className="text-sm font-medium">{flash.success}</p>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                            <FileText className="text-purple-600" size={24} />
                            Manual Book dan Panduan
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola dokumen yang dapat diunduh oleh pengguna.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Upload Manual Baru
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b-2 border-slate-200">
                                <th className="py-4 px-6">Judul</th>
                                <th className="py-4 px-6">Deskripsi</th>
                                <th className="py-4 px-6">Nama File</th>
                                <th className="py-4 px-6">Ukuran</th>
                                <th className="py-4 px-6">Diunggah Oleh</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {manualBooks.data.length ? (
                                manualBooks.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/60 transition-all duration-200">
                                        <td className="py-4 px-6 font-semibold text-slate-800">{item.title}</td>
                                        <td className="py-4 px-6 text-slate-600 text-sm">
                                            {item.description ? item.description.substring(0, 50) + (item.description.length > 50 ? "..." : "") : "-"}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-600">{item.file_name}</td>
                                        <td className="py-4 px-6 text-sm text-slate-600">{item.size_formatted}</td>
                                        <td className="py-4 px-6 text-sm text-slate-600">{item.uploaded_by || "Unknown"}</td>
                                        <td className="py-4 px-6 text-center">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    item.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {item.is_active ? "Aktif" : "Nonaktif"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleDownload(item.id)}
                                                    className="p-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                                                    title="Download"
                                                >
                                                    <Download size={16} />
                                                </button>
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-slate-400">
                                        Belum ada manual book diunggah.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {manualBooks.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="text-sm text-slate-600">
                                Menampilkan{" "}
                                <span className="font-semibold text-slate-800">{manualBooks.from || 0}</span> -{" "}
                                <span className="font-semibold text-slate-800">{manualBooks.to || 0}</span> dari{" "}
                                <span className="font-semibold text-slate-800">{manualBooks.total}</span> data
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(manualBooks.current_page - 1)}
                                    disabled={manualBooks.current_page === 1}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                        manualBooks.current_page === 1
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            : "bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-600 border border-slate-200 hover:border-teal-300"
                                    }`}
                                >
                                    <ChevronLeft size={16} />
                                    Sebelumnya
                                </button>

                                <div className="flex items-center gap-1">
                                    {(() => {
                                        const pages = [];
                                        const current = manualBooks.current_page;
                                        const last = manualBooks.last_page;

                                        let startPage = Math.max(1, current - 2);
                                        let endPage = Math.min(last, current + 2);

                                        if (endPage - startPage < 4) {
                                            if (startPage === 1) {
                                                endPage = Math.min(last, startPage + 4);
                                            } else if (endPage === last) {
                                                startPage = Math.max(1, endPage - 4);
                                            }
                                        }

                                        if (startPage > 1) {
                                            pages.push(
                                                <button
                                                    key={1}
                                                    onClick={() => handlePageChange(1)}
                                                    className="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-600 border border-slate-200 hover:border-teal-300"
                                                >
                                                    1
                                                </button>
                                            );
                                            if (startPage > 2) {
                                                pages.push(
                                                    <span key="dots1" className="w-9 h-9 flex items-center justify-center text-slate-400">
                                                        ...
                                                    </span>
                                                );
                                            }
                                        }

                                        for (let i = startPage; i <= endPage; i++) {
                                            pages.push(
                                                <button
                                                    key={i}
                                                    onClick={() => handlePageChange(i)}
                                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                        i === manualBooks.current_page
                                                            ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md"
                                                            : "bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-600 border border-slate-200 hover:border-teal-300"
                                                    }`}
                                                >
                                                    {i}
                                                </button>
                                            );
                                        }

                                        if (endPage < last) {
                                            if (endPage < last - 1) {
                                                pages.push(
                                                    <span key="dots2" className="w-9 h-9 flex items-center justify-center text-slate-400">
                                                        ...
                                                    </span>
                                                );
                                            }
                                            pages.push(
                                                <button
                                                    key={last}
                                                    onClick={() => handlePageChange(last)}
                                                    className="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-600 border border-slate-200 hover:border-teal-300"
                                                >
                                                    {last}
                                                </button>
                                            );
                                        }

                                        return pages;
                                    })()}
                                </div>

                                <button
                                    onClick={() => handlePageChange(manualBooks.current_page + 1)}
                                    disabled={manualBooks.current_page === manualBooks.last_page}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                        manualBooks.current_page === manualBooks.last_page
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            : "bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-600 border border-slate-200 hover:border-teal-300"
                                    }`}
                                >
                                    Selanjutnya
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Components */}
            <ManualFormModal
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
                selectedManual={selectedManual}
                processing={processing}
                handleDelete={handleDelete}
            />
        </AdminLayout>
    );
}