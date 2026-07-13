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
    FileText,
    Hash,
    Tag,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function Index({ agendas }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedAgenda, setSelectedAgenda] = useState(null);
    const { flash } = usePage().props;

    // Inertia useForm Hook
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
            order: item.order,
        });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const openDeleteModal = (item) => {
        setSelectedAgenda(item);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            put(route("admin.master-agenda.update", data.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route("admin.master-agenda.store"), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedAgenda) {
            destroy(route("admin.master-agenda.destroy", selectedAgenda.id), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedAgenda(null);
                },
            });
        }
    };

    // Fungsi untuk berpindah halaman menggunakan router.visit
    const handlePageChange = (page) => {
        if (page < 1 || page > agendas.last_page) return;
        router.visit(route("admin.master-agenda.index", { page: page }));
    };

    return (
        <AdminLayout header="Bank Data Uraian Kegiatan (Rundown)">
            <Head title="Bank Data Agenda" />

            {/* Flash Messages Notifications */}
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

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-5 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium mb-1">Total Bank Uraian Acara</p>
                            <p className="text-3xl font-bold">{agendas.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <FileText size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-purple-100 text-xs">Pilihan aktif generator di aplikasi mobile</div>
                </div>
            </div>

            {/* Table Core Wrapper */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                            <FileText className="text-purple-600" size={24} />
                            Master Data Agenda Protokol
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola teks master aktivitas demi mempercepat proses penyusunan rundown di HP.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Tambah Master Agenda
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b-2 border-slate-200">
                                <th className="py-4 px-6 text-center w-24">
                                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <Hash size={14} /> Order
                                    </div>
                                </th>
                                <th className="py-4 px-6">
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        <Tag size={14} /> Uraian Kegiatan / Agenda Resmi
                                    </div>
                                </th>
                                <th className="py-4 px-6 text-center w-36">
                                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Aksi</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {agendas.data.length ? (
                                agendas.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/60 transition-all duration-200">
                                        <td className="py-4 px-6 text-center">
                                            <div className="inline-flex items-center justify-center w-8 h-8 bg-purple-50 text-purple-700 font-bold rounded-lg">
                                                {item.order}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-semibold text-slate-800 text-base">{item.name}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-2 text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(item)}
                                                    className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-8 text-center text-slate-400">
                                        Belum ada data agenda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Component – gaya sesuai permintaan */}
                {agendas.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="text-sm text-slate-600">
                                Menampilkan{" "}
                                <span className="font-semibold text-slate-800">
                                    {agendas.from || 0}
                                </span>{" "}
                                -{" "}
                                <span className="font-semibold text-slate-800">
                                    {agendas.to || 0}
                                </span>{" "}
                                dari{" "}
                                <span className="font-semibold text-slate-800">
                                    {agendas.total}
                                </span>{" "}
                                data
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Tombol Sebelumnya */}
                                <button
                                    onClick={() => handlePageChange(agendas.current_page - 1)}
                                    disabled={agendas.current_page === 1}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                        agendas.current_page === 1
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            : "bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-600 border border-slate-200 hover:border-teal-300"
                                    }`}
                                >
                                    <ChevronLeft size={16} />
                                    Sebelumnya
                                </button>

                                {/* Nomor Halaman (generated secara manual) */}
                                <div className="flex items-center gap-1">
                                    {(() => {
                                        const pages = [];
                                        const current = agendas.current_page;
                                        const last = agendas.last_page;

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
                                                        i === agendas.current_page
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

                                {/* Tombol Selanjutnya */}
                                <button
                                    onClick={() => handlePageChange(agendas.current_page + 1)}
                                    disabled={agendas.current_page === agendas.last_page}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                        agendas.current_page === agendas.last_page
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

            {/* Modal Input Create / Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">
                                    {editMode ? "Ubah Master Agenda" : "Tambah Master Agenda Baru"}
                                </h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                    Nama Uraian Kegiatan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="Contoh: Menyanyikan Lagu Kebangsaan Indonesia Raya"
                                    className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    autoFocus
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                    Urutan Urut / Dropdown Order
                                </label>
                                <input
                                    type="number"
                                    value={data.order}
                                    onChange={(e) => setData("order", e.target.value)}
                                    className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md"
                                >
                                    {processing ? "Menyimpan..." : "Simpan Agenda"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Delete */}
            {isDeleteModalOpen && selectedAgenda && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} className="text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus dari Bank Data?</h3>
                            <p className="text-slate-500 text-sm mb-4">
                                Menghapus <span className="font-semibold text-slate-700">"{selectedAgenda.name}"</span> akan menghilangkannya dari opsi dropdown beranda mobile.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={processing}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium shadow-md"
                                >
                                    {processing ? "Menghapus..." : "Ya, Hapus"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}