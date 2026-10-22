-- 입점 및 매장 대관 문의 테이블
-- Supabase 대시보드 > SQL Editor 에서 실행한다.
-- 여러 번 실행해도 안전하다: 테이블이 이미 있으면 만들지 않고, 정책은 다시 만든다.

CREATE TABLE IF NOT EXISTS public.vendor_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  brand_name text NOT NULL,
  contact_name text NOT NULL,
  phone text NOT NULL,
  inquiry_type text NOT NULL,          -- 'rental' | 'vendor'
  primary_category text NOT NULL,      -- 'women' | 'men' | 'life'
  secondary_category text NOT NULL,
  mobile text NOT NULL,
  email text NOT NULL,
  website text NOT NULL,
  other_platforms text,
  content text,
  status text NOT NULL DEFAULT 'received',
  created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  updated_at timestamp with time zone,
  deleted_at timestamp with time zone,
  CONSTRAINT vendor_inquiries_pkey PRIMARY KEY (id)
);

-- 공개 폼이므로 "등록"만 허용하고 조회·수정·삭제는 막는다 (이메일·전화번호 보호)
ALTER TABLE public.vendor_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vendor_inquiries_insert_only" ON public.vendor_inquiries;
CREATE POLICY "vendor_inquiries_insert_only"
  ON public.vendor_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

GRANT INSERT ON public.vendor_inquiries TO anon, authenticated;
