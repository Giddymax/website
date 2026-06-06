-- ============================================================
-- SEED DATA for K.K. Danny Enterprise
-- Run AFTER schema.sql
-- ============================================================

-- HERO SLIDES
INSERT INTO hero_slides (title, subtitle, heading, body, button1_text, button1_href, button2_text, button2_href, sort_order, is_active) VALUES
(
  'Cement · Steel · Roofing',
  'Premium Building Materials',
  'Building Foundations That Last',
  'Premium cement, reinforcement steel, and roofing materials delivered to your site from Adeiso''s most reliable supplier.',
  'Get a Quote', '/quote', 'Browse Products', '/products',
  1, true
),
(
  'Your First Stop For Building Materials',
  'Quality & Affordable',
  'Quality & Affordable Materials For Every Project',
  'From a single bag of cement to full project supply — K.K. Danny Enterprise has the stock, the price, and the delivery.',
  'View Products', '/products', 'Call Us Now', 'tel:+233244754803',
  2, true
),
(
  'Reliable · Stocked · Delivered',
  'Everything You Need',
  'Everything You Need, Right Here In Adeiso',
  'Roofing sheets, tiles, paint, timber, wire mesh, tools, and more — walk in or call ahead for fast service and same-day delivery.',
  'Our Products', '/products', 'Contact Us', '/contact',
  3, true
);

-- PRODUCTS (public catalogue)
INSERT INTO products (name, slug, category, description, unit, sort_order) VALUES
('Ghacem Cement Bags', 'ghacem-cement', 'Cement & Concrete', 'Premium Ghacem ordinary portland cement, 50kg bags. The most trusted cement brand in Ghana for foundations, blocks, and concrete work.', 'bag', 1),
('Concrete Mix Supplies', 'concrete-mix', 'Cement & Concrete', 'Sharp sand, gravel, and aggregates for concrete mixing. Available in bulk or per trip.', 'bag', 2),
('Reinforcement Bars (Rebar)', 'rebar', 'Steel & Reinforcement', 'High tensile steel reinforcement bars in all standard sizes — 8mm, 10mm, 12mm, 16mm, 20mm. Star Steels and other brands.', 'piece', 3),
('BRC Wire Mesh Panels', 'brc-wire-mesh', 'Steel & Reinforcement', 'Welded reinforcement mesh panels for slabs and concrete reinforcement. Various gauge and spacing options.', 'sheet', 4),
('Corrugated Roofing Sheets', 'corrugated-roofing', 'Roofing Materials', 'Zinc, aluminium, and painted corrugated roofing sheets in standard lengths. Durable protection for any building.', 'sheet', 5),
('Coloured Roof Sheets', 'coloured-roof-sheets', 'Roofing Materials', 'Pre-painted roof sheets in charcoal grey, ox-blood red, and forest green. Add character to your building.', 'sheet', 6),
('De-Luxy Acrylic Paint', 'de-luxy-paint', 'Paint & Finishes', 'De-Luxy premium acrylic emulsion paint in all colours. Available from small tins to 20-litre buckets. Interior and exterior grades.', 'tin', 7),
('Primers & Solvents', 'primers-solvents', 'Paint & Finishes', 'Undercoat primers, solvents, and paint accessories. Prepare surfaces and get a professional finish.', 'tin', 8),
('Ceramic Floor Tiles', 'ceramic-tiles', 'Tiles & Flooring', 'Quality ceramic and porcelain floor and wall tiles in a wide range of designs, sizes, and finishes.', 'piece', 9),
('Structural Timber', 'structural-timber', 'Timber & Lumber', 'Sawn timber, planks, and battens for roofing, formwork, carpentry, and structural use.', 'piece', 10),
('Building Hardware & Fasteners', 'hardware-fasteners', 'Hardware & Fasteners', 'Nails, screws, bolts, hinges, padlocks, door handles, and all building hardware needs under one roof.', 'set', 11),
('Tools & Equipment', 'tools-equipment', 'Tools & Equipment', 'Cement mixers for hire or purchase, wheelbarrows, shovels, spirit levels, and a full range of hand tools.', 'piece', 12),
('Wire & Mesh Products', 'wire-mesh', 'Wire & Mesh', 'Chicken wire, welded wire mesh rolls, and barbed wire for fencing and security.', 'roll', 13),
('PVC Pipes & Fittings', 'pvc-pipes', 'Pipes & Plumbing', 'Pressure and drainage PVC pipes with matching fittings, bends, tees, and connectors.', 'piece', 14),
('Same-Day Delivery Service', 'delivery-service', 'Delivery Service', 'Fast, reliable delivery via our branded cargo tricycle within Adeiso and nearby communities. Call to arrange.', 'piece', 15);

-- INVENTORY ITEMS
INSERT INTO inventory_items (name, category, price, unit, stock_quantity, low_stock_threshold) VALUES
('Ghacem Cement 50kg', 'Cement & Concrete', 75.00, 'bag', 250, 20),
('Rebar 12mm x 12m', 'Steel & Reinforcement', 185.00, 'piece', 80, 10),
('Rebar 10mm x 12m', 'Steel & Reinforcement', 130.00, 'piece', 100, 10),
('Rebar 8mm x 12m', 'Steel & Reinforcement', 90.00, 'piece', 120, 10),
('BRC Mesh Panel 6x2.4m', 'Steel & Reinforcement', 320.00, 'sheet', 40, 5),
('Corrugated Zinc Sheet 8ft', 'Roofing Materials', 55.00, 'sheet', 200, 30),
('Corrugated Zinc Sheet 10ft', 'Roofing Materials', 68.00, 'sheet', 150, 20),
('Coloured Roof Sheet Charcoal 8ft', 'Roofing Materials', 75.00, 'sheet', 100, 15),
('Coloured Roof Sheet Red 8ft', 'Roofing Materials', 75.00, 'sheet', 80, 15),
('De-Luxy Paint 4L', 'Paint & Finishes', 85.00, 'tin', 60, 10),
('De-Luxy Paint 20L', 'Paint & Finishes', 380.00, 'tin', 30, 5),
('Floor Tiles 60x60cm (box)', 'Tiles & Flooring', 120.00, 'piece', 80, 10),
('PVC Pipe 4inch x 6m', 'Pipes & Plumbing', 45.00, 'piece', 50, 8),
('Wheelbarrow', 'Tools & Equipment', 350.00, 'piece', 15, 2),
('Nails 3 inch (1kg)', 'Hardware & Fasteners', 12.00, 'kg', 100, 20),
('Binding Wire (25kg roll)', 'Steel & Reinforcement', 150.00, 'roll', 20, 3),
('Chicken Wire 4ft x 25m', 'Wire & Mesh', 180.00, 'roll', 25, 4),
('Delivery Service', 'Delivery Service', 50.00, 'piece', 999, 0);

-- Update last item as service
UPDATE inventory_items SET is_service = true WHERE name = 'Delivery Service';

-- SITE CONTENT
INSERT INTO site_content (key, value, section) VALUES
-- Hero / General
('site_name', 'K.K. Danny Enterprise', 'general'),
('tagline', 'Quality & Affordable Building Materials', 'general'),
('sub_tagline', 'Your First Stop For Building Materials', 'general'),
('address', 'Opp. Radiance Gas Filling Station, Near Point 3 Hotel, Adeiso, Eastern Region, Ghana', 'contact'),
('phone1', '0244754803', 'contact'),
('phone2', '0249986118', 'contact'),
('phone3', '0240268125', 'contact'),
('email', 'info@kkdannyenterprise.com', 'contact'),
('website', 'kkdannyenterprise.com', 'contact'),
-- About
('about_heading', 'About K.K. Danny Enterprise', 'about'),
('about_body', 'K.K. Danny Enterprise is a trusted building materials and hardware supply company based in Adeiso, Eastern Region, Ghana. We serve individual home builders, contractors, developers, and the broader construction community with quality products at competitive prices. Our yard is fully stocked with cement, steel, roofing sheets, tiles, paint, timber, tools, wire, pipes, and more. We also offer fast same-day delivery via our branded cargo tricycle.', 'about'),
('about_mission', 'To be Adeiso''s most dependable building materials partner — delivering quality, honest pricing, and fast service on every order.', 'about'),
-- Why Choose Us
('why1_title', 'Always In Stock', 'why'),
('why1_body', 'Our yard holds large, ready inventory so you never face project delays. From a single bag to full-site supply — we have it.', 'why'),
('why2_title', 'Competitive Prices', 'why'),
('why2_body', 'Transparent pricing with no hidden costs. We source directly and pass the savings on to every customer.', 'why'),
('why3_title', 'Fast Delivery', 'why'),
('why3_body', 'Same-day delivery to your construction site within Adeiso and surrounding communities via our branded tricycle.', 'why'),
('why4_title', 'Trusted & Reliable', 'why'),
('why4_body', 'Years of service to the Adeiso community. Contractors and home builders count on us for every project stage.', 'why'),
-- FAQ
('faq1_q', 'Do you offer delivery to sites outside Adeiso?', 'faq'),
('faq1_a', 'Yes, we deliver to Adeiso and nearby communities. For longer distances, please contact us for a custom quote. Call 0244754803 to arrange.', 'faq'),
('faq2_q', 'Can I get a formal written quote for my project?', 'faq'),
('faq2_a', 'Absolutely. Fill in the online quote form or call us and a staff member will prepare a detailed price list for your materials list.', 'faq'),
('faq3_q', 'Do you sell single bags of cement or in bulk only?', 'faq'),
('faq3_a', 'We sell by the bag, by the pallet, or in bulk. Any quantity is welcome — walk in or call ahead.', 'faq'),
('faq4_q', 'What brands of cement and steel do you stock?', 'faq'),
('faq4_a', 'We primarily stock Ghacem cement and Star Steels reinforcement bars. We carry both popular market brands and alternatives.', 'faq'),
('faq5_q', 'Do you accept Mobile Money payment?', 'faq'),
('faq5_a', 'Yes. We accept cash, Mobile Money (MTN MoMo, AirtelTigo Money, Telecel Cash), and bank transfer.', 'faq'),
-- Header / Navbar
('header_phone', '0244754803', 'header'),
('header_tagline', 'Building Materials & Services', 'header'),
-- Footer
('footer_tagline', 'Adeiso''s most reliable source for cement, steel, roofing, paint, tiles, timber, tools, and more.', 'footer'),
('footer_copyright', '© 2025 K.K. Danny Enterprise. All rights reserved.', 'footer'),
-- SEO
('seo_title', 'K.K. Danny Enterprise | Building Materials Supplier in Adeiso, Ghana', 'seo'),
('seo_description', 'K.K. Danny Enterprise in Adeiso supplies quality cement, steel rebar, roofing sheets, paint, tiles, timber, tools, and more at affordable prices. Fast delivery.', 'seo');

-- SOCIAL LINKS
INSERT INTO social_links (platform, url, is_active, sort_order) VALUES
('Facebook', 'https://facebook.com/kkdannyenterprise', true, 1),
('WhatsApp', 'https://wa.me/233244754803', true, 2),
('Instagram', 'https://instagram.com/kkdannyenterprise', true, 3),
('TikTok', 'https://tiktok.com/@kkdannyenterprise', false, 4),
('YouTube', 'https://youtube.com/@kkdannyenterprise', false, 5);

-- GALLERY ITEMS (placeholders — replace with real uploads)
INSERT INTO gallery_items (label, image_url, category, sort_order) VALUES
('Cement Stock — Ghacem Bags', '/images/gallery-cement.jpg', 'Stock', 1),
('Steel Rebar Yard', '/images/gallery-rebar.jpg', 'Stock', 2),
('Coloured Roofing Sheets', '/images/gallery-roofing.jpg', 'Stock', 3),
('Paint Section — De-Luxy', '/images/gallery-paint.jpg', 'Store Interior', 4),
('Hardware & Tools', '/images/gallery-hardware.jpg', 'Store Interior', 5),
('Delivery Tricycle', '/images/gallery-delivery.jpg', 'Delivery', 6);

