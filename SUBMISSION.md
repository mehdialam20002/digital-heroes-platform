# Digital Heroes Web-to-Print Platform — Submission Report

**Issued for Trainee Selection Assignment (PRD Level 2 Edition 2026)**  
**Applicant:** Mehdi Alam (`mehdialam20002@gmail.com`)  
**Target Organization:** Digital Heroes (`digitalheroes.co.in` / `hr@digitalheroes.co.in`)  

---

## 🚀 Live Deployment & Deliverables Summary (PRD Section 15)

| Deliverable | Details & Links |
| :--- | :--- |
| **Live Production Website** | [https://digital-heroes-platform-zeta.vercel.app/](https://digital-heroes-platform-zeta.vercel.app/) |
| **Source Code Repository** | [https://github.com/mehdialam20002/digital-heroes-platform](https://github.com/mehdialam20002/digital-heroes-platform) |
| **Vercel Project Dashboard** | [https://vercel.com/mehdis-projects-045a0ad9/digital-heroes-platform](https://vercel.com/mehdis-projects-045a0ad9/digital-heroes-platform) |
| **Supabase Database Project** | `digital-heroes` (`jhcafccgjjujmuzqfxge`) |
| **Supabase Project URL** | `https://jhcafccgjjujmuzqfxge.supabase.co` |

---

## 👥 User Roles & Test Credentials (PRD Section 03 & 15)

The platform features an instant **Role Switcher** pill in the top navigation bar to seamlessly test both user journeys:

### 1. Customer Portal Journey (`Customer Role`)
* **Test Customer:** Alex Mercer (`alex@peaksports.co.uk`)
* **Organization:** Peak Sports Events
* **Access URL:** [https://digital-heroes-platform-zeta.vercel.app/dashboard](https://digital-heroes-platform-zeta.vercel.app/dashboard)
* **Capabilities Verified:**
  * Configure products with dynamic finished dimensions and substrate materials.
  * In-Browser Canvas Designer with print boundary constraints (Bleed, Trim, Safe Zone).
  * Proof generation and review (`v1`, `v2`).
  * Strict **Proof Approval Gate**: Customers can approve proofs or request changes with notes.
  * Order history with stage status.
  * **1-Click Reorder**: Re-order past jobs with identical artwork without re-configuring.
  * Downloadable invoices and receipts.

### 2. Administrator Production Journey (`Admin Role`)
* **Test Administrator:** Production Master (`production@digitalheroes.co.uk`)
* **Organization:** Digital Heroes Manufacturing Plant
* **Access URL:** [https://digital-heroes-platform-zeta.vercel.app/admin/pipeline](https://digital-heroes-platform-zeta.vercel.app/admin/pipeline)
* **Capabilities Verified:**
  * Full Kanban Pipeline: `Quote` → `Order` → `Artwork` → `Proof` → `Production` → `Completed`.
  * Search and filter jobs by status, customer, and product family.
  * **Ready-for-Production Indicators**: Locks RIP files until customer proof sign-off.
  * **1-Click 300 DPI PDF Generation**: Real server-side PDF with bleed, slug, and industrial crop marks.
  * **Variable-Data CSV Merge Engine**: Generates individualized bib cards from athlete spreadsheets for race events.
  * **Accounting-Ready**: Instant export of sales invoices to Xero-compliant CSV (`/api/orders/export-xero`).
  * Live revenue and product throughput analytics.

---

## 🏷️ The Six Print Divisions (PRD Section 04)

1. **Labels & Stickers:** Heavy-duty vinyls (Gloss, Matte, Clear, Kraft), custom contour die-cutting, dynamic surface area pricing.
2. **Race & Event Numbers:** Waterproof Tyvek 54/75gsm, 4-corner pin holes, automated CSV variable data merge.
3. **MTB Boards:** Flexible 0.8mm & 1.2mm Polypropylene, pre-punched cable-tie slots, high-impact racing boards.
4. **Stamps:** Vulcanized odorless rubber dies, Trodat/Colop self-inking and wooden mounts, 10,000+ clean impressions.
5. **Trophies & Plaques:** 10mm Optical cast acrylic, solid walnut bases, text placeholder shrink-to-fit typography.
6. **Laser-Cut Work:** Aircraft grade birch ply, cast acrylic, Medite MDF with precision 0.02mm kerf vector cutting.

---

## ✅ Evaluation & Testing Checklist (PRD Section 16)

- [x] **Signup & Login:** Multi-role profile state and role switcher.
- [x] **Product Configuration & Live Pricing:** Real-time continuous dimensional calculations without static SKU bloat.
- [x] **Volume-Discount Calculation:** Automatic discount floors (10%, 20%, 35%, 50%, etc.) calculated live.
- [x] **Designer — Print-Area Constraints:** Bleed guides (+3mm), Trim cut lines, and inner Safe Zones (-5mm).
- [x] **Proof Versioning & Approval Gate:** Versioned proofs (`v1`, `v2`), customer sign-off unlocks production status.
- [x] **Print-File & CSV Merge Output:** High-resolution server-side PDF generator (`pdf-lib`) and CSV variable data batch generator.
- [x] **Reorder Flow:** 1-Click reorder button in customer dashboard.
- [x] **Admin Pipeline & File Download:** 6-stage pipeline Kanban board with live status updates and one-click downloads.
- [x] **Responsive on Mobile & Desktop:** Built with Tailwind CSS, dark boutique-industrial aesthetic, mobile-friendly navigation.
- [x] **Error Handling & Edge Cases:** Fallback data layer, sanitized numeric ranges, strict type checking.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
* **Icons & Components:** Lucide React, Radix UI primitives
* **Backend & DB:** Supabase PostgreSQL with documented migrations & RLS policies
* **Print Engine:** Server-side PDFKit / `pdf-lib` (300 DPI, bleed margins, crop marks, slug)
* **Variable-Data Engine:** `papaparse` CSV parser + automated batch compositor
* **Deployment:** Vercel (CI/CD connected to GitHub `main` branch)
