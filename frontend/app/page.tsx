import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-70px)] flex items-center justify-center bg-[#3d4663]">
        {/* Background Image - You'll need to add your resort image to /public/images/ */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#3d4663] opacity-60" />

        {/* Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            NEXUS
          </h1>

          <div className="text-lg md:text-xl mb-8">
            <p className="mb-2">Hosted by</p>
            <p className="font-semibold">
              <span className="uppercase">George Pyne</span> and <span className="uppercase">Jay Penske</span>
            </p>
          </div>

          <p className="text-base md:text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
            George Pyne and Jay Penske will host an invitation-only gathering of
            international sports leaders, March 18 - 20, 2026 at The Boca Raton resort in
            Boca Raton, Florida. Now in its fifth year, this retreat remains the only event of its
            kind dedicated exclusively to the global sports leadership.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>March 18-20</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Boca Raton, FL</span>
            </div>
          </div>

          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-[#f49898] text-gray-900 rounded hover:bg-[#f5a8a8] transition-colors font-medium"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  )
}
