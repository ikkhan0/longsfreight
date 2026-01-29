import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
                <h1 className="text-3xl md:text-5xl font-bold text-center mb-10 md:mb-12 text-gray-900">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl">📍</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Address</h3>
                                    <p className="text-gray-600">4844 Asherton PL NW<br />Concord, NC 28027</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl">📞</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                                    <p className="text-gray-600">(704) 918-5201</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl">✉️</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Email</h3>
                                    <p className="text-gray-600">LFLL@LFLLogistics.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-2xl font-bold mb-4">Business Hours</h3>
                            <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM<br />Saturday: 9:00 AM - 2:00 PM<br />Sunday: Closed</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Name *</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Email *</label>
                                <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Phone</label>
                                <input type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Message *</label>
                                <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32" required></textarea>
                            </div>
                            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
