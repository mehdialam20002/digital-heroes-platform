import { Order, OrderItem, ProofRecord, UserProfile, OrderStatus } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_ORDERS_KEY = 'dh_orders_data';
const STORAGE_USER_KEY = 'dh_current_user';

// Initial pre-seeded sample data so the pipeline & dashboards are rich with real data immediately
const INITIAL_SEED_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'DH-2026-1001',
    customerId: 'cust-1',
    customerName: 'Alex Mercer',
    customerEmail: 'alex@peaksports.co.uk',
    customerCompany: 'Peak Sports Events',
    status: 'production',
    subtotal: 382.50,
    vatAmount: 76.50,
    total: 459.00,
    shippingAddress: {
      fullName: 'Alex Mercer',
      street: '14 Skyline Way',
      city: 'Sheffield',
      postalCode: 'S1 2EF',
      country: 'United Kingdom'
    },
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    items: [
      {
        id: 'item-1001-1',
        orderId: 'ord-1001',
        divisionSlug: 'race-event-numbers',
        productName: 'Race & Event Numbers',
        configuration: {
          divisionSlug: 'race-event-numbers',
          widthMm: 210,
          heightMm: 148,
          materialId: 'mat-tyvek-heavy',
          quantity: 450,
          orientation: 'horizontal'
        },
        pricing: {
          unitPrice: 0.85,
          basePrice: 0.45,
          materialSurcharge: 0.20,
          sizeMultiplier: 1.0,
          volumeDiscountPct: 38,
          subtotal: 382.50,
          vatAmount: 76.50,
          total: 459.00
        },
        currentProofVersion: 2,
        isProofApproved: true,
        productionFilesUnlocked: true,
        proofs: [
          {
            id: 'prf-1001-v1',
            orderItemId: 'item-1001-1',
            version: 1,
            previewUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
            status: 'changes_requested',
            feedbackNotes: 'Please increase font size of bib number and shift sponsor logo 5mm up.',
            createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
          },
          {
            id: 'prf-1001-v2',
            orderItemId: 'item-1001-1',
            version: 2,
            previewUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
            status: 'approved',
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            approvedAt: new Date(Date.now() - 2 * 86400000).toISOString()
          }
        ],
        csvMergeData: {
          totalRows: 450,
          rows: [
            { 'Bib Number': '101', 'First Name': 'Sarah', 'Last Name': 'Jenkins', 'Wave': 'Elite A' },
            { 'Bib Number': '102', 'First Name': 'David', 'Last Name': 'Kipchoge', 'Wave': 'Elite A' },
            { 'Bib Number': '103', 'First Name': 'Liam', 'Last Name': 'Walker', 'Wave': 'Open 1' }
          ]
        }
      }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'DH-2026-1002',
    customerId: 'cust-2',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@craftbrew.io',
    customerCompany: 'North Star Brewing',
    status: 'proof',
    subtotal: 185.00,
    vatAmount: 37.00,
    total: 222.00,
    shippingAddress: {
      fullName: 'Elena Rostova',
      street: '8 Mill Wharf',
      city: 'Manchester',
      postalCode: 'M4 4BF',
      country: 'United Kingdom'
    },
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    items: [
      {
        id: 'item-1002-1',
        orderId: 'ord-1002',
        divisionSlug: 'labels-stickers',
        productName: 'Labels & Stickers',
        configuration: {
          divisionSlug: 'labels-stickers',
          widthMm: 80,
          heightMm: 120,
          materialId: 'mat-gloss-vinyl',
          quantity: 500,
          orientation: 'vertical'
        },
        pricing: {
          unitPrice: 0.37,
          basePrice: 0.15,
          materialSurcharge: 0.08,
          sizeMultiplier: 1.3,
          volumeDiscountPct: 45,
          subtotal: 185.00,
          vatAmount: 37.00,
          total: 222.00
        },
        currentProofVersion: 1,
        isProofApproved: false,
        productionFilesUnlocked: false,
        proofs: [
          {
            id: 'prf-1002-v1',
            orderItemId: 'item-1002-1',
            version: 1,
            previewUrl: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80',
            status: 'pending',
            createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
          }
        ]
      }
    ]
  },
  {
    id: 'ord-1003',
    orderNumber: 'DH-2026-1003',
    customerId: 'cust-3',
    customerName: 'Marcus Shaw',
    customerEmail: 'marcus@gravitytrail.co',
    customerCompany: 'Gravity Trails UK',
    status: 'artwork',
    subtotal: 440.00,
    vatAmount: 88.00,
    total: 528.00,
    shippingAddress: {
      fullName: 'Marcus Shaw',
      street: '72 Downhill Pass',
      city: 'Fort William',
      postalCode: 'PH33 6SW',
      country: 'United Kingdom'
    },
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    items: [
      {
        id: 'item-1003-1',
        orderId: 'ord-1003',
        divisionSlug: 'mtb-boards',
        productName: 'MTB Boards',
        configuration: {
          divisionSlug: 'mtb-boards',
          widthMm: 200,
          heightMm: 175,
          materialId: 'mat-pp-08mm',
          quantity: 200,
          orientation: 'horizontal'
        },
        pricing: {
          unitPrice: 2.20,
          basePrice: 2.20,
          materialSurcharge: 0.60,
          sizeMultiplier: 1.0,
          volumeDiscountPct: 35,
          subtotal: 440.00,
          vatAmount: 88.00,
          total: 528.00
        },
        currentProofVersion: 1,
        isProofApproved: false,
        productionFilesUnlocked: false,
        proofs: []
      }
    ]
  },
  {
    id: 'ord-1004',
    orderNumber: 'DH-2026-1004',
    customerId: 'cust-1',
    customerName: 'Alex Mercer',
    customerEmail: 'alex@peaksports.co.uk',
    customerCompany: 'Peak Sports Events',
    status: 'completed',
    subtotal: 540.00,
    vatAmount: 108.00,
    total: 648.00,
    shippingAddress: {
      fullName: 'Alex Mercer',
      street: '14 Skyline Way',
      city: 'Sheffield',
      postalCode: 'S1 2EF',
      country: 'United Kingdom'
    },
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    items: [
      {
        id: 'item-1004-1',
        orderId: 'ord-1004',
        divisionSlug: 'trophies',
        productName: 'Trophies',
        configuration: {
          divisionSlug: 'trophies',
          widthMm: 150,
          heightMm: 200,
          materialId: 'mat-clear-acrylic-10mm',
          quantity: 30,
          orientation: 'vertical'
        },
        pricing: {
          unitPrice: 18.00,
          basePrice: 18.00,
          materialSurcharge: 8.00,
          sizeMultiplier: 1.0,
          volumeDiscountPct: 32,
          subtotal: 540.00,
          vatAmount: 108.00,
          total: 648.00
        },
        currentProofVersion: 1,
        isProofApproved: true,
        productionFilesUnlocked: true,
        proofs: [
          {
            id: 'prf-1004-v1',
            orderItemId: 'item-1004-1',
            version: 1,
            previewUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
            status: 'approved',
            createdAt: new Date(Date.now() - 11 * 86400000).toISOString(),
            approvedAt: new Date(Date.now() - 11 * 86400000).toISOString()
          }
        ]
      }
    ]
  }
];

export class DataService {
  private static getStoredOrders(): Order[] {
    if (typeof window === 'undefined') return INITIAL_SEED_ORDERS;
    const stored = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(INITIAL_SEED_ORDERS));
      return INITIAL_SEED_ORDERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_SEED_ORDERS;
    }
  }

  private static saveStoredOrders(orders: Order[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    }
  }

  static async getAllOrders(): Promise<Order[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)');
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            orderNumber: d.order_number,
            customerId: d.customer_id,
            customerName: d.customer_name,
            customerEmail: d.customer_email,
            customerCompany: d.customer_company,
            status: d.status,
            subtotal: Number(d.subtotal),
            vatAmount: Number(d.vat_amount),
            total: Number(d.total),
            shippingAddress: d.shipping_address || {},
            createdAt: d.created_at,
            updatedAt: d.updated_at,
            items: (d.order_items || []).map((it: any) => ({
              id: it.id,
              orderId: it.order_id,
              divisionSlug: it.division_slug,
              productName: it.product_name,
              configuration: it.configuration,
              pricing: it.pricing,
              designState: it.design_state,
              uploadedFileUrl: it.uploaded_file_url,
              currentProofVersion: it.current_proof_version,
              isProofApproved: it.is_proof_approved,
              productionFilesUnlocked: it.production_files_unlocked,
              proofs: [],
            }))
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch error, fallback to local', e);
      }
    }
    return this.getStoredOrders();
  }

  static async getOrdersByCustomer(customerEmail: string): Promise<Order[]> {
    const orders = await this.getAllOrders();
    return orders.filter(
      (o) => o.customerEmail.toLowerCase() === customerEmail.toLowerCase()
    );
  }

  static async getOrderById(id: string): Promise<Order | undefined> {
    const orders = await this.getAllOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id);
  }

  static async createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const newId = `ord-${Date.now().toString().slice(-6)}`;
    const newOrderNumber = `DH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const createdOrder: Order = {
      ...order,
      id: newId,
      orderNumber: newOrderNumber,
      createdAt: now,
      updatedAt: now,
      items: order.items.map((it, idx) => ({
        ...it,
        id: `item-${newId}-${idx + 1}`,
        orderId: newId,
        proofs: it.proofs || [
          {
            id: `prf-${newId}-1`,
            orderItemId: `item-${newId}-${idx + 1}`,
            version: 1,
            previewUrl: it.uploadedFileUrl || 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80',
            status: 'pending',
            createdAt: now
          }
        ]
      }))
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('orders').insert({
          id: createdOrder.id,
          order_number: createdOrder.orderNumber,
          customer_name: createdOrder.customerName,
          customer_email: createdOrder.customerEmail,
          customer_company: createdOrder.customerCompany,
          status: createdOrder.status,
          subtotal: createdOrder.subtotal,
          vat_amount: createdOrder.vatAmount,
          total: createdOrder.total,
          shipping_address: createdOrder.shippingAddress,
        });
      } catch (err) {
        console.warn('Supabase order creation error:', err);
      }
    }

    const current = this.getStoredOrders();
    this.saveStoredOrders([createdOrder, ...current]);
    return createdOrder;
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const orders = this.getStoredOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status, updatedAt: new Date().toISOString() };
      }
      return o;
    });
    this.saveStoredOrders(updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('orders').update({ status }).eq('id', orderId);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  static async approveProof(orderId: string, orderItemId: string, version: number): Promise<void> {
    const orders = this.getStoredOrders();
    const updated: Order[] = orders.map((order) => {
      if (order.id !== orderId) return order;
      const nextStatus: OrderStatus = (order.status === 'proof' || order.status === 'artwork') ? 'production' : order.status;
      return {
        ...order,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
        items: order.items.map((item) => {
          if (item.id !== orderItemId) return item;
          return {
            ...item,
            isProofApproved: true,
            productionFilesUnlocked: true,
            proofs: item.proofs.map((p) => {
              if (p.version === version) {
                return {
                  ...p,
                  status: 'approved',
                  approvedAt: new Date().toISOString()
                } as ProofRecord;
              }
              return p;
            })
          };
        })
      };
    });
    this.saveStoredOrders(updated);
  }

  static async requestProofChanges(
    orderId: string,
    orderItemId: string,
    version: number,
    feedbackNotes: string
  ): Promise<void> {
    const orders = this.getStoredOrders();
    const updated: Order[] = orders.map((order) => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        status: 'artwork' as OrderStatus, // Moves back to artwork stage for adjustments
        updatedAt: new Date().toISOString(),
        items: order.items.map((item) => {
          if (item.id !== orderItemId) return item;
          return {
            ...item,
            isProofApproved: false,
            productionFilesUnlocked: false,
            proofs: item.proofs.map((p) => {
              if (p.version === version) {
                return {
                  ...p,
                  status: 'changes_requested',
                  feedbackNotes
                } as ProofRecord;
              }
              return p;
            })
          };
        })
      };
    });
    this.saveStoredOrders(updated);
  }

  // Current session simulation (Customer vs Admin)
  static getCurrentUser(): UserProfile {
    if (typeof window === 'undefined') {
      return {
        id: 'cust-1',
        email: 'alex@peaksports.co.uk',
        fullName: 'Alex Mercer',
        role: 'customer',
        company: 'Peak Sports Events',
        createdAt: new Date().toISOString()
      };
    }
    const stored = localStorage.getItem(STORAGE_USER_KEY);
    if (!stored) {
      const defaultUser: UserProfile = {
        id: 'cust-1',
        email: 'alex@peaksports.co.uk',
        fullName: 'Alex Mercer',
        role: 'customer',
        company: 'Peak Sports Events',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return {
        id: 'cust-1',
        email: 'alex@peaksports.co.uk',
        fullName: 'Alex Mercer',
        role: 'customer',
        company: 'Peak Sports Events',
        createdAt: new Date().toISOString()
      };
    }
  }

  static switchUserRole(role: 'customer' | 'admin'): UserProfile {
    const user: UserProfile =
      role === 'admin'
        ? {
            id: 'admin-1',
            email: 'production@digitalheroes.co.uk',
            fullName: 'Production Master',
            role: 'admin',
            company: 'Digital Heroes Production Plant',
            createdAt: new Date().toISOString()
          }
        : {
            id: 'cust-1',
            email: 'alex@peaksports.co.uk',
            fullName: 'Alex Mercer',
            role: 'customer',
            company: 'Peak Sports Events',
            createdAt: new Date().toISOString()
          };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    }
    return user;
  }
}
