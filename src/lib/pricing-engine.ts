import { ProductDivision, ProductConfiguration, PricingBreakdown } from '@/types';
import { getDivisionBySlug } from './products-data';

export const VAT_RATE = 0.2; // 20% UK / Standard VAT

export function calculatePricing(config: ProductConfiguration): PricingBreakdown {
  const division = getDivisionBySlug(config.divisionSlug);

  if (!division) {
    throw new Error(`Division not found: ${config.divisionSlug}`);
  }

  const { widthMm, heightMm, materialId, quantity } = config;

  // Selected material
  const material =
    division.materials.find((m) => m.id === materialId) || division.materials[0];

  // Base unit cost from division
  const baseCost = division.basePrice;

  // Area in square millimeters
  const areaSqMm = Math.max(1, widthMm * heightMm);
  const defaultArea = Math.max(1, division.defaultWidthMm * division.defaultHeightMm);

  // Area ratio vs default size
  const areaRatio = Math.sqrt(areaSqMm / defaultArea);

  // Material cost
  const materialBaseCost = material.baseCost;
  const materialAreaCost = (material.pricePerSqMm || 0.00003) * areaSqMm;
  const totalMaterialUnit = materialBaseCost + materialAreaCost;

  // Raw unit price before volume discount
  const rawUnitPrice = (baseCost * areaRatio) + totalMaterialUnit;

  // Determine volume discount tier
  let discountPct = 0;
  // Sort descending by minQty to find highest matching threshold
  const sortedTiers = [...division.volumeDiscounts].sort(
    (a, b) => b.minQty - a.minQty
  );

  for (const tier of sortedTiers) {
    if (quantity >= tier.minQty) {
      discountPct = tier.discountPercentage;
      break;
    }
  }

  // Discounted unit price (rounded to 2 decimal places, minimum £0.05)
  const discountedUnitPrice = Math.max(
    0.05,
    Number((rawUnitPrice * (1 - discountPct / 100)).toFixed(2))
  );

  const subtotal = Number((discountedUnitPrice * quantity).toFixed(2));
  const vatAmount = Number((subtotal * VAT_RATE).toFixed(2));
  const total = Number((subtotal + vatAmount).toFixed(2));

  return {
    unitPrice: discountedUnitPrice,
    basePrice: Number(baseCost.toFixed(2)),
    materialSurcharge: Number(totalMaterialUnit.toFixed(2)),
    sizeMultiplier: Number(areaRatio.toFixed(2)),
    volumeDiscountPct: discountPct,
    subtotal,
    vatAmount,
    total,
  };
}

export function formatCurrency(amount: number, currency: string = '£'): string {
  return `${currency}${amount.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
