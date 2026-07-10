import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage } from "@inertiajs/react";
import {
    BarChart3,
    Calendar,
    MapPin,
    Users,
    FileSpreadsheet,
    Trash2,
    CheckCircle,
    Clock,
    Layers,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function Index({ stats, rundowns }) {
    const { flash } = usePage().props;
    const [processingId, setProcessingId] = useState(null);

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus rekam jejak rundown ini dari server?")) {
            setProcessingId(id);
            router.delete(route("admin.rundown-analytics.destroy", id), {
                onSuccess: () => setProcessingId(null),
                onFinish: () => setProcessingId(null),
            });
        }
    };

    // Fungsi untuk berpindah halaman menggunakan router.get
    const handlePageChange = (page) => {
        if (page < 1 || page > rundowns.last_page) return;
        router.get(route("admin.rundown-analytics.index", { page: page }));
    };

    // Kalkulasi nilai maksimal untuk skala persentase grafik batang mini
    const maxLocCount = Math.max(...stats.top_locations.map(l => l.total), 1);
    const maxPicCount = Math.max(...stats.top_pics.map(p => p.total), 1);

    return (
        <AdminLayout header="Analitik & Monitoring Pemanfaatan Aplikasi">
            <Head title="Analitik Rundown App" />

            {flash?.success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={20} />
                        <p className="text-sm font-medium">{flash.success}</p>
                    </div>
                </div>
            )}

            {/* GRID UTAMA STATS CARD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Total Produksi Rundown */}
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-md p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-teal-100 text-xs font-bold uppercase tracking-wider mb-1">Total Generated Rundown</p>
                            <p className="text-4xl font-black">{stats.total_rundown}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <FileSpreadsheet size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-teal-100/80 mt-4 font-medium">Akumulasi seluruh dokumen rundown yang dicetak via HP</p>
                </div>

                {/* Card 2: Aktivitas Bulan Ini */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-md p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Agenda Bulan Ini</p>
                            <p className="text-4xl font-black">{stats.total_this_month}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Calendar size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-indigo-100/80 mt-4 font-medium">Dokumen rundown baru yang digenerate bulan ini</p>
                </div>

                {/* Card 3: Status Keaktifan App */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-md p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Status Keaktifan App</p>
                            <p className="text-xl font-black text-emerald-400 flex items-center gap-1.5 mt-2">
                                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
                                AKTIF & BERJALAN
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
                            <Clock size={24} className="text-teal-400" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-5 font-medium">Menerima rekaman data live transaksi dari lapangan</p>
                </div>
            </div>

            {/* SEKSI GRAFIK VISUAL ANALITIK */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Grafik 1: Top Lokasi Kegiatan */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                        <MapPin size={18} className="text-cyan-600" /> Top Lokasi / Venue Terpilih
                    </h4>
                    <div className="space-y-4">
                        {stats.top_locations.map((loc, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-xs font-medium text-slate-700">
                                    <span className="truncate max-w-[80%]">{loc.location}</span>
                                    <span className="font-bold text-slate-900">{loc.total} Acara</span>
                                </div>
                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${(loc.total / maxLocCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {stats.top_locations.length === 0 && <p className="text-xs text-slate-400 italic py-4">Belum ada data visual</p>}
                    </div>
                </div>

                {/* Grafik 2: Top Pelaksana / PJ */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                        <Users size={18} className="text-purple-600" /> Pelaksana / PJ Teraktif
                    </h4>
                    <div className="space-y-4">
                        {stats.top_pics.map((pic, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-xs font-medium text-slate-700">
                                    <span className="truncate max-w-[80%]">{pic.pic || "Anonim/Tanpa PJ"}</span>
                                    <span className="font-bold text-slate-900">{pic.total} Kali</span>
                                </div>
                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${(pic.total / maxPicCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {stats.top_pics.length === 0 && <p className="text-xs text-slate-400 italic py-4">Belum ada data visual</p>}
                    </div>
                </div>
            </div>

            {/* TABEL DATA REKAM JEJAK UTAMA */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <BarChart3 className="text-teal-600" size={22} /> Riwayat Rundown dari Lapangan
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Daftar log arsip seluruh rundown yang sukses disusun oleh tim protokol via mobile app.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <th className="py-3 px-6">Nama Agenda Kegiatan</th>
                                <th className="py-3 px-6">Tanggal Acara</th>
                                <th className="py-3 px-6">Lokasi / Tempat</th>
                                <th className="py-3 px-6">Pelaksana / PJ</th>
                                <th className="py-3 px-6 text-center">Kompleksitas</th>
                                <th className="py-3 px-6 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {rundowns.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-4 px-6 font-bold text-slate-800 uppercase">{item.event_name}</td>
                                    <td className="py-4 px-6 text-slate-600">{item.date}</td>
                                    <td className="py-4 px-6 text-slate-600 flex items-center gap-1 mt-1.5"><MapPin size={14} className="text-slate-400"/> {item.location}</td>
                                    <td className="py-4 px-6 font-medium text-slate-700">{item.pic || "-"}</td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                                            <Layers size={12} /> {item.items_count} Baris Acara
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            disabled={processingId === item.id}
                                            className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Hapus Rekam Jejak"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {rundowns.data.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center text-slate-400 py-12 italic">Belum ada rekaman rundown yang masuk dari perangkat mobile.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Component – gaya sama seperti master-agenda */}
                {rundowns.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="text-sm text-slate-600">
                                Menampilkan{" "}
                                <span className="font-semibold text-slate-800">
                                    {rundowns.from || 0}
                                </span>{" "}
                                -{" "}
                                <span className="font-semibold text-slate-800">
                                    {rundowns.to || 0}
                                </span>{" "}
                                dari{" "}
                                <span className="font-semibold text-slate-800">
                                    {rundowns.total}
                                </span>{" "}
                                rundown
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Tombol Sebelumnya */}
                                <button
                                    onClick={() => handlePageChange(rundowns.current_page - 1)}
                                    disabled={rundowns.current_page === 1}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                        rundowns.current_page === 1
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            : "bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-600 border border-slate-200 hover:border-teal-300"
                                    }`}
                                >
                                    <ChevronLeft size={16} />
                                    Sebelumnya
                                </button>

                                {/* Nomor Halaman */}
                                <div className="flex items-center gap-1">
                                    {(() => {
                                        const pages = [];
                                        const current = rundowns.current_page;
                                        const last = rundowns.last_page;

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
                                                        i === rundowns.current_page
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
                                    onClick={() => handlePageChange(rundowns.current_page + 1)}
                                    disabled={rundowns.current_page === rundowns.last_page}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                        rundowns.current_page === rundowns.last_page
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
        </AdminLayout>
    );
}