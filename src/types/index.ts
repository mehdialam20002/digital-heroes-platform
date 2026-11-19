export type DivisionSlug =
  | 'labels-stickers'
  | 'race-event-numbers'
  | 'mtb-boards'
  | 'stamps'
  | 'trophies'
  | 'laser-cut';

export interface ProductMaterial {
  id: string;
  name: string;
  pricePerSqMm?: number;
  baseCost: number;
  description: string;
}

export interface VolumeDiscountTier {
  minQty: number;
  discountPercentage: number;
}

export interface ProductDivision {
  id: string;
  slug: DivisionSlug;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  minWidthMm: number;
  maxWidthMm: number;
  minHeightMm: number;
  maxHeightMm: number;
  defaultWidthMm: number;
  defaultHeightMm: number;
  basePrice: number;
  materials: ProductMaterial[];
  volumeDiscounts: VolumeDiscountTier[];
  bleedMm: number;
  safeMarginMm: number;
  supportsCsvMerge?: boolean;
  sampleSpecs: string[];
}

export interface ProductConfiguration {
  divisionSlug: DivisionSlug;
  widthMm: number;
  heightMm: number;
  materialId: string;
  quantity: number;
  orientation: 'horizontal' | 'vertical' | 'square';
  customOptions?: Record<string, any>;
}

export interface PricingBreakdown {
  unitPrice: number;
  basePrice: number;
  materialSurcharge: number;
  sizeMultiplier: number;
  volumeDiscountPct: number;
  subtotal: number;
  vatAmount: number; // 20% standard VAT
  total: number;
}

export type OrderStatus =
  | 'quote'
  | 'order'
  | 'artwork'
  | 'proof'
  | 'production'
  | 'completed';

export type ProofStatus = 'pending' | 'approved' | 'changes_requested';

export interface ProofRecord {
  id: string;
  orderItemId: string;
  version: number;
  previewUrl: string;
  status: ProofStatus;
  feedbackNotes?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'variable-placeholder';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  // Text properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  shrinkToFit?: boolean;
  // Image properties
  imageUrl?: string;
  // Shape properties
  shapeType?: 'rectangle' | 'circle' | 'line';
  stroke?: string;
  strokeWidth?: number;
  // Variable binding for CSV
  variableColumn?: string;
}

export interface CanvasDesignState {
  widthMm: number;
  heightMm: number;
  bleedMm: number;
  safeMarginMm: number;
  backgroundColor: string;
  elements: CanvasElement[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  divisionSlug: DivisionSlug;
  productName: string;
  configuration: ProductConfiguration;
  pricing: PricingBreakdown;
  designState?: CanvasDesignState;
  uploadedFileUrl?: string;
  proofs: ProofRecord[];
  currentProofVersion: number;
  isProofApproved: boolean;
  productionFilesUnlocked: boolean;
  csvMergeData?: {
    totalRows: number;
    rows: Record<string, string>[];
    mergedPdfUrl?: string;
    mergedZipUrl?: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'customer' | 'admin';
  company?: string;
  createdAt: string;
}
