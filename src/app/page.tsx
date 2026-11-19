import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ProductHub from '@/components/product-hub';
import PricingCalculator from '@/components/pricing-calculator';
import WorkGallery from '@/components/work-gallery';
import { ArrowRight, ShieldCheck, Zap, Layers, RefreshCw, Cpu, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION - Boutique Industrial */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-gradient-to-b from-[#111722] via-[#0d1117] to-[#0e121a] border-b border-zinc-800">
          {/* Subtle Industrial Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              {/* Monospace Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/80 text-amber-400 font-mono text-xs mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Level 2 Web-to-Print Platform · Edition 2026</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none mb-6">
                Engineered <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500">
                  Web-to-Print
                </span> <br />
                Manufacturing.
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mb-8 font-normal">
                Six specialized industrial print divisions under one owned backend. Design in-browser inside strictly validated producible zones, capture real-time volume pricing, and trigger automated 300 DPI production files with zero manual intervention.
              </p>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="#calculator"
                  className="px-6 py-3.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 active:scale-95"
                >
                  <span>Launch Live Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="#divisions"
                  className="px-6 py-3.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <span>Explore 6 Divisions</span>
                </Link>

                <Link
                  href="/admin/pipeline"
                  className="px-6 py-3.5 rounded bg-zinc-900/80 hover:bg-zinc-800 text-amber-400/90 border border-amber-500/30 font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>Admin Production Pipeline</span>
                </Link>
              </div>

              {/* PRD Highlights Bar (3 Key Metrics from PRD Page 3) */}
              <div className="grid grid-cols-3 gap-6 pt-12 mt-12 border-t border-zinc-800/80">
                <div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400">6</div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mt-1">
                    Product Divisions
                  </div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-zinc-200">2</div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mt-1">
                    User Journeys
                  </div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-zinc-200">1</div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mt-1">
                    Owned Platform
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6 PRODUCT DIVISIONS */}
        <ProductHub />

        {/* INSTANT PARAMETER PRICING ENGINE */}
        <PricingCalculator />

        {/* WORK GALLERY */}
        <WorkGallery />

        {/* PRODUCTION ASSURANCE BANNER */}
        <section className="py-16 bg-[#0a0e14] border-t border-zinc-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#141a24] to-[#10141d] rounded-xl border border-zinc-700/80 p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Production Safety Gate</span>
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
                  Zero Errors on the Production Floor.
                </h3>
                <p className="text-sm text-zinc-400 max-w-xl">
                  Every order is locked behind a strict customer proof approval gate. Artwork cannot reach the RIP or cutters until explicit sign-off is logged with timestamp and version audit trails.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <Link
                  href="/dashboard"
                  className="px-5 py-3 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold uppercase tracking-wider font-mono border border-zinc-700"
                >
                  View Proof Gate Demo
                </Link>
                <Link
                  href="/admin/pipeline"
                  className="px-5 py-3 rounded bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Open Production Queue
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
