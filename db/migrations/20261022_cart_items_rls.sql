-- 장바구니(cart_items) 권한 규칙: 로그인한 회원은 "자기 장바구니"만 조회·담기·수정·삭제할 수 있다
-- 비회원(anon)은 cart_items 를 쓰지 않는다 (비회원 장바구니는 브라우저 localStorage 에 저장)
--
-- Supabase 대시보드 > SQL Editor 에서 실행한다.
-- 여러 번 실행해도 안전하다: 정책을 지우고 다시 만든다.

BEGIN;

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;

DROP POLICY IF EXISTS "cart_items_select_own" ON public.cart_items;
CREATE POLICY "cart_items_select_own"
  ON public.cart_items FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "cart_items_insert_own" ON public.cart_items;
CREATE POLICY "cart_items_insert_own"
  ON public.cart_items FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "cart_items_update_own" ON public.cart_items;
CREATE POLICY "cart_items_update_own"
  ON public.cart_items FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "cart_items_delete_own" ON public.cart_items;
CREATE POLICY "cart_items_delete_own"
  ON public.cart_items FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

COMMIT;
