import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
  Save, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Clock, 
  Package, 
  Flag,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Truck,
  Award
} from 'lucide-react';

export default function MateriAcara({ scenario, checklists, equipments }) {
    const [expandedSections, setExpandedSections] = useState({
        persiapan: true,
        pendahuluan: true,
        pokok: true,
        penutup: true,
        tambahan: true
    });

    const initialChecklists = checklists?.map(c => ({ section: c.section, item: c.item })) 
        || [{ section: 'Acara Pokok', item: '' }];

    const initialEquipments = equipments?.map(e => ({ name: e.name, category: e.category })) 
        || [{ name: '', category: 'perlengkapan' }];

    const { data, setData, post, processing } = useForm({
        checklists: initialChecklists,
        equipments: initialEquipments,
    });

    // Group checklists by section
    const getChecklistsBySection = () => {
        const grouped = {
            'Acara Persiapan': [],
            'Acara Pendahuluan': [],
            'Acara Pokok': [],
            'Acara Penutup': [],
            'Acara Tambahan': []
        };
        data.checklists.forEach((item, index) => {
            if (grouped[item.section]) {
                grouped[item.section].push({ ...item, index });
            }
        });
        return grouped;
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section.toLowerCase().replace('acara ', '')]: !prev[section.toLowerCase().replace('acara ', '')]
        }));
    };

    // Manajemen baris Rundown / Checklist
    const addChecklistRow = (section = 'Acara Pokok') => {
        setData('checklists', [...data.checklists, { section, item: '' }]);
    };
    
    const removeChecklistRow = (index) => {
        setData('checklists', data.checklists.filter((_, i) => i !== index));
    };
    
    const handleChecklistChange = (index, field, value) => {
        const updated = [...data.checklists];
        updated[index][field] = value;
        setData('checklists', updated);
    };

    // Manajemen baris Logistik / Equipment
    const addEquipmentRow = () => {
        setData('equipments', [...data.equipments, { name: '', category: 'perlengkapan' }]);
    };
    
    const removeEquipmentRow = (index) => {
        setData('equipments', data.equipments.filter((_, i) => i !== index));
    };
    
    const handleEquipmentChange = (index, field, value) => {
        const updated = [...data.equipments];
        updated[index][field] = value;
        setData('equipments', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.scenarios.materi.acara', scenario.id));
    };

    const getSectionIcon = (section) => {
        const icons = {
            'Acara Persiapan': <Clock size={18} />,
            'Acara Pendahuluan': <Award size={18} />,
            'Acara Pokok': <Flag size={18} />,
            'Acara Penutup': <CheckCircle size={18} />,
            'Acara Tambahan': <Plus size={18} />,
        };
        return icons[section] || <Calendar size={18} />;
    };

    const getSectionColor = (section) => {
        const colors = {
            'Acara Persiapan': 'from-blue-500 to-blue-600',
            'Acara Pendahuluan': 'from-orange-500 to-orange-600',
            'Acara Pokok': 'from-teal-500 to-teal-600',
            'Acara Penutup': 'from-emerald-500 to-emerald-600',
            'Acara Tambahan': 'from-purple-500 to-purple-600'
        };
        return colors[section] || 'from-slate-500 to-slate-600';
    };

    const groupedChecklists = getChecklistsBySection();
    const totalItems = data.checklists.length;
    const totalEquipments = data.equipments.length;

    return (
        <AdminLayout header={`✍️ Edit Materi: ${scenario.title}`}>
            <Head title="Kelola Susunan Acara" />

            {/* Header Info Card */}
            <div className="mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-sm">
                                {scenario.category?.name}
                            </span>
                            <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-sm">
                                Order #{scenario.order}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{scenario.title}</h2>
                        <p className="text-teal-100 text-sm">{scenario.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                            <div className="text-2xl font-bold">{totalItems}</div>
                            <div className="text-xs text-teal-100">Tahapan Acara</div>
                        </div>
                        <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                            <div className="text-2xl font-bold">{totalEquipments}</div>
                            <div className="text-xs text-teal-100">Item Logistik</div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                    {/* Kolom Kiri & Tengah: Susunan Acara / Rundown (Checklist) */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Quick Add Buttons */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold uppercase text-slate-800 flex items-center gap-2">
                                    <Clock size={16} className="text-teal-600" />
                                    Tambah Cepat Tahapan Acara
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['Acara Persiapan', 'Acara Pendahuluan', 'Acara Pokok', 'Acara Penutup', 'Acara Tambahan'].map((section) => (
                                    <button
                                        key={section}
                                        type="button"
                                        onClick={() => addChecklistRow(section)}
                                        className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-all duration-200"
                                    >
                                        <Plus size={14} />
                                        {section}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Checklist Sections */}
                        {Object.entries(groupedChecklists).map(([section, items]) => {
                            const sectionKey = section.toLowerCase().replace('acara ', '');
                            if (items.length === 0 && !expandedSections[sectionKey]) return null;
                            
                            return (
                                <div key={section} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
                                    <div 
                                        className={`px-5 py-3 bg-gradient-to-r ${getSectionColor(section)} text-white cursor-pointer flex justify-between items-center`}
                                        onClick={() => toggleSection(section)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {getSectionIcon(section)}
                                            <h3 className="font-semibold text-sm">{section}</h3>
                                            <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
                                                {items.length}
                                            </span>
                                        </div>
                                        <button type="button" className="hover:bg-white/10 rounded p-1 transition-colors">
                                            {expandedSections[sectionKey] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                    </div>
                                    
                                    {expandedSections[sectionKey] && (
                                        <div className="p-4 space-y-2">
                                            {items.length === 0 ? (
                                                <div className="text-center py-8 text-slate-400">
                                                    <p className="text-sm">Belum ada tahapan acara</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => addChecklistRow(section)}
                                                        className="mt-2 text-teal-600 hover:text-teal-700 text-xs font-medium flex items-center gap-1 justify-center"
                                                    >
                                                        <Plus size={12} />
                                                        Tambah {section}
                                                    </button>
                                                </div>
                                            ) : (
                                                items.map((row) => (
                                                    <div key={row.index} className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 group hover:shadow-md transition-all duration-200">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center text-sm font-bold text-teal-700">
                                                            {row.index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <input 
                                                                type="text" 
                                                                value={row.item} 
                                                                onChange={e => handleChecklistChange(row.index, 'item', e.target.value)}
                                                                placeholder="Contoh: Penghormatan kepada Lambang Negara, Menyanyikan Lagu Indonesia Raya..." 
                                                                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeChecklistRow(row.index)} 
                                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {data.checklists.length === 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                                <Clock size={48} className="mx-auto text-slate-300 mb-3" />
                                <p className="text-slate-500 font-medium">Belum ada tahapan acara</p>
                                <p className="text-xs text-slate-400 mt-1">Klik tombol di atas untuk menambah tahapan</p>
                            </div>
                        )}
                    </div>

                    {/* Kolom Kanan: Logistik Peralatan (Equipment) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 sticky top-6">
                            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-sm font-bold uppercase text-slate-800 flex items-center gap-2">
                                            <Package size={16} className="text-teal-600" />
                                            Logistik & Alat
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1">Atribut wajib dan pendukung acara</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={addEquipmentRow} 
                                        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm"
                                    >
                                        <Plus size={14} />
                                        Tambah
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                                {data.equipments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package size={48} className="mx-auto text-slate-300 mb-3" />
                                        <p className="text-slate-500 text-sm">Belum ada peralatan</p>
                                        <button
                                            type="button"
                                            onClick={addEquipmentRow}
                                            className="mt-3 text-teal-600 hover:text-teal-700 text-xs font-medium"
                                        >
                                            + Tambah peralatan
                                        </button>
                                    </div>
                                ) : (
                                    data.equipments.map((row, index) => (
                                        <div key={index} className="relative p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 group">
                                            <button 
                                                type="button" 
                                                onClick={() => removeEquipmentRow(index)} 
                                                className="absolute top-2 right-2 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1">
                                                        <Award size={12} />
                                                        Nama Alat / Objek
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        value={row.name} 
                                                        onChange={e => handleEquipmentChange(index, 'name', e.target.value)} 
                                                        placeholder="Misal: Podium Gubernur, Microphone Shure" 
                                                        className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1">
                                                        <Truck size={12} />
                                                        Kategori Keprotokolan
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <label className={`cursor-pointer p-2 rounded-lg border-2 transition-all duration-200 text-center ${
                                                            row.category === 'perlengkapan'
                                                                ? 'border-teal-500 bg-teal-50'
                                                                : 'border-slate-200 hover:border-teal-300'
                                                        }`}>
                                                            <input
                                                                type="radio"
                                                                value="perlengkapan"
                                                                checked={row.category === 'perlengkapan'}
                                                                onChange={(e) => handleEquipmentChange(index, 'category', e.target.value)}
                                                                className="hidden"
                                                            />
                                                            <Package size={14} className="mx-auto mb-1" />
                                                            <span className="text-[10px] font-medium">Pendukung</span>
                                                        </label>
                                                        <label className={`cursor-pointer p-2 rounded-lg border-2 transition-all duration-200 text-center ${
                                                            row.category === 'kelengkapan'
                                                                ? 'border-teal-500 bg-teal-50'
                                                                : 'border-slate-200 hover:border-teal-300'
                                                        }`}>
                                                            <input
                                                                type="radio"
                                                                value="kelengkapan"
                                                                checked={row.category === 'kelengkapan'}
                                                                onChange={(e) => handleEquipmentChange(index, 'category', e.target.value)}
                                                                className="hidden"
                                                            />
                                                            <Flag size={14} className="mx-auto mb-1" />
                                                            <span className="text-[10px] font-medium">Wajib</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Summary Footer */}
                            <div className="p-4 border-t border-slate-200 bg-slate-50">
                                <div className="flex justify-between text-xs text-slate-600 mb-3">
                                    <span>Total Item Logistik:</span>
                                    <span className="font-bold text-teal-600">{data.equipments.length}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Link 
                                        href={route('admin.scenarios.index')} 
                                        className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
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
                </div>
            </form>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertCircle size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-blue-800 mb-1">Informasi Penting:</p>
                        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                            <li>Susunan acara akan ditampilkan secara berurutan sesuai nomor urut yang ditentukan</li>
                            <li>Logistik kategori "Wajib" akan ditampilkan lebih prioritas di aplikasi mobile</li>
                            <li>Pastikan semua tahapan acara terisi dengan lengkap untuk panduan petugas protokol</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}