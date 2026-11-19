'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Shield, User, ArrowRight, CheckCircle2, ChevronDown, Sliders } from 'lucide-react';
import { DataService } from '@/lib/data-service';
import { UserProfile } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setCurrentUser(DataService.getCurrentUser());
  }, []);

  const handleToggleRole = () => {
    const nextRole = currentUser?.role === 'admin' ? 'customer' : 'admin';
    const updated = DataService.switchUserRole(nextRole);
    setCurrentUser(updated);
    if (nextRole === 'admin') {
      window.location.href = '/admin/pipeline';
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur-md border-b border-[#21262d] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center font-black text-black text-sm tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
            DH
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wider uppercase text-zinc-100 flex items-center gap-1.5">
              Digital Heroes
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono border border-zinc-700">
                PROD-26
              </span>
            </span>
            <span className="text-[11px] text-zinc-400 font-mono tracking-tight">
              Web-to-Print Manufacturing
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium uppercase tracking-wider text-zinc-300">
          <Link
            href="/#divisions"
            className="hover:text-amber-400 transition-colors"
          >
            6 Divisions
          </Link>
          <Link
            href="/#calculator"
            className="hover:text-amber-400 transition-colors"
          >
            Live Calculator
          </Link>
          <Link
            href="/#gallery"
            className="hover:text-amber-400 transition-colors"
          >
            Work Gallery
          </Link>
          <Link
            href="/dashboard"
            className={`hover:text-amber-400 transition-colors ${
              pathname.includes('/dashboard') ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Customer Portal
          </Link>
          <Link
            href="/admin/pipeline"
            className={`hover:text-amber-400 transition-colors flex items-center gap-1.5 ${
              pathname.includes('/admin') ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Admin Pipeline
          </Link>
        </nav>

        {/* Right side controls: Role switcher & Quick CTAs */}
        <div className="flex items-center gap-3">
          {/* Role Switcher Pill for Evaluation */}
          <button
            onClick={handleToggleRole}
            title="Switch between Customer & Admin roles for evaluation"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 hover:border-amber-500/50 text-xs font-mono text-zinc-300 transition-all cursor-pointer"
          >
            <span className="text-[10px] uppercase text-zinc-400">Role:</span>
            <span className={`font-semibold ${currentUser?.role === 'admin' ? 'text-amber-400' : 'text-emerald-400'}`}>
              {currentUser?.role === 'admin' ? 'Administrator' : 'Customer'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <Link
            href="/configure/race-event-numbers"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <span>Instant Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
