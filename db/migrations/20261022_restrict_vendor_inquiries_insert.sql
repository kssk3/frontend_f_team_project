-- 입점 문의 저장 규칙을 DB 에서도 지킨다 (PR #44 Codex P1 지적 반영)
-- 공개 키(anon)로 REST API 를 직접 호출하면 서버 검증(zod)을 건너뛸 수 있으므로,
-- 같은 규칙을 DB 제약으로 한 번 더 건다.
--
-- 20261021_create_vendor_inquiries.sql 을 실행한 뒤 Supabase 대시보드 > SQL Editor 에서 실행한다.
-- 여러 번 실행해도 안전하다: 권한·제약·정책을 지우고 다시 만든다.
--
-- 규칙을 바꿀 때는 domains/vendor/utils/vendorValidation.ts, domains/vendor/data/mockCategories.ts 와 함께 바꾼다.
-- 원칙: zod 가 통과시키는 값은 DB 도 반드시 통과시킨다 (DB 가 더 엄격하면 정상 입력이 "잠시 후 다시 시도"로 실패한다).

BEGIN;

-- 1. 데이터 칸만 넣을 수 있게 한다 → id·status·created_at·updated_at·deleted_at 은 기본값으로만 채워진다
REVOKE INSERT ON public.vendor_inquiries FROM anon, authenticated;
GRANT INSERT (
  company_name, brand_name, contact_name, phone,
  inquiry_type, primary_category, secondary_category,
  mobile, email, website, other_platforms, content
) ON public.vendor_inquiries TO anon, authenticated;

-- 2. 등록 시점의 관리용 칸은 처음 상태여야 한다 (권한이 다시 넓어져도 막히도록 한 번 더 확인)
DROP POLICY IF EXISTS "vendor_inquiries_insert_only" ON public.vendor_inquiries;
CREATE POLICY "vendor_inquiries_insert_only"
  ON public.vendor_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'received' AND updated_at IS NULL AND deleted_at IS NULL);

-- 3. zod 와 같은 입력 규칙
ALTER TABLE public.vendor_inquiries
  DROP CONSTRAINT IF EXISTS vendor_inquiries_company_name_check,
  DROP CONSTRAINT IF EXISTS vendor_inquiries_brand_name_check,
  DROP CONSTRAINT IF EXISTS vendor_inquiries_contact_name_check,
  DROP CONSTRAINT IF EXISTS vendor_inquiries_phone_check,
  DROP CONSTRAINT IF EXISTS vendor_inquiries_mobile_check,
  DROP CONSTRAINT IF EXISTS vendor_inquiries_inquiry_type_check,
  DROP CONSTRAINT IF EXISTS vendor_inquiries_category_check,
  DROP CONSTRAINT IF EXISTS vendor_inquiries_email_check,
  DROP CONSTRAINT IF EXISTS vendor_inquiries_website_check,
  DROP CONSTRAINT IF EXISTS vendor_inquiries_other_platforms_check,
  DROP CONSTRAINT IF EXISTS vendor_inquiries_content_check;

ALTER TABLE public.vendor_inquiries
  -- 앞뒤 공백 없이 2자 이상, VENDOR_TEXT_MAX_LENGTH 이하
  ADD CONSTRAINT vendor_inquiries_company_name_check
    CHECK (company_name = btrim(company_name) AND char_length(company_name) BETWEEN 2 AND 50),
  ADD CONSTRAINT vendor_inquiries_brand_name_check
    CHECK (brand_name = btrim(brand_name) AND char_length(brand_name) BETWEEN 2 AND 50),
  ADD CONSTRAINT vendor_inquiries_contact_name_check
    CHECK (contact_name = btrim(contact_name) AND char_length(contact_name) BETWEEN 2 AND 20),

  -- 숫자만. 상한은 zod 에 없어서 국제 번호(최대 15자리)보다 넉넉하게 둔 안전망
  ADD CONSTRAINT vendor_inquiries_phone_check
    CHECK (phone ~ '^[0-9]+$' AND char_length(phone) <= 20),
  ADD CONSTRAINT vendor_inquiries_mobile_check
    CHECK (mobile ~ '^[0-9]+$' AND char_length(mobile) <= 20),

  ADD CONSTRAINT vendor_inquiries_inquiry_type_check
    CHECK (inquiry_type IN ('rental', 'vendor')),

  -- mockCategories.ts 의 대표 → 2차 카테고리 짝
  ADD CONSTRAINT vendor_inquiries_category_check
    CHECK (
      (primary_category IN ('women', 'men')
        AND secondary_category IN ('clothing', 'bags', 'accessories', 'shoes'))
      OR (primary_category = 'life'
        AND secondary_category IN ('home', 'home-fabric', 'homewear', 'kitchen', 'beauty', 'tech', 'family', 'leisure'))
    ),

  -- zod 의 이메일 검사보다 느슨한 형식 확인 (zod 가 통과시킨 값은 모두 통과), 길이는 이메일 표준 상한
  ADD CONSTRAINT vendor_inquiries_email_check
    CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' AND char_length(email) <= 254),

  -- http(s) 주소만 (javascript:·data: 주소 차단), 길이는 안전망
  ADD CONSTRAINT vendor_inquiries_website_check
    CHECK (website ~* '^https?:' AND char_length(website) <= 2048),

  -- 선택 칸: 비어 있어도 되고, 길이만 안전망으로 제한
  ADD CONSTRAINT vendor_inquiries_other_platforms_check
    CHECK (char_length(other_platforms) <= 2000),
  ADD CONSTRAINT vendor_inquiries_content_check
    CHECK (char_length(content) <= 5000);

COMMIT;
