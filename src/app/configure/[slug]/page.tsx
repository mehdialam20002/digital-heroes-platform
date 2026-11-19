'use client';

import React, { useState, useMemo, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { PRODUCT_DIVISIONS, getDivisionBySlug } from '@/lib/products-data';
import { calculatePricing, formatCurrency } from '@/lib/pricing-engine';
import { DivisionSlug } from '@/types';
import { ArrowLeft, ArrowRight, Check, Paintbrush, UploadCloud, Shield, Info, Zap } from 'lucide-react';



interface PageProps {
  params: Promise<{ slug: string }>;
}

function ConfigureContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const division = getDivisionBySlug(resolvedParams.slug) || PRODUCT_DIVISIONS[0];

  const initialW = Number(searchParams.get('w')) || division.defaultWidthMm;
  const initialH = Number(searchParams.get('h')) || division.defaultHeightMm;
  const initialM = searchParams.get('m') || division.materials[0]?.id;
  const initialQ = Number(searchParams.get('q')) || (division.volumeDiscounts[0]?.minQty || 50);

  const [widthMm, setWidthMm] = useState<number>(initialW);
  const [heightMm, setHeightMm] = useState<number>(initialH);
  const [materialId, setMaterialId] = useState<string>(initialM);
  const [quantity, setQuantity] = useState<number>(initialQ);
  const [selectedMethod, setSelectedMethod] = useState<'designer' | 'upload'>('designer');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const pricing = useMemo(() => {
    return calculatePricing({
      divisionSlug: division.slug,
      widthMm,
      heightMm,
      materialId: materialId || division.materials[0]?.id,
      quantity,
      orientation: widthMm >= heightMm ? 'horizontal' : 'vertical',
    });
  }, [division, widthMm, heightMm, materialId, quantity]);

  const handleProceed = () => {
    // Save configuration in session/query and proceed
    const query = new URLSearchParams({
      w: widthMm.toString(),
      h: heightMm.toString(),
      m: materialId,
      q: quantity.toString(),
      method: selectedMethod,
    }).toString();

    if (selectedMethod === 'designer') {
      router.push(`/designer/${division.slug}?${query}`);
    } else {
      router.push(`/checkout?slug=${division.slug}&${query}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back */}
          <div className="mb-6">
            <Link
              href="/#divisions"
              className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Divisions</span>
            </Link>
          </div>

          {/* Division Title Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs text-amber-400 uppercase tracking-wider mb-2">
                <span>Division Specification</span>
                <span>·</span>
                <span>{division.slug}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                Configure {division.name}
              </h1>
              <p className="text-zinc-400 text-sm mt-1 max-w-2xl font-normal">
                {division.description}
              </p>
            </div>
            {division.supportsCsvMerge && (
              <div className="mt-4 md:mt-0 flex items-center gap-2 px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs">
                <Zap className="w-3.5 h-3.5" />
                <span>Variable Data CSV Merge Available</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Dimensions */}
              <div className="bg-[#121620] border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-200">
                    1. Dynamic Finished Dimensions (Trim)
                  </h3>
                  <span className="font-mono text-xs text-amber-400 font-bold">
                    {widthMm} mm × {heightMm} mm
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Width (Min: {division.minWidthMm}mm / Max: {division.maxWidthMm}mm)
                    </label>
                    <input
                      type="range"
                      min={division.minWidthMm}
                      max={division.maxWidthMm}
                      value={widthMm}
                      onChange={(e) => setWidthMm(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min={division.minWidthMm}
                        max={division.maxWidthMm}
                        value={widthMm}
                        onChange={(e) => setWidthMm(Number(e.target.value))}
                        className="w-24 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs font-mono text-white text-center"
                      />
                      <span className="text-xs text-zinc-500 font-mono">mm</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Height (Min: {division.minHeightMm}mm / Max: {division.maxHeightMm}mm)
                    </label>
                    <input
                      type="range"
                      min={division.minHeightMm}
                      max={division.maxHeightMm}
                      value={heightMm}
                      onChange={(e) => setHeightMm(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min={division.minHeightMm}
                        max={division.maxHeightMm}
                        value={heightMm}
                        onChange={(e) => setHeightMm(Number(e.target.value))}
                        className="w-24 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs font-mono text-white text-center"
                      />
                      <span className="text-xs text-zinc-500 font-mono">mm</span>
                    </div>
                  </div>
                </div>

                {/* Aspect ratio preview box */}
                <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-6">
                  <div className="text-xs font-mono text-zinc-500">
                    Proportion preview:
                  </div>
                  <div
                    className="border-2 border-dashed border-amber-500/50 bg-amber-500/5 flex items-center justify-center font-mono text-[10px] text-amber-400/80 transition-all duration-300"
                    style={{
                      width: `${Math.min(160, Math.max(50, (widthMm / Math.max(widthMm, heightMm)) * 160))}px`,
                      height: `${Math.min(100, Math.max(30, (heightMm / Math.max(widthMm, heightMm)) * 100))}px`,
                    }}
                  >
                    {widthMm}×{heightMm}
                  </div>
                </div>
              </div>

              {/* Step 2: Material Selection */}
              <div className="bg-[#121620] border border-zinc-800 rounded-lg p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-200 mb-4 border-b border-zinc-800 pb-3">
                  2. Substrate & Surface Finish
                </h3>
                <div className="space-y-3">
                  {division.materials.map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => setMaterialId(mat.id)}
                      className={`w-full p-4 rounded text-left border flex items-center justify-between transition-all cursor-pointer ${
                        materialId === mat.id
                          ? 'bg-amber-500/10 border-amber-500 text-white'
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
                        <div className="text-[11px] text-zinc-400 mt-1">
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

              {/* Step 3: Quantity & Batch Pricing */}
              <div className="bg-[#121620] border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-200">
                    3. Order Batch Quantity
                  </h3>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-base font-bold text-amber-400">{quantity} units</span>
                    {pricing.volumeDiscountPct > 0 && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        -{pricing.volumeDiscountPct}% Volume Tier
                      </span>
                    )}
                  </div>
                </div>

                <input
                  type="range"
                  min="10"
                  max="3000"
                  step="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />

                <div className="flex flex-wrap gap-2 pt-3">
                  {division.volumeDiscounts.map((tier) => (
                    <button
                      key={tier.minQty}
                      onClick={() => setQuantity(tier.minQty)}
                      className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
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

              {/* Step 4: Choose Artwork Creation Path */}
              <div className="bg-[#121620] border border-zinc-800 rounded-lg p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-200 mb-4 border-b border-zinc-800 pb-3">
                  4. Choose Artwork Path (PRD Section 06)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Path A: In-Browser Designer */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('designer')}
                    className={`p-5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedMethod === 'designer'
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-amber-400">
                        <Paintbrush className="w-5 h-5" />
                        <span className="font-bold text-xs uppercase tracking-wider">
                          In-Browser Designer
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">
                        Design directly inside printable boundaries with live bleed lines, text styling, and instant proof preview.
                      </p>
                    </div>
                    <div className="mt-4 font-mono text-[10px] text-zinc-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Print-zone constrained
                    </div>
                  </button>

                  {/* Path B: Direct File Upload */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upload')}
                    className={`p-5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedMethod === 'upload'
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-amber-400">
                        <UploadCloud className="w-5 h-5" />
                        <span className="font-bold text-xs uppercase tracking-wider">
                          Upload Finished Files
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">
                        Upload production-ready vector or high-resolution artwork (PDF, SVG, AI, PNG at 300 DPI).
                      </p>
                    </div>
                    <div className="mt-4 font-mono text-[10px] text-zinc-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Direct RIP dispatch
                    </div>
                  </button>
                </div>

                {selectedMethod === 'upload' && (
                  <div className="mt-4 p-4 border-2 border-dashed border-zinc-700 rounded-lg bg-zinc-900/40 text-center">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.svg,.png,.ai"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadedFile(e.target.files[0]);
                        }
                      }}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer block">
                      <UploadCloud className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                      <span className="text-xs font-mono text-amber-400 hover:underline block">
                        {uploadedFile ? uploadedFile.name : 'Click to select PDF, SVG, AI or PNG file'}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                        File will be validated against {widthMm}x{heightMm}mm trim
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Right Summary Column (5 cols) */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-[#121620] border border-amber-500/30 rounded-lg p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-amber-400 font-mono">
                    Live Order Summary
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    Instant Calculation
                  </span>
                </div>

                {/* Spec Specs */}
                <div className="bg-zinc-900/80 rounded p-4 border border-zinc-800 font-mono text-xs space-y-2 mb-6">
                  <div className="flex justify-between text-zinc-400">
                    <span>Product:</span>
                    <span className="text-white font-semibold">{division.name}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Trim Size:</span>
                    <span className="text-white">{widthMm} × {heightMm} mm</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Substrate:</span>
                    <span className="text-white truncate max-w-[180px]">
                      {division.materials.find((m) => m.id === materialId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Bleed Standard:</span>
                    <span className="text-emerald-400">+{division.bleedMm}mm Perimeter</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-b border-zinc-800 pb-6 mb-6 font-mono text-xs">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Unit Price:</span>
                    <span className="text-base font-bold text-amber-400">
                      {formatCurrency(pricing.unitPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Batch Subtotal ({quantity} pcs):</span>
                    <span>{formatCurrency(pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>VAT (20%):</span>
                    <span>{formatCurrency(pricing.vatAmount)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-baseline justify-between mb-6">
                  <div>
                    <span className="text-xs uppercase font-mono text-zinc-400 block">Total Due</span>
                    <span className="text-[10px] text-zinc-500 font-mono">VAT Inclusive</span>
                  </div>
                  <span className="text-3xl font-bold font-mono text-white">
                    {formatCurrency(pricing.total)}
                  </span>
                </div>

                {/* Proceed Button */}
                <button
                  type="button"
                  onClick={handleProceed}
                  className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase text-xs tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <span>
                    {selectedMethod === 'designer' ? 'Open In-Browser Designer' : 'Proceed to Checkout'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Proof Approval Gate Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ConfigurePage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d1117] text-white p-12 text-center font-mono">
          Loading Configuration...
        </div>
      }
    >
      <ConfigureContent params={params} />
    </Suspense>
  );
}
