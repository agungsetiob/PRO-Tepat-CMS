import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    Shield,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20'></div>

                {/* Animated Gradient Orbs */}
                <div className="absolute top-0 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>

                <div className="relative min-h-screen flex items-center justify-center p-6">
                    <div className="w-full max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-0 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                            {/* Left Side - Branding & Info */}
                            <div className="hidden md:flex flex-col justify-between p-8 lg:p-12 bg-gradient-to-br from-teal-600 to-cyan-700 text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="relative z-10 flex flex-col h-full">
                                    {/* Foto diperbesar */}
                                    <div className="flex-1 flex items-center justify-center py-6">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>

                                            <img
                                                src="/bupati-dan-wakil.png"
                                                alt="Bupati dan Wakil Bupati Tanah Bumbu"
                                                className="relative w-full max-w-sm group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>

                                    {/* Quote */}
                                    <div>
                                        <div className="w-12 h-0.5 bg-teal-300 mb-4"></div>
                                        <p className="text-lg font-light italic leading-relaxed">
                                            "Mewujudkan tata kelola keprotokolan
                                            yang profesional, transparan, dan
                                            berintegritas untuk kemajuan Tanah
                                            Bumbu"
                                        </p>
                                        <p className="text-sm text-teal-200 mt-4 font-semibold">
                                            - Pemerintah Kabupaten Tanah Bumbu
                                        </p>
                                    </div>
                                </div>{" "}
                            </div>

                            {/* Right Side - Login Form */}
                            <div className="p-8 lg:p-12 bg-white">
                                {/* Mobile Logo */}
                                <div className="md:hidden text-center mb-8">
                                    <img
                                        src="/beraksi-logo.webp"
                                        alt="Protokol Tanah Bumbu"
                                        className="h-12 w-auto mx-auto mb-3"
                                    />
                                    <h2 className="text-2xl font-bold text-slate-800">
                                        PRO-Tepat
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Selamat datang, silakan login ke akun Anda
                                    </p>
                                </div>

                                <div className="md:hidden text-center mb-6">
                                    <img
                                        src="/bupati-dan-wakil.png"
                                        alt="Bupati dan Wakil"
                                        className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-teal-500 shadow-lg"
                                    />
                                </div>
                                <div className="hidden md:block mb-8 text-center">
                                    <img
                                        src="/beraksi-logo.webp"
                                        alt="Beraksi"
                                        className="h-20 w-auto mb-5 mx-auto"
                                    />

                                    <h2 className="text-2xl font-bold text-slate-800">
                                        PRO-Tepat
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Selamat datang, silakan login untuk mengakses dashboard
                                    </p>
                                </div>

                                {/* Status Message */}
                                {status && (
                                    <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-2">
                                        <CheckCircle
                                            size={18}
                                            className="text-green-600"
                                        />
                                        <p className="text-sm font-medium text-green-700">
                                            {status}
                                        </p>
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-6">
                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail
                                                    size={18}
                                                    className="text-slate-400 group-focus-within:text-teal-500 transition-colors"
                                                />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-slate-50/50"
                                                placeholder="admin@tanahbumbu.go.id"
                                                autoComplete="username"
                                                autoFocus
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                                                <AlertCircle size={12} />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Password
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock
                                                    size={18}
                                                    className="text-slate-400 group-focus-within:text-teal-500 transition-colors"
                                                />
                                            </div>
                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                value={data.password}
                                                className="block w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-slate-50/50"
                                                placeholder="••••••••"
                                                autoComplete="current-password"
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                                                <AlertCircle size={12} />
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={data.remember}
                                                    onChange={(e) =>
                                                        setData(
                                                            "remember",
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                                <div
                                                    className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
                                                    ${data.remember ? "bg-teal-600 border-teal-600" : "border-slate-300 group-hover:border-teal-400"}`}
                                                >
                                                    {data.remember && (
                                                        <CheckCircle
                                                            size={12}
                                                            className="text-white"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                                                Remember me
                                            </span>
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route("password.request")}
                                                className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Logging in...</span>
                                            </>
                                        ) : (
                                            <>
                                                <LogIn
                                                    size={18}
                                                    className="group-hover:translate-x-1 transition-transform"
                                                />
                                                <span>Login to Dashboard</span>
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Security Badge */}
                                <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                                    <div className="flex items-center justify-center gap-2 text-xs text-teal-500">
                                        <Shield
                                            size={14}
                                            className="text-teal-600"
                                        />
                                        <span>
                                            Secure Login • SSL Encrypted
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-3">
                                        © 2026 PRO-Tepat Tanah Bumbu. All rights
                                        reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.3; }
                }
                .animate-pulse {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .delay-1000 {
                    animation-delay: 1s;
                }
                .delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </>
    );
}
