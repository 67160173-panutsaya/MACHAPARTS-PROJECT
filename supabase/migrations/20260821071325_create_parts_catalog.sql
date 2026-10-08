/*
# Create public automotive parts catalog

1. New Tables
- `parts`: public product catalog for automotive parts and accessories.
- `parts.id`: stable UUID primary key.
- `parts.name`: customer-facing part name.
- `parts.brand`: manufacturer or brand name.
- `parts.category`: storefront category used for filtering.
- `parts.compatibility`: vehicle compatibility summary.
- `parts.description`: product description.
- `parts.price`: current selling price in THB.
- `parts.compare_at_price`: optional original price for showing discounts.
- `parts.rating`: average customer rating.
- `parts.review_count`: number of customer reviews.
- `parts.stock_status`: availability label.
- `parts.image_url`: product image URL.
- `parts.badge`: optional storefront badge.
- `parts.is_featured`: whether the item appears in the featured collection.
- `parts.created_at`: creation timestamp.

2. Security
- Enable row level security on `parts`.
- Allow anonymous and authenticated visitors to read the public catalog.
- Allow no browser writes; catalog changes remain operator-managed.

3. Important Notes
- This is a single-tenant storefront without a sign-in screen.
- Seed products are safe to re-run because inserts use stable IDs and ON CONFLICT handling.
*/

CREATE TABLE IF NOT EXISTS public.parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  compatibility text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(12,2) NOT NULL CHECK (price >= 0),
  compare_at_price numeric(12,2) CHECK (compare_at_price IS NULL OR compare_at_price >= price),
  rating numeric(2,1) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  review_count integer NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  stock_status text NOT NULL DEFAULT 'พร้อมส่ง',
  image_url text NOT NULL,
  badge text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read parts catalog" ON public.parts;
CREATE POLICY "Public can read parts catalog"
ON public.parts FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Public cannot insert parts catalog" ON public.parts;
CREATE POLICY "Public cannot insert parts catalog"
ON public.parts FOR INSERT
TO anon, authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "Public cannot update parts catalog" ON public.parts;
CREATE POLICY "Public cannot update parts catalog"
ON public.parts FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Public cannot delete parts catalog" ON public.parts;
CREATE POLICY "Public cannot delete parts catalog"
ON public.parts FOR DELETE
TO anon, authenticated
USING (false);

CREATE INDEX IF NOT EXISTS parts_category_idx ON public.parts (category);
CREATE INDEX IF NOT EXISTS parts_featured_idx ON public.parts (is_featured);

INSERT INTO public.parts (id, name, brand, category, compatibility, description, price, compare_at_price, rating, review_count, stock_status, image_url, badge, is_featured)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'ผ้าเบรกหน้า Ceramic Pro', 'Brembo', 'ระบบเบรก', 'Toyota Camry 2018–2023', 'ผ้าเบรกเซรามิกเสียงเงียบ ฝุ่นน้อย พร้อมติดตั้งง่ายและรับประกัน 1 ปี', 1890, 2290, 4.9, 128, 'พร้อมส่ง', 'https://images.pexels.com/photos/29226618/pexels-photo-29226618.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'ขายดี', true),
  ('10000000-0000-4000-8000-000000000002', 'น้ำมันเครื่อง Fully Synthetic 5W-30', 'Mobil 1', 'ของเหลวและสารหล่อลื่น', 'เครื่องยนต์เบนซินทั่วไป', 'น้ำมันเครื่องสังเคราะห์แท้ 4 ลิตร ช่วยปกป้องเครื่องยนต์ทุกสภาพการขับขี่', 1290, 1490, 4.8, 96, 'พร้อมส่ง', 'https://images.pexels.com/photos/12658309/pexels-photo-12658309.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'คุ้มที่สุด', true),
  ('10000000-0000-4000-8000-000000000003', 'กรองอากาศ High Flow', 'K&N', 'เครื่องยนต์', 'Honda Civic FC / FK 2016–2021', 'กรองอากาศประสิทธิภาพสูง ล้างใช้ซ้ำได้ ช่วยเพิ่มการไหลเวียนอากาศเข้าเครื่องยนต์', 2350, 2690, 4.7, 74, 'เหลือ 12 ชิ้น', 'https://images.pexels.com/photos/11455717/pexels-photo-11455717.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL, true),
  ('10000000-0000-4000-8000-000000000004', 'แบตเตอรี่ EFB 70Ah', 'GS Battery', 'ระบบไฟฟ้า', 'รถญี่ปุ่นและรถยุโรป รุ่นที่รองรับ EFB', 'แบตเตอรี่ EFB สำหรับรถที่มีระบบ Start-Stop รับประกัน 15 เดือน ส่งฟรีทั่วประเทศ', 3290, 3790, 4.9, 211, 'พร้อมส่ง', 'https://images.pexels.com/photos/4116207/pexels-photo-4116207.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'ส่งฟรี', true),
  ('10000000-0000-4000-8000-000000000005', 'หัวเทียน Iridium Power (ชุด 4 หัว)', 'DENSO', 'เครื่องยนต์', 'Toyota / Honda / Mazda เครื่องเบนซิน', 'หัวเทียน Iridium อายุการใช้งานยาวนาน จุดระเบิดแม่นยำ ช่วยประหยัดน้ำมัน', 980, 1190, 4.8, 63, 'พร้อมส่ง', 'https://images.pexels.com/photos/14615706/pexels-photo-14615706.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL, false),
  ('10000000-0000-4000-8000-000000000006', 'น้ำยาหม้อน้ำ Long Life 4L', 'Toyota Genuine', 'ของเหลวและสารหล่อลื่น', 'รถยนต์ Toyota ทุกรุ่น', 'น้ำยาหล่อเย็นแท้จากผู้ผลิต ปกป้องระบบระบายความร้อนและป้องกันสนิม', 690, 790, 4.9, 42, 'พร้อมส่ง', 'https://images.pexels.com/photos/4116193/pexels-photo-4116193.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL, false),
  ('10000000-0000-4000-8000-000000000007', 'ใบปัดน้ำฝน Hybrid 24 นิ้ว', 'BOSCH', 'ภายนอกรถ', 'รถยนต์ขนาดกลางและ SUV', 'ใบปัดน้ำฝนแบบ Hybrid รีดน้ำสะอาด เงียบ และติดตั้งได้ภายใน 2 นาที', 490, 590, 4.6, 38, 'พร้อมส่ง', 'https://images.pexels.com/photos/694424/pexels-photo-694424.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'ราคาพิเศษ', false),
  ('10000000-0000-4000-8000-000000000008', 'ชุดสายชาร์จแบตเตอรี่ฉุกเฉิน', 'NOCO', 'อุปกรณ์ฉุกเฉิน', 'รถยนต์ 12V ทุกประเภท', 'Jump starter ขนาดกะทัดรัด พร้อมไฟฉาย LED และ USB-C สำหรับเดินทางไกล', 2890, 3290, 4.9, 87, 'เหลือ 8 ชิ้น', 'https://images.pexels.com/photos/12271951/pexels-photo-12271951.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'แนะนำ', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  compatibility = EXCLUDED.compatibility,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  stock_status = EXCLUDED.stock_status,
  image_url = EXCLUDED.image_url,
  badge = EXCLUDED.badge,
  is_featured = EXCLUDED.is_featured;