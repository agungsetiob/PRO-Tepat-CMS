import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Style WYSIWYG bawaan Quill
import { ShieldCheck, CheckCircle, Save } from "lucide-react";

export default function Index({ policy }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        description: policy?.description || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.privacy-policy.update"));
    };

    // Konfigurasi Toolbar WYSIWYG Editor Sederhana & Lengkap
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "clean"],
        ],
    };

    return (
        <AdminLayout header="Pengaturan Aplikasi: Kebijakan Privasi">
            <Head title="Kebijakan Privasi Aplikasi" />

            {/* Flash Info Notifikasi */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-sm flex items-center gap-2">
                    <CheckCircle size={20} />
                    <p className="text-sm font-medium">{flash.success}</p>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-8xl">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                            <ShieldCheck className="text-purple-600" size={24} />
                            Kebijakan Privasi Aplikasi (Privacy Policy)
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola dokumen pernyataan perlindungan data pengguna untuk keperluan Play Store & App Store.
                        </p>
                    </div>
                    {policy?.updated_at && (
                        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                            Terakhir diubah: {new Date(policy.updated_at).toLocaleDateString("id-ID")}
                        </span>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-3 tracking-wider">
                            Isi Dokumen Privacy Policy
                        </label>
                        
                        {/* Editor WYSIWYG */}
                        <div className="bg-white rounded-xl overflow-hidden border border-slate-300">
                            <ReactQuill
                                theme="snow"
                                value={data.description}
                                onChange={(value) => setData("description", value)}
                                modules={modules}
                                className="h-80 mb-12"
                            />
                        </div>
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-2">{errors.description}</p>
                        )}
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                        <p className="text-xs text-slate-400 italic">
                            *Format teks HTML akan otomatis disesuaikan saat ditampilkan di mobile app.
                        </p>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-md flex items-center gap-2 transition-all"
                        >
                            <Save size={18} />
                            {processing ? "Simpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}