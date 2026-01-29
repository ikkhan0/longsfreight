import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation />


      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-[#003366] via-[#0077be] to-gray-900">
        <div className="absolute inset-0 bg-[url('/images/banner_home.jpg')] bg-cover bg-center opacity-20"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 animate-fade-in">
            Reliable Transport & Logistics Solutions
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Efficient, Safe, and On-Time Delivery Across North America
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-[#0077be] text-white rounded-full font-bold text-lg hover:bg-[#003366] transition-all shadow-xl border-2 border-[#0077be]"
            >
              Get a Quote
            </Link>
            <Link
              href="/portal/carrier"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-[#003366] rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl border-2 border-white"
            >
              Join as Carrier
            </Link>
            <Link
              href="/portal/shipper"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-600 text-white rounded-full font-bold text-lg hover:bg-green-700 transition-all shadow-xl border-2 border-green-600"
            >
              Join as Shipper
            </Link>
          </div>
        </div>
      </section>

      {/* About Highlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#003366] mb-6">Welcome to LFL Logistics</h2>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                LONGS FREIGHT LOAD LOGISTICS LLC is a premier trucking and logistics company dedicated to
                providing top-tier transportation services. Founded by O&apos;DELL LONG JR., we pride ourselves on
                reliability and customer satisfaction.
              </p>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                We handle your freight with the utmost care, ensuring it arrives at its destination safely and on
                schedule. Our modern fleet and experienced drivers are ready to meet your shipping needs.
              </p>
              <Link
                href="/about"
                className="inline-block px-8 py-3 bg-[#003366] text-white rounded-full font-bold hover:bg-[#0077be] transition-all"
              >
                Learn More
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-truck.png"
                alt="LFL Logistics Truck"
                width={600}
                height={400}
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#003366] mb-12">Our Services</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0077be] mb-4">Full Truckload (FTL)</h3>
              <p className="text-gray-600">
                Dedicated truck space for your large shipments, ensuring faster and safer delivery directly to
                the destination.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🚛</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0077be] mb-4">Less Than Truckload (LTL)</h3>
              <p className="text-gray-600">
                Cost-effective solutions for smaller shipments that don&apos;t require a full truck, without
                compromising on speed.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0077be] mb-4">Expedited Shipping</h3>
              <p className="text-gray-600">
                Time-critical delivery services for when your cargo needs to be there yesterday.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-block px-8 py-3 bg-[#0077be] text-white rounded-lg font-bold hover:bg-[#003366] transition-all"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Portal CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#003366] to-[#0077be]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl border border-white/20">
              <div className="w-20 h-20 bg-[#0077be] rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">🚚</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Carrier Portal</h3>
              <p className="text-gray-100 mb-6 text-lg">
                Join our network of professional carriers. Register your fleet and access loads across North America.
              </p>
              <Link
                href="/portal/carrier"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-white text-[#003366] rounded-xl font-bold hover:bg-gray-100 transition-all"
              >
                Register as Carrier →
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl border border-white/20">
              <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Shipper Portal</h3>
              <p className="text-gray-100 mb-6 text-lg">
                Ship with confidence. Get instant quotes, track shipments 24/7, and manage your logistics seamlessly.
              </p>
              <Link
                href="/portal/shipper"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
              >
                Register as Shipper →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-[#0077be] to-[#003366] text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to move your freight?</h2>
          <p className="text-xl mb-8">Contact us today for a competitive quote and superior service.</p>
          <Link href="/contact" className="inline-block px-10 py-4 bg-white text-[#003366] rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl">
            Contact Us Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#003366] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#0077be]">About LFL</h3>
              <p className="text-gray-400">
                Longs Freight Load Logistics LLC delivers excellence in transportation. We are committed to
                serving our clients with integrity and efficiency.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-[#0077be]">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-white">Services</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                <li><Link href="/portal/carrier" className="text-gray-400 hover:text-white">Carrier Portal</Link></li>
                <li><Link href="/portal/shipper" className="text-gray-400 hover:text-white">Shipper Portal</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-[#0077be]">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li>4844 Asherton PL NW</li>
                <li>Concord, NC 28027</li>
                <li>(704) 918-5201</li>
                <li>LFLL@LFLLogistics.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#0077be]/30 pt-8 text-center text-gray-300">
            <p>&copy; 2026 LONGS FREIGHT LOAD LOGISTICS LLC. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
