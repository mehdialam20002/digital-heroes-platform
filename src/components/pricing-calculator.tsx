'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PRODUCT_DIVISIONS } from '@/lib/products-data';
import { calculatePricing, formatCurrency } from '@/lib/pricing-engine';
import { Calculator, ArrowRight, Zap, Check, Sparkles, SlidersHorizontal } from 'lucide-react';
import { DivisionSlug } from '@/types';

export default function PricingCalculator() {
  const [selectedSlug, setSelectedSlug] = useState<DivisionSlug>('labels-stickers');
  const division = useMemo(
    () => PRODUCT_DIVISIONS.find((d) => d.slug === selectedSlug) || PRODUCT_DIVISIONS[0],
    [selectedSlug]
  );

  const [widthMm, setWidthMm] = useState<number>(division.defaultWidthMm);
  const [heightMm, setHeightMm] = useState<number>(division.defaultHeightMm);
  const [materialId, setMaterialId] = useState<string>(division.materials[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(100);

  // Sync state if division changes
  const handleDivisionChange = (slug: DivisionSlug) => {
    setSelectedSlug(slug);
    const div = PRODUCT_DIVISIONS.find((d) => d.slug === slug)!;
    setWidthMm(div.defaultWidthMm);
    setHeightMm(div.defaultHeightMm);
    setMaterialId(div.materials[0]?.id || '');
    setQuantity(div.volumeDiscounts[0]?.minQty || 50);
  };

  const pricing = useMemo(() => {
    return calculatePricing({
      divisionSlug: selectedSlug,
      widthMm,
      heightMm,
      materialId: materialId || division.materials[0]?.id,
      quantity,
      orientation: widthMm >= heightMm ? 'horizontal' : 'vertical',
    });
  }, [selectedSlug, widthMm, heightMm, materialId, quantity, division]);

  return (
    <section id="calculator" className="py-20 bg-[#090d13] text-white border-t border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Section 05 · Instant Parameter Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase">
            Live Pricing Engine.
          </h2>
          <p className="text-zinc-400 text-sm max-w-2xl mt-2">
            No quote forms, no delayed callbacks. Continuous pricing driven by surface area calculations, specialized media grade, and algorithmic quantity discount floors.
          </p>
        </div>

        {/* Division Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {PRODUCT_DIVISIONS.map((d) => (
            <button
              key={d.slug}
              onClick={() => handleDivisionChange(d.slug)}
              className={`px-3 py-3 rounded text-left font-mono text-xs uppercase tracking-tight border transition-all cursor-pointer ${
                selectedSlug === d.slug
                  ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold shadow-sm'
                  : 'bg-[#121620] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <div className="text-[10px] text-zinc-500">Div 0{PRODUCT_DIVISIONS.indexOf(d) + 1}</div>
              <div className="truncate mt-0.5">{d.name}</div>
            </button>
          ))}
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 bg-[#121620] border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="font-bold text-lg text-white uppercase tracking-tight">
                  {division.name} Specs
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Bleed: {division.bleedMm}mm · Safe: {division.safeMarginMm}mm
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-1 rounded bg-zinc-800 text-zinc-300">
                Live Engine Active
              </span>
            </div>

            {/* Dimensional Sizing (Width x Height) */}
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase text-zinc-300 flex items-center justify-between">
                <span>1. Dimensions (Millimeters)</span>
                <span className="text-amber-400 font-bold">
                  {widthMm} mm × {heightMm} mm
                </span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 font-mono mb-1">
                    <span>Width (mm)</span>
                    <span>{division.minWidthMm} - {division.maxWidthMm}</span>
                  </div>
                  <input
                    type="range"
                    min={division.minWidthMm}
                    max={division.maxWidthMm}
                    value={widthMm}
                    onChange={(e) => setWidthMm(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <input
                    type="number"
                    min={division.minWidthMm}
                    max={division.maxWidthMm}
                    value={widthMm}
                    onChange={(e) => setWidthMm(Number(e.target.value))}
                    className="mt-2 w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-white text-center focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 font-mono mb-1">
                    <span>Height (mm)</span>
                    <span>{division.minHeightMm} - {division.maxHeightMm}</span>
                  </div>
                  <input
                    type="range"
                    min={division.minHeightMm}
                    max={division.maxHeightMm}
                    value={heightMm}
                    onChange={(e) => setHeightMm(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <input
                    type="number"
                    min={division.minHeightMm}
                    max={division.maxHeightMm}
                    value={heightMm}
                    onChange={(e) => setHeightMm(Number(e.target.value))}
                    className="mt-2 w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-white text-center focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Material Selector */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase text-zinc-300 block">
                2. Select Substrate / Material
              </label>
              <div className="space-y-2">
                {division.materials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setMaterialId(mat.id)}
                    className={`w-full p-3 rounded text-left border flex items-center justify-between transition-all cursor-pointer ${
                      materialId === mat.id
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs uppercase tracking-tight text-white flex items-center gap-2">
                        {mat.name}
                        {materialId === mat.id && (
                          <Check className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {mat.description}
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs text-amber-400">
                      +£{mat.baseCost.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-zinc-300">
                  3. Batch Quantity
                </label>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-base font-bold text-amber-400">{quantity} units</span>
                  {pricing.volumeDiscountPct > 0 && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      -{pricing.volumeDiscountPct}% OFF
                    </span>
                  )}
                </div>
              </div>

              <input
                type="range"
                min="10"
                max="2500"
                step="10"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />

              {/* Volume Discount Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {division.volumeDiscounts.map((tier) => (
                  <button
                    key={tier.minQty}
                    onClick={() => setQuantity(tier.minQty)}
                    className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                      quantity >= tier.minQty
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    {tier.minQty}+ pcs ({tier.discountPercentage}% off)
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Summary Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#121620] border border-amber-500/30 rounded-lg p-6 sm:p-8 flex flex-col justify-between shadow-xl sticky top-24">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
                  Instant Commercial Quote
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  Per-Order Capture
                </span>
              </div>

              {/* Live Spec Overview */}
              <div className="bg-zinc-900/80 rounded p-4 border border-zinc-800 font-mono text-xs space-y-2 mb-6">
                <div className="flex justify-between text-zinc-400">
                  <span>Product:</span>
                  <span className="text-white font-semibold">{division.name}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Physical Trim:</span>
                  <span className="text-white">{widthMm} × {heightMm} mm</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Surface Area:</span>
                  <span className="text-white">{((widthMm * heightMm) / 100).toFixed(1)} cm²</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Volume Tier:</span>
                  <span className={pricing.volumeDiscountPct > 0 ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                    {pricing.volumeDiscountPct > 0 ? `${pricing.volumeDiscountPct}% Discount Applied` : 'Standard Tier'}
                  </span>
                </div>
              </div>

              {/* Price Calculations Breakdown */}
              <div className="space-y-3 border-b border-zinc-800 pb-6 mb-6 font-mono text-xs">
                <div className="flex justify-between items-center text-zinc-300">
                  <span>Effective Unit Price:</span>
                  <span className="text-base font-bold text-amber-400">
                    {formatCurrency(pricing.unitPrice)}
                    <span className="text-[10px] text-zinc-500 font-normal"> /ea</span>
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Batch Subtotal ({quantity} units):</span>
                  <span>{formatCurrency(pricing.subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Standard VAT (20%):</span>
                  <span>{formatCurrency(pricing.vatAmount)}</span>
                </div>
              </div>

              {/* Total Card */}
              <div className="flex items-baseline justify-between mb-8">
                <div>
                  <span className="text-xs uppercase font-mono text-zinc-400 block">Total Payable</span>
                  <span className="text-[10px] text-zinc-500 font-mono">VAT Inclusive · No Hidden Surcharges</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold font-mono text-white tracking-tight">
                    {formatCurrency(pricing.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Launch Configurator / Designer Button */}
            <div className="space-y-3">
              <Link
                href={`/configure/${selectedSlug}?w=${widthMm}&h=${heightMm}&m=${materialId}&q=${quantity}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase text-xs tracking-wider transition-all shadow-md active:scale-98"
              >
                <span>Launch Web-to-Print Designer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-center text-zinc-500 font-mono">
                Real-time canvas editor with bleed guides & automated proofing
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
