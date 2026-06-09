import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats, recentScenarios }) {
    return (
        <AdminLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Statistik Cards */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-500">Categories</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.categories}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-500">Honorifics</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.honorifics}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-500">Scenarios</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.scenarios}</p>
                </div>
            </div>

            {/* Recent Scenarios */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Recent Scenarios</h3>
                <ul className="divide-y divide-gray-200">
                    {recentScenarios.map((scenario) => (
                        <li key={scenario.id} className="py-3 flex justify-between">
                            <span className="font-medium text-gray-800">{scenario.title}</span>
                            <span className="text-sm text-gray-500">{scenario.category.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </AdminLayout>
    );
}
