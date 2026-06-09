import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
  Save, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Users, 
  BookOpen,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
// Hapus LinkExtension karena sudah termasuk dalam StarterKit
import Placeholder from '@tiptap/extension-placeholder';

// Toolbar component untuk Rich Text Editor
const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="border-b border-slate-200 p-2 flex flex-wrap gap-1 bg-slate-50 rounded-t-lg">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded text-xs font-medium transition-all ${
          editor.isActive('bold') ? 'bg-teal-100 text-teal-700' : 'hover:bg-slate-200'
        }`}
      >
        <span className="font-bold">B</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded text-xs font-medium transition-all ${
          editor.isActive('italic') ? 'bg-teal-100 text-teal-700' : 'hover:bg-slate-200'
        }`}
      >
        <span className="italic">I</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded text-xs font-medium transition-all ${
          editor.isActive('strike') ? 'bg-teal-100 text-teal-700' : 'hover:bg-slate-200'
        }`}
      >
        <span className="line-through">S</span>
      </button>
      <div className="w-px h-6 bg-slate-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded text-xs font-medium transition-all ${
          editor.isActive('heading', { level: 1 }) ? 'bg-teal-100 text-teal-700' : 'hover:bg-slate-200'
        }`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded text-xs font-medium transition-all ${
          editor.isActive('heading', { level: 2 }) ? 'bg-teal-100 text-teal-700' : 'hover:bg-slate-200'
        }`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1.5 rounded text-xs font-medium transition-all ${
          editor.isActive('heading', { level: 3 }) ? 'bg-teal-100 text-teal-700' : 'hover:bg-slate-200'
        }`}
      >
        H3
      </button>
      <div className="w-px h-6 bg-slate-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded text-xs font-medium transition-all ${
          editor.isActive('bulletList') ? 'bg-teal-100 text-teal-700' : 'hover:bg-slate-200'
        }`}
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded text-xs font-medium transition-all ${
          editor.isActive('orderedList') ? 'bg-teal-100 text-teal-700' : 'hover:bg-slate-200'
        }`}
      >
        1. List
      </button>
      <div className="w-px h-6 bg-slate-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-1.5 rounded text-xs font-medium hover:bg-slate-200 transition-all"
        title="Undo"
      >
        ↩️
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-1.5 rounded text-xs font-medium hover:bg-slate-200 transition-all"
        title="Redo"
      >
        ↪️
      </button>
    </div>
  );
};

export default function MateriTempat({ scenario, protocol, honorifics }) {
    const [activeTab, setActiveTab] = useState('content');
    const [imagePreview, setImagePreview] = useState(protocol?.image_infographic || null);
    const [expandedSections, setExpandedSections] = useState({
      seating: true,
      references: true
    });

    // Pastikan initialRules selalu array
    const initialRules = protocol?.seating_rules && Array.isArray(protocol.seating_rules) 
        ? protocol.seating_rules.map(r => ({
            position_label: r.position_label || '',
            honorific_id: r.honorific_id || '',
            note: r.note || ''
          }))
        : [{ position_label: '1', honorific_id: '', note: 'Posisi Utama' }];

    // Pastikan references selalu array, handle null/undefined
    const initialReferences = protocol?.references && Array.isArray(protocol.references) 
        ? protocol.references 
        : [''];

    const { data, setData, post, processing, errors } = useForm({
        title: protocol?.title || `Pedoman Aturan ${scenario.title}`,
        content: protocol?.content || '',
        image_infographic: null,
        references: initialReferences,
        seating_rules: initialRules,
    });

    // Setup Rich Text Editor - Hapus LinkExtension karena duplikasi
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                }
            }),
            Image,
            Placeholder.configure({
                placeholder: 'Tuliskan petunjuk teknis posisi duduk atau urutan kendaraan di sini secara mendetail...',
            })
        ],
        content: data.content || '',
        onUpdate: ({ editor }) => {
            setData('content', editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const addSeatingRow = () => {
        setData('seating_rules', [...data.seating_rules, { position_label: '', honorific_id: '', note: '' }]);
    };

    const removeSeatingRow = (index) => {
        const updated = data.seating_rules.filter((_, i) => i !== index);
        setData('seating_rules', updated);
    };

    const handleRowChange = (index, field, value) => {
        const updated = [...data.seating_rules];
        updated[index][field] = value;
        setData('seating_rules', updated);
    };

    const addReference = () => setData('references', [...data.references, '']);
    const removeReference = (index) => {
        const updated = data.references.filter((_, i) => i !== index);
        setData('references', updated);
    };
    const handleRefChange = (index, value) => {
        const updated = [...data.references];
        updated[index] = value;
        setData('references', updated);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image_infographic', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.scenarios.materi.tempat', scenario.id));
    };

    // Pastikan data.seating_rules dan data.references adalah array sebelum dihitung
    const totalSeats = Array.isArray(data.seating_rules) ? data.seating_rules.length : 0;
    const totalReferences = Array.isArray(data.references) ? data.references.filter(r => r && r.trim() !== '').length : 0;

    return (
        <AdminLayout header={`📍 Tata Tempat: ${scenario.title}`}>
            <Head title="Kelola Materi Tata Tempat" />

            {/* Header Info Card */}
            <div className="mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-sm">
                                {scenario.category?.name || 'Kategori'}
                            </span>
                            <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-sm">
                                Tata Tempat
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{scenario.title}</h2>
                        <p className="text-teal-100 text-sm">{scenario.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                            <div className="text-2xl font-bold">{totalSeats}</div>
                            <div className="text-xs text-teal-100">Posisi Kursi</div>
                        </div>
                        <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                            <div className="text-2xl font-bold">{totalReferences}</div>
                            <div className="text-xs text-teal-100">Dasar Hukum</div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Kolom Kiri & Tengah: Dokumen Panduan & Denah */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tab Navigation */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="flex border-b border-slate-200 bg-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('content')}
                                    className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
                                        activeTab === 'content'
                                            ? 'bg-white text-teal-600 border-b-2 border-teal-600 -mb-px'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <FileText size={16} className="inline mr-2" />
                                    Dokumen Panduan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('infographic')}
                                    className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
                                        activeTab === 'infographic'
                                            ? 'bg-white text-teal-600 border-b-2 border-teal-600 -mb-px'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <ImageIcon size={16} className="inline mr-2" />
                                    Denah & Infografis
                                </button>
                            </div>

                            <div className="p-6">
                                {/* Tab Content: Dokumen Panduan */}
                                {activeTab === 'content' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                                Judul Aturan Protokol <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                value={data.title || ''} 
                                                onChange={e => setData('title', e.target.value)} 
                                                className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Contoh: Pedoman Tata Tempat Acara Kenegaraan"
                                            />
                                            {errors.title && (
                                                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                                    <AlertCircle size={12} />
                                                    {errors.title}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                                Isi Teks Panduan <span className="text-red-500">*</span>
                                            </label>
                                            <div className="border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 transition-all duration-200">
                                                <EditorToolbar editor={editor} />
                                                <EditorContent editor={editor} />
                                            </div>
                                            {errors.content && (
                                                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                                    <AlertCircle size={12} />
                                                    {errors.content}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Tab Content: Denah & Infografis */}
                                {activeTab === 'infographic' && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                                            Upload Gambar Denah / Infografis
                                        </label>
                                        <div className="mt-2">
                                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-teal-400 transition-colors cursor-pointer">
                                                <input
                                                    type="file"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                    id="image-upload"
                                                    accept="image/*"
                                                />
                                                <label htmlFor="image-upload" className="cursor-pointer block">
                                                    <ImageIcon size={48} className="mx-auto text-slate-400 mb-3" />
                                                    <p className="text-sm text-slate-600 mb-1">
                                                        Klik atau drag file ke sini
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        Format: JPG, PNG, WEBP (Max 2MB)
                                                    </p>
                                                </label>
                                            </div>
                                            
                                            {imagePreview && (
                                                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                            Preview Denah Aktif
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImagePreview(null);
                                                                setData('image_infographic', null);
                                                            }}
                                                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="Denah" 
                                                        className="max-h-64 rounded-lg border border-slate-200 object-contain mx-auto"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {errors.image_infographic && (
                                            <p className="text-red-500 text-xs mt-2">{errors.image_infographic}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bagian Referensi Hukum */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div 
                                className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 cursor-pointer flex justify-between items-center"
                                onClick={() => toggleSection('references')}
                            >
                                <h3 className="text-sm font-bold uppercase text-slate-800 flex items-center gap-2">
                                    <BookOpen size={16} className="text-teal-600" />
                                    Referensi Regulasi / Dasar Hukum
                                    <span className="text-xs text-slate-500 font-normal ml-2">
                                        ({totalReferences} pasal)
                                    </span>
                                </h3>
                                <button type="button" className="text-slate-400">
                                    {expandedSections.references ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                            </div>
                            
                            {expandedSections.references && (
                                <div className="p-6">
                                    <div className="flex justify-end mb-4">
                                        <button 
                                            type="button" 
                                            onClick={addReference} 
                                            className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            <Plus size={14} />
                                            Tambah Pasal
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {Array.isArray(data.references) && data.references.map((ref, idx) => (
                                            <div key={idx} className="flex gap-2 group">
                                                <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                                                    {idx + 1}
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={ref || ''} 
                                                    onChange={e => handleRefChange(idx, e.target.value)} 
                                                    placeholder="Contoh: Pasal 10 UU No. 9 Tahun 2010 tentang Keprotokolan" 
                                                    className="flex-1 text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeReference(idx)}
                                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kolom Kanan: Pemetaan Baris Urutan Kursi (Seating Rules) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 sticky top-6">
                            <div 
                                className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 cursor-pointer flex justify-between items-center"
                                onClick={() => toggleSection('seating')}
                            >
                                <div>
                                    <h3 className="text-sm font-bold uppercase text-slate-800 flex items-center gap-2">
                                        <Users size={16} className="text-teal-600" />
                                        Pemetaan Kursi / Urutan
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Atur prioritas posisi duduk</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">
                                        {totalSeats} kursi
                                    </span>
                                    <button type="button" className="text-slate-400">
                                        {expandedSections.seating ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                </div>
                            </div>
                            
                            {expandedSections.seating && (
                                <>
                                    <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
                                        {!Array.isArray(data.seating_rules) || data.seating_rules.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Users size={48} className="mx-auto text-slate-300 mb-3" />
                                                <p className="text-slate-500 text-sm">Belum ada pemetaan kursi</p>
                                                <button
                                                    type="button"
                                                    onClick={addSeatingRow}
                                                    className="mt-3 text-teal-600 hover:text-teal-700 text-xs font-medium"
                                                >
                                                    + Tambah posisi kursi
                                                </button>
                                            </div>
                                        ) : (
                                            data.seating_rules.map((row, index) => (
                                                <div key={index} className="relative p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 group">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeSeatingRow(index)} 
                                                        className="absolute top-2 right-2 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-6 h-6 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center text-xs font-bold text-teal-700">
                                                            {index + 1}
                                                        </div>
                                                        <span className="text-xs text-slate-400">Posisi Kursi</span>
                                                    </div>
                                                    
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1">
                                                                <Award size={12} />
                                                                Label Posisi
                                                            </label>
                                                            <input 
                                                                type="text" 
                                                                value={row.position_label || ''} 
                                                                onChange={e => handleRowChange(index, 'position_label', e.target.value)} 
                                                                placeholder="Misal: 1, Kanan, Kiri" 
                                                                className="w-full text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                                            />
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                                                                Pejabat / Jabatan
                                                            </label>
                                                            <select 
                                                                value={row.honorific_id || ''} 
                                                                onChange={e => handleRowChange(index, 'honorific_id', e.target.value)} 
                                                                className="w-full text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white"
                                                            >
                                                                <option value="">-- Pilih Jabatan --</option>
                                                                {honorifics && honorifics.map(h => (
                                                                    <option key={h.id} value={h.id}>
                                                                        [Tingkat {h.tingkat}] {h.jabatan}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                                                                Catatan Khusus
                                                            </label>
                                                            <input 
                                                                type="text" 
                                                                value={row.note || ''} 
                                                                onChange={e => handleRowChange(index, 'note', e.target.value)} 
                                                                placeholder="Contoh: Jika rombongan ganjil / acara kenegaraan" 
                                                                className="w-full text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="p-4 border-t border-slate-200 bg-slate-50">
                                        <button
                                            type="button"
                                            onClick={addSeatingRow}
                                            className="w-full py-2 text-sm font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Tambah Posisi Kursi
                                        </button>
                                    </div>
                                </>
                            )}

                            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
                                <Link 
                                    href={route('admin.scenarios.index')} 
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-slate-200"
                                >
                                    <ArrowLeft size={16} />
                                    Kembali
                                </Link>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Simpan Materi
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertCircle size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-blue-800 mb-1">Panduan Pengisian:</p>
                        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                            <li>Gunakan Rich Text Editor untuk memformat teks panduan (bold, italic, list, dll)</li>
                            <li>Upload denah/infografis untuk memudahkan pemahaman tata letak kursi</li>
                            <li>Urutan posisi kursi menentukan prioritas dalam acara keprotokolan</li>
                            <li>Referensi hukum akan ditampilkan sebagai sumber yang sah</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}