import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    ShieldCheck,
    ArrowLeft,
    Building2,
    Calendar,
    FileText,
} from "lucide-react";

export default function PrivacyPolicy({ description, updated_at }) {
    return (
        <>
            <Head title="Kebijakan Privasi - PROTAP Tanah Bumbu" />

            <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden flex flex-col justify-between selection:bg-teal-500 selection:text-slate-900">
                {/* Background Pattern Soft */}
                <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] pointer-events-none'></div>

                {/* Ambient Glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* HEADER */}
                <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-4">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="/beraksi-logo.webp"
                                alt="Logo PROTAP"
                                className="h-9 w-auto"
                            />
                            <div>
                                <h1 className="font-bold text-white text-base tracking-wide leading-none">
                                    PROTAP
                                </h1>
                                <p className="text-[11px] text-teal-400 mt-0.5 font-medium">
                                    Kabupaten Tanah Bumbu
                                </p>
                            </div>
                        </div>

                        <Link
                            href={route("login")}
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all hover:text-white"
                        >
                            <ArrowLeft size={15} />
                            <span>Kembali</span>
                        </Link>
                    </div>
                </header>

                {/* KONTEN UTAMA */}
                <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <ShieldCheck size={160} className="text-teal-400" />
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-xs font-medium mb-4">
                                <FileText size={13} />
                                <span>Dokumen Resmi Keprotokolan</span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Kebijakan Privasi (Privacy Policy)
                            </h2>

                            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                                Pernyataan ini menjelaskan bagaimana aplikasi
                                PROTAP mengelola, melindungi, dan memperlakukan
                                data serta privasi Anda selama menggunakan
                                layanan operasional keprotokolan.
                            </p>

                            {updated_at && (
                                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                                    <Calendar
                                        size={14}
                                        className="text-teal-400"
                                    />
                                    <span>
                                        Pembaruan Terakhir:{" "}
                                        <strong className="text-slate-200 font-semibold">
                                            {updated_at}
                                        </strong>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rich Text Container (Styling Disesuaikan secara Presisi) */}
                    <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl">
                        <div
                            className="privacy-content text-slate-300 text-sm sm:text-base leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </div>
                </main>

                {/* FOOTER */}
                <footer className="relative z-10 border-t border-slate-800 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Building2 size={14} className="text-teal-500" />
                        <span className="font-semibold text-slate-400">
                            Pemerintah Kabupaten Tanah Bumbu
                        </span>
                    </div>
                    <p>© 2026 PROTAP Tanah Bumbu. All rights reserved.</p>
                </footer>
            </div>

            {/* STYLING KHUSUS UNTUK STERILISASI HTML DARI WYSIWYG */}
            <style>{`
                /* 1. Mencegah Teks Keluar Batas / Overflow */
                .privacy-content {
                    word-break: break-word;
                    overflow-wrap: anywhere;
                    white-space: normal !important;
                }

                /* 2. Hapus Paksa Highlight Putih & Warna Teks Hitam Bawaan WYSIWYG */
                .privacy-content * {
                    background-color: transparent !important;
                    color: inherit;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                }

                /* 3. Penataan Elemen Tipografi */
                .privacy-content h1 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #ffffff !important;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #334155;
                }
                .privacy-content h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #f1f5f9 !important;
                    margin-top: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                .privacy-content h3 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #38bdf8 !important;
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                }
                .privacy-content p {
                    margin-bottom: 1rem;
                    color: #cbd5e1 !important;
                    line-height: 1.7;
                }
                .privacy-content ul {
                    list-style-type: disc !important;
                    padding-left: 1.5rem !important;
                    margin-bottom: 1rem;
                }
                .privacy-content ol {
                    list-style-type: decimal !important;
                    padding-left: 1.5rem !important;
                    margin-bottom: 1rem;
                }
                .privacy-content li {
                    margin-bottom: 0.35rem;
                    color: #cbd5e1 !important;
                }
                .privacy-content strong, .privacy-content b {
                    color: #ffffff !important;
                    font-weight: 700;
                }
                .privacy-content a {
                    color: #2dd4bf !important;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }
                .privacy-content a:hover {
                    color: #5eead4 !important;
                }
                .privacy-content img {
                    max-width: 100% !important;
                    height: auto !important;
                    border-radius: 0.75rem;
                    margin: 1rem 0;
                }
            `}</style>
        </>
    );
}
