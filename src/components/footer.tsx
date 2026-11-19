import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#090d13] border-t border-[#1c2128] text-zinc-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center font-black text-black text-xs">
                DH
              </div>
              <span className="font-bold text-white uppercase tracking-wider text-sm">
                Digital Heroes
              </span>
            </div>
            <p className="text-zinc-500 leading-relaxed mb-4">
              Transactional web-to-print manufacturing platform. Six specialized divisions under one roof, running from real-time dynamic pricing to 300 DPI automated factory dispatch.
            </p>
            <div className="font-mono text-[11px] text-zinc-500">
              PRD Edition 2026 · Level 2 Specification
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-zinc-200 mb-3 text-[11px]">
              Print Divisions
            </h4>
            <ul className="space-y-2">
              <li><Link href="/configure/labels-stickers" className="hover:text-amber-400 transition-colors">Labels & Stickers</Link></li>
              <li><Link href="/configure/race-event-numbers" className="hover:text-amber-400 transition-colors">Race & Event Numbers</Link></li>
              <li><Link href="/configure/mtb-boards" className="hover:text-amber-400 transition-colors">MTB Boards</Link></li>
              <li><Link href="/configure/stamps" className="hover:text-amber-400 transition-colors">Stamps</Link></li>
              <li><Link href="/configure/trophies" className="hover:text-amber-400 transition-colors">Trophies & Awards</Link></li>
              <li><Link href="/configure/laser-cut" className="hover:text-amber-400 transition-colors">Laser-Cut Work</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-zinc-200 mb-3 text-[11px]">
              Production Systems
            </h4>
            <ul className="space-y-2">
              <li><Link href="/admin/pipeline" className="hover:text-amber-400 transition-colors">Internal Pipeline (Kanban)</Link></li>
              <li><Link href="/#calculator" className="hover:text-amber-400 transition-colors">Instant Sizing Calculator</Link></li>
              <li><Link href="/dashboard" className="hover:text-amber-400 transition-colors">Proof Approval Gate</Link></li>
              <li><a href="/api/orders/export-xero" className="hover:text-amber-400 transition-colors">Xero Accounting Export</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-zinc-200 mb-3 text-[11px]">
              Compliance & Verification
            </h4>
            <div className="bg-[#12161f] p-3.5 rounded border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-zinc-500">Server Status:</span>
                <span className="text-emerald-400 font-semibold">Online (Vercel)</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-zinc-500">Bleed Standard:</span>
                <span className="text-zinc-300">3mm Trim / 300 DPI</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-zinc-500">Evaluation:</span>
                <span className="text-amber-400">Strict 2-Day Brief</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-zinc-500">
              Inquiries: <span className="text-zinc-300 font-mono">hr@digitalheroes.co.in</span>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-[11px]">
          <div>
            © 2026 DIGITAL HEROES · digitalheroes.co.in · All Rights Reserved.
          </div>
          <div className="flex gap-6 mt-3 sm:mt-0 font-mono">
            <span>Server-side PDF Engine</span>
            <span>CSV Variable Merge</span>
            <span>Proof Gate Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
