import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
                <h1 className="text-3xl md:text-5xl font-bold text-center mb-10 md:mb-16 text-gray-900">About LFL Logistics</h1>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                            LONGS FREIGHT LOAD LOGISTICS LLC was founded by O'DELL LONG JR. with a vision to provide
                            exceptional transportation services across North America. Our commitment to reliability and customer
                            satisfaction has made us a trusted partner in the logistics industry.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            We pride ourselves on our modern fleet, experienced team, and dedication to on-time delivery.
                            Every shipment is handled with the utmost care, ensuring your freight arrives safely at its destination.
                        </p>
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-2xl">
                        <Image
                            src="/images/about-warehouse.png"
                            alt="LFL Logistics Warehouse"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="bg-white p-12 rounded-2xl shadow-lg mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose LFL Logistics?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                <span className="text-3xl">✓</span>
                            </div>
                            <h3 className="font-bold text-xl mb-2">Reliable Service</h3>
                            <p className="text-gray-600">On-time delivery you can count on.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                <span className="text-3xl">🌟</span>
                            </div>
                            <h3 className="font-bold text-xl mb-2">Professional Team</h3>
                            <p className="text-gray-600">Experienced drivers and logistics experts.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                <span className="text-3xl">🚀</span>
                            </div>
                            <h3 className="font-bold text-xl mb-2">Modern Fleet</h3>
                            <p className="text-gray-600">Well-maintained equipment for safe transport.</p>
                        </div>
                    </div>
                </div>

                <div className="text-center bg-blue-900 text-white p-12 rounded-2xl">
                    <h2 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h2>
                    <p className="text-xl mb-8">Join our network of satisfied customers and carriers.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact" className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold hover:bg-gray-100">
                            Contact Us
                        </Link>
                        <Link href="/portal/carrier" className="px-8 py-4 bg-blue-700 text-white rounded-full font-bold hover:bg-blue-800 border border-white">
                            Become a Carrier
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
