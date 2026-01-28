'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';

interface ShipperData {
    legalName: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    status: string;
    commodityType: string;
    monthlyVolume: string;
    preferredEquipment: string[];
    documents?: {
        w9?: string;
        creditApp?: string;
        shippingAgreement?: string;
    };
}

export default function ShipperDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [shipper, setShipper] = useState<ShipperData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<ShipperData>>({});

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (session?.user?.role !== 'shipper') {
            router.push('/login');
        }
    }, [session, status, router]);

    useEffect(() => {
        if (session?.user?.role === 'shipper') {
            fetchProfile();
        }
    }, [session]);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/shipper/profile');
            const data = await response.json();
            setShipper(data.shipper);
            setFormData(data.shipper);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await fetch('/api/shipper/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            setShipper({ ...shipper, ...formData } as ShipperData);
            setEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile');
        }
    };

    const handleDocumentUpload = async (docType: 'w9' | 'creditApp' | 'shippingAgreement', url: string) => {
        try {
            const updatedDocuments = {
                ...shipper?.documents,
                [docType]: url,
            };

            await fetch('/api/shipper/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documents: updatedDocuments }),
            });

            setShipper(prev => prev ? { ...prev, documents: updatedDocuments } : null);
            alert('Document uploaded successfully!');
        } catch (error) {
            console.error('Failed to upload document:', error);
            alert('Failed to upload document');
        }
    };

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!shipper) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl">Shipper profile not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-green-700 text-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Shipper Portal</h1>
                    <div className="flex items-center space-x-4">
                        <span>{session?.user?.email}</span>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Status Badge */}
                <div className="mb-6">
                    <div
                        className={`inline-block px-6 py-3 rounded-full font-bold ${shipper.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : shipper.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                    >
                        Status: {shipper.status.charAt(0).toUpperCase() + shipper.status.slice(1)}
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Company Profile</h2>
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="space-x-3">
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setFormData(shipper);
                                    }}
                                    className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Legal Name</label>
                            {editing ? (
                                <input
                                    type="text"
                                    value={formData.legalName || ''}
                                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            ) : (
                                <div className="text-lg">{shipper.legalName}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Contact Name</label>
                            {editing ? (
                                <input
                                    type="text"
                                    value={formData.contactName || ''}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            ) : (
                                <div className="text-lg">{shipper.contactName}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Email</label>
                            <div className="text-lg">{shipper.contactEmail}</div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Phone</label>
                            {editing ? (
                                <input
                                    type="tel"
                                    value={formData.contactPhone || ''}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            ) : (
                                <div className="text-lg">{shipper.contactPhone}</div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-600 mb-2">Address</label>
                            {editing ? (
                                <input
                                    type="text"
                                    value={formData.address || ''}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            ) : (
                                <div className="text-lg">{shipper.address}, {shipper.city}, {shipper.state} {shipper.zip}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Primary Commodity</label>
                            {editing ? (
                                <input
                                    type="text"
                                    value={formData.commodityType || ''}
                                    onChange={(e) => setFormData({ ...formData, commodityType: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            ) : (
                                <div className="text-lg">{shipper.commodityType}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Monthly Volume</label>
                            <div className="text-lg">{shipper.monthlyVolume}</div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-600 mb-2">Preferred Equipment</label>
                            <div className="flex flex-wrap gap-2">
                                {shipper.preferredEquipment?.map((eq, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        {eq}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
                    <h2 className="text-2xl font-bold mb-6">Required Documents</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileUpload
                            label="W-9 Form"
                            currentFileUrl={shipper.documents?.w9}
                            onUploadSuccess={(url) => handleDocumentUpload('w9', url)}
                        />
                        <FileUpload
                            label="Credit Application"
                            currentFileUrl={shipper.documents?.creditApp}
                            onUploadSuccess={(url) => handleDocumentUpload('creditApp', url)}
                        />
                        <FileUpload
                            label="Signed Shipping Agreement"
                            currentFileUrl={shipper.documents?.shippingAgreement}
                            onUploadSuccess={(url) => handleDocumentUpload('shippingAgreement', url)}
                        />
                    </div>
                </div>

                {shipper.status === 'pending' && (
                    <div className="mt-6 p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                        <h3 className="font-bold text-yellow-800 mb-2">Pending Approval</h3>
                        <p className="text-yellow-700">
                            Your shipper application is under review. Our team will contact you within one business day.
                        </p>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-xl font-bold mb-3">Request a Quote</h3>
                        <p className="text-gray-600 mb-4">Get competitive shipping quotes for your freight.</p>
                        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Get Quote
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-xl font-bold mb-3">Track Shipment</h3>
                        <p className="text-gray-600 mb-4">Monitor your active shipments in real-time.</p>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Track Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
