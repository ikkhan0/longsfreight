'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/images/logo.png"
                            alt="LFL Logistics Logo"
                            width={180}
                            height={60}
                            className="h-10 w-auto sm:h-14"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav gap-8 items-center">
                        <Link href="/" className="text-[#003366] font-semibold text-sm uppercase hover:text-[#0077be] transition-colors">Home</Link>
                        <Link href="/services" className="text-[#003366] font-semibold text-sm uppercase hover:text-[#0077be] transition-colors">Services</Link>
                        <Link href="/about" className="text-[#003366] font-semibold text-sm uppercase hover:text-[#0077be] transition-colors">About Us</Link>
                        <Link href="/portal/carrier" className="text-[#003366] font-semibold text-sm uppercase hover:text-[#0077be] transition-colors" target="_blank" rel="noopener noreferrer">Carrier Portal</Link>
                        <Link href="/contact" className="text-[#003366] font-semibold text-sm uppercase hover:text-[#0077be] transition-colors">Contact</Link>
                    </nav>

                    {/* Desktop CTA Buttons */}
                    <div className="desktop-nav items-center space-x-4">
                        <Link href="/portal/carrier" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-[#0077be] border-2 border-[#0077be] rounded-full font-bold hover:bg-[#0077be] hover:text-white transition">
                            Carrier Portal
                        </Link>
                        <Link href="/portal/shipper" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition">
                            Shipper Portal
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="mobile-menu-btn flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-[#003366] hover:text-[#0077be] focus:outline-none"
                        >
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-bold text-[#003366] hover:bg-gray-50 rounded-lg">Home</Link>
                        <Link href="/services" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-bold text-[#003366] hover:bg-gray-50 rounded-lg">Services</Link>
                        <Link href="/about" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-bold text-[#003366] hover:bg-gray-50 rounded-lg">About Us</Link>
                        <Link href="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-bold text-[#003366] hover:bg-gray-50 rounded-lg">Contact</Link>
                        <div className="border-t my-2 pt-2 space-y-3">
                            <Link href="/portal/carrier" onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 text-[#0077be] border-2 border-[#0077be] rounded-lg font-bold hover:bg-[#0077be] hover:text-white transition">
                                Carrier Portal
                            </Link>
                            <Link href="/portal/shipper" onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition">
                                Shipper Portal
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
