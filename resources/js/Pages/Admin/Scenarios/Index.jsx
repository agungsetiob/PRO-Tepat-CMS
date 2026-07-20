import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link, router, usePage } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    AlertCircle,
    FileText,
    Image as ImageIcon,
    Tag,
    Eye,
    EyeOff,
    Layout,
    Search,
    ChevronRight,
    ChevronLeft,
    Layers,
} from "lucide-react";
import ScenarioFormModal from "./Partials/ScenarioFormModal";
import DeleteConfirmationModal from "./Partials/DeleteConfirmationModal";

export default function Index({ scenarios, categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
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
        id: "",
        category_id: "",
        title: "",
        description: "",
        layout_type: "",
        jenis_acara: "resmi",
        order: 0,
        is_active: 1,
        thumbnail: null,
        tags: "",
        _method: "POST",
    });

    const openCreateModal = () => {
        reset();
        setThumbnailPreview(null);
        setData((prev) => ({
            ...prev,
            _method: "POST",
            category_id: categories[0]?.id || "",
        }));
        setEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        const tagString = item.tags
            ? item.tags.map((t) => t.name).join(", ")
            : "";
        setData({
            id: item.id,
            category_id: item.category_id,
            title: item.title,
            description: item.description || "",
            layout_type: item.layout_type || "",
            jenis_acara: item.jenis_acara || "resmi",
            order: item.order,
            is_active: item.is_active ? 1 : 0,
            thumbnail: null,
            tags: tagString,
            _method: "PUT",
        });
        setThumbnailPreview(item.thumbnail || null);
        setEditMode(true);
        setIsModalOpen(true);
    };

    const openDeleteModal = (item) => {
        setSelectedScenario(item);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            post(route("admin.scenarios.update", data.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    setThumbnailPreview(null);
                },
                forceFormData: true,
            });
        } else {
            post(route("admin.scenarios.store"), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    setThumbnailPreview(null);
                },
                forceFormData: true,
            });
        }
    };

    const handleDelete = () => {
        if (selectedScenario) {
            destroy(route("admin.scenarios.destroy", selectedScenario.id), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedScenario(null);
                },
            });
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("thumbnail", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePageChange = (page) => {
        router.get(
            route("admin.scenarios.index", { page: page }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getStatusBadge = (isActive) => {
        return isActive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                <Eye size={12} />
                Aktif
            </span>
        ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                <EyeOff size={12} />
                Nonaktif
            </span>
        );
    };

    const getJenisAcaraBadge = (jenis) => {
        const types = {
            resmi: { label: "Acara Resmi", color: "blue", icon: "📋" },
            kenegaraan: { label: "Acara Kenegaraan", color: "purple", icon: "🏛️" },
            lainnya: { label: "Lainnya", color: "gray", icon: "📌" },
        };
        const t = types[jenis] || { label: jenis, color: "gray", icon: "📦" };

        return (
            <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-${t.color}-50 text-${t.color}-700`}
            >
                <span>{t.icon}</span>
                <span>{t.label}</span>
            </div>
        );
    };

    // Get paginated data
    const paginatedData = scenarios;
    const currentPageData = paginatedData.data || [];
    const totalItems = paginatedData.total || 0;
    const activeScenarios =
        paginatedData.data?.filter((s) => s.is_active).length || 0;
    const totalTags =
        paginatedData.data?.reduce(
            (acc, s) => acc + (s.tags?.length || 0),
            0,
        ) || 0;

    return (
        <AdminLayout header="Manajemen Skenario Konten Protokol">
            <Head title="Skenario Utama" />

            {/* Flash Messages - tetap sama */}
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

            {/* Stats Cards - tetap sama */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-teal-100 text-sm font-medium mb-1">
                                Total Skenario
                            </p>
                            <p className="text-3xl font-bold">{totalItems}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Layers size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-teal-100 text-xs">
                        Panduan keprotokolan tersedia
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">
                                Kategori Aktif
                            </p>
                            <p className="text-3xl font-bold">{categories.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Layout size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-blue-100 text-xs">
                        Jenis menu dalam sistem
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium mb-1">
                                Skenario Aktif
                            </p>
                            <p className="text-3xl font-bold">{activeScenarios}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Eye size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-purple-100 text-xs">
                        Tampil di aplikasi mobile
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-100 text-sm font-medium mb-1">
                                Total Tags
                            </p>
                            <p className="text-3xl font-bold">{totalTags}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Tag size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-amber-100 text-xs">
                        Kata kunci pencarian
                    </div>
                </div>
            </div>

            {/* Main Table Card - tetap sama, hanya bagian aksi yang menggunakan open modal */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                            <FileText className="text-teal-600" size={24} />
                            Daftar Skenario Lapangan
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola panduan utama berdasarkan kasus acara atau penataan tempat keprotokolan Tanbu
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Tambah Skenario
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                                <th className="py-4 px-6 w-28">Thumbnail</th>
                                <th className="py-4 px-6">Kategori & Judul</th>
                                <th className="py-4 px-6">Detail Layout</th>
                                <th className="py-4 px-6">Tags</th>
                                <th className="py-4 px-6 text-center w-24">Status</th>
                                <th className="py-4 px-6 text-center w-44">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {currentPageData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <FileText size={48} className="text-slate-300" />
                                            <p className="text-slate-500 font-medium">
                                                Belum ada skenario
                                            </p>
                                            <button
                                                onClick={openCreateModal}
                                                className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                                            >
                                                <Plus size={14} />
                                                Buat skenario pertama
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentPageData.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="group hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-200"
                                    >
                                        <td className="py-4 px-6">
                                            {item.thumbnail ? (
                                                <img
                                                    src={`/storage/${item.thumbnail}`}
                                                    alt={item.title}
                                                    className="w-20 h-14 rounded-lg object-cover border-2 border-slate-200 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-dashed border-slate-300">
                                                    <ImageIcon size={20} className="text-slate-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="mb-1">
                                                <span className="text-[11px] uppercase font-bold tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                                                    {item.category?.name}
                                                </span>
                                            </div>
                                            <div className="font-semibold text-slate-800 text-base mt-1">
                                                {item.title}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <ChevronRight size={10} />
                                                    Order: {item.order}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Layout size={14} className="text-slate-400" />
                                                    <span className="text-xs text-slate-600">
                                                        {item.layout_type || "Layout Umum"}
                                                    </span>
                                                </div>
                                                <div>{getJenisAcaraBadge(item.jenis_acara)}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                                                {item.tags?.length > 0 ? (
                                                    item.tags.map((t) => (
                                                        <span
                                                            key={t.id}
                                                            className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px] font-medium border border-slate-200"
                                                        >
                                                            <Tag size={10} />
                                                            {t.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">
                                                        Tidak ada tag
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {getStatusBadge(item.is_active)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={route("admin.scenarios.materi", item.id)}
                                                    className="p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200 group-hover:scale-110"
                                                    title="Kelola Materi"
                                                >
                                                    <FileText size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-2 text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all duration-200 group-hover:scale-110"
                                                    title="Ubah Skenario"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(item)}
                                                    className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 group-hover:scale-110"
                                                    title="Hapus Skenario"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - tetap sama */}
                {paginatedData.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="text-sm text-slate-600">
                                Menampilkan{" "}
                                <span className="font-semibold text-slate-800">
                                    {paginatedData.from || 0}
                                </span>{" "}
                                -{" "}
                                <span className="font-semibold text-slate-800">
                                    {paginatedData.to || 0}
                                </span>{" "}
                                dari{" "}
                                <span className="font-semibold text-slate-800">
                                    {paginatedData.total}
                                </span>{" "}
                                skenario
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(paginatedData.current_page - 1)}
                                    disabled={paginatedData.current_page === 1}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                        paginatedData.current_page === 1
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
                                        const current = paginatedData.current_page;
                                        const last = paginatedData.last_page;

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
                                                        i === paginatedData.current_page
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
                                    onClick={() => handlePageChange(paginatedData.current_page + 1)}
                                    disabled={paginatedData.current_page === paginatedData.last_page}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                        paginatedData.current_page === paginatedData.last_page
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
            <ScenarioFormModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editMode={editMode}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                categories={categories}
                thumbnailPreview={thumbnailPreview}
                handleThumbnailChange={handleThumbnailChange}
                setThumbnailPreview={setThumbnailPreview}
            />

            <DeleteConfirmationModal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                selectedScenario={selectedScenario}
                processing={processing}
                handleDelete={handleDelete}
            />
        </AdminLayout>
    );
}