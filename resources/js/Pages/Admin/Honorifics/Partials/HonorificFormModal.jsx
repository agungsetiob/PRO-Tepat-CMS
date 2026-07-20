import React from "react";
import Modal from "@/Components/Modal";
import {
    X,
    Edit,
    Plus,
    CheckCircle,
    AlertCircle,
    Users,
    Mic,
    FileText,
} from "lucide-react";

export default function HonorificFormModal({
    show,
    onClose,
    editMode,
    data,
    setData,
    errors,
    processing,
    handleSubmit,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl" closeable={!processing}>
            <div className="bg-white rounded-lg overflow-hidden">
                {/* Header */}
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
                                {editMode ? "Ubah Data Jabatan" : "Tambah Jabatan Baru"}
                            </h3>
                            <p className="text-slate-400 text-xs mt-0.5">
                                {editMode ? "Edit informasi jabatan" : "Isi form untuk menambah jabatan"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                            Nama Jabatan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.jabatan}
                            onChange={(e) => setData("jabatan", e.target.value)}
                            placeholder="Contoh: Bupati Tanah Bumbu, Ketua DPRD"
                            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                            autoFocus
                            disabled={processing}
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
                                onChange={(e) => setData("sapaan_resmi", e.target.value)}
                                placeholder="Yang Terhormat"
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                disabled={processing}
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
                                onChange={(e) => setData("sapaan_lisan", e.target.value)}
                                placeholder="Bapak Bupati"
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                disabled={processing}
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
                            onChange={(e) => setData("tingkat", e.target.value)}
                            placeholder="Bupati=1, Wabup=2, dsb."
                            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                            min="1"
                            disabled={processing}
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
                            onChange={(e) => setData("perlakuan_khusus", e.target.value)}
                            placeholder="Misal: Penyediaan ruang transit utama, pengawalan Patwal Dishub saat acara formal daerah."
                            rows="3"
                            className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                            disabled={processing}
                        />
                    </div>

                    {/* Preview Section */}
                    <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                        <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Preview</p>
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center text-2xl font-bold text-teal-700">
                                {data.tingkat || "?"}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-800">{data.jabatan || "Nama Jabatan"}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    <span className="font-medium">Sapaan:</span> {data.sapaan_resmi || "Belum diisi"}
                                    {data.sapaan_lisan && ` (${data.sapaan_lisan})`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
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
        </Modal>
    );
}