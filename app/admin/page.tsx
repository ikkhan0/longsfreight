'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface Stats {
    totalCarriers: number;
    pendingCarriers: number;
    approvedCarriers: number;
    totalShippers: number;
    pendingShippers: number;
    approvedShippers: number;
    unreadNotifications: number;
}

interface Carrier {
    _id: string;
    legalName: string;
    contactEmail: string;
    contactPhone: string;
    dotNumber: string;
    mcNumber: string;
    city: string;
    state: string;
    status: string;
    createdAt: string;
    documents?: {
        w9?: string;
        coi?: string;
        mcAuthority?: string;
    };
}

interface Shipper {
    _id: string;
    legalName: string;
    contactEmail: string;
    contactPhone: string;
    city: string;
    state: string;
    status: string;
    createdAt: string;
    documents?: {
        w9?: string;
        creditApp?: string;
        shippingAgreement?: string;
    };
}

interface DocumentModalData {
    type: 'carrier' | 'shipper';
    companyName: string;
    documents: Carrier['documents'] | Shipper['documents'];
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [carriers, setCarriers] = useState<Carrier[]>([]);
    const [shippers, setShippers] = useState<Shipper[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'carriers' | 'shippers'>('carriers');
    const [documentModal, setDocumentModal] = useState<DocumentModalData | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (session?.user?.role !== 'admin') {
            router.push('/login');
        }
    }, [session, status, router]);

    useEffect(() => {
        if (session?.user?.role === 'admin') {
            fetchData();
        }
    }, [session]);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/admin/data');
            const data = await response.json();
            setStats(data.stats);
            setCarriers(data.carriers);
            setShippers(data.shippers);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: string, type: 'carrier' | 'shipper') => {
        try {
            await fetch(`/api/admin/${type}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            fetchData();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const getDocumentCount = (documents: Carrier['documents'] | Shipper['documents'] | undefined) => {
        if (!documents) return { uploaded: 0, total: 0 };
        const values = Object.values(documents);
        const uploaded = values.filter(doc => doc).length;
        const total = values.length;
        return { uploaded, total };
    };

    const openDocumentModal = (type: 'carrier' | 'shipper', companyName: string, documents: Carrier['documents'] | Shipper['documents']) => {
        setDocumentModal({ type, companyName, documents });
    };

    const DocumentModal = () => {
        if (!documentModal) return null;

        const { type, companyName, documents } = documentModal;

        const documentList = type === 'carrier' ? [
            { key: 'w9', label: 'W-9 Form', url: (documents as Carrier['documents'])?.w9 },
            { key: 'coi', label: 'Certificate of Insurance', url: (documents as Carrier['documents'])?.coi },
            { key: 'mcAuthority', label: 'MC Authority', url: (documents as Carrier['documents'])?.mcAuthority },
        ] : [
            { key: 'w9', label: 'W-9 Form', url: (documents as Shipper['documents'])?.w9 },
            { key: 'creditApp', label: 'Credit Application', url: (documents as Shipper['documents'])?.creditApp },
            { key: 'shippingAgreement', label: 'Shipping Agreement', url: (documents as Shipper['documents'])?.shippingAgreement },
        ];

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setDocumentModal(null)}>
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b sticky top-0 bg-white">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">{companyName}</h2>
                            <button onClick={() => setDocumentModal(null)} className="text-gray-500 hover:text-gray-700 text-2xl">
                                ×
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            {type === 'carrier' ? 'Carrier' : 'Shipper'} Documents
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            {documentList.map(({ key, label, url }) => (
                                <div key={key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        {url ? (
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-gray-900">{label}</div>
                                            <div className="text-xs text-gray-500">
                                                {url ? 'Uploaded' : 'Not uploaded'}
                                            </div>
                                        </div>
                                    </div>
                                    {url && (
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-sm"
                                        >
                                            View/Download
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleDelete = async (id: string, type: 'carrier' | 'shipper') => {
        if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

        try {
            await fetch(`/api/admin/${type}/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">{session?.user?.email}</span>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="text-sm text-gray-600 mb-1">Total Carriers</div>
                        <div className="text-3xl font-bold text-blue-600">{stats?.totalCarriers || 0}</div>
                        <div className="text-xs text-gray-500 mt-2">
                            {stats?.pendingCarriers || 0} pending
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="text-sm text-gray-600 mb-1">Approved Carriers</div>
                        <div className="text-3xl font-bold text-green-600">{stats?.approvedCarriers || 0}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="text-sm text-gray-600 mb-1">Total Shippers</div>
                        <div className="text-3xl font-bold text-orange-600">{stats?.totalShippers || 0}</div>
                        <div className="text-xs text-gray-500 mt-2">
                            {stats?.pendingShippers || 0} pending
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="text-sm text-gray-600 mb-1">Approved Shippers</div>
                        <div className="text-3xl font-bold text-green-600">{stats?.approvedShippers || 0}</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow">
                    <div className="border-b">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('carriers')}
                                className={`px-6 py-4 font-bold ${activeTab === 'carriers'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500'
                                    }`}
                            >
                                Carriers ({carriers.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('shippers')}
                                className={`px-6 py-4 font-bold ${activeTab === 'shippers'
                                    ? 'border-b-2 border-green-600 text-green-600'
                                    : 'text-gray-500'
                                    }`}
                            >
                                Shippers ({shippers.length})
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {activeTab === 'carriers' && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b">
                                            <th className="pb-4 font-bold">Company</th>
                                            <th className="pb-4 font-bold">DOT/MC</th>
                                            <th className="pb-4 font-bold">Contact</th>
                                            <th className="pb-4 font-bold">Location</th>
                                            <th className="pb-4 font-bold">Status</th>
                                            <th className="pb-4 font-bold">Registered</th>
                                            <th className="pb-4 font-bold">Documents</th>
                                            <th className="pb-4 font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {carriers.map((carrier) => (
                                            <tr key={carrier._id} className="border-b">
                                                <td className="py-4">
                                                    <div className="font-bold">{carrier.legalName}</div>
                                                </td>
                                                <td className="py-4 text-sm">
                                                    DOT: {carrier.dotNumber}<br />
                                                    MC: {carrier.mcNumber}
                                                </td>
                                                <td className="py-4 text-sm">
                                                    {carrier.contactEmail}<br />
                                                    {carrier.contactPhone}
                                                </td>
                                                <td className="py-4 text-sm">
                                                    {carrier.city}, {carrier.state}
                                                </td>
                                                <td className="py-4">
                                                    <select
                                                        value={carrier.status}
                                                        onChange={(e) => handleStatusChange(carrier._id, e.target.value, 'carrier')}
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${carrier.status === 'approved'
                                                            ? 'bg-green-100 text-green-800'
                                                            : carrier.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="suspended">Suspended</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 text-sm text-gray-600">
                                                    {format(new Date(carrier.createdAt), 'MMM d, yyyy')}
                                                </td>
                                                <td className="py-4">
                                                    {(() => {
                                                        const { uploaded, total } = getDocumentCount(carrier.documents);
                                                        return (
                                                            <button
                                                                onClick={() => openDocumentModal('carrier', carrier.legalName, carrier.documents)}
                                                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-bold transition-colors"
                                                            >
                                                                View ({uploaded}/{total})
                                                            </button>
                                                        );
                                                    })()}
                                                </td>
                                                <td className="py-4">
                                                    <button
                                                        onClick={() => handleDelete(carrier._id, 'carrier')}
                                                        className="text-red-600 hover:text-red-800 font-bold"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {carriers.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">No carriers registered yet.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'shippers' && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b">
                                            <th className="pb-4 font-bold">Company</th>
                                            <th className="pb-4 font-bold">Contact</th>
                                            <th className="pb-4 font-bold">Location</th>
                                            <th className="pb-4 font-bold">Status</th>
                                            <th className="pb-4 font-bold">Registered</th>
                                            <th className="pb-4 font-bold">Documents</th>
                                            <th className="pb-4 font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shippers.map((shipper) => (
                                            <tr key={shipper._id} className="border-b">
                                                <td className="py-4">
                                                    <div className="font-bold">{shipper.legalName}</div>
                                                </td>
                                                <td className="py-4 text-sm">
                                                    {shipper.contactEmail}<br />
                                                    {shipper.contactPhone}
                                                </td>
                                                <td className="py-4 text-sm">
                                                    {shipper.city}, {shipper.state}
                                                </td>
                                                <td className="py-4">
                                                    <select
                                                        value={shipper.status}
                                                        onChange={(e) => handleStatusChange(shipper._id, e.target.value, 'shipper')}
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${shipper.status === 'approved'
                                                            ? 'bg-green-100 text-green-800'
                                                            : shipper.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="suspended">Suspended</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 text-sm text-gray-600">
                                                    {format(new Date(shipper.createdAt), 'MMM d, yyyy')}
                                                </td>
                                                <td className="py-4">
                                                    {(() => {
                                                        const { uploaded, total } = getDocumentCount(shipper.documents);
                                                        return (
                                                            <button
                                                                onClick={() => openDocumentModal('shipper', shipper.legalName, shipper.documents)}
                                                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-bold transition-colors"
                                                            >
                                                                View ({uploaded}/{total})
                                                            </button>
                                                        );
                                                    })()}
                                                </td>
                                                <td className="py-4">
                                                    <button
                                                        onClick={() => handleDelete(shipper._id, 'shipper')}
                                                        className="text-red-600 hover:text-red-800 font-bold"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {shippers.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">No shippers registered yet.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Document Modal */}
            <DocumentModal />
        </div>
    );
}
