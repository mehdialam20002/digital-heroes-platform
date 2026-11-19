'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { PRODUCT_DIVISIONS, getDivisionBySlug } from '@/lib/products-data';
import { calculatePricing, formatCurrency } from '@/lib/pricing-engine';
import { DataService } from '@/lib/data-service';
import { DivisionSlug, OrderItem } from '@/types';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Truck,
  Building,
  Mail,
  User,
  MapPin,
  FileCheck
} from 'lucide-react';



function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const slug = (searchParams.get('slug') as DivisionSlug) || 'race-event-numbers';
  const division = getDivisionBySlug(slug) || PRODUCT_DIVISIONS[0];

  const widthMm = Number(searchParams.get('w')) || division.defaultWidthMm;
  const heightMm = Number(searchParams.get('h')) || division.defaultHeightMm;
  const materialId = searchParams.get('m') || division.materials[0]?.id;
  const quantity = Number(searchParams.get('q')) || 100;
  const proofParam = searchParams.get('proof') || 'v1';

  const [fullName, setFullName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex@peaksports.co.uk');
  const [company, setCompany] = useState('Peak Sports Events');
  const [street, setStreet] = useState('14 Skyline Way');
  const [city, setCity] = useState('Sheffield');
  const [postalCode, setPostalCode] = useState('S1 2EF');
  const [country, setCountry] = useState('United Kingdom');

  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('921');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create new Order Item
      const item: OrderItem = {
        id: `item-${Date.now()}`,
        orderId: '',
        divisionSlug: division.slug,
        productName: division.name,
        configuration: {
          divisionSlug: division.slug,
          widthMm,
          heightMm,
          materialId,
          quantity,
          orientation: widthMm >= heightMm ? 'horizontal' : 'vertical',
        },
        pricing,
        currentProofVersion: parseInt(proofParam.replace('v', '')) || 1,
        isProofApproved: true, // Signed-off at checkout
        productionFilesUnlocked: true,
        proofs: [
          {
            id: `prf-${Date.now()}`,
            orderItemId: '',
            version: parseInt(proofParam.replace('v', '')) || 1,
            previewUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
            status: 'approved',
            createdAt: new Date().toISOString(),
            approvedAt: new Date().toISOString(),
          },
        ],
      };

      const newOrder = await DataService.createOrder({
        customerId: 'cust-1',
        customerName: fullName,
        customerEmail: email,
        customerCompany: company,
        status: 'production', // Ready for production pipeline immediately!
        subtotal: pricing.subtotal,
        vatAmount: pricing.vatAmount,
        total: pricing.total,
        shippingAddress: {
          fullName,
          street,
          city,
          postalCode,
          country,
        },
        items: [item],
      });

      setOrderComplete(newOrder.orderNumber);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#121620] border border-emerald-500/40 rounded-xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Order Logged & Dispatched
              </span>
              <h2 className="text-2xl font-bold uppercase tracking-tight text-white mt-1">
                Payment Confirmed
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-2">
                Order Reference: <span className="text-white font-bold">{orderComplete}</span>
              </p>
            </div>

            <div className="bg-zinc-900/80 p-4 rounded-lg border border-zinc-800 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>Product:</span>
                <span className="text-white">{division.name}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Quantity:</span>
                <span className="text-white">{quantity} units</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Total Paid:</span>
                <span className="text-amber-400 font-bold">{formatCurrency(pricing.total)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Proof Status:</span>
                <span className="text-emerald-400 font-bold">Approved ({proofParam})</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase text-xs tracking-wider transition-all shadow-md cursor-pointer"
              >
                <span>Go to Customer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/admin/pipeline"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs uppercase tracking-wider border border-zinc-700 transition-all cursor-pointer"
              >
                <span>Track in Admin Production Pipeline</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 border-b border-zinc-800 pb-4">
            <span className="font-mono text-xs uppercase text-amber-400 font-bold">
              Transactional Order Capture · Section 05
            </span>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white mt-1">
              Secure Checkout & Production Dispatch
            </h1>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Customer & Shipping info (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Account Info */}
              <div className="bg-[#121620] border border-zinc-800 rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-200 flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>1. Contact & Customer Account</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">
                    Company / Organisation (Optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-[#121620] border border-zinc-800 rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-200 flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>2. Production Dispatch & Delivery Address</span>
                </h3>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Card Simulation (Stripe PCI compliant shape) */}
              <div className="bg-[#121620] border border-zinc-800 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>3. Payment Method (PCI Compliant)</span>
                  </h3>
                  <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    256-bit SSL Encrypted
                  </span>
                </div>

                <div className="p-3 bg-zinc-900 border border-zinc-700 rounded space-y-3 font-mono">
                  <div>
                    <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary (5 cols) */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-[#121620] border border-amber-500/30 rounded-lg p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="font-mono text-xs uppercase text-amber-400 font-bold">
                    Order Summary
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" />
                    Proof {proofParam} Approved
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-zinc-300">
                    <span>{division.name}</span>
                    <span className="text-white font-bold">{quantity} pcs</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Trim Size:</span>
                    <span className="text-white">{widthMm} × {heightMm} mm</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Unit Price:</span>
                    <span className="text-amber-400">{formatCurrency(pricing.unitPrice)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 border-t border-zinc-800 pt-3">
                    <span>Batch Subtotal:</span>
                    <span className="text-white">{formatCurrency(pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Standard VAT (20%):</span>
                    <span className="text-white">{formatCurrency(pricing.vatAmount)}</span>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4 flex justify-between items-baseline font-mono">
                  <div>
                    <span className="text-xs uppercase text-zinc-400 block">Total Due</span>
                    <span className="text-[10px] text-zinc-500">Includes VAT</span>
                  </div>
                  <span className="text-3xl font-bold text-white">
                    {formatCurrency(pricing.total)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold uppercase text-xs tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Processing Payment & Dispatch...</span>
                  ) : (
                    <>
                      <span>Pay & Dispatch to Production</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-zinc-500 font-mono text-center leading-relaxed">
                  Transactional billing only. By placing this order, you authorize Digital Heroes to process high-resolution production output based on your approved proof.
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d1117] text-white p-12 text-center font-mono">
          Loading Checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
