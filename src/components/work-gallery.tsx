'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

interface GalleryItem {
  id: string;
  division: string;
  title: string;
  client: string;
  specs: string;
  imageUrl: string;
  slug: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    division: 'Labels & Stickers',
    title: 'Precision Die-Cut Brand Foil Decals',
    client: 'Apex Coffee Roasters',
    specs: 'Gloss Laminated Vinyl · 65x90mm · Contour Cut',
    imageUrl: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80',
    slug: 'labels-stickers',
  },
  {
    id: 'gal-2',
    division: 'Race & Event Numbers',
    title: 'Sub-Zero Ultra Marathon Tyvek Bibs',
    client: 'Peak District 100k',
    specs: 'Tyvek 75gsm · 4-Hole Punched · Variable CSV Merge',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
    slug: 'race-event-numbers',
  },
  {
    id: 'gal-3',
    division: 'MTB Boards',
    title: 'Downhill National Cup Number Plates',
    client: 'Gravity Syndicate',
    specs: '0.8mm Flexible Polypropylene · Pre-slotted Cable Slots',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    slug: 'mtb-boards',
  },
  {
    id: 'gal-4',
    division: 'Stamps',
    title: 'Heavy Duty Inspection Rubber Stamps',
    client: 'Vanguard Aerospace',
    specs: 'Trodat 4913 Self-Inker · 0.1mm Laser-Etched Vulcanized Die',
    imageUrl: 'https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?auto=format&fit=crop&w=800&q=80',
    slug: 'stamps',
  },
  {
    id: 'gal-5',
    division: 'Trophies',
    title: 'Cast Acrylic & Solid Walnut Awards',
    client: 'FinTech Leaders 2026',
    specs: '10mm Flame-Polished Acrylic · Sub-Surface UV & Laser Cut',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    slug: 'trophies',
  },
  {
    id: 'gal-6',
    division: 'Laser-Cut Work',
    title: 'Architectural Geometric Birch Panels',
    client: 'Studio K Architectura',
    specs: '6mm Aircraft Birch Ply · 0.02mm Toleranced Kerf',
    imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
    slug: 'laser-cut',
  },
];

export default function WorkGallery() {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Labels & Stickers', 'Race & Event Numbers', 'MTB Boards', 'Stamps', 'Trophies', 'Laser-Cut Work'];

  const filteredItems = filter === 'All' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter((item) => item.division === filter);

  return (
    <section id="gallery" className="py-20 bg-[#0e121a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-zinc-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>Production Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase">
              Real Production Gallery.
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl mt-2">
              Browse actual jobs manufactured on the Digital Heroes production floor across all six divisions.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  filter === cat
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-[#131822] border border-zinc-800 rounded-lg overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-md"
            >
              <div className="relative h-60 w-full overflow-hidden bg-zinc-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0d1117]/90 px-2.5 py-1 rounded border border-zinc-700 font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  {item.division}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs text-zinc-400 font-mono mt-1">
                    Client: <span className="text-zinc-200">{item.client}</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-2 bg-zinc-900/60 p-2 rounded border border-zinc-800/80">
                    {item.specs}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Output
                  </span>
                  <Link
                    href={`/configure/${item.slug}`}
                    className="text-xs font-mono text-zinc-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                  >
                    <span>Order similar</span>
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
