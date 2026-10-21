-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.
-- Don't Touch

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  phone text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  updated_at timestamp with time zone,
  deleted_at timestamp with time zone,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  status text NOT NULL,
  total_price numeric NOT NULL,
  recipient_name text NOT NULL,
  recipient_phone text NOT NULL,
  zipcode text NOT NULL,
  address text NOT NULL,
  address_detail text NOT NULL,
  delivery_memo text,
  created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  updated_at timestamp with time zone,
  deleted_at timestamp with time zone,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.brands (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  updated_at timestamp with time zone,
  deleted_at timestamp with time zone,
  CONSTRAINT brands_pkey PRIMARY KEY (id)
);

CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  base_price numeric NOT NULL,
  sale_price numeric,
  discount_price numeric,
  delivery_type text NOT NULL,
  delivery_fee integer DEFAULT 0,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id)
);

CREATE TABLE public.product_options (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  size text NOT NULL,
  extra_price integer,
  stock integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  updated_at timestamp with time zone,
  deleted_at timestamp with time zone,
  CONSTRAINT product_options_pkey PRIMARY KEY (id),
  CONSTRAINT product_options_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);

CREATE TABLE public.product_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  alt text NOT NULL,
  sort_order integer NOT NULL,
  is_thumbnail boolean NOT NULL,
  created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
  updated_at timestamp with time zone,
  deleted_at timestamp with time zone,
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);

CREATE TABLE public.cart_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  option_id uuid DEFAULT gen_random_uuid(),
  quantity integer NOT NULL,
  is_checked boolean NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  updated_at timestamp with time zone,
  deleted_at timestamp with time zone,
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT cart_items_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.product_options(id)
);

CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL DEFAULT gen_random_uuid(),
  option_id uuid DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  option_name text NOT NULL,
  unit_price integer NOT NULL,
  quantity integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  updated_at timestamp with time zone,
  deleted_at timestamp with time zone,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.product_options(id)
);