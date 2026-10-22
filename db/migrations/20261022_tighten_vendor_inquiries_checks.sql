-- 입점 문의 이름·웹사이트 제약을 zod 와 정확히 맞춘다 (PR #46 Codex P2 지적 반영)
-- 20261022_restrict_vendor_inquiries_insert.sql 을 실행한 뒤 Supabase 대시보드 > SQL Editor 에서 실행한다.
-- 여러 번 실행해도 안전하다: 같은 이름의 제약을 지우고 다시 만든다.
--
-- 공백 문자 목록은 JavaScript trim()·\s 가 지우는(가리키는) 문자와 같다:
--   \t \n \v \f \r 공백 U+00A0 U+1680 U+2000~U+200A U+2028 U+2029 U+202F U+205F U+3000 U+FEFF
-- PostgreSQL 의 btrim() 은 일반 공백만, [[:space:]] 는 서버 로케일에 따라 범위가 달라서 직접 나열한다.

BEGIN;

ALTER TABLE public.vendor_inquiries
  DROP CONSTRAINT IF EXISTS vendor_inquiries_company_name_check,
  DROP CONSTRAINT IF EXISTS vendor_inquiries_brand_name_check,
  DROP CONSTRAINT IF EXISTS vendor_inquiries_contact_name_check,
  DROP CONSTRAINT IF EXISTS vendor_inquiries_website_check;

ALTER TABLE public.vendor_inquiries
  -- 앞뒤가 공백 문자가 아니고 2자 이상, VENDOR_TEXT_MAX_LENGTH 이하 (zod 의 trim → min → max 와 같음)
  ADD CONSTRAINT vendor_inquiries_company_name_check
    CHECK (
      company_name !~ '^[\t\n\v\f\r \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]|[\t\n\v\f\r \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]$'
      AND char_length(company_name) BETWEEN 2 AND 50
    ),
  ADD CONSTRAINT vendor_inquiries_brand_name_check
    CHECK (
      brand_name !~ '^[\t\n\v\f\r \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]|[\t\n\v\f\r \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]$'
      AND char_length(brand_name) BETWEEN 2 AND 50
    ),
  ADD CONSTRAINT vendor_inquiries_contact_name_check
    CHECK (
      contact_name !~ '^[\t\n\v\f\r \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]|[\t\n\v\f\r \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]$'
      AND char_length(contact_name) BETWEEN 2 AND 20
    ),

  -- https://호스트[/경로·?쿼리·#해시] 모양, 공백 없음. vendorValidation.ts 의 WEBSITE_PATTERN 과 같은 규칙
  ADD CONSTRAINT vendor_inquiries_website_check
    CHECK (
      website ~* '^https?://[^\t\n\v\f\r \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff/?#]+([/?#][^\t\n\v\f\r \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*)?$'
      AND char_length(website) <= 2048
    );

COMMIT;
