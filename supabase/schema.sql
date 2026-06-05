-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('admin', 'staff');
CREATE TYPE sale_status AS ENUM ('completed', 'partial', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'mobile_money', 'bank_transfer', 'card');
CREATE TYPE quote_status AS ENUM ('new', 'reviewed', 'quoted', 'completed', 'cancelled');
CREATE TYPE blog_status AS ENUM ('draft', 'published');
CREATE TYPE stock_unit AS ENUM ('bag', 'sheet', 'roll', 'tin', 'piece', 'kg', 'metre', 'bundle', 'set');

-- ============================================================
-- HELPER: updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'staff',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'staff')
  );
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- RLS HELPERS
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
END; $$;

CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_active = true
  );
END; $$;

-- ============================================================
-- PRODUCTS (public catalogue)
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  unit stock_unit NOT NULL DEFAULT 'piece',
  price NUMERIC(12,2),
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- INVENTORY (stock for POS)
-- ============================================================
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  unit stock_unit NOT NULL DEFAULT 'piece',
  stock_quantity NUMERIC(12,2) NOT NULL DEFAULT 0,
  low_stock_threshold NUMERIC(12,2) NOT NULL DEFAULT 5,
  is_service BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_inventory_updated_at BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- SALES
-- ============================================================
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_ref TEXT NOT NULL UNIQUE,
  customer_name TEXT,
  customer_phone TEXT,
  payment_method payment_method NOT NULL DEFAULT 'cash',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
  change_due NUMERIC(12,2) NOT NULL DEFAULT 0,
  balance_due NUMERIC(12,2) NOT NULL DEFAULT 0,
  status sale_status NOT NULL DEFAULT 'completed',
  notes TEXT,
  served_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_sales_updated_at BEFORE UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- SALE ITEMS
-- ============================================================
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'piece',
  quantity NUMERIC(12,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  line_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- HERO SLIDES
-- ============================================================
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  heading TEXT NOT NULL,
  body TEXT NOT NULL,
  button1_text TEXT NOT NULL DEFAULT 'Get a Quote',
  button1_href TEXT NOT NULL DEFAULT '/quote',
  button2_text TEXT NOT NULL DEFAULT 'Browse Products',
  button2_href TEXT NOT NULL DEFAULT '/products',
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_hero_slides_updated_at BEFORE UPDATE ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  status blog_status NOT NULL DEFAULT 'draft',
  author TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- GALLERY ITEMS
-- ============================================================
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_gallery_items_updated_at BEFORE UPDATE ON gallery_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- SITE CONTENT (key-value store for editable copy)
-- ============================================================
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  section TEXT NOT NULL DEFAULT 'general',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_site_content_updated_at BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- SOCIAL LINKS
-- ============================================================
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0
);

-- ============================================================
-- QUOTE REQUESTS
-- ============================================================
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  project_type TEXT,
  materials_needed TEXT,
  quantity_volume TEXT,
  delivery_address TEXT,
  deadline TEXT,
  notes TEXT,
  status quote_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_quote_requests_updated_at BEFORE UPDATE ON quote_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Staff view own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admin view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admin manage profiles" ON profiles FOR ALL USING (is_admin());

-- products (public read)
CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Staff manage products" ON products FOR ALL USING (is_staff());

-- inventory
CREATE POLICY "Staff manage inventory" ON inventory_items FOR ALL USING (is_staff());

-- sales
CREATE POLICY "Staff manage sales" ON sales FOR ALL USING (is_staff());

-- sale_items
CREATE POLICY "Staff manage sale_items" ON sale_items FOR ALL USING (is_staff());

-- hero_slides
CREATE POLICY "Public read active slides" ON hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage slides" ON hero_slides FOR ALL USING (is_admin());

-- blog_posts
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Staff manage posts" ON blog_posts FOR ALL USING (is_staff());

-- gallery_items
CREATE POLICY "Public read active gallery" ON gallery_items FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage gallery" ON gallery_items FOR ALL USING (is_admin());

-- site_content
CREATE POLICY "Public read content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Admin manage content" ON site_content FOR ALL USING (is_admin());

-- social_links
CREATE POLICY "Public read active links" ON social_links FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage links" ON social_links FOR ALL USING (is_admin());

-- quote_requests
CREATE POLICY "Public insert quotes" ON quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff manage quotes" ON quote_requests FOR ALL USING (is_staff());

-- ============================================================
-- STORAGE BUCKETS (run in Supabase dashboard or CLI)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('hero-images', 'hero-images', true),
--   ('product-images', 'product-images', true),
--   ('blog-covers', 'blog-covers', true),
--   ('gallery-images', 'gallery-images', true),
--   ('uploads', 'uploads', false);
