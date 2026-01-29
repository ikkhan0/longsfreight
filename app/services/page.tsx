import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
                <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 text-gray-900">Our Services</h1>
                <p className="text-center text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
                    LFL Logistics provides comprehensive transportation solutions tailored to your needs.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-10 rounded-xl shadow-lg">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <span className="text-4xl">📦</span>
                        </div>
                        <h3 className="text-2xl font-bold text-center mb-4">Full Truckload (FTL)</h3>
                        <p className="text-gray-600 text-center">
                            Dedicated truck space for your large shipments ensuring faster and safer delivery directly to the destination.
                            Perfect for high-volume shipments that require exclusive use of a trailer.
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-xl shadow-lg">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <span className="text-4xl">🚛</span>
                        </div>
                        <h3 className="text-2xl font-bold text-center mb-4">Less Than Truckload (LTL)</h3>
                        <p className="text-gray-600 text-center">
                            Cost-effective solutions for smaller shipments that don't require a full truck. Consolidated shipping
                            without compromising on speed or service quality.
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-xl shadow-lg">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <span className="text-4xl">⚡</span>
                        </div>
                        <h3 className="text-2xl font-bold text-center mb-4">Expedited Shipping</h3>
                        <p className="text-gray-600 text-center">
                            Time-critical delivery services for urgent shipments. When your cargo needs to be there fast,
                            we prioritize speed without sacrificing safety.
                        </p>
                    </div>
                </div>

                <div className="bg-blue-900 text-white p-12 rounded-2xl text-center">
                    <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
                    <p className="text-xl mb-8">Contact us to discuss your specific freight requirements.</p>
                    <Link href="/contact" className="inline-block px-8 py-4 bg-white text-blue-900 rounded-full font-bold hover:bg-gray-100">
                        Get in Touch
                    </Link>
                </div>
            </div>
        </div>
    );
}
