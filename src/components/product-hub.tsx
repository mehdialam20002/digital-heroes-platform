import React from 'react';
import Link from 'next/link';
import { PRODUCT_DIVISIONS } from '@/lib/products-data';
import { ArrowRight, Check, Zap, Layers, Cpu, Sparkles } from 'lucide-react';

export default function ProductHub() {
  return (
    <section id="divisions" className="py-20 bg-[#0e121a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Section 04 · Parameter-Driven Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase font-sans">
              Six Specialized Divisions.
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl mt-2">
              A single platform replacing dozens of static catalog SKUs with continuous dimensional logic, custom finishes, and direct factory workflow integration.
            </p>
          </div>
          <div className="mt-4 md:mt-0 font-mono text-xs text-zinc-500">
            [DYNAMIC_SIZING: ENABLED]
          </div>
        </div>

        {/* 6 Equal-Weight Product Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_DIVISIONS.map((division, idx) => (
            <div
              key={division.id}
              className="group relative bg-[#131822] rounded-lg border border-zinc-800/80 hover:border-amber-500/60 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1"
            >
              {/* Product Visual Area */}
              <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                <img
                  src={division.imageUrl}
                  alt={division.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131822] via-transparent to-black/30" />

                {/* Division Index Badge */}
                <div className="absolute top-3 left-3 bg-[#0d1117]/90 backdrop-blur-sm px-2.5 py-1 rounded border border-zinc-700 font-mono text-[11px] text-amber-400 font-bold">
                  0{idx + 1}
                </div>

                {division.supportsCsvMerge && (
                  <div className="absolute top-3 right-3 bg-amber-500/90 text-black px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                    <Zap className="w-3 h-3" />
                    CSV Merge
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors">
                    {division.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1 mb-3 line-clamp-1">
                    {division.tagline}
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                    {division.description}
                  </p>

                  {/* Tech Specs Micro-List */}
                  <div className="space-y-1.5 border-t border-zinc-800/80 pt-3 mb-6">
                    {division.sampleSpecs.slice(0, 3).map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-zinc-500">From</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">
                      £{division.basePrice.toFixed(2)}
                      <span className="text-[10px] text-zinc-500 font-normal"> /unit</span>
                    </span>
                  </div>

                  <Link
                    href={`/configure/${division.slug}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-200 text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    <span>Configure</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
