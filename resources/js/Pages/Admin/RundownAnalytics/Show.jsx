import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Printer,
    MapPin,
    Calendar,
    Clock,
    User,
    CheckCircle,
    XCircle,
    HelpCircle,
    Image as ImageIcon,
    X,
} from "lucide-react";
import Modal from "@/Components/Modal";

export default function Show({ rundown }) {
    const [photoModalOpen, setPhotoModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const openPhotoModal = (photoPath) => {
        let fullUrl = photoPath;
        if (
            !photoPath.startsWith("storage/") &&
            !photoPath.startsWith("/storage/")
        ) {
            fullUrl = `/storage/${photoPath}`;
        } else if (photoPath.startsWith("storage/")) {
            fullUrl = `/${photoPath}`;
        }
        fullUrl = fullUrl.replace(/([^:]\/)\/+/g, "$1");
        setSelectedPhoto(fullUrl);
        setPhotoModalOpen(true);
    };

    const closePhotoModal = () => {
        setPhotoModalOpen(false);
        setSelectedPhoto(null);
    };

    const statusBadge = (status) => {
        switch (status) {
            case "hadir":
                return {
                    color: "bg-green-100 text-green-700 border-green-200",
                    icon: <CheckCircle size={14} className="text-green-600" />,
                    label: "Hadir",
                };
            case "tidak_hadir":
                return {
                    color: "bg-red-100 text-red-700 border-red-200",
                    icon: <XCircle size={14} className="text-red-600" />,
                    label: "Tidak Hadir",
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-600 border-gray-200",
                    icon: <HelpCircle size={14} className="text-gray-400" />,
                    label: "Belum Hadir",
                };
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminLayout header={`Detail Rundown: ${rundown.event_name}`}>
            <Head title={`Detail ${rundown.event_name}`} />

            {/* Tombol Kembali & Cetak */}
            <div className="flex items-center justify-between mb-6 print:hidden">
                <Link
                    href={route("admin.rundown-analytics.index")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <ArrowLeft size={18} />
                    Kembali ke Daftar
                </Link>
                <button
                    onClick={() => window.open(route('admin.rundown-analytics.print', rundown.id), '_blank')}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all"
                >
                    <Printer size={18} />
                    Cetak
                </button>
            </div>

            {/* KONTEN UTAMA */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden print:shadow-none print:border-0">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white print:bg-white print:p-6">
                    <h1 className="text-2xl font-extrabold text-slate-800 uppercase tracking-wide">
                        {rundown.event_name}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Calendar size={18} className="text-teal-600" />
                            <span className="font-medium">{rundown.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Clock size={18} className="text-teal-600" />
                            <span className="font-medium">
                                {rundown.time_info}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <MapPin size={18} className="text-teal-600" />
                            <span className="font-medium">
                                {rundown.location}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <User size={18} className="text-teal-600" />
                            <span className="font-medium">
                                PJ: {rundown.pic || "-"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Susunan Acara */}
                <div className="p-6 print:p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
                        Susunan Acara
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-100 text-slate-700">
                                    <th className="py-2 px-4 text-left font-semibold">
                                        No.
                                    </th>
                                    <th className="py-2 px-4 text-left font-semibold">
                                        Waktu
                                    </th>
                                    <th className="py-2 px-4 text-left font-semibold">
                                        Uraian Kegiatan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rundown.items.map((item, idx) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="py-2 px-4">{idx + 1}</td>
                                        <td className="py-2 px-4 font-mono">
                                            {item.start_time} – {item.end_time}
                                        </td>
                                        <td className="py-2 px-4">
                                            {item.master_agenda?.name || "-"}
                                        </td>
                                    </tr>
                                ))}
                                {rundown.items.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="py-6 text-center text-slate-400 italic"
                                        >
                                            Tidak ada susunan acara.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Undangan */}
                <div className="p-6 border-t border-slate-200 print:p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                        Daftar Undangan Pejabat
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-100 text-slate-700">
                                    <th className="py-2 px-4 text-left font-semibold">
                                        No.
                                    </th>
                                    <th className="py-2 px-4 text-left font-semibold">
                                        Jabatan
                                    </th>
                                    <th className="py-2 px-4 text-left font-semibold">
                                        Sapaan
                                    </th>
                                    <th className="py-2 px-4 text-left font-semibold">
                                        Status
                                    </th>
                                    <th className="py-2 px-4 text-left font-semibold">
                                        Foto Kehadiran
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rundown.invitations.map((inv, idx) => {
                                    const status = statusBadge(inv.status);
                                    return (
                                        <tr
                                            key={inv.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="py-2 px-4">
                                                {idx + 1}
                                            </td>
                                            <td className="py-2 px-4 font-medium">
                                                {inv.honorific?.jabatan || "-"}
                                            </td>
                                            <td className="py-2 px-4">
                                                {inv.honorific?.sapaan_resmi ||
                                                    "-"}
                                            </td>
                                            <td className="py-2 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}
                                                >
                                                    {status.icon}
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4">
                                                {inv.presence_photo ? (
                                                    <button
                                                        onClick={() =>
                                                            openPhotoModal(
                                                                inv.presence_photo,
                                                            )
                                                        }
                                                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors text-xs font-medium"
                                                    >
                                                        <ImageIcon size={14} />
                                                        Lihat Foto
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">
                                                        Tidak ada
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {rundown.invitations.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-6 text-center text-slate-400 italic"
                                        >
                                            Tidak ada daftar undangan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-200 text-xs text-slate-400 print:block hidden">
                    Dicetak dari Sistem Protokol Tanah Bumbu pada{" "}
                    {new Date().toLocaleString()}
                </div>
            </div>

            {/* MODAL FOTO */}
            <Modal
                show={photoModalOpen}
                onClose={closePhotoModal}
                maxWidth="2xl"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-800">
                            Foto Kehadiran
                        </h3>
                        <button
                            onClick={closePhotoModal}
                            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>
                    {selectedPhoto ? (
                        <div className="flex justify-center">
                            <img
                                src={selectedPhoto}
                                alt="Foto Kehadiran"
                                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "";
                                    e.target.alt = "Gambar tidak dapat dimuat";
                                }}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            Tidak ada foto untuk ditampilkan.
                        </div>
                    )}
                </div>
            </Modal>

            {/* CSS untuk cetak - perbaiki dengan dangerouslySetInnerHTML */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        .print\\:hidden {
                            display: none !important;
                        }
                        body {
                            background: white !important;
                            margin: 0;
                            padding: 0;
                        }
                        .rounded-2xl {
                            border-radius: 0 !important;
                            box-shadow: none !important;
                            border: none !important;
                        }
                        .bg-gradient-to-r {
                            background: white !important;
                        }
                        .bg-slate-100 {
                            background: #f1f5f9 !important;
                        }
                        .text-teal-600 {
                            color: #0d9488 !important;
                        }
                        table {
                            page-break-inside: auto;
                        }
                        tr {
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }
                        thead {
                            display: table-header-group;
                        }
                        tfoot {
                            display: table-footer-group;
                        }
                    }
                `,
                }}
            />
        </AdminLayout>
    );
}
