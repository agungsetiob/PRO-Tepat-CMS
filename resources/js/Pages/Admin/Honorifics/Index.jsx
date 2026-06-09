import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle, 
  AlertCircle,
  Crown,
  Users,
  Award,
  Star,
  Hash,
  Mic,
  FileText,
  AlertTriangle,
  Shield
} from 'lucide-react';

export default function Index({ honorifics }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedHonorific, setSelectedHonorific] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        id: '',
        jabatan: '',
        sapaan_resmi: '',
        sapaan_lisan: '',
        perlakuan_khusus: '',
        tingkat: '',
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
            sapaan_lisan: item.sapaan_lisan || '',
            perlakuan_khusus: item.perlakuan_khusus || '',
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
            put(route('admin.honorifics.update', data.id), {
                onSuccess: () => { setIsModalOpen(false); reset(); }
            });
        } else {
            post(route('admin.honorifics.store'), {
                onSuccess: () => { setIsModalOpen(false); reset(); }
            });
        }
    };

    const handleDelete = () => {
        if (selectedHonorific) {
            destroy(route('admin.honorifics.destroy', selectedHonorific.id), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedHonorific(null);
                }
            });
        }
    };

    const getTingkatBadge = (tingkat) => {
        const colors = [
            'from-amber-500 to-amber-600',
            'from-blue-500 to-blue-600',
            'from-emerald-500 to-emerald-600',
            'from-purple-500 to-purple-600',
            'from-pink-500 to-pink-600',
            'from-indigo-500 to-indigo-600'
        ];
        const colorIndex = Math.min(parseInt(tingkat) - 1, colors.length - 1);
        const colorClass = colors[colorIndex] || colors[0];
        
        return (
            <div className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br ${colorClass} text-white font-bold rounded-xl shadow-md`}>
                {tingkat}
            </div>
        );
    };

    // Urutkan berdasarkan tingkat
    const sortedHonorifics = [...honorifics].sort((a, b) => a.tingkat - b.tingkat);

    return (
        <AdminLayout header="Manajemen Master Jabatan & Sapaan">
            <Head title="Master Jabatan" />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium mb-1">Total Jabatan</p>
                            <p className="text-3xl font-bold">{honorifics.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Crown size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-purple-100 text-xs">
                        Jabatan yang terdaftar dalam sistem
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 text-sm font-medium mb-1">Tertinggi</p>
                            <p className="text-2xl font-bold truncate">
                                {sortedHonorifics[0]?.jabatan.split(' ').slice(0, 2).join(' ') || '-'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Star size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-emerald-100 text-xs">
                        Tingkat {sortedHonorifics[0]?.tingkat || 0} - Prioritas tertinggi
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Rata-rata Sapaan</p>
                            <p className="text-3xl font-bold">
                                {Math.round(honorifics.reduce((acc, h) => acc + (h.sapaan_lisan ? 1 : 0), 0) / honorifics.length * 100)}%
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Mic size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 text-blue-100 text-xs">
                        Kelengkapan sapaan lisan
                    </div>
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
                                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Aksi
                                    </div>
                                </th>
                             </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedHonorifics.length === 0 ? (
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
                                sortedHonorifics.map((item, index) => (
                                    <tr key={item.id} className="group hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-200">
                                        <td className="py-4 px-6 text-center">
                                            {getTingkatBadge(item.tingkat)}
                                        </td>
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
            </div>

            {/* Modal Form Create/Edit */}
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
                                        {editMode ? 'Ubah Data Jabatan' : 'Tambah Jabatan Baru'}
                                    </h3>
                                    <p className="text-slate-400 text-xs mt-0.5">
                                        {editMode ? 'Edit informasi jabatan' : 'Isi form untuk menambah jabatan'}
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
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                    Nama Jabatan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.jabatan}
                                    onChange={e => setData('jabatan', e.target.value)}
                                    placeholder="Contoh: Bupati Tanah Bumbu, Ketua DPRD"
                                    className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                    autoFocus
                                />
                                {errors.jabatan && (
                                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        {errors.jabatan}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                        Sapaan Resmi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.sapaan_resmi}
                                        onChange={e => setData('sapaan_resmi', e.target.value)}
                                        placeholder="Yang Terhormat"
                                        className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                    />
                                    {errors.sapaan_resmi && (
                                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.sapaan_resmi}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                        Sapaan Lisan
                                    </label>
                                    <input
                                        type="text"
                                        value={data.sapaan_lisan}
                                        onChange={e => setData('sapaan_lisan', e.target.value)}
                                        placeholder="Bapak Bupati"
                                        className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                    Angka Tingkat Urutan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.tingkat}
                                    onChange={e => setData('tingkat', e.target.value)}
                                    placeholder="Bupati=1, Wabup=2, dsb."
                                    className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                    min="1"
                                />
                                <div className="flex items-start gap-2 mt-2">
                                    <span className="text-xs text-slate-400">💡</span>
                                    <span className="text-[11px] text-slate-500">
                                        Makin kecil angkanya, posisi keprotokolan makin tinggi/didahulukan
                                    </span>
                                </div>
                                {errors.tingkat && (
                                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        {errors.tingkat}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                    Standar Perlakuan Khusus
                                </label>
                                <textarea
                                    value={data.perlakuan_khusus}
                                    onChange={e => setData('perlakuan_khusus', e.target.value)}
                                    placeholder="Misal: Penyediaan ruang transit utama, pengawalan Patwal Dishub saat acara formal daerah."
                                    rows="3"
                                    className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                                />
                            </div>

                            {/* Preview Section */}
                            <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                                <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Preview</p>
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center text-2xl">
                                        {data.tingkat || '?'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800">{data.jabatan || 'Nama Jabatan'}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            <span className="font-medium">Sapaan:</span> {data.sapaan_resmi || 'Belum diisi'}
                                            {data.sapaan_lisan && ` (${data.sapaan_lisan})`}
                                        </p>
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
                                            Simpan Data
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {isDeleteModalOpen && selectedHonorific && (
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
                                    Apakah Anda yakin ingin menghapus jabatan ini?
                                </p>
                                <p className="text-slate-500 text-sm">
                                    Data yang dihapus tidak dapat dikembalikan lagi.
                                </p>
                            </div>

                            {/* Detail Jabatan yang akan dihapus */}
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm
                                        ${selectedHonorific.tingkat <= 2 ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 
                                          selectedHonorific.tingkat <= 3 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 
                                          'bg-gradient-to-br from-slate-500 to-slate-600'}`}>
                                        {selectedHonorific.tingkat}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800">{selectedHonorific.jabatan}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Sapaan: {selectedHonorific.sapaan_resmi}
                                            {selectedHonorific.sapaan_lisan && ` (${selectedHonorific.sapaan_lisan})`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Warning Message */}
                            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700">
                                        Menghapus jabatan akan mempengaruhi pengaturan kursi dan prioritas protokol yang terkait dengan jabatan ini.
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
                                            Ya, Hapus Jabatan
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