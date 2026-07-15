export type UserRole = 'admin' | 'staff'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'cancelled'
export type SaleStatus = 'completed' | 'partial' | 'cancelled'
export type PaymentMethod = 'cash' | 'mobile_money' | 'bank_transfer' | 'card'
export type QuoteStatus = 'new' | 'reviewed' | 'quoted' | 'completed' | 'cancelled'
export type StockUnit = 'bag' | 'sheet' | 'roll' | 'tin' | 'piece' | 'kg' | 'metre' | 'bundle' | 'set'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string | null
  image_url: string | null
  unit: StockUnit
  price: number | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  description: string | null
  image_url: string | null
  price: number
  cost_price: number
  unit: StockUnit
  stock_quantity: number
  low_stock_threshold: number
  sort_order: number
  is_service: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  sale_ref: string
  customer_name: string | null
  customer_phone: string | null
  payment_method: PaymentMethod
  subtotal: number
  discount: number
  total: number
  amount_paid: number
  change_due: number
  balance_due: number
  status: SaleStatus
  notes: string | null
  served_by: string | null
  created_at: string
  updated_at: string
  sale_items?: SaleItem[]
  profiles?: Profile
}

export interface SaleItem {
  id: string
  sale_id: string
  inventory_item_id: string | null
  item_name: string
  unit: string
  quantity: number
  unit_price: number
  line_total: number
  created_at: string
  inventory_items?: InventoryItem
}

export interface HeroSlide {
  id: string
  title: string
  subtitle: string | null
  heading: string
  body: string
  button1_text: string
  button1_href: string
  button2_text: string
  button2_href: string
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PageHero {
  id: string
  page_slug: string
  label: string
  subtitle: string | null
  heading: string
  description: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  label: string | null
  image_url: string
  category: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SiteContent {
  id: string
  key: string
  value: string | null
  section: string
  updated_at: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  is_active: boolean
  sort_order: number
}

export interface QuoteRequest {
  id: string
  name: string
  phone: string
  email: string | null
  project_type: string | null
  materials_needed: string | null
  quantity_volume: string | null
  delivery_address: string | null
  deadline: string | null
  notes: string | null
  status: QuoteStatus
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  invoice_number: string
  customer_name: string
  customer_phone: string | null
  customer_email: string | null
  customer_address: string | null
  status: InvoiceStatus
  due_date: string | null
  notes: string | null
  created_by: string | null
  subtotal: number
  discount: number
  total: number
  created_at: string
  updated_at: string
  invoice_items?: InvoiceItem[]
  profiles?: Pick<Profile, 'full_name' | 'email'>
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit: string
  unit_price: number
  line_total: number
}

export interface ThemeColor {
  key: string
  value: string
  label: string
}

export interface DashboardStats {
  total_revenue: number
  total_sales: number
  pending_quotes: number
  low_stock_count: number
  monthly_revenue: { month: string; revenue: number }[]
  recent_sales: Sale[]
}
