'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { DataService } from '@/lib/data-service';
import { Order, OrderStatus, OrderItem } from '@/types';
import { formatCurrency } from '@/lib/pricing-engine';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronRight,
  TrendingUp,
  Package,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  RotateCw,
  Zap,
  ArrowRight
} from 'lucide-react';

const PIPELINE_STAGES: { id: OrderStatus; label: string; color: string }[] = [
  { id: 'quote', label: 'Quote', color: 'border-zinc-600 text-zinc-400' },
  { id: 'order', label: 'Order Captured', color: 'border-blue-500/60 text-blue-400' },
  { id: 'artwork', label: 'Artwork In-Prep', color: 'border-purple-500/60 text-purple-400' },
  { id: 'proof', label: 'Proof Approval Gate', color: 'border-amber-500/60 text-amber-400' },
  { id: 'production', label: 'Production Floor', color: 'border-emerald-500/60 text-emerald-400' },
  { id: 'completed', label: 'Completed / Dispatched', color: 'border-zinc-500 text-zinc-300' },
];

export default function AdminPipelinePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null);

  useEffect(() => {
    loadAllOrders();
  }, []);

  const loadAllOrders = async () => {
    const all = await DataService.getAllOrders();
    setOrders(all);
  };

  const handleAdvanceStatus = async (orderId: string, currentStatus: OrderStatus) => {
    const currentIndex = PIPELINE_STAGES.findIndex((s) => s.id === currentStatus);
    if (currentIndex < PIPELINE_STAGES.length - 1) {
      const nextStatus = PIPELINE_STAGES[currentIndex + 1].id;
      await DataService.updateOrderStatus(orderId, nextStatus);
      loadAllOrders();
    }
  };

  // 1-Click Download High-Res 300 DPI Production PDF (calling our API route)
  const handleDownloadProductionPdf = async (order: Order, item: OrderItem) => {
    setIsGeneratingPdf(item.id);
    try {
      const res = await fetch('/api/print/render-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          orderItemId: item.id,
          mockItem: item,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${order.orderNumber}_${item.divisionSlug}_300DPI_Output.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error downloading production PDF');
    } finally {
      setIsGeneratingPdf(null);
    }
  };

  // Variable CSV batch runner
  const handleDownloadCsvBatch = async (order: Order, item: OrderItem) => {
    setIsGeneratingPdf(item.id);
    try {
      const sampleCsv = `Bib Number,First Name,Last Name,Wave
101,Sarah,Jenkins,Elite A
102,David,Kipchoge,Elite A
103,Liam,Walker,Open 1
104,Emma,Watson,Open 1
105,Carlos,Sainz,Elite B`;

      const res = await fetch('/api/print/csv-merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          divisionSlug: item.divisionSlug,
          csvData: sampleCsv,
          widthMm: item.configuration.widthMm,
          heightMm: item.configuration.heightMm,
        }),
      });

      if (!res.ok) throw new Error('CSV Merge failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${order.orderNumber}_VariableBatch_Merge.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPdf(null);
    }
  };

  // Metrics summary
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + o.total, 0),
    [orders]
  );
  const activeJobsCount = useMemo(
    () => orders.filter((o) => o.status !== 'completed').length,
    [orders]
  );

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.customerCompany || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchStage = selectedStage === 'all' || o.status === selectedStage;
      const matchDivision =
        selectedDivision === 'all' ||
        o.items.some((it) => it.divisionSlug === selectedDivision);

      return matchSearch && matchStage && matchDivision;
    });
  }, [orders, searchTerm, selectedStage, selectedDivision]);

  return (
    <div className="min-h-screen bg-[#090d13] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-6 mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs text-amber-400 uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Section 11 · Central Production Pipeline</span>
              </div>
              <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
                Manufacturing Console
              </h1>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Quote to Done · Multi-Division Production Orchestration
              </p>
            </div>

            {/* Xero Accounting Export Link */}
            <div className="flex items-center gap-3">
              <a
                href="/api/orders/export-xero"
                className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono uppercase tracking-wider border border-zinc-700 flex items-center gap-2 transition-all cursor-pointer shadow"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export Xero Invoices</span>
              </a>
            </div>
          </div>

          {/* Top Analytics Metrics Cards (PRD Section 11 #05) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#121620] border border-zinc-800 rounded-lg p-5">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">Total Pipeline Revenue</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                {formatCurrency(totalRevenue)}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 mt-2 block">
                VAT Inclusive · Clean Ledgers
              </span>
            </div>

            <div className="bg-[#121620] border border-zinc-800 rounded-lg p-5">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">Active Production Jobs</span>
              <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
                {activeJobsCount}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 mt-2 block">
                In-flight across 6 divisions
              </span>
            </div>

            <div className="bg-[#121620] border border-zinc-800 rounded-lg p-5">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">Proof Sign-off Rate</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                94.8%
              </span>
              <span className="text-[10px] font-mono text-zinc-400 mt-2 block">
                Zero file rework gate
              </span>
            </div>

            <div className="bg-[#121620] border border-zinc-800 rounded-lg p-5">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">Variable CSV Batches</span>
              <span className="text-2xl font-bold font-mono text-blue-400 mt-1 block">
                Automated
              </span>
              <span className="text-[10px] font-mono text-zinc-400 mt-2 block">
                Server-side row generation
              </span>
            </div>
          </div>

          {/* Filter Bar & Search Database (PRD Section 11 #01) */}
          <div className="bg-[#121620] border border-zinc-800 rounded-lg p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by Order #, Customer, Company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-mono text-xs">
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Stages</option>
                {PIPELINE_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Divisions</option>
                <option value="labels-stickers">Labels & Stickers</option>
                <option value="race-event-numbers">Race & Event Numbers</option>
                <option value="mtb-boards">MTB Boards</option>
                <option value="stamps">Stamps</option>
                <option value="trophies">Trophies</option>
                <option value="laser-cut">Laser-Cut Work</option>
              </select>
            </div>
          </div>

          {/* Pipeline Stage Columns (Kanban Style Flow) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10 overflow-x-auto pb-4">
            {PIPELINE_STAGES.map((stage) => {
              const stageOrders = filteredOrders.filter((o) => o.status === stage.id);

              return (
                <div
                  key={stage.id}
                  className="bg-[#0e121a] border border-zinc-800 rounded-lg p-3 min-w-[220px] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                    <span className="font-mono text-xs uppercase font-bold text-zinc-300">
                      {stage.label}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-mono flex items-center justify-center font-bold">
                      {stageOrders.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {stageOrders.map((order) => {
                      const firstItem = order.items[0];
                      const isUnlocked = firstItem?.productionFilesUnlocked;

                      return (
                        <div
                          key={order.id}
                          className="bg-[#141924] border border-zinc-800/80 rounded p-3 hover:border-amber-500/50 transition-all text-xs font-mono space-y-2 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{order.orderNumber}</span>
                            {/* Unlock Badge (PRD Section 11 #02) */}
                            {isUnlocked ? (
                              <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-bold">
                                <Unlock className="w-3 h-3" />
                                UNLOCKED
                              </span>
                            ) : (
                              <span className="text-[9px] text-zinc-500 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                GATE LOCKED
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-zinc-400">
                            {order.customerCompany || order.customerName}
                          </div>

                          <div className="text-[10px] text-zinc-500">
                            {firstItem?.productName} ({firstItem?.configuration.quantity} pcs)
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                            <button
                              onClick={() => handleDownloadProductionPdf(order, firstItem)}
                              disabled={isGeneratingPdf === firstItem?.id}
                              title="Download 300 DPI Production PDF"
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            {/* Advance stage button (PRD Section 11 #04) */}
                            {stage.id !== 'completed' && (
                              <button
                                onClick={() => handleAdvanceStatus(order.id, order.status)}
                                className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-black font-bold text-[10px] uppercase flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <span>Advance</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Job Queue Table with Production File Downloads (PRD Section 11 #03) */}
          <div className="bg-[#121620] border border-zinc-800 rounded-lg overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-white font-mono">
                  Production Master Records ({filteredOrders.length} orders)
                </h3>
                <span className="text-[11px] font-mono text-zinc-400">
                  Direct RIP & Variable Data Dispatch Queue
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#0e121a] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="py-3.5 px-6">Order ID & Date</th>
                    <th className="py-3.5 px-6">Customer & Company</th>
                    <th className="py-3.5 px-6">Product & Trim</th>
                    <th className="py-3.5 px-6">Pipeline Stage</th>
                    <th className="py-3.5 px-6">Proof Gate</th>
                    <th className="py-3.5 px-6 text-right">Production Files</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                  {filteredOrders.map((order) => {
                    const item = order.items[0];
                    const isUnlocked = item?.productionFilesUnlocked;

                    return (
                      <tr key={order.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-white">
                          <div>{order.orderNumber}</div>
                          <div className="text-[10px] text-zinc-500 font-normal">
                            {new Date(order.createdAt).toLocaleDateString('en-GB')}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="text-zinc-200">{order.customerName}</div>
                          <div className="text-[10px] text-zinc-500">{order.customerCompany || 'Individual'}</div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="text-amber-400 font-bold">{item?.productName}</div>
                          <div className="text-[10px] text-zinc-400">
                            {item?.configuration.widthMm} × {item?.configuration.heightMm} mm · {item?.configuration.quantity} pcs
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] uppercase font-bold">
                            {order.status}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          {isUnlocked ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approved (v{item?.currentProofVersion})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-400 text-[11px]">
                              <Lock className="w-3.5 h-3.5" />
                              Awaiting Proof
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-right space-x-2">
                          {/* 300 DPI PDF Download */}
                          <button
                            onClick={() => handleDownloadProductionPdf(order, item)}
                            disabled={isGeneratingPdf === item?.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono uppercase tracking-wider border border-zinc-700 transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-400" />
                            <span>PDF (300 DPI)</span>
                          </button>

                          {/* Variable CSV Merge runner if supported */}
                          {item?.divisionSlug === 'race-event-numbers' && (
                            <button
                              onClick={() => handleDownloadCsvBatch(order, item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-mono uppercase tracking-wider transition-colors cursor-pointer shadow"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>Run CSV Batch</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
