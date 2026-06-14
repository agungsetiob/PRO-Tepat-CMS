import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    FolderTree,
    Crown,
    Film,
    CheckCircle,
    Clock,
    ArrowRight,
    Star,
    Activity,
    PieChart,
    BarChart3,
    FileText,
    Package,
    ClipboardList,
    Tag,
} from "lucide-react";

// Chart components menggunakan recharts
import {
    LineChart,
    Line,
    PieChart as RePieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function Dashboard({
    stats,
    recentScenarios,
    monthlyData,
}) {
    const { auth } = usePage().props;
    // Data untuk grafik aktivitas bulanan
    const activityData = monthlyData || [
        { month: "Jan", scenarios: 4, protocols: 2 },
        { month: "Feb", scenarios: 3, protocols: 3 },
        { month: "Mar", scenarios: 5, protocols: 4 },
        { month: "Apr", scenarios: 2, protocols: 1 },
        { month: "Mei", scenarios: 6, protocols: 3 },
        { month: "Jun", scenarios: 4, protocols: 5 },
    ];

    // Warna-warna untuk pie chart
    const COLORS = [
        "#0d9488",
        "#8b5cf6",
        "#f59e0b",
        "#ef4444",
        "#3b82f6",
        "#10b981",
    ];

    // Data untuk distribusi kategori
    const pieData = [
        {
            name: "Tata Tempat",
            value: stats?.categoriesByType?.tempat || 0,
            fill: "#0d9488",
        },
        {
            name: "Tata Acara",
            value: stats?.categoriesByType?.acara || 0,
            fill: "#8b5cf6",
        },
        {
            name: "Tata Hormat",
            value: stats?.categoriesByType?.hormat || 0,
            fill: "#f59e0b",
        },
    ];

    // Statistik cards dengan icon dan gradient
    const statCards = [
        {
            title: "Total Kategori",
            value: stats?.categories || 0,
            icon: FolderTree,
            gradient: "from-teal-500 to-teal-600",
            iconBg: "bg-teal-100",
            iconColor: "text-teal-600",
            description: "Jenis menu protokol",
            link: route("admin.categories.index"),
        },
        {
            title: "Master Jabatan",
            value: stats?.honorifics || 0,
            icon: Crown,
            gradient: "from-purple-500 to-purple-600",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            description: "Urutan protokoler",
            link: route("admin.honorifics.index"),
        },
        {
            title: "Skenario Konten",
            value: stats?.scenarios || 0,
            icon: Film,
            gradient: "from-amber-500 to-amber-600",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            description: "Panduan acara",
            link: route("admin.scenarios.index"),
        },
        {
            title: "Skenario Aktif",
            value: stats?.activeScenarios || 0,
            icon: CheckCircle,
            gradient: "from-emerald-500 to-emerald-600",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            description: "Tampil di mobile",
            link: route("admin.scenarios.index"),
        },
    ];

    // Statistik tambahan (tanpa trend/change)
    const additionalStats = [
        {
            label: "Total Protocols",
            value: stats?.protocols || 0,
            icon: FileText,
        },
        {
            label: "Total Equipment",
            value: stats?.equipment || 0,
            icon: Package,
        },
        {
            label: "Checklist Items",
            value: stats?.checklistItems || 0,
            icon: ClipboardList,
        },
        {
            label: "Unique Tags",
            value: stats?.tags || 0,
            icon: Tag,
        },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                    <p className="text-xs font-semibold text-slate-600 mb-1">
                        {label}
                    </p>
                    {payload.map((entry, index) => (
                        <p
                            key={index}
                            className="text-sm"
                            style={{ color: entry.color }}
                        >
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Custom render label untuk pie chart
    const renderCustomizedLabel = ({
        name,
        percent,
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        index,
    }) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius * 1.1;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent < 0.05) return null;

        return (
            <text
                x={x}
                y={y}
                fill={COLORS[index % COLORS.length]}
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                className="text-xs font-medium"
            >
                {`${name} (${(percent * 100).toFixed(0)}%)`}
            </text>
        );
    };

    return (
        <AdminLayout header="Dashboard">
            <Head title="Dashboard" />

            {/* Welcome Section */}
            <div className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <Activity size={24} className="text-teal-400" />
                        <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">
                            Dashboard Overview
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        Selamat Datang, {auth.user.name}
                    </h1>
                    <p className="text-slate-300 text-sm">
                        Kelola seluruh konten keprotokolan Kabupaten Tanah Bumbu
                        dari dashboard ini.
                    </p>
                </div>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={index}
                            href={card.link}
                            className="group relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div
                                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full blur-2xl`}
                            ></div>
                            <div className="p-6 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`p-3 ${card.iconBg} rounded-xl`}
                                    >
                                        <Icon
                                            size={24}
                                            className={card.iconColor}
                                        />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-slate-800">
                                            {card.value}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {card.description}
                                        </p>
                                    </div>
                                </div>
                                <h3 className="text-sm font-semibold text-slate-600 mb-1">
                                    {card.title}
                                </h3>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs text-teal-600 group-hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1">
                                        Lihat Detail <ArrowRight size={12} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {additionalStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Icon size={18} className="text-slate-400" />
                            </div>
                            <p className="text-2xl font-bold text-slate-800">
                                {stat.value}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {stat.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Line Chart - Aktivitas Bulanan */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <BarChart3
                                    size={20}
                                    className="text-teal-600"
                                />
                                Aktivitas Konten
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Tren pembuatan skenario & protokol per bulan
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                                <span className="text-slate-600">Skenario</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="text-slate-600">Protokol</span>
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={activityData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                            />
                            <XAxis
                                dataKey="month"
                                stroke="#94a3b8"
                                fontSize={12}
                            />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="scenarios"
                                stroke="#0d9488"
                                strokeWidth={2}
                                dot={{ fill: "#0d9488", strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Skenario"
                            />
                            <Line
                                type="monotone"
                                dataKey="protocols"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Protokol"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart - Distribusi Kategori */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <PieChart size={20} className="text-teal-600" />
                                Distribusi Kategori
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Persentase berdasarkan jenis protokol
                            </p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <RePieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {pieData.map((entry, index) => (
                                    <React.Fragment key={`slice-${index}`}>
                                        {/* Menggunakan pendekatan tanpa Cell */}
                                    </React.Fragment>
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </RePieChart>
                    </ResponsiveContainer>

                    {/* Legend manual dengan warna yang benar */}
                    <div className="flex justify-center gap-6 mt-6">
                        {pieData.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor:
                                            COLORS[index % COLORS.length],
                                    }}
                                ></div>
                                <span className="text-xs text-slate-600">
                                    {item.name}
                                </span>
                                <span className="text-xs font-semibold text-slate-800">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Scenarios & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Scenarios List */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                    <Clock
                                        size={20}
                                        className="text-teal-600"
                                    />
                                    Skenario Terbaru
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Konten yang baru ditambahkan atau diperbarui
                                </p>
                            </div>
                            <Link
                                href={route("admin.scenarios.index")}
                                className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
                            >
                                Lihat Semua <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {recentScenarios && recentScenarios.length > 0 ? (
                            recentScenarios.map((scenario, index) => (
                                <div
                                    key={scenario.id}
                                    className="px-6 py-4 hover:bg-slate-50 transition-all duration-200 group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg
                        ${
                            scenario.category?.type === "tempat"
                                ? "bg-teal-100"
                                : scenario.category?.type === "acara"
                                  ? "bg-purple-100"
                                  : "bg-amber-100"
                        }`}
                                            >
                                                {scenario.category?.type ===
                                                "tempat"
                                                    ? "📍"
                                                    : scenario.category
                                                            ?.type === "acara"
                                                      ? "🎉"
                                                      : "🙏"}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded-full font-medium
                            ${scenario.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                                    >
                                                        {scenario.is_active
                                                            ? "Aktif"
                                                            : "Nonaktif"}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        Order #{scenario.order}
                                                    </span>
                                                </div>
                                                <p className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors">
                                                    {scenario.title}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {scenario.category?.name} •{" "}
                                                    {scenario.layout_type ||
                                                        "Layout Umum"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={route(
                                                    "admin.scenarios.materi",
                                                    scenario.id,
                                                )}
                                                className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                                title="Kelola Materi"
                                            >
                                                <FileText size={16} />
                                            </Link>
                                            <div className="w-px h-8 bg-slate-200"></div>
                                            <span className="text-xs text-slate-400">
                                                {new Date(
                                                    scenario.created_at,
                                                ).toLocaleDateString("id-ID")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <Film
                                    size={48}
                                    className="mx-auto text-slate-300 mb-3"
                                />
                                <p className="text-slate-500">
                                    Belum ada skenario
                                </p>
                                <Link
                                    href={route("admin.scenarios.index")}
                                    className="mt-3 inline-block text-teal-600 hover:text-teal-700 text-sm font-medium"
                                >
                                    + Buat skenario pertama
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions & System Info */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4">
                            <Star size={20} className="text-teal-600" />
                            Aksi Cepat
                        </h3>
                        <div className="space-y-2">
                            <Link
                                href={route("admin.categories.index")}
                                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-teal-50 rounded-xl transition-all duration-200 group"
                            >
                                <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700">
                                    Kelola Kategori
                                </span>
                                <ArrowRight
                                    size={16}
                                    className="text-slate-400 group-hover:text-teal-600"
                                />
                            </Link>
                            <Link
                                href={route("admin.honorifics.index")}
                                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-teal-50 rounded-xl transition-all duration-200 group"
                            >
                                <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700">
                                    Kelola Master Jabatan
                                </span>
                                <ArrowRight
                                    size={16}
                                    className="text-slate-400 group-hover:text-teal-600"
                                />
                            </Link>
                            <Link
                                href={route("admin.scenarios.index")}
                                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-teal-50 rounded-xl transition-all duration-200 group"
                            >
                                <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700">
                                    Kelola Skenario
                                </span>
                                <ArrowRight
                                    size={16}
                                    className="text-slate-400 group-hover:text-teal-600"
                                />
                            </Link>
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl shadow-md p-6 text-white">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <Activity size={20} />
                            Informasi Sistem
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-teal-100">
                                    Total Data
                                </span>
                                <span className="font-semibold">
                                    {(stats?.categories || 0) +
                                        (stats?.honorifics || 0) +
                                        (stats?.scenarios || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-teal-100">
                                    Aktifitas Terakhir
                                </span>
                                <span className="font-semibold">
                                    {new Date().toLocaleDateString("id-ID")}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-teal-100">
                                    Status Server
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="font-semibold">
                                        Online
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/20 text-xs text-teal-100">
                            PROTAP Tanah Bumbu v1.0
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
