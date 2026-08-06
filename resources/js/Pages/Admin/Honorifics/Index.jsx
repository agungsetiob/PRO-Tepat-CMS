import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    Crown,
    Users,
    Award,
    Star,
    Hash,
    Mic,
    FileText,
    Shield,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import HonorificFormModal from "./Partials/HonorificFormModal";
import DeleteConfirmationModal from "./Partials/DeleteConfirmationModal";

export default function Index({ honorifics }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedHonorific, setSelectedHonorific] = useState(null);
    const { flash } = usePage().props;

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        id: "",
        jabatan: "",
        sapaan_resmi: "",
        sapaan_lisan: "",
        perlakuan_khusus: "",
        tingkat: "",
    });

    const openCreateModal = () => {
        reset();
        setEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setData({
            id: item.id,
            jabatan: item.jabatan,
            sapaan_resmi: item.sapaan_resmi,
            sapaan_lisan: item.sapaan_lisan || "",
            perlakuan_khusus: item.perlakuan_khusus || "",
            tingkat: item.tingkat,
        });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const openDeleteModal = (item) => {
        setSelectedHonorific(item);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            put(route("admin.honorifics.update", data.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route("admin.honorifics.store"), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedHonorific) {
            destroy(route("admin.honorifics.destroy", selectedHonorific.id), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedHonorific(null);
                },
            });
        }
    };

    const handlePageChange = (page) => {
        router.get(
            route("admin.honorifics.index", { page: page }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getTingkatBadge = (tingkat) => {
        const colors = [
            "from-amber-500 to-amber-600",
            "from-blue-500 to-blue-600",
            "from-emerald-500 to-emerald-600",
            "from-purple-500 to-purple-600",
            "from-pink-500 to-pink-600",
            "from-indigo-500 to-indigo-600",
        ];
        const colorIndex = Math.min(parseInt(tingkat) - 1, colors.length - 1);
        const colorClass = colors[colorIndex] || colors[0];

        return (
            <div
                className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br ${colorClass} text-white font-bold rounded-xl shadow-md`}
            >
                {tingkat}
            </div>
        );
    };

    const paginatedData = honorifics;
    const currentPageData = paginatedData.data || [];
    const totalItems = paginatedData.total || 0;

    return (
        <AdminLayout header="Manajemen Master Jabatan & Sapaan">
            <Head title="Master Jabatan" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium mb-1">Total Jabatan</p>
                            <p className="text-3xl font-bold">{totalItems}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Crown size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-purple-100 text-xs">Jabatan yang terdaftar dalam sistem</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 text-sm font-medium mb-1">Tertinggi</p>
                            <p className="text-2xl font-bold truncate">
                                {currentPageData[0]?.jabatan.split(" ").slice(0, 2).join(" ") || "-"}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Star size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-emerald-100 text-xs">
                        Tingkat {currentPageData[0]?.tingkat || 0} - Prioritas tertinggi
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Rata-rata Sapaan</p>
                            <p className="text-3xl font-bold">
                                {totalItems > 0
                                    ? Math.round(
                                          currentPageData.reduce(
                                              (acc, h) => acc + (h.sapaan_lisan ? 1 : 0),
                                              0,
                                          ) / currentPageData.length * 100,
                                      )
                                    : 0}
                                %
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Mic size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-blue-100 text-xs">Kelengkapan sapaan lisan (halaman ini)</div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                            <Shield className="text-teal-600" size={24} />
                            Daftar Urutan Protokol
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Urutan tingkatan menentukan prioritas utama dalam tata tempat keprotokolan daerah
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Tambah Jabatan
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                                <th className="py-4 px-6 text-center w-24">
                                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <Hash size={14} />
                                        Tingkat
                                    </div>
                                </th>
                                <th className="py-4 px-6">
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <Users size={14} />
                                        Nama Jabatan
                                    </div>
                                </th>
                                <th className="py-4 px-6">
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <Mic size={14} />
                                        Sapaan
                                    </div>
                                </th>
                                <th className="py-4 px-6">
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <FileText size={14} />
                                        Perlakuan Khusus
                                    </div>
                                </th>
                                <th className="py-4 px-6 text-center w-36">
                                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Aksi</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {currentPageData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <Crown size={48} className="text-slate-300" />
                                            <p className="text-slate-500 font-medium">Belum ada data jabatan</p>
                                            <button
                                                onClick={openCreateModal}
                                                className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                                            >
                                                <Plus size={14} />
                                                Tambah jabatan pertama
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
                                        <td className="py-4 px-6 text-center">{getTingkatBadge(item.tingkat)}</td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-semibold text-slate-800 text-base">{item.jabatan}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Award size={10} />
                                                        Prioritas #{item.tingkat}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-xs font-semibold text-slate-500 min-w-[45px]">Resmi:</span>
                                                    <span className="text-sm font-medium text-slate-700">{item.sapaan_resmi}</span>
                                                </div>
                                                {item.sapaan_lisan && (
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-xs font-semibold text-slate-500 min-w-[45px]">Lisan:</span>
                                                        <span className="text-sm text-slate-600">{item.sapaan_lisan}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {item.perlakuan_khusus ? (
                                                <div className="max-w-xs">
                                                    <p className="text-sm text-slate-600 line-clamp-2" title={item.perlakuan_khusus}>
                                                        {item.perlakuan_khusus}
                                                    </p>
                                                    {item.perlakuan_khusus.length > 60 && (
                                                        <span className="text-xs text-slate-400 mt-1 inline-block">hover untuk detail</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic text-sm">Tidak ada</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-2 text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all duration-200 group-hover:scale-110"
                                                    title="Ubah Jabatan"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(item)}
                                                    className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 group-hover:scale-110"
                                                    title="Hapus Jabatan"
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

                {/* Pagination */}
                {paginatedData.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="text-sm text-slate-600">
                                Menampilkan{" "}
                                <span className="font-semibold text-slate-800">{paginatedData.from || 0}</span> -{" "}
                                <span className="font-semibold text-slate-800">{paginatedData.to || 0}</span> dari{" "}
                                <span className="font-semibold text-slate-800">{paginatedData.total}</span> data
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
                                                </button>,
                                            );
                                            if (startPage > 2) {
                                                pages.push(
                                                    <span key="dots1" className="w-9 h-9 flex items-center justify-center text-slate-400">
                                                        ...
                                                    </span>,
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
                                                </button>,
                                            );
                                        }

                                        if (endPage < last) {
                                            if (endPage < last - 1) {
                                                pages.push(
                                                    <span key="dots2" className="w-9 h-9 flex items-center justify-center text-slate-400">
                                                        ...
                                                    </span>,
                                                );
                                            }
                                            pages.push(
                                                <button
                                                    key={last}
                                                    onClick={() => handlePageChange(last)}
                                                    className="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-600 border border-slate-200 hover:border-teal-300"
                                                >
                                                    {last}
                                                </button>,
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
            <HonorificFormModal
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
                selectedHonorific={selectedHonorific}
                processing={processing}
                handleDelete={handleDelete}
            />
        </AdminLayout>
    );
}