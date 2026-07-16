import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    FolderTree,
    Crown,
    Film,
    Menu,
    X,
    LogOut,
    User,
    ChevronRight,
    ClipboardCheck,
    ClockCheck,
    FileText,
} from "lucide-react";

export default function AdminLayout({ children, header }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        {
            name: "Dashboard",
            href: route("admin.dashboard"),
            icon: LayoutDashboard,
            active: route().current("admin.dashboard"),
        },
        {
            name: "Skenario Konten",
            href: route("admin.scenarios.index"),
            icon: Film,
            active: route().current("admin.scenarios.*"),
        },
        {
            name: "Rundown Analytics",
            href: route("admin.rundown-analytics.index"),
            icon: ClockCheck,
            active: route().current("admin.rundown-analytics.*"),
        },
        {
            name: "Master Kategori",
            href: route("admin.categories.index"),
            icon: FolderTree,
            active: route().current("admin.categories.*"),
        },
        {
            name: "Master Jabatan",
            href: route("admin.honorifics.index"),
            icon: Crown,
            active: route().current("admin.honorifics.*"),
        },
        {
            name: "Master Agenda",
            href: route("admin.master-agenda.index"),
            icon: ClipboardCheck,
            active: route().current("admin.master-agenda.*"),
        },
        {
            name: "Manual Book",
            href: route("admin.manual-book.index"),
            icon: FileText,
            active: route().current("admin.manual-book.*"),
        },
    ];

    // Toggle sidebar untuk mobile
    const toggleSidebar = () => {
        if (window.innerWidth < 768) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
        } else {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
            {/* Sidebar Desktop */}
            <aside
                className={`fixed left-0 top-0 z-30 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-all duration-300 ease-in-out flex flex-col
                    ${isSidebarOpen ? "w-72" : "w-20"} 
                    hidden md:flex`}
            >
                {/* Logo Area */}
                <div className={`p-5 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 ${isSidebarOpen ? "px-6" : "px-4"}`}>
                    {isSidebarOpen ? (
                        <div className="flex items-center justify-center">
                            <img
                                src="/beraksi-logo.webp"
                                alt="Protokol Tanbu"
                                className="h-12 w-auto object-contain"
                            />
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <img
                                src="/beraksi-logo.webp"
                                alt="Logo"
                                className="h-10 w-10 rounded-lg object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden
                                    ${item.active
                                        ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/30"
                                        : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                    }`}
                            >
                                <Icon size={isSidebarOpen ? 20 : 24} className="flex-shrink-0" />
                                {isSidebarOpen && (
                                    <span className="flex-1">{item.name}</span>
                                )}
                                {item.active && isSidebarOpen && (
                                    <ChevronRight size={16} className="opacity-70" />
                                )}
                                {!isSidebarOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen && "justify-center"}`}>
                        <Link
                            href={route("admin.profile.edit")}
                            className="flex items-center gap-3"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
                                    <User size={20} className="text-white" />
                                </div>
                            </div>
                            {isSidebarOpen && (
                                <span className="text-sm font-medium text-white truncate">
                                    {auth.user.name}
                                </span>
                            )}
                        </Link>
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 ml-auto"
                        >
                            <LogOut size={18} />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <aside className="fixed left-0 top-0 z-50 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl md:hidden flex flex-col animate-slide-in">
                        <div className="p-5 border-b border-slate-700/50 flex justify-between items-center">
                            <img
                                src="/beraksi-logo.webp"
                                alt="Protokol Tanbu"
                                className="h-10 object-contain"
                            />
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                            ${item.active
                                                ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                                                : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route("admin.profile.edit")}
                                    className="flex items-center gap-3 flex-1"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                                        <User size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{auth.user.name}</p>
                                    </div>
                                </Link>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="p-2 rounded-lg bg-red-500/10 text-red-400"
                                >
                                    <LogOut size={18} />
                                </Link>
                            </div>
                        </div>
                    </aside>
                </>
            )}

            {/* Main Content */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? "md:ml-72" : "md:ml-20"}`}>
                {/* Top Navbar */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200">
                    <div className="h-16 flex items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <Menu size={22} />
                            </button>
                            {header && (
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-1 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-slate-800">
                                        {header}
                                    </h2>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Desktop - Icon PROTAP */}
                            <div className="hidden sm:flex items-center gap-2">
                                <img
                                    src="/icon-protap.png"
                                    alt="PROTAP"
                                    className="h-8 w-auto"
                                />
                            </div>

                            {/* Mobile - Icon PROTAP */}
                            <div className="sm:hidden px-2 py-1 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-full">
                                <img
                                    src="/icon-protap.png"
                                    alt="PROTAP"
                                    className="h-6 w-auto"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <div className="animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}