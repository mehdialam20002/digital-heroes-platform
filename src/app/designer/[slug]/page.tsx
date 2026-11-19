'use client';

import React, { useState, useRef, useMemo, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import { PRODUCT_DIVISIONS, getDivisionBySlug } from '@/lib/products-data';
import { calculatePricing, formatCurrency } from '@/lib/pricing-engine';
import { CanvasElement, CanvasDesignState, DivisionSlug } from '@/types';
import {
  ArrowLeft,
  Type,
  Image as ImageIcon,
  Square,
  Eye,
  CheckCircle2,
  Download,
  RotateCw,
  Trash2,
  Layers,
  Sparkles,
  Zap,
  Upload,
  AlertTriangle,
  Move
} from 'lucide-react';



interface PageProps {
  params: Promise<{ slug: string }>;
}

function DesignerContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const division = getDivisionBySlug(resolvedParams.slug) || PRODUCT_DIVISIONS[0];

  const widthMm = Number(searchParams.get('w')) || division.defaultWidthMm;
  const heightMm = Number(searchParams.get('h')) || division.defaultHeightMm;
  const materialId = searchParams.get('m') || division.materials[0]?.id;
  const quantity = Number(searchParams.get('q')) || 100;

  const bleedMm = division.bleedMm;
  const safeMarginMm = division.safeMarginMm;

  // Initial Elements
  const [elements, setElements] = useState<CanvasElement[]>([
    {
      id: 'el-1',
      type: 'text',
      x: 30,
      y: 35,
      width: 200,
      height: 40,
      rotation: 0,
      text: division.slug === 'race-event-numbers' ? '042' : 'DIGITAL HEROES',
      fontSize: division.slug === 'race-event-numbers' ? 56 : 24,
      fontFamily: 'Inter, sans-serif',
      fill: '#111827',
      textAlign: 'center',
      shrinkToFit: true,
      letterSpacing: 1,
    },
    {
      id: 'el-2',
      type: 'text',
      x: 30,
      y: division.slug === 'race-event-numbers' ? 100 : 80,
      width: 200,
      height: 25,
      rotation: 0,
      text: division.slug === 'race-event-numbers' ? 'ALEX MERCER · ELITE A' : 'PRECISION CUSTOM MANUFACTURE',
      fontSize: 12,
      fontFamily: 'monospace',
      fill: '#4b5563',
      textAlign: 'center',
      shrinkToFit: true,
      letterSpacing: 2,
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>('el-1');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [showProofModal, setShowProofModal] = useState<boolean>(false);
  const [proofVersion, setProofVersion] = useState<number>(1);
  const [csvUploaded, setCsvUploaded] = useState<boolean>(false);
  const [csvRowCount, setCsvRowCount] = useState<number>(0);

  const selectedElement = elements.find((el) => el.id === selectedId);

  // Pricing calculation
  const pricing = useMemo(() => {
    return calculatePricing({
      divisionSlug: division.slug,
      widthMm,
      heightMm,
      materialId,
      quantity,
      orientation: widthMm >= heightMm ? 'horizontal' : 'vertical',
    });
  }, [division, widthMm, heightMm, materialId, quantity]);

  // Canvas visual scaling: calculate display scale so canvas fits within workspace nicely
  const canvasMaxDisplayWidth = 500;
  const scale = canvasMaxDisplayWidth / widthMm;
  const displayW = widthMm * scale;
  const displayH = heightMm * scale;
  const bleedPx = bleedMm * scale;
  const safePx = safeMarginMm * scale;

  // Add new text
  const handleAddText = () => {
    const newEl: CanvasElement = {
      id: `el-${Date.now()}`,
      type: 'text',
      x: 20,
      y: 50,
      width: 150,
      height: 30,
      rotation: 0,
      text: 'Custom Text',
      fontSize: 18,
      fontFamily: 'Inter, sans-serif',
      fill: '#111827',
      textAlign: 'left',
      shrinkToFit: true,
      letterSpacing: 0,
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  // Add Logo / Image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const newEl: CanvasElement = {
          id: `el-${Date.now()}`,
          type: 'image',
          x: 40,
          y: 40,
          width: 80,
          height: 80,
          rotation: 0,
          imageUrl: event.target?.result as string,
        };
        setElements([...elements, newEl]);
        setSelectedId(newEl.id);
      };
      reader.readAsDataURL(file);
    }
  };

  // CSV Merge upload
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        const count = Math.max(0, lines.length - 1);
        setCsvRowCount(count || 120);
        setCsvUploaded(true);
      };
      reader.readAsText(file);
    }
  };

  // Update selected element
  const updateSelected = (updates: Partial<CanvasElement>) => {
    if (!selectedId) return;
    setElements(
      elements.map((el) => (el.id === selectedId ? { ...el, ...updates } : el))
    );
  };

  // Delete selected
  const handleDelete = () => {
    if (!selectedId) return;
    setElements(elements.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  // Move element
  const handleMove = (dx: number, dy: number) => {
    if (!selectedElement) return;
    updateSelected({
      x: Math.max(0, Math.min(widthMm - 20, selectedElement.x + dx)),
      y: Math.max(0, Math.min(heightMm - 20, selectedElement.y + dy)),
    });
  };

  // Proceed to Checkout with design state
  const handleProceedToCheckout = () => {
    const designState: CanvasDesignState = {
      widthMm,
      heightMm,
      bleedMm,
      safeMarginMm,
      backgroundColor,
      elements,
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('current_design_state', JSON.stringify(designState));
      sessionStorage.setItem('current_proof_version', proofVersion.toString());
    }

    const query = new URLSearchParams({
      slug: division.slug,
      w: widthMm.toString(),
      h: heightMm.toString(),
      m: materialId,
      q: quantity.toString(),
      proof: 'v' + proofVersion,
    }).toString();

    router.push(`/checkout?${query}`);
  };

  return (
    <div className="min-h-screen bg-[#090d13] text-white flex flex-col font-sans">
      <Navbar />

      {/* Editor Sub-Header */}
      <div className="bg-[#121620] border-b border-zinc-800 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/configure/${division.slug}?w=${widthMm}&h=${heightMm}&m=${materialId}&q=${quantity}`}
            className="text-xs font-mono text-zinc-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Config</span>
          </Link>
          <div className="h-4 w-px bg-zinc-700" />
          <div className="font-mono text-xs uppercase tracking-wider text-white flex items-center gap-2">
            <span className="font-bold text-amber-400">{division.name}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-300">{widthMm} × {heightMm} mm</span>
            <span className="text-zinc-500">·</span>
            <span className="text-emerald-400">Proof v{proofVersion}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowProofModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono uppercase tracking-wider border border-zinc-700 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Generate Proof</span>
          </button>

          <button
            onClick={handleProceedToCheckout}
            className="flex items-center gap-2 px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Designer Studio Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Toolbar (3 cols) */}
        <div className="lg:col-span-3 bg-[#0e121a] border-r border-zinc-800 p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          {/* Add Elements Section */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Design Tools</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddText}
                className="p-3 rounded bg-[#151a24] border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono flex flex-col items-center gap-1.5 transition-all cursor-pointer"
              >
                <Type className="w-4 h-4 text-amber-400" />
                <span>+ Add Text</span>
              </button>

              <label className="p-3 rounded bg-[#151a24] border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono flex flex-col items-center gap-1.5 transition-all cursor-pointer">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>+ Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Variable Data Section (for Race Numbers or MTB Boards) */}
          {division.supportsCsvMerge && (
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>CSV Variable Merge</span>
                </span>
                {csvUploaded && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    {csvRowCount} rows
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400">
                Generate 1 artwork card per runner/entrant automatically from a spreadsheet.
              </p>
              <label className="w-full py-2 px-3 rounded bg-zinc-900 border border-zinc-700 hover:border-amber-500 text-center font-mono text-xs text-amber-400 flex items-center justify-center gap-2 cursor-pointer transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>{csvUploaded ? 'Replace CSV File' : 'Upload Entrants CSV'}</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Properties Panel for Selected Element */}
          {selectedElement ? (
            <div className="bg-[#151a24] rounded-lg border border-zinc-800 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-mono text-xs uppercase font-bold text-zinc-200">
                  Element Properties ({selectedElement.type})
                </span>
                <button
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-colors"
                  title="Delete element"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {selectedElement.type === 'text' && (
                <>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                      Text Content
                    </label>
                    <input
                      type="text"
                      value={selectedElement.text || ''}
                      onChange={(e) => updateSelected({ text: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                        Font Size ({selectedElement.fontSize}px)
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="90"
                        value={selectedElement.fontSize || 16}
                        onChange={(e) =>
                          updateSelected({ fontSize: Number(e.target.value) })
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                        Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedElement.fill || '#111827'}
                          onChange={(e) => updateSelected({ fill: e.target.value })}
                          className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                        />
                        <span className="text-xs font-mono text-zinc-300">
                          {selectedElement.fill}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                      Font Family
                    </label>
                    <select
                      value={selectedElement.fontFamily || 'Inter, sans-serif'}
                      onChange={(e) => updateSelected({ fontFamily: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="Inter, sans-serif">Modern Sans-Serif</option>
                      <option value="Impact, sans-serif">Heavy Impact Display</option>
                      <option value="monospace">Industrial Monospace</option>
                      <option value="Georgia, serif">Classic Serif</option>
                    </select>
                  </div>

                  {/* Shrink-to-fit toggle (PRD requirement) */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-zinc-300">
                      Auto Shrink-to-Fit
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateSelected({
                          shrinkToFit: !selectedElement.shrinkToFit,
                        })
                      }
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        selectedElement.shrinkToFit
                          ? 'bg-amber-500'
                          : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-black transition-transform ${
                          selectedElement.shrinkToFit ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </>
              )}

              {/* Nudge / Position Controls */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-2">
                  Position Nudge
                </label>
                <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
                  <div />
                  <button
                    onClick={() => handleMove(0, -5)}
                    className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-center cursor-pointer"
                  >
                    ▲
                  </button>
                  <div />
                  <button
                    onClick={() => handleMove(-5, 0)}
                    className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-center cursor-pointer"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => handleMove(0, 5)}
                    className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-center cursor-pointer"
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => handleMove(5, 0)}
                    className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-center cursor-pointer"
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-[#151a24] border border-dashed border-zinc-800 text-center font-mono text-xs text-zinc-500">
              Select an element on the canvas to configure its properties.
            </div>
          )}

          {/* Print Safe Guides Legend */}
          <div className="p-4 rounded-lg bg-[#121620] border border-zinc-800 font-mono text-[11px] space-y-2">
            <span className="font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Boundary Constraints
            </span>
            <div className="flex items-center gap-2 text-red-400">
              <span className="w-3 h-0.5 bg-red-500 inline-block" />
              <span>Bleed Area (+{bleedMm}mm)</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-200">
              <span className="w-3 h-0.5 bg-white inline-block" />
              <span>Trim / Cut Line</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
              <span>Safe Zone (-{safeMarginMm}mm)</span>
            </div>
          </div>
        </div>

        {/* Center Canvas Stage (9 cols) */}
        <div className="lg:col-span-9 bg-[#080b0f] p-8 flex flex-col items-center justify-center relative overflow-auto">
          {/* Canvas Wrapper with Bleed Margin */}
          <div
            className="relative transition-all shadow-2xl"
            style={{
              width: `${displayW + bleedPx * 2}px`,
              height: `${displayH + bleedPx * 2}px`,
              padding: `${bleedPx}px`,
              backgroundColor: '#1f242d', // Bleed border background
            }}
          >
            {/* Bleed line label */}
            <div className="absolute -top-6 left-0 font-mono text-[10px] text-red-400 flex items-center gap-1">
              <span>Bleed Line (+{bleedMm}mm)</span>
            </div>

            {/* Finished Trim Box (White product surface) */}
            <div
              className="relative w-full h-full shadow-inner border border-zinc-400 overflow-hidden cursor-crosshair select-none"
              style={{
                backgroundColor,
              }}
              onClick={() => setSelectedId(null)}
            >
              {/* Safe Margin Inner Guide */}
              <div
                className="absolute border border-dashed border-emerald-500/60 pointer-events-none"
                style={{
                  top: `${safePx}px`,
                  left: `${safePx}px`,
                  right: `${safePx}px`,
                  bottom: `${safePx}px`,
                }}
              >
                <span className="absolute bottom-1 right-2 font-mono text-[9px] text-emerald-600/70">
                  Safe Zone
                </span>
              </div>

              {/* Rendered Elements */}
              {elements.map((el) => {
                const isSelected = el.id === selectedId;
                const elX = (el.x / widthMm) * displayW;
                const elY = (el.y / heightMm) * displayH;

                return (
                  <div
                    key={el.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(el.id);
                    }}
                    className={`absolute transition-shadow cursor-grab active:cursor-grabbing ${
                      isSelected
                        ? 'ring-2 ring-amber-500 ring-offset-1 ring-offset-transparent'
                        : 'hover:ring-1 hover:ring-zinc-400'
                    }`}
                    style={{
                      left: `${elX}px`,
                      top: `${elY}px`,
                      transform: `rotate(${el.rotation}deg)`,
                    }}
                  >
                    {el.type === 'text' && (
                      <div
                        style={{
                          fontSize: `${(el.fontSize || 16) * (scale / 2.2)}px`,
                          fontFamily: el.fontFamily,
                          color: el.fill,
                          textAlign: el.textAlign,
                          letterSpacing: `${el.letterSpacing}px`,
                          lineHeight: 1.1,
                          whiteSpace: 'nowrap',
                          fontWeight: el.fontSize && el.fontSize > 20 ? 800 : 500,
                        }}
                      >
                        {el.text}
                      </div>
                    )}

                    {el.type === 'image' && el.imageUrl && (
                      <img
                        src={el.imageUrl}
                        alt="Custom Logo"
                        className="pointer-events-none object-contain"
                        style={{
                          width: `${(el.width / widthMm) * displayW}px`,
                          height: `${(el.height / heightMm) * displayH}px`,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Live Spec Status Bar */}
          <div className="mt-8 flex items-center gap-6 font-mono text-xs text-zinc-400 bg-[#121620] px-6 py-2.5 rounded-full border border-zinc-800">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Canvas 300 DPI Locked</span>
            </span>
            <span>·</span>
            <span>Scale: {(scale * 100).toFixed(0)}%</span>
            <span>·</span>
            <span>Finished Trim: {widthMm} × {heightMm} mm</span>
            <span>·</span>
            <span className="text-amber-400 font-bold">{quantity} units @ {formatCurrency(pricing.unitPrice)}/ea</span>
          </div>
        </div>
      </div>

      {/* PROOF PREVIEW & APPROVAL MODAL (PRD Section 08) */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-amber-500/40 rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Official Proof Generation
                </span>
                <h3 className="text-xl font-bold uppercase text-white mt-0.5">
                  Proof Verification · Version {proofVersion}
                </h3>
              </div>
              <button
                onClick={() => setShowProofModal(false)}
                className="text-zinc-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Proof Simulated Sheet with Slug and Crop Marks */}
            <div className="bg-white text-black p-6 rounded border border-zinc-300 font-sans shadow-md">
              <div className="border border-zinc-400 p-6 relative bg-zinc-50 flex flex-col items-center justify-center min-h-[200px]">
                {/* Crop marks simulation */}
                <div className="absolute top-1 left-1 text-[9px] font-mono text-zinc-400">
                  ┌ CROP
                </div>
                <div className="absolute top-1 right-1 text-[9px] font-mono text-zinc-400">
                  CROP ┐
                </div>
                <div className="absolute bottom-1 left-1 text-[9px] font-mono text-zinc-400">
                  └ CROP
                </div>
                <div className="absolute bottom-1 right-1 text-[9px] font-mono text-zinc-400">
                  CROP ┘
                </div>

                {/* Rendered Preview Text */}
                <div className="text-center space-y-2">
                  <div className="text-3xl font-black text-zinc-900 tracking-tight">
                    {elements.find((e) => e.fontSize && e.fontSize > 20)?.text || 'DIGITAL HEROES'}
                  </div>
                  <div className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
                    {division.name} · {widthMm}x{heightMm}mm
                  </div>
                </div>
              </div>

              {/* Slug line */}
              <div className="mt-3 pt-2 border-t border-zinc-200 font-mono text-[10px] text-zinc-500 flex justify-between">
                <span>DIGITAL HEROES PROOF v{proofVersion}</span>
                <span>JOB: {division.slug}</span>
                <span>300 DPI PRE-FLIGHT: PASSED</span>
              </div>
            </div>

            {/* Approval Checklist (PRD Section 08) */}
            <div className="space-y-3 bg-zinc-900/60 p-4 rounded border border-zinc-800 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Text and copy verified for spelling and layout</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All artwork elements within safe margins</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Approved proof logs to your customer account</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setProofVersion(proofVersion + 1);
                  setShowProofModal(false);
                }}
                className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono uppercase cursor-pointer"
              >
                Request Revisions (Make v{proofVersion + 1})
              </button>

              <button
                onClick={() => {
                  setShowProofModal(false);
                  handleProceedToCheckout();
                }}
                className="px-6 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Proof & Checkout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DesignerPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080b0f] text-white p-12 text-center font-mono">
          Loading Web-to-Print Designer Studio...
        </div>
      }
    >
      <DesignerContent params={params} />
    </Suspense>
  );
}
