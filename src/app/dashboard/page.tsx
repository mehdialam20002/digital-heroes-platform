'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { DataService } from '@/lib/data-service';
import { Order, OrderItem, UserProfile } from '@/types';
import { formatCurrency } from '@/lib/pricing-engine';
import {
  Package,
  Clock,
  RotateCw,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function CustomerDashboard() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProofItem, setSelectedProofItem] = useState<{
    orderId: string;
    item: OrderItem;
  } | null>(null);
  const [changeNotes, setChangeNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'proofs' | 'saved'>('orders');

  useEffect(() => {
    const user = DataService.getCurrentUser();
    setCurrentUser(user);
    loadOrders(user.email);
  }, []);

  const loadOrders = async (email: string) => {
    const customerOrders = await DataService.getOrdersByCustomer(email);
    setOrders(customerOrders);
  };

  const handleApproveProof = async (orderId: string, orderItemId: string, version: number) => {
    await DataService.approveProof(orderId, orderItemId, version);
    if (currentUser) loadOrders(currentUser.email);
    setSelectedProofItem(null);
  };

  const handleRequestChanges = async (orderId: string, orderItemId: string, version: number) => {
    if (!changeNotes) return;
    await DataService.requestProofChanges(orderId, orderItemId, version, changeNotes);
    if (currentUser) loadOrders(currentUser.email);
    setChangeNotes('');
    setSelectedProofItem(null);
  };

  // One-Click Reorder (PRD Section 09)
  const handleOneClickReorder = async (pastItem: OrderItem) => {
    const query = new URLSearchParams({
      slug: pastItem.divisionSlug,
      w: pastItem.configuration.widthMm.toString(),
      h: pastItem.configuration.heightMm.toString(),
      m: pastItem.configuration.materialId,
      q: pastItem.configuration.quantity.toString(),
      reorder: 'true',
    }).toString();

    window.location.href = `/checkout?${query}`;
  };

  const pendingProofs = orders.flatMap((o) =>
    o.items
      .filter((it) => !it.isProofApproved)
      .map((it) => ({ orderId: o.id, orderNumber: o.orderNumber, item: it }))
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header with Account Status */}
          <div className="bg-[#121620] border border-zinc-800 rounded-xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-amber-400 uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Customer Portal · Verified Account</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                {currentUser?.fullName || 'Alex Mercer'}
              </h1>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                {currentUser?.email} · {currentUser?.company || 'Peak Sports Events'}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 font-mono text-xs">
              <div className="bg-zinc-900/80 px-4 py-3 rounded border border-zinc-800">
                <span className="text-zinc-500 uppercase block text-[10px]">Total Orders</span>
                <span className="text-lg font-bold text-white">{orders.length}</span>
              </div>
              <div className="bg-zinc-900/80 px-4 py-3 rounded border border-zinc-800">
                <span className="text-zinc-500 uppercase block text-[10px]">Awaiting Proof</span>
                <span className="text-lg font-bold text-amber-400">{pendingProofs.length}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-800 mb-6 font-mono text-xs uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-6 border-b-2 font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              Order History & Tracking ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('proofs')}
              className={`py-3 px-6 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'proofs'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <span>Active Proofs</span>
              {pendingProofs.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] flex items-center justify-center font-bold">
                  {pendingProofs.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-3 px-6 border-b-2 font-bold transition-all cursor-pointer ${
                activeTab === 'saved'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              Saved Artwork & 1-Click Reorder
            </button>
          </div>

          {/* Tab 1: Orders History */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-[#121620] border border-zinc-800 rounded-lg p-12 text-center font-mono text-xs text-zinc-400">
                  No orders found. Configure your first product to start.
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#121620] border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 mb-4 gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-bold text-white">
                            {order.orderNumber}
                          </span>
                          {/* Status Badge */}
                          <span
                            className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded font-bold border ${
                              order.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : order.status === 'production'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            }`}
                          >
                            Stage: {order.status}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-500 mt-1 block">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-GB')}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 font-mono text-xs">
                        <div className="text-right">
                          <span className="text-zinc-500 uppercase text-[10px] block">Total Amount</span>
                          <span className="text-white font-bold">{formatCurrency(order.total)}</span>
                        </div>
                        {/* Download Invoice Button */}
                        <a
                          href="/api/orders/export-xero"
                          className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5 border border-zinc-700 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </a>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-zinc-900/60 rounded p-4 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <h4 className="font-bold text-sm text-white uppercase tracking-tight">
                              {item.productName}
                            </h4>
                            <div className="text-xs font-mono text-zinc-400 mt-1">
                              Dimensions: {item.configuration.widthMm} × {item.configuration.heightMm} mm · {item.configuration.quantity} pcs
                            </div>
                            <div className="flex items-center gap-2 mt-2 font-mono text-[11px]">
                              <span className="text-zinc-500">Proof State:</span>
                              <span className={item.isProofApproved ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                                {item.isProofApproved ? 'Approved (Signed Off)' : 'Pending Approval'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* 1-Click Reorder Button (PRD requirement) */}
                            <button
                              onClick={() => handleOneClickReorder(item)}
                              className="px-3.5 py-2 rounded bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-mono text-xs uppercase font-bold border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                              <span>1-Click Reorder</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Active Proofs Approval Gate */}
          {activeTab === 'proofs' && (
            <div className="space-y-6">
              {pendingProofs.length === 0 ? (
                <div className="bg-[#121620] border border-zinc-800 rounded-lg p-12 text-center font-mono text-xs text-zinc-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  All active proofs have been approved! Your orders are moving through production.
                </div>
              ) : (
                pendingProofs.map(({ orderId, orderNumber, item }) => (
                  <div
                    key={item.id}
                    className="bg-[#121620] border border-amber-500/40 rounded-lg p-6 shadow-xl"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                      <div>
                        <span className="font-mono text-[10px] text-amber-400 uppercase font-bold">
                          Approval Gate Action Required
                        </span>
                        <h3 className="text-lg font-bold text-white uppercase mt-0.5">
                          {item.productName} · {orderNumber}
                        </h3>
                      </div>
                      <span className="font-mono text-xs px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Version v{item.currentProofVersion}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="bg-zinc-950 p-4 rounded border border-zinc-800 flex items-center justify-center min-h-[160px]">
                        <img
                          src="https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=600&q=80"
                          alt="Proof Preview"
                          className="max-h-40 rounded object-contain border border-zinc-700 shadow"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="bg-zinc-900 p-3 rounded text-xs font-mono text-zinc-300 space-y-1">
                          <div>Trim Size: {item.configuration.widthMm} × {item.configuration.heightMm} mm</div>
                          <div>Substrate: {item.configuration.materialId}</div>
                          <div>Resolution: 300 DPI Pre-Flight OK</div>
                        </div>

                        {/* Customer Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() =>
                              handleApproveProof(orderId, item.id, item.currentProofVersion)
                            }
                            className="w-full py-2.5 px-4 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve Proof & Unlock Production</span>
                          </button>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Feedback / changes request..."
                              value={changeNotes}
                              onChange={(e) => setChangeNotes(e.target.value)}
                              className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                            />
                            <button
                              onClick={() =>
                                handleRequestChanges(orderId, item.id, item.currentProofVersion)
                              }
                              className="py-1.5 px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs uppercase border border-zinc-700 cursor-pointer"
                            >
                              Request Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Saved Designs & 1-Click Reorder */}
          {activeTab === 'saved' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.flatMap((o) => o.items).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#121620] border border-zinc-800 rounded-lg p-5 flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] text-amber-400 uppercase">
                      {item.divisionSlug}
                    </span>
                    <h4 className="text-base font-bold text-white uppercase mt-1">
                      {item.productName}
                    </h4>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      {item.configuration.widthMm} × {item.configuration.heightMm} mm · {item.configuration.quantity} units
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white">
                      {formatCurrency(item.pricing.total)}
                    </span>
                    <button
                      onClick={() => handleOneClickReorder(item)}
                      className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
