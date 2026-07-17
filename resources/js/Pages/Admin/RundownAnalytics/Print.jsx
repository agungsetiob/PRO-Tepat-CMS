import React from 'react';
import { Head } from '@inertiajs/react';

export default function Print({ rundown }) {
    const printDate = new Date().toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Helper untuk status kehadiran
    const statusLabel = (status) => {
        switch (status) {
            case 'hadir': return 'HADIR';
            case 'tidak_hadir': return 'TIDAK HADIR';
            default: return 'BELUM HADIR';
        }
    };

    return (
        <div className="bg-white min-h-screen text-black font-sans">
            <Head title={`Cetak Rundown - ${rundown.event_name}`} />

            {/* Tombol aksi di luar area cetak (hanya tampil di layar) */}
            <div className="print:hidden p-6 bg-gray-100 border-b border-gray-300 flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Cetak Rundown Acara</h1>
                    <p className="text-gray-600 mt-1">{rundown.event_name}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => window.close()} className="px-4 py-2 bg-gray-400 text-white rounded font-bold shadow hover:bg-gray-500">
                        Tutup Tab
                    </button>
                    <button onClick={() => window.print()} className="px-6 py-2 bg-blue-600 text-white rounded font-bold shadow hover:bg-blue-700 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Cetak
                    </button>
                </div>
            </div>

            {/* AREA KERTAS CETAK A4 */}
            <div className="w-full max-w-4xl mx-auto p-8 bg-white text-sm leading-relaxed">
                {/* KOP SURAT RESMI */}
                <div className="border-b-4 border-double border-black mb-4 flex items-center">
                    <img 
                        src="/logo-tanbu.png" 
                        alt="Logo Kabupaten Tanah Bumbu" 
                        className="w-24 h-24 object-contain mr-2" 
                        onError={(e) => { e.target.style.display = 'none'; }} 
                    />
                    <div className="text-center p-3">
                        <h3 className="text-lg font-bold uppercase tracking-tight">Pemerintah Kabupaten Tanah Bumbu</h3>
                        <h1 className="text-xl font-extrabold uppercase tracking-tight">Bagian Keprotokolan dan Komunikasi Pimpinan</h1>
                        <p className="text-sm font-semibold">Jl. Dharma Praja No.1, Kelurahan Gunung Tinggi Kecamatan Batulicin Kabupaten Tanah Bumbu Provinsi Kalimatan Selatan-Kode Pos 72214 
                            email : <span className="text-blue-600 underline">hukumtanbu@gmail.com</span> Telepon : -</p>
                    </div>
                </div>

                {/* Judul Dokumen */}
                <div className="text-center mb-6">
                    <h2 className="text-lg font-bold underline uppercase tracking-wide">RUNDOWN ACARA</h2>
                </div>

                {/* Informasi Acara */}
                <div className="border border-black p-4 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                        <div><span className="font-bold">Nama Acara</span> : {rundown.event_name}</div>
                        <div><span className="font-bold">Tanggal</span> : {rundown.date}</div>
                        <div><span className="font-bold">Waktu</span> : {rundown.time_info}</div>
                        <div><span className="font-bold">Tempat</span> : {rundown.location}</div>
                        <div><span className="font-bold">Pelaksana / PJ</span> : {rundown.pic || '-'}</div>
                    </div>
                </div>

                {/* Tabel Susunan Acara */}
                <div className="mb-8">
                    <h3 className="font-bold border-b border-black pb-1 text-gray-800 uppercase text-xs mb-2">Susunan Acara</h3>
                    <table className="w-full border-collapse border border-black text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black p-2 text-left">No.</th>
                                <th className="border border-black p-2 text-left">Waktu</th>
                                <th className="border border-black p-2 text-left">Uraian Kegiatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rundown.items.map((item, idx) => (
                                <tr key={item.id}>
                                    <td className="border border-black p-2 text-center">{idx + 1}</td>
                                    <td className="border border-black p-2">{item.start_time} – {item.end_time}</td>
                                    <td className="border border-black p-2">{item.master_agenda?.name || '-'}</td>
                                </tr>
                            ))}
                            {rundown.items.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="border border-black p-2 text-center text-gray-400 italic">Tidak ada susunan acara</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Tabel Undangan Pejabat */}
                <div className="mb-8">
                    <h3 className="font-bold border-b border-black pb-1 text-gray-800 uppercase text-xs mb-2">Daftar Undangan</h3>
                    <table className="w-full border-collapse border border-black text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black p-2 text-left">No.</th>
                                <th className="border border-black p-2 text-left">Jabatan</th>
                                <th className="border border-black p-2 text-left">Sapaan Resmi</th>
                                <th className="border border-black p-2 text-left">Status Kehadiran</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rundown.invitations.map((inv, idx) => (
                                <tr key={inv.id}>
                                    <td className="border border-black p-2 text-center">{idx + 1}</td>
                                    <td className="border border-black p-2">{inv.honorific?.jabatan || '-'}</td>
                                    <td className="border border-black p-2">{inv.honorific?.sapaan_resmi || '-'}</td>
                                    <td className="border border-black p-2 font-semibold uppercase">
                                        {statusLabel(inv.status)}
                                    </td>
                                </tr>
                            ))}
                            {rundown.invitations.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="border border-black p-2 text-center text-gray-400 italic">Tidak ada undangan</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-[10px] text-gray-400 border-t border-gray-200 pt-2 font-mono">
                    Dokumen dicetak dari Sistem Protokol Kab. Tanah Bumbu pada: {printDate}
                </div>
            </div>

            {/* CSS untuk cetak */}
            <style jsx global>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .max-w-4xl {
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 1.5cm !important;
                    }
                    .border {
                        border-color: #000 !important;
                    }
                    .bg-gray-100 {
                        background: #f1f5f9 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
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
                }
            `}</style>
        </div>
    );
}