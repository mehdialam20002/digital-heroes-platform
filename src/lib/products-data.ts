import { ProductDivision } from '@/types';

export const PRODUCT_DIVISIONS: ProductDivision[] = [
  {
    id: 'div-1',
    slug: 'labels-stickers',
    name: 'Labels & Stickers',
    tagline: 'High-tack vinyls, laminations & custom die-cut contours',
    description:
      'Industrial-grade vinyl stickers and product packaging labels. Resistant to moisture, UV, and chemicals, precision cut to any custom contour.',
    imageUrl: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80',
    minWidthMm: 20,
    maxWidthMm: 500,
    minHeightMm: 20,
    maxHeightMm: 500,
    defaultWidthMm: 75,
    defaultHeightMm: 75,
    basePrice: 0.15, // Base cost per standard unit
    bleedMm: 3,
    safeMarginMm: 3,
    supportsCsvMerge: false,
    sampleSpecs: ['Heavy Duty 100μ Vinyl', 'Gloss or Matte Lamination', 'Permanent Acrylic Adhesive', 'Water & UV Proof'],
    materials: [
      {
        id: 'mat-gloss-vinyl',
        name: 'Gloss White Vinyl (Outdoor 5-Yr)',
        baseCost: 0.05,
        pricePerSqMm: 0.00003,
        description: 'Vibrant colors with high-gloss protective sheen.'
      },
      {
        id: 'mat-matte-vinyl',
        name: 'Matte White Vinyl (Anti-Glare)',
        baseCost: 0.06,
        pricePerSqMm: 0.000035,
        description: 'Silky smooth non-reflective premium finish.'
      },
      {
        id: 'mat-clear-vinyl',
        name: 'Ultra-Clear Polypropylene',
        baseCost: 0.08,
        pricePerSqMm: 0.000045,
        description: 'Transparent film with white-under-ink backing capability.'
      },
      {
        id: 'mat-kraft-paper',
        name: 'Recycled Kraft Paper (Artisan)',
        baseCost: 0.04,
        pricePerSqMm: 0.000025,
        description: 'Eco-friendly textured brown rustic aesthetic.'
      }
    ],
    volumeDiscounts: [
      { minQty: 50, discountPercentage: 10 },
      { minQty: 100, discountPercentage: 20 },
      { minQty: 250, discountPercentage: 35 },
      { minQty: 500, discountPercentage: 45 },
      { minQty: 1000, discountPercentage: 55 },
      { minQty: 2500, discountPercentage: 65 }
    ]
  },
  {
    id: 'div-2',
    slug: 'race-event-numbers',
    name: 'Race & Event Numbers',
    tagline: 'Tear-proof Tyvek bibs with automated variable data & barcode merge',
    description:
      'Ultra-durable, waterproof race numbers for marathons, triathlons, and cycling events. Fully integrated with batch variable data printing for athlete names and bib numbers.',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
    minWidthMm: 148,
    maxWidthMm: 297,
    minHeightMm: 105,
    maxHeightMm: 210,
    defaultWidthMm: 210,
    defaultHeightMm: 148, // A5 standard
    basePrice: 0.45,
    bleedMm: 3,
    safeMarginMm: 5,
    supportsCsvMerge: true,
    sampleSpecs: ['Waterproof Tyvek 75gsm', 'Pre-punched 4-Corner Pin Holes', 'Tear & Sweat Resistant', 'CSV Variable Data'],
    materials: [
      {
        id: 'mat-tyvek-standard',
        name: 'Tyvek Standard 54gsm',
        baseCost: 0.1,
        pricePerSqMm: 0.00002,
        description: 'Lightweight, virtually untearable athletic standard.'
      },
      {
        id: 'mat-tyvek-heavy',
        name: 'Tyvek Pro Heavy 75gsm',
        baseCost: 0.2,
        pricePerSqMm: 0.00003,
        description: 'Heavy duty for ultra-marathons, OCR and harsh conditions.'
      },
      {
        id: 'mat-synthetic-paper',
        name: 'Synthetic Polyart 110gsm',
        baseCost: 0.25,
        pricePerSqMm: 0.00004,
        description: 'Ultra-bright white finish with laser-sharp photographic reproduction.'
      }
    ],
    volumeDiscounts: [
      { minQty: 100, discountPercentage: 15 },
      { minQty: 300, discountPercentage: 25 },
      { minQty: 500, discountPercentage: 38 },
      { minQty: 1000, discountPercentage: 50 },
      { minQty: 3000, discountPercentage: 60 }
    ]
  },
  {
    id: 'div-3',
    slug: 'mtb-boards',
    name: 'MTB Boards',
    tagline: 'Impact-resistant flexible polypropylene bike plates with zip-tie slots',
    description:
      'Custom shaped front handlebar number plates for Downhill, Enduro, and Cross-Country MTB racing. Pre-slotted for secure zip-tie mounting.',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    minWidthMm: 160,
    maxWidthMm: 240,
    minHeightMm: 140,
    maxHeightMm: 220,
    defaultWidthMm: 200,
    defaultHeightMm: 175,
    basePrice: 2.2,
    bleedMm: 3,
    safeMarginMm: 6,
    supportsCsvMerge: true,
    sampleSpecs: ['0.8mm Solid Polypropylene', 'UV Direct Subsurface Print', 'Die-Cut Zip-Tie Slots', 'Shatter-Proof in Sub-Zero'],
    materials: [
      {
        id: 'mat-pp-08mm',
        name: 'Rigid Polypropylene 0.8mm',
        baseCost: 0.6,
        pricePerSqMm: 0.00005,
        description: 'Industry benchmark for impact strength and flexibility.'
      },
      {
        id: 'mat-pp-12mm',
        name: 'Heavy Duty Polypropylene 1.2mm',
        baseCost: 0.95,
        pricePerSqMm: 0.00007,
        description: 'Stiff downhill racing board for high-speed aerodynamics.'
      }
    ],
    volumeDiscounts: [
      { minQty: 25, discountPercentage: 10 },
      { minQty: 50, discountPercentage: 20 },
      { minQty: 100, discountPercentage: 35 },
      { minQty: 250, discountPercentage: 45 },
      { minQty: 500, discountPercentage: 55 }
    ]
  },
  {
    id: 'div-4',
    slug: 'stamps',
    name: 'Stamps',
    tagline: 'Laser-engraved vulcanized rubber & heavy-duty self-inking mounts',
    description:
      'High-precision business, address, and monogram stamps. Engineered using odorless vulcanized rubber for razor-sharp impressions down to 0.1mm detail.',
    imageUrl: 'https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?auto=format&fit=crop&w=800&q=80',
    minWidthMm: 25,
    maxWidthMm: 120,
    minHeightMm: 10,
    maxHeightMm: 90,
    defaultWidthMm: 58,
    defaultHeightMm: 22,
    basePrice: 12.0,
    bleedMm: 0,
    safeMarginMm: 2,
    supportsCsvMerge: false,
    sampleSpecs: ['Laser-Etched Rubber Die', 'Trodat / Colop Mounts', '10,000+ Clean Impressions', 'Re-inkable Cartridge'],
    materials: [
      {
        id: 'mat-self-inking-black',
        name: 'Self-Inking Mount (Black Ink)',
        baseCost: 4.5,
        pricePerSqMm: 0.0005,
        description: 'Integrated ink cartridge with spring action.'
      },
      {
        id: 'mat-self-inking-blue',
        name: 'Self-Inking Mount (Blue Ink)',
        baseCost: 4.5,
        pricePerSqMm: 0.0005,
        description: 'Official corporate document blue ink.'
      },
      {
        id: 'mat-wood-handle',
        name: 'Traditional Beech Wood Handle',
        baseCost: 3.0,
        pricePerSqMm: 0.0003,
        description: 'Artisan handcrafted wooden mount for manual stamp pads.'
      }
    ],
    volumeDiscounts: [
      { minQty: 3, discountPercentage: 10 },
      { minQty: 5, discountPercentage: 18 },
      { minQty: 10, discountPercentage: 28 },
      { minQty: 25, discountPercentage: 40 }
    ]
  },
  {
    id: 'div-5',
    slug: 'trophies',
    name: 'Trophies',
    tagline: 'Custom laser-cut acrylic plaques, timber blocks & precision engraved awards',
    description:
      'Corporate recognition awards, championship plaques, and bespoke presentation trophies. Full color UV printing backed with precision laser engraving.',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    minWidthMm: 80,
    maxWidthMm: 300,
    minHeightMm: 100,
    maxHeightMm: 400,
    defaultWidthMm: 150,
    defaultHeightMm: 200,
    basePrice: 18.0,
    bleedMm: 2,
    safeMarginMm: 8,
    supportsCsvMerge: true,
    sampleSpecs: ['10mm Cast Optical Acrylic', 'Solid Walnut Wood Base', 'Metallic Engraving Plate', 'Presentation Box Included'],
    materials: [
      {
        id: 'mat-clear-acrylic-10mm',
        name: 'Optical Cast Acrylic 10mm',
        baseCost: 8.0,
        pricePerSqMm: 0.0004,
        description: 'Crystal-clear diamond polished flame edges.'
      },
      {
        id: 'mat-solid-walnut',
        name: 'Solid Walnut Wood & Brass Plate',
        baseCost: 12.0,
        pricePerSqMm: 0.0006,
        description: 'Sustainably sourced dark American walnut.'
      },
      {
        id: 'mat-brushed-aluminum',
        name: 'Brushed Gold/Silver Composite',
        baseCost: 6.5,
        pricePerSqMm: 0.00035,
        description: 'Contemporary metallic face with dark substrate.'
      }
    ],
    volumeDiscounts: [
      { minQty: 5, discountPercentage: 10 },
      { minQty: 10, discountPercentage: 20 },
      { minQty: 25, discountPercentage: 32 },
      { minQty: 50, discountPercentage: 45 }
    ]
  },
  {
    id: 'div-6',
    slug: 'laser-cut',
    name: 'Laser-Cut Work',
    tagline: 'Precision 0.01mm kerf vector cutting & raster engraving in ply, acrylic & MDF',
    description:
      'Architectural models, signage, mechanical prototypes, and retail display components. Upload DXF/SVG or customize templates directly.',
    imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
    minWidthMm: 50,
    maxWidthMm: 900,
    minHeightMm: 50,
    maxHeightMm: 600,
    defaultWidthMm: 300,
    defaultHeightMm: 200,
    basePrice: 8.5,
    bleedMm: 0,
    safeMarginMm: 4,
    supportsCsvMerge: false,
    sampleSpecs: ['0.02mm Laser Tolerance', 'Vector Cut & Raster Engrave', 'Polished Acrylic / Clean Wood Edge', 'Sheets up to 900x600mm'],
    materials: [
      {
        id: 'mat-birch-ply-3mm',
        name: 'Aircraft Grade Birch Plywood 3mm',
        baseCost: 3.5,
        pricePerSqMm: 0.00008,
        description: 'High-density multi-ply with knot-free face.'
      },
      {
        id: 'mat-birch-ply-6mm',
        name: 'Aircraft Grade Birch Plywood 6mm',
        baseCost: 5.5,
        pricePerSqMm: 0.00012,
        description: 'Structural wood for heavy brackets and furniture items.'
      },
      {
        id: 'mat-acrylic-cast-3mm',
        name: 'Cast Acrylic Gloss 3mm (Colors)',
        baseCost: 5.0,
        pricePerSqMm: 0.00011,
        description: 'Flame polished vector edge in black, white, or clear.'
      },
      {
        id: 'mat-premium-mdf-4mm',
        name: 'Medite Premier MDF 4mm',
        baseCost: 2.2,
        pricePerSqMm: 0.00006,
        description: 'Smooth, consistent texture ideal for spray painting.'
      }
    ],
    volumeDiscounts: [
      { minQty: 10, discountPercentage: 12 },
      { minQty: 25, discountPercentage: 22 },
      { minQty: 50, discountPercentage: 35 },
      { minQty: 100, discountPercentage: 48 }
    ]
  }
];

export function getDivisionBySlug(slug: string): ProductDivision | undefined {
  return PRODUCT_DIVISIONS.find((div) => div.slug === slug);
}
