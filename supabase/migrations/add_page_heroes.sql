-- Page Heroes: sub-page header banners with optional background images
CREATE TABLE IF NOT EXISTS page_heroes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  subtitle TEXT,
  heading TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_page_heroes_updated_at BEFORE UPDATE ON page_heroes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE page_heroes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active page heroes" ON page_heroes FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage page heroes" ON page_heroes FOR ALL USING (is_admin());
