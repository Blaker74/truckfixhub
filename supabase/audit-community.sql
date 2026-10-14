-- TruckFixHub: read-only configuration audit.
-- No member records, messages, documents, credentials, or object contents are read.
-- Run against the existing project before designing migrations.
BEGIN TRANSACTION READ ONLY;

-- 1. Existing application tables and their row-level-security settings.
WITH expected(name) AS (VALUES
  ('posts'), ('comments'), ('reports'), ('tfh_media'), ('tfh_post_likes'),
  ('private_contacts'), ('tfh_business_cards'), ('tfh_call_notes'),
  ('tfh_customer_lists'), ('tfh_personal_documents'), ('tfh_private_lists'),
  ('tfh_quick_links'), ('tfh_sales_flyers'))
SELECT e.name AS table_name, c.oid IS NOT NULL AS exists,
       c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS rls_forced
FROM expected e
LEFT JOIN pg_namespace n ON n.nspname = 'public'
LEFT JOIN pg_class c ON c.relnamespace = n.oid AND c.relname = e.name
                        AND c.relkind IN ('r', 'p')
ORDER BY e.name;

-- 2. Column definitions, without reading table contents.
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('posts', 'comments', 'reports', 'tfh_media', 'tfh_post_likes')
ORDER BY table_name, ordinal_position;

-- 3. Policies for community tables, private tools, and file objects.
-- Expressions require human review: the existence of a policy is not proof of isolation.
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE (schemaname = 'public' AND tablename IN
  ('posts', 'comments', 'reports', 'tfh_media', 'tfh_post_likes',
   'private_contacts', 'tfh_business_cards', 'tfh_call_notes',
   'tfh_customer_lists', 'tfh_personal_documents', 'tfh_private_lists',
   'tfh_quick_links', 'tfh_sales_flyers'))
   OR (schemaname = 'storage' AND tablename = 'objects')
ORDER BY schemaname, tablename, cmd, policyname;

-- 4. Storage configuration only. Object filenames and contents are excluded.
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'truckfixhub-media' OR id LIKE 'tfh-%'
ORDER BY id;

-- 5. Integrity constraints and indexes, including media ownership and like uniqueness.
SELECT c.relname AS table_name, con.conname AS constraint_name,
       con.contype AS constraint_type, pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('posts', 'comments', 'reports', 'tfh_media', 'tfh_post_likes')
ORDER BY c.relname, con.conname;

SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('posts', 'comments', 'reports', 'tfh_media', 'tfh_post_likes')
ORDER BY tablename, indexname;

-- 6. Expected RPC signatures and privilege grants; no function bodies are retrieved.
SELECT p.proname AS function_name, pg_get_function_identity_arguments(p.oid) AS arguments,
       p.prosecdef AS security_definer, p.proacl AS privilege_grants
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname IN
  ('tfh_post_like_summary', 'tfh_is_admin', 'tfh_call_capture_status',
   'tfh_create_call_capture_token', 'tfh_revoke_call_capture_token')
ORDER BY p.proname;

-- 7. Whether community tables are included in Supabase Realtime publication.
SELECT pubname, schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' AND schemaname = 'public'
  AND tablename IN ('posts', 'comments', 'tfh_post_likes')
ORDER BY tablename;

ROLLBACK;
