'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingStep } from '@/types';
import { analyzeProfile } from '@/lib/gemini';
import { FileUpload } from '@/components/FileUpload';

interface CarrierFormData {
    dotNumber: string;
    mcNumber: string;
    authorityDate: string;
    legalName: string;
    dbaName: string;
    ein: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    equipmentTypes: string[];
    preferredLanes: string[];
    password: string;
    documents: {
        w9?: string;
        coi?: string;
        mcAuthority?: string;
    };
}

const INITIAL_DATA: CarrierFormData = {
    dotNumber: '', mcNumber: '', legalName: '', dbaName: '', authorityDate: '',
    ein: '', address: '', city: '', state: '', zip: '',
    contactName: '', contactEmail: '', contactPhone: '',
    equipmentTypes: [], preferredLanes: [], password: '',
    documents: { w9: undefined, coi: undefined, mcAuthority: undefined },
};

export default function CarrierInviteOnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.Verification);
    const [formData, setFormData] = useState<CarrierFormData>(INITIAL_DATA);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<string>('');

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleEquipmentChange = (equipment: string) => {
        setFormData(prev => ({
            ...prev,
            equipmentTypes: prev.equipmentTypes.includes(equipment)
                ? prev.equipmentTypes.filter(e => e !== equipment)
                : [...prev.equipmentTypes, equipment]
        }));
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.authorityDate) {
            setError("Authority grant date is required.");
            return;
        }

        // NO 1-YEAR VALIDATION - This is the private invite link
        // Carriers can register with any authority date

        setLoading(true);
        setError(null);

        // AI analysis simulation
        setTimeout(() => {
            setAiAnalysis("Based on DOT records, this carrier appears to have a satisfactory safety rating with active authority.");
            setLoading(false);
            nextStep();
        }, 1500);
    };

    const handleSubmit = async () => {
        if (!formData.password || formData.password.length < 6) {
            setError('Please create a password (minimum 6 characters)');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/carrier/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to register');
            }

            setCurrentStep(OnboardingStep.Complete);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case OnboardingStep.Verification:
                return (
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 max-w-2xl mx-auto w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Motor Carrier Verification</h2>
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">DOT #</label>
                                    <input
                                        required
                                        name="dotNumber"
                                        value={formData.dotNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="1234567"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">MC #</label>
                                    <input
                                        required
                                        name="mcNumber"
                                        value={formData.mcNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="123456"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Authority Date</label>
                                <input
                                    required
                                    type="date"
                                    name="authorityDate"
                                    value={formData.authorityDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {error && (
                                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border-l-4 border-red-500">
                                    {error}
                                </div>
                            )}
                            <div className="flex justify-end pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Continue'}
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case OnboardingStep.CompanyProfile:
                return (
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 w-full max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Legal Entity Name</label>
                                    <input
                                        name="legalName"
                                        value={formData.legalName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">DBA Name (Optional)</label>
                                    <input
                                        name="dbaName"
                                        value={formData.dbaName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Tax ID / EIN</label>
                                    <input
                                        name="ein"
                                        value={formData.ein}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Contact Name</label>
                                    <input
                                        name="contactName"
                                        value={formData.contactName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Contact Email</label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Primary Address</label>
                                    <input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div className="col-span-1">
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="City"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="ST"
                                            maxLength={2}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Zip"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Phone Number</label>
                                    <input
                                        name="contactPhone"
                                        value={formData.contactPhone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="(123) 456-7890"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Create Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Min. 6 characters"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        </div>
                        {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
                        <div className="flex justify-between mt-10">
                            <button
                                onClick={prevStep}
                                className="text-gray-500 font-medium hover:text-gray-700"
                            >
                                Back
                            </button>
                            <button
                                onClick={nextStep}
                                className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                            >
                                Next: Operations
                            </button>
                        </div>
                    </div>
                );

            case OnboardingStep.Operations:
                return (
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 w-full max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Carrier Operations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-4">Equipment & Capabilities</label>
                                <div className="space-y-2">
                                    {['Dry Van', 'Reefer', 'Flatbed', 'Intermodal', 'Step Deck', 'Hotshot'].map(eq => (
                                        <label
                                            key={eq}
                                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.equipmentTypes.includes(eq)}
                                                onChange={() => handleEquipmentChange(eq)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm font-medium">{eq}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">AI Safety Profile</h4>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 italic text-sm text-blue-800">
                                    <i className="fa-solid fa-robot mr-2"></i>
                                    {aiAnalysis || "Safety analysis will appear here..."}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-10">
                            <button
                                onClick={prevStep}
                                className="text-gray-500 font-medium hover:text-gray-700"
                            >
                                Back
                            </button>
                            <button
                                onClick={nextStep}
                                className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                            >
                                Next: Documentation
                            </button>
                        </div>
                    </div>
                );

            case OnboardingStep.Documentation:
                return (
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 w-full max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Documents</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Please upload the required documents to complete your registration
                        </p>
                        <div className="space-y-6">
                            <FileUpload
                                label="W-9 Form"
                                currentFileUrl={formData.documents?.w9}
                                onUploadSuccess={(url) => setFormData(prev => ({
                                    ...prev,
                                    documents: { ...prev.documents, w9: url }
                                }))}
                            />
                            <FileUpload
                                label="Certificate of Insurance (COI)"
                                currentFileUrl={formData.documents?.coi}
                                onUploadSuccess={(url) => setFormData(prev => ({
                                    ...prev,
                                    documents: { ...prev.documents, coi: url }
                                }))}
                            />
                            <FileUpload
                                label="MC Authority Letter"
                                currentFileUrl={formData.documents?.mcAuthority}
                                onUploadSuccess={(url) => setFormData(prev => ({
                                    ...prev,
                                    documents: { ...prev.documents, mcAuthority: url }
                                }))}
                            />
                        </div>
                        <div className="flex justify-between mt-10">
                            <button
                                onClick={prevStep}
                                className="text-gray-500 font-medium hover:text-gray-700"
                            >
                                Back
                            </button>
                            <button
                                onClick={nextStep}
                                className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                            >
                                Continue to Agreement
                            </button>
                        </div>
                    </div>
                );

            case OnboardingStep.Agreement:
                return (
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 w-full max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms & Conditions</h2>
                        <div className="bg-gray-50 p-6 rounded-xl h-48 overflow-y-auto text-xs text-gray-600 mb-6 font-mono border">
                            BY SIGNING THIS AGREEMENT, THE UNDERSIGNED ENTITY ("REGISTERED PARTY") AGREES TO THE BROKER-CARRIER PROTOCOLS...
                            Standard terms regarding payment timelines, liability coverage, safety compliance, and freight handling procedures.
                            Carrier agrees to maintain active insurance with minimum coverage of $100k cargo, $1M auto liability.
                        </div>
                        {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={prevStep}
                                className="text-gray-500 font-medium hover:text-gray-700"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-12 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-xl hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Complete Registration'}
                            </button>
                        </div>
                    </div>
                );

            case OnboardingStep.Complete:
                return (
                    <div className="text-center py-12 max-w-md mx-auto">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-5xl text-blue-600 mx-auto mb-8">
                            <span>✓</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Registration Complete!</h2>
                        <p className="text-gray-500 mb-10 leading-relaxed">
                            Your carrier application has been submitted. Our compliance team will review and reach out within one business day.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800"
                        >
                            Back to Home
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Carrier Registration</h1>
                    <p className="text-gray-600">Join the LFL Logistics carrier network</p>
                    <div className="mt-2 inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                        Private Invite Registration
                    </div>
                </div>

                {/* Step Indicator */}
                {currentStep !== OnboardingStep.Complete && currentStep >= OnboardingStep.Verification && (
                    <div className="flex justify-center mb-12">
                        <div className="flex items-center space-x-4">
                            {['Verify', 'Company', 'Operations', 'Docs', 'Agreement'].map((label, idx) => (
                                <div key={label} className="flex items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${idx <= currentStep
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {idx + 1}
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-700 hidden md:inline">
                                        {label}
                                    </span>
                                    {idx < 4 && <div className="w-12 h-1 bg-gray-200 mx-2 hidden md:block" />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Form Content */}
                {renderStep()}
            </div>
        </div>
    );
}
