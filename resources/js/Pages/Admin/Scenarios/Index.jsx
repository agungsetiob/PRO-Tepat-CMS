import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link, router } from "@inertiajs/react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Tag,
  Eye,
  EyeOff,
  Layout,
  Calendar,
  Search,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Upload,
  Layers
} from "lucide-react";

export default function Index({ scenarios, categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const { data, setData, post, reset, errors, processing } = useForm({
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
            post(route("admin.scenarios.destroy", selectedScenario.id), {
                _method: "DELETE",
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
        router.get(route('admin.scenarios.index', { page: page }), {}, {
            preserveState: true,
            preserveScroll: true,
        });
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
            resmi: { label: 'Acara Resmi', color: 'blue', icon: '📋' },
            kenegaraan: { label: 'Acara Kenegaraan', color: 'purple', icon: '🏛️' },
            lainnya: { label: 'Lainnya', color: 'gray', icon: '📌' }
        };
        const t = types[jenis] || { label: jenis, color: 'gray', icon: '📦' };
        
        return (
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-${t.color}-50 text-${t.color}-700`}>
                <span>{t.icon}</span>
                <span>{t.label}</span>
            </div>
        );
    };

    // Get paginated data
    const paginatedData = scenarios;
    const currentPageData = paginatedData.data || [];
    const totalItems = paginatedData.total || 0;
    const activeScenarios = paginatedData.data?.filter(s => s.is_active).length || 0;
    const totalTags = paginatedData.data?.reduce((acc, s) => acc + (s.tags?.length || 0), 0) || 0;

    return (
        <AdminLayout header="Manajemen Skenario Konten Protokol">
            <Head title="Skenario Utama" />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-teal-100 text-sm font-medium mb-1">Total Skenario</p>
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
                            <p className="text-blue-100 text-sm font-medium mb-1">Kategori Aktif</p>
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
                            <p className="text-purple-100 text-sm font-medium mb-1">Skenario Aktif</p>
                            <p className="text-3xl font-bold">{activeScenarios}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Eye size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-purple-100 text-xs">
                        Tampil di aplikasi mobile (halaman ini)
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-100 text-sm font-medium mb-1">Total Tags</p>
                            <p className="text-3xl font-bold">{totalTags}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Tag size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-amber-100 text-xs">
                        Kata kunci pencarian (halaman ini)
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
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
                                            <p className="text-slate-500 font-medium">Belum ada skenario</p>
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
                                    <tr key={item.id} className="group hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-200">
                                        <td className="py-4 px-6">
                                            {item.thumbnail ? (
                                                <img
                                                    src={item.thumbnail}
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
                                                <div>
                                                    {getJenisAcaraBadge(item.jenis_acara)}
                                                </div>
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
                                                    <span className="text-slate-400 text-xs italic">Tidak ada tag</span>
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

                {/* Pagination Component */}
                {paginatedData.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="text-sm text-slate-600">
                                Menampilkan <span className="font-semibold text-slate-800">{paginatedData.from || 0}</span> - <span className="font-semibold text-slate-800">{paginatedData.to || 0}</span> dari <span className="font-semibold text-slate-800">{paginatedData.total}</span> skenario
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(paginatedData.current_page - 1)}
                                    disabled={paginatedData.current_page === 1}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                        paginatedData.current_page === 1
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-600 border border-slate-200 hover:border-teal-300'
                                    }`}
                                >
                                    <ChevronLeft size={16} />
                                    Sebelumnya
                                </button>

                                {/* Page Numbers */}
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
                                                            ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                                                            : 'bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-600 border border-slate-200 hover:border-teal-300'
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

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(paginatedData.current_page + 1)}
                                    disabled={paginatedData.current_page === paginatedData.last_page}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                        paginatedData.current_page === paginatedData.last_page
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-600 border border-slate-200 hover:border-teal-300'
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

            {/* Modal Form Create/Edit - Keep the same as original */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 scale-100">
                        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                                    {editMode ? (
                                        <Edit size={20} className="text-teal-400" />
                                    ) : (
                                        <Plus size={20} className="text-teal-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">
                                        {editMode ? "Ubah Skenario" : "Tambah Skenario Baru"}
                                    </h3>
                                    <p className="text-slate-400 text-xs mt-0.5">
                                        {editMode ? "Edit informasi skenario" : "Isi form untuk menambah skenario"}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                        Kategori Menu <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData("category_id", e.target.value)}
                                        className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                        Sifat Jenis Acara
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['resmi', 'kenegaraan', 'incognito'].map((jenis) => (
                                            <label
                                                key={jenis}
                                                className={`cursor-pointer p-2 rounded-lg border-2 transition-all duration-200 text-center ${
                                                    data.jenis_acara === jenis
                                                        ? 'border-teal-500 bg-teal-50'
                                                        : 'border-slate-200 hover:border-teal-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={jenis}
                                                    checked={data.jenis_acara === jenis}
                                                    onChange={(e) => setData("jenis_acara", e.target.value)}
                                                    className="hidden"
                                                />
                                                <span className="text-lg block">
                                                    {jenis === 'resmi' ? '📋' : jenis === 'kenegaraan' ? '🏛️' : '📌'}
                                                </span>
                                                <span className="text-[10px] font-medium capitalize">
                                                    {jenis === 'kenegaraan' ? 'Kenegaraan' : jenis}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                    Judul Skenario <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    placeholder="Contoh: Tata Tempat Di Kendaraan Dinas (Mobil)"
                                    className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                    autoFocus
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                        Model Layout
                                    </label>
                                    <input
                                        type="text"
                                        value={data.layout_type}
                                        onChange={(e) => setData("layout_type", e.target.value)}
                                        placeholder="Meja Oval, Lapangan Terbuka"
                                        className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                        Urutan Tampil
                                    </label>
                                    <input
                                        type="number"
                                        value={data.order}
                                        onChange={(e) => setData("order", e.target.value)}
                                        className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                        min="0"
                                    />
                                    <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                                        <span>↕️</span> Semakin kecil di atas
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                    Tags Pencarian
                                </label>
                                <input
                                    type="text"
                                    value={data.tags}
                                    onChange={(e) => setData("tags", e.target.value)}
                                    placeholder="Contoh: mobil, bupati, wabup, urutan kursi"
                                    className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                />
                                <div className="flex items-start gap-2 mt-2">
                                    <Search size={12} className="text-slate-400 mt-0.5" />
                                    <span className="text-[11px] text-slate-500">
                                        Tag ini yang dicari oleh user lewat Quick Search di aplikasi mobile
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                    Deskripsi Singkat
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    rows="3"
                                    placeholder="Penjelasan singkat mengenai skenario ini..."
                                    className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                        Thumbnail
                                    </label>
                                    <div className="mt-1 flex items-center gap-3">
                                        <label className="flex-1 cursor-pointer">
                                            <div className="w-full border-2 border-dashed border-slate-300 rounded-xl p-3 hover:border-teal-400 transition-colors text-center">
                                                <Upload size={20} className="mx-auto text-slate-400 mb-1" />
                                                <span className="text-xs text-slate-500">Pilih file</span>
                                                <input
                                                    type="file"
                                                    onChange={handleThumbnailChange}
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                            </div>
                                        </label>
                                        {thumbnailPreview && (
                                            <div className="relative">
                                                <img
                                                    src={thumbnailPreview}
                                                    alt="Preview"
                                                    className="w-16 h-16 rounded-lg object-cover border-2 border-teal-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setThumbnailPreview(null);
                                                        setData("thumbnail", null);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {errors.thumbnail && (
                                        <p className="text-red-500 text-xs mt-2">{errors.thumbnail}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                        Status Publikasi
                                    </label>
                                    <div className="flex gap-3">
                                        <label className="flex-1 cursor-pointer">
                                            <div className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                                                data.is_active === 1
                                                    ? 'border-teal-500 bg-teal-50'
                                                    : 'border-slate-200 hover:border-teal-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    value={1}
                                                    checked={data.is_active === 1}
                                                    onChange={(e) => setData("is_active", parseInt(e.target.value))}
                                                    className="hidden"
                                                />
                                                <Eye size={16} className="mx-auto mb-1 text-green-600" />
                                                <span className="text-xs font-medium">Aktif</span>
                                            </div>
                                        </label>
                                        <label className="flex-1 cursor-pointer">
                                            <div className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                                                data.is_active === 0
                                                    ? 'border-teal-500 bg-teal-50'
                                                    : 'border-slate-200 hover:border-teal-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    value={0}
                                                    checked={data.is_active === 0}
                                                    onChange={(e) => setData("is_active", parseInt(e.target.value))}
                                                    className="hidden"
                                                />
                                                <EyeOff size={16} className="mx-auto mb-1 text-red-600" />
                                                <span className="text-xs font-medium">Nonaktif</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={16} />
                                            Simpan Skenario
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus - Keep the same as original */}
            {isDeleteModalOpen && selectedScenario && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100">
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
                                onClick={() => setIsDeleteModalOpen(false)} 
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 size={32} className="text-red-600" />
                                </div>
                                <p className="text-slate-700 font-medium mb-2">
                                    Apakah Anda yakin ingin menghapus skenario ini?
                                </p>
                                <p className="text-slate-500 text-sm">
                                    Data yang dihapus tidak dapat dikembalikan lagi.
                                </p>
                            </div>

                            {/* Detail Skenario yang akan dihapus */}
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                                <div className="flex items-start gap-3">
                                    {selectedScenario.thumbnail ? (
                                        <img
                                            src={selectedScenario.thumbnail}
                                            alt=""
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                                            <FileText size={20} className="text-slate-400" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800">{selectedScenario.title}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Kategori: {selectedScenario.category?.name}
                                        </p>
                                        {selectedScenario.tags?.length > 0 && (
                                            <p className="text-xs text-slate-400 mt-1">
                                                {selectedScenario.tags.length} tag terkait
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Warning Message */}
                            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700">
                                        Menghapus skenario akan menghapus seluruh isi pedoman protokol/checklist di dalamnya.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => setIsDeleteModalOpen(false)} 
                                    className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleDelete} 
                                    disabled={processing} 
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Menghapus...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} />
                                            Ya, Hapus Skenario
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}